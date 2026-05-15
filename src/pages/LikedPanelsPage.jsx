import { useEffect, useState } from 'react';
import { Button } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import { motion } from 'framer-motion';
import { Footer } from '../components/Footer';
import { Navbar } from '../components/Navbar';
import { PanelCard } from '../components/PanelCard';
import { getLikedPanels } from '../utils/likedPanels';

function LikedPanelsPage() {
  const [likedPanels, setLikedPanels] = useState(() => getLikedPanels());

  useEffect(() => {
    const refreshLikedPanels = () => setLikedPanels(getLikedPanels());
    window.addEventListener('panelcraft:liked-panels-updated', refreshLikedPanels);
    return () => window.removeEventListener('panelcraft:liked-panels-updated', refreshLikedPanels);
  }, []);

  const openAssistant = () => {
    window.dispatchEvent(new CustomEvent('panelcraft:open-ai'));
  };

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text-primary)]">
      <Navbar />
      <main className="mx-auto max-w-7xl px-5 pb-16 pt-32 md:px-8">
        <section className="mb-10 max-w-3xl">
          <p className="mb-4 flex items-center gap-2 text-sm font-bold uppercase tracking-[0.28em] text-[var(--accent)]">
            <FavoriteIcon fontSize="small" /> Saved locally
          </p>
          <h1 className="font-syne accent-underline text-4xl font-extrabold leading-tight md:text-6xl">Liked Panels</h1>
          <p className="mt-8 leading-8 text-[var(--text-secondary)]">
            Your liked panels are saved in this browser only. Clearing browser data or using another device can remove this list.
          </p>
        </section>

        {likedPanels.length ? (
          <motion.section
            className="panel-grid grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
            initial="initial"
            animate="animate"
            variants={{ animate: { transition: { staggerChildren: 0.08 } } }}
          >
            {likedPanels.map((panel) => (
              <motion.div key={panel.id} variants={{ initial: { opacity: 0, y: 18 }, animate: { opacity: 1, y: 0 } }}>
                <PanelCard panel={panel} />
              </motion.div>
            ))}
          </motion.section>
        ) : (
          <div className="glass-panel mx-auto flex max-w-2xl flex-col items-center justify-center rounded-lg p-10 text-center">
            <div className="mb-5 grid h-20 w-20 place-items-center rounded-lg border border-[var(--border)] bg-[rgba(233,69,96,0.08)] text-[var(--accent)]">
              <FavoriteIcon fontSize="large" />
            </div>
            <h2 className="font-syne text-3xl font-bold">No liked panels yet</h2>
            <p className="mt-3 text-[var(--text-secondary)]">Open a panel and tap the heart to keep it here.</p>
            <Button
              variant="contained"
              startIcon={<SmartToyIcon />}
              onClick={openAssistant}
              sx={{ mt: 4, bgcolor: 'var(--accent)', '&:hover': { bgcolor: 'var(--accent-hover)' } }}
            >
              Ask AI to Find One
            </Button>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}

export default LikedPanelsPage;
