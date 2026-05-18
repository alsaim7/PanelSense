import { useEffect, useMemo, useState } from 'react';
import { Dialog, Fab, Tooltip } from '@mui/material';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import { ChatWindow } from './ChatWindow';

export function ChatBot({ openSignal, onError }) {
  const [open, setOpen] = useState(false);
  const [nudge, setNudge] = useState('');

  const nudges = useMemo(
    () => [
      'Want help choosing the right panel for your room?',
      'Tell me your wall color and I can shortlist panels.',
      'Not sure what fits your space? I can help.',
      'I can match panels to your lighting and style.',
      'Need a second opinion before picking a panel?',
    ],
    [],
  );

  useEffect(() => {
    if (!openSignal) return;
    const timer = window.setTimeout(() => {
      setOpen(true);
      setNudge('');
    }, 0);
    return () => window.clearTimeout(timer);
  }, [openSignal]);

  useEffect(() => {
    if (open) return undefined;
    let hideTimer;

    const showRandomNudge = () => {
      const next = nudges[Math.floor(Math.random() * nudges.length)];
      setNudge(next);
      window.clearTimeout(hideTimer);
      hideTimer = window.setTimeout(() => setNudge(''), 6500);
    };

    const firstTimer = window.setTimeout(showRandomNudge, 9000);
    const repeatTimer = window.setInterval(showRandomNudge, 28000);

    return () => {
      window.clearTimeout(firstTimer);
      window.clearInterval(repeatTimer);
      window.clearTimeout(hideTimer);
    };
  }, [nudges, open]);

  const openAssistant = () => {
    setNudge('');
    setOpen(true);
  };

  return (
    <>
      <Tooltip title="Need help choosing the best panel for you?">
        <div className="chatbot-fab fixed bottom-6 left-6 z-40">
          {nudge && !open && (
            <button type="button" className="chatbot-nudge" onClick={openAssistant}>
              {nudge}
            </button>
          )}
          <Fab
            aria-label="Open PanelSense AI assistant"
            onClick={openAssistant}
            sx={{
              position: 'relative',
              bgcolor: 'var(--accent)',
              color: 'white',
              '&:hover': { bgcolor: 'var(--accent-hover)' },
            }}
          >
            <SmartToyIcon />
          </Fab>
        </div>
      </Tooltip>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        fullWidth
        maxWidth="sm"
        slotProps={{
          paper: {
            sx: {
              bgcolor: 'rgba(10,10,26,0.96)',
              color: 'var(--text-primary)',
              border: '1px solid var(--border)',
              boxShadow: 'var(--shadow)',
              borderRadius: 2,
              overflow: 'hidden',
            },
          },
        }}
      >
        <ChatWindow open={open} onClose={() => setOpen(false)} onError={onError} />
      </Dialog>
    </>
  );
}
