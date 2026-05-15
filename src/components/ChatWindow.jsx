import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, CircularProgress, DialogActions, DialogContent, DialogTitle, IconButton, TextField } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import SendIcon from '@mui/icons-material/Send';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import { sendChatMessage } from '../api/api';

const initialState = {
  step: 1,
  messages: [],
  room_type: '',
  wall_color: '',
  lighting: '',
  style: '',
  isLoading: false,
  isComplete: false,
  hasError: false,
  recommendations: [],
  recommendationMeta: null,
};

function normalizeChatResponse(data) {
  const response = data?.response;
  const isRecommendationResponse = Array.isArray(response);
  const missingFields = Array.isArray(data?.missing_fields) ? data.missing_fields : [];
  const suggestion = data?.suggestion || '';
  const status =
    isRecommendationResponse && missingFields.length
      ? 'partial_data'
      : isRecommendationResponse
        ? 'success'
        : suggestion || missingFields.length
          ? 'no_data'
          : 'in_progress';

  let aiText;

  if (isRecommendationResponse) {
    if (response.length) {
      const intro =
        data?.ai_message ||
        data?.message ||
        `I found ${response.length} recommended panel${response.length > 1 ? 's' : ''} for your space!`;
      const missingText = missingFields.length
        ? ` Missing or unclear: ${missingFields.join(', ')}.`
        : '';
      const suggestionText = suggestion ? ` ${suggestion}` : '';
      aiText = `${intro}${missingText}${suggestionText}`;
    } else {
      aiText = 'No recommendations matched your answers yet. Try starting again with broader preferences.';
    }
  } else {
    const text = data?.ai_message || data?.message || response || 'Tell me a little more.';
    const missingText = missingFields.length
      ? ` Missing or unclear: ${missingFields.join(', ')}.`
      : '';
    const suggestionText = suggestion ? ` ${suggestion}` : '';
    aiText = `${text}${missingText}${suggestionText}`;
  }

  return {
    isComplete: isRecommendationResponse || status === 'no_data',
    recommendations: isRecommendationResponse ? response : [],
    recommendationMeta: status === 'in_progress'
      ? null
      : {
          status,
          message: data?.ai_message || data?.message || (typeof response === 'string' ? response : ''),
          suggestion,
          missing_fields: missingFields,
        },
    aiText,
  };
}

function TypingIndicator() {
  return (
    <div className="flex items-center gap-2 rounded-lg bg-[rgba(15,52,96,0.62)] px-4 py-3 text-[var(--text-secondary)]">
      {[0, 1, 2].map((dot) => (
        <span
          key={dot}
          className="typing-dot h-2 w-2 rounded-full bg-[var(--accent)]"
          style={{ animationDelay: `${dot * 220}ms` }}
        />
      ))}
    </div>
  );
}

export function ChatWindow({ open, onClose, onError }) {
  const [state, setState] = useState(initialState);
  const [input, setInput] = useState('');
  const stateRef = useRef(initialState);
  const inputRef = useRef(null);
  const bottomRef = useRef(null);
  const hasStartedRef = useRef(false);
  const navigate = useNavigate();

  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  const playSound = useCallback(() => {
    if (typeof Audio === 'undefined') return;
    const sound = new Audio('/notification.mp3');
    sound.play().catch(() => {});
  }, []);

  const submitMessage = useCallback(
    async (message = '', overrideStep) => {
      const currentState = stateRef.current;
      const currentStep = overrideStep || currentState.step;
      const trimmed = message.trim();

      console.log('-----------------------------');
      console.log('submitMessage triggered');
      console.log('Current Step:', currentStep);
      console.log('User Message:', trimmed);
      console.log('Current State:', currentState);

      if (currentStep > 1 && !trimmed) {
        console.log('Empty input detected, returning early');
        return;
      }

      setState((current) => ({
        ...current,
        isLoading: true,
        messages: trimmed
          ? [...current.messages, { role: 'user', text: trimmed }]
          : current.messages,
      }));

      const payload = {
        message: trimmed,
        step: currentStep,
        room_type:
          currentStep === 2 ? trimmed : currentState.room_type || null,
        wall_color:
          currentStep === 3 ? trimmed : currentState.wall_color || null,
        lighting:
          currentStep === 4 ? trimmed : currentState.lighting || null,
        style:
          currentStep === 5 ? trimmed : currentState.style || null,
      };

      if (currentStep === 1) {
        payload.room_type = null;
        payload.wall_color = null;
        payload.lighting = null;
        payload.style = null;
      }

      console.log('Sending Payload:', payload);

      try {
        const { data } = await sendChatMessage(payload);

        console.log('API Response:', data);

        const { aiText, isComplete, recommendations, recommendationMeta } =
          normalizeChatResponse(data);

        console.log('Normalized Response:', {
          aiText,
          isComplete,
          recommendations,
          recommendationMeta,
        });

        setState((current) => {
          const updatedState = {
            ...current,
            step: data?.next_step || current.step,
            room_type:
              data?.room_type ??
              payload.room_type ??
              current.room_type,
            wall_color:
              data?.wall_color ??
              payload.wall_color ??
              current.wall_color,
            lighting:
              data?.lighting ??
              payload.lighting ??
              current.lighting,
            style:
              data?.style ??
              payload.style ??
              current.style,
            isLoading: false,
            isComplete,
            hasError: false,
            recommendations,
            recommendationMeta,
            messages: [
              ...current.messages,
              {
                role: 'ai',
                text: aiText,
              },
            ],
          };

          console.log('Updated State:', updatedState);

          return updatedState;
        });

        console.log('Playing notification sound');
        playSound();
      } catch (error) {
        console.error('-----------------------------');
        console.error('Chat Error:', error);

        if (error.response) {
          console.error('Error Response Data:', error.response.data);
          console.error('Error Response Status:', error.response.status);
          console.error('Error Response Headers:', error.response.headers);
        } else if (error.request) {
          console.error('No response received:', error.request);
        } else {
          console.error('Error Message:', error.message);
        }

        setState((current) => ({
          ...current,
          isLoading: false,
          isComplete: false,
          hasError: true,
          recommendations: [],
          recommendationMeta: null,
          messages: [
            ...current.messages,
            {
              role: 'ai',
              text: 'I could not connect to the assistant right now. Please start again and try once more.',
            },
          ],
        }));

        onError?.(
          error.response?.data?.detail ||
          'AI assistant is unavailable. Please try again.'
        );
      }
    },
    [onError, playSound],
  );

  useEffect(() => {
    if (open && !hasStartedRef.current) {
      hasStartedRef.current = true;
      submitMessage('', 1);
    }
  }, [open, submitMessage]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ block: 'end' });
  }, [state.messages, state.isLoading]);

  useEffect(() => {
    if (!state.isLoading) {
      inputRef.current?.focus();
    }
  }, [state.isLoading]);

  const restart = () => {
    stateRef.current = initialState;
    setState(initialState);
    setInput('');
    hasStartedRef.current = false;
    window.setTimeout(() => submitMessage('', 1), 0);
  };

  const viewRecommendations = () => {
    localStorage.setItem('panelcraft_recommendations', JSON.stringify(state.recommendations));
    localStorage.setItem('panelcraft_recommendation_meta', JSON.stringify(state.recommendationMeta));
    onClose();
    navigate('/recommendations', {
      state: {
        recommendations: state.recommendations,
        recommendationMeta: state.recommendationMeta,
      },
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const value = input;
    setInput('');
    submitMessage(value);
  };

  return (
    <>
      <DialogTitle className="flex items-center justify-between border-b border-[var(--border)]">
        <span className="font-syne flex items-center gap-2 text-xl font-bold">
          <SmartToyIcon sx={{ color: 'var(--accent)' }} /> PanelCraft AI
        </span>
        <IconButton aria-label="Close AI assistant" onClick={onClose} sx={{ color: 'white' }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent className="!p-0">
        <div className="h-[460px] overflow-y-auto p-5">
          <div className="flex flex-col gap-4">
            {state.messages.map((message, index) => (
              <div key={`${message.role}-${index}`} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[82%] rounded-lg px-4 py-3 text-sm leading-6 ${
                    message.role === 'user'
                      ? 'bg-[var(--accent)] text-white'
                      : 'border border-[var(--border)] bg-[rgba(15,52,96,0.62)] text-[var(--text-primary)]'
                  }`}
                >
                  {message.role === 'ai' && <SmartToyIcon fontSize="small" sx={{ mr: 1, color: 'var(--accent)', verticalAlign: 'middle' }} />}
                  {message.text}
                </div>
              </div>
            ))}
            {state.isLoading && (
              <div className="flex justify-start">
                <TypingIndicator />
              </div>
            )}
            <div ref={bottomRef} />
          </div>
        </div>
      </DialogContent>
      <DialogActions className="!block border-t border-[var(--border)] !p-4">
        {state.hasError ? (
          <Button
            fullWidth
            variant="outlined"
            startIcon={<RestartAltIcon />}
            onClick={restart}
            sx={{ borderColor: 'var(--border)', color: 'white' }}
          >
            Start Again
          </Button>
        ) : state.isComplete ? (
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button
              fullWidth
              variant="contained"
              onClick={viewRecommendations}
              disabled={!state.recommendations.length}
              sx={{ bgcolor: 'var(--accent)', '&:hover': { bgcolor: 'var(--accent-hover)' } }}
            >
              View Recommended Panels
            </Button>
            <Button fullWidth variant="outlined" startIcon={<RestartAltIcon />} onClick={restart} sx={{ borderColor: 'var(--border)', color: 'white' }}>
              Start Again
            </Button>
          </div>
        ) : (
          <form className="flex gap-3" onSubmit={handleSubmit}>
            <TextField
              inputRef={inputRef}
              fullWidth
              size="small"
              value={input}
              disabled={state.isLoading}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Type your answer..."
              aria-label="Chat message"
              sx={{
                '& .MuiOutlinedInput-root': {
                  color: 'white',
                  bgcolor: 'rgba(15,52,96,0.42)',
                  '& fieldset': { borderColor: 'var(--border)' },
                  '&.Mui-focused fieldset': { borderColor: 'var(--accent)' },
                },
              }}
            />
            <Button
              type="submit"
              variant="contained"
              disabled={state.isLoading || !input.trim()}
              endIcon={state.isLoading ? <CircularProgress size={16} color="inherit" /> : <SendIcon />}
              sx={{ bgcolor: 'var(--accent)', '&:hover': { bgcolor: 'var(--accent-hover)' } }}
            >
              Send
            </Button>
          </form>
        )}
      </DialogActions>
    </>
  );
}
