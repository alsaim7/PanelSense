import { useState } from 'react';
import { Dialog, Fab, Tooltip } from '@mui/material';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import { ChatWindow } from './ChatWindow';

export function ChatBot({ onError }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Tooltip title="Need help choosing the best panel for you?">
        <div className="chatbot-fab fixed bottom-6 right-6 z-40">
          <Fab
            aria-label="Open AI panel assistant"
            onClick={() => setOpen(true)}
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
