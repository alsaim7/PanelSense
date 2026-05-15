import { useEffect, useState } from 'react';
import { ChatBot } from './ChatBot';
import { Toast } from './Toast';
import { useToast } from '../hooks/useToast';

export function ChatBotProvider() {
  const [openSignal, setOpenSignal] = useState(0);
  const { toasts, showToast, removeToast } = useToast();

  useEffect(() => {
    const openAssistant = () => setOpenSignal((value) => value + 1);
    window.addEventListener('panelcraft:open-ai', openAssistant);
    return () => window.removeEventListener('panelcraft:open-ai', openAssistant);
  }, []);

  return (
    <>
      <ChatBot openSignal={openSignal} onError={(message) => showToast(message, 'error')} />
      <Toast toasts={toasts} onClose={removeToast} />
    </>
  );
}
