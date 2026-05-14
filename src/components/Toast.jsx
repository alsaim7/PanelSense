import { Alert, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { AnimatePresence, motion } from 'framer-motion';

const variants = {
  initial: { x: -120, opacity: 0 },
  animate: { x: 0, opacity: 1 },
  exit: { x: -120, opacity: 0 },
};

const colors = {
  success: '#40d99a',
  error: '#e94560',
  info: '#5da9ff',
};

export function Toast({ toasts, onClose }) {
  return (
    <div className="fixed bottom-6 left-6 z-[1500] flex w-[min(92vw,380px)] flex-col gap-3">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            variants={variants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.24, ease: 'easeOut' }}
          >
            <Alert
              severity={toast.type}
              variant="filled"
              sx={{
                alignItems: 'center',
                bgcolor: 'rgba(15,52,96,0.96)',
                border: `1px solid ${colors[toast.type] || colors.info}`,
                color: 'var(--text-primary)',
                boxShadow: 'var(--shadow)',
              }}
              action={
                <IconButton size="small" color="inherit" aria-label="Close toast" onClick={() => onClose(toast.id)}>
                  <CloseIcon fontSize="small" />
                </IconButton>
              }
            >
              {toast.message}
            </Alert>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
