import { lazy, Suspense } from 'react';
import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { CircularProgress, ThemeProvider, createTheme } from '@mui/material';
import { ChatBotProvider } from './components/ChatBotProvider';
import HomePage from './pages/HomePage';

const PanelDetailPage = lazy(() => import('./pages/PanelDetailPage'));
const LikedPanelsPage = lazy(() => import('./pages/LikedPanelsPage'));
const RecommendationPage = lazy(() => import('./pages/RecommendationPage'));

const theme = createTheme({
  typography: {
    fontFamily: '"DM Sans", system-ui, sans-serif',
    h1: { fontFamily: '"Syne", system-ui, sans-serif' },
    h2: { fontFamily: '"Syne", system-ui, sans-serif' },
    h3: { fontFamily: '"Syne", system-ui, sans-serif' },
    h4: { fontFamily: '"Syne", system-ui, sans-serif' },
    h5: { fontFamily: '"Syne", system-ui, sans-serif' },
    h6: { fontFamily: '"Syne", system-ui, sans-serif' },
    button: { textTransform: 'none', fontWeight: 700 },
  },
  palette: {
    mode: 'dark',
    primary: { main: '#e94560' },
    background: { default: '#0a0a1a', paper: '#101936' },
    text: { primary: '#f0f0f0', secondary: '#a0a0b0' },
  },
  shape: { borderRadius: 8 },
});

const pageVariants = {
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -12 },
};

function PageLoader() {
  return (
    <div className="min-h-screen grid place-items-center bg-[var(--bg)]">
      <CircularProgress sx={{ color: 'var(--accent)' }} />
    </div>
  );
}

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
      >
        <Suspense fallback={<PageLoader />}>
          <Routes location={location}>
            <Route path="/" element={<HomePage />} />
            <Route path="/panel/:id" element={<PanelDetailPage />} />
            <Route path="/liked" element={<LikedPanelsPage />} />
            <Route path="/recommendations" element={<RecommendationPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </motion.div>
    </AnimatePresence>
  );
}

function App() {
  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <AnimatedRoutes />
        <ChatBotProvider />
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
