import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Alert, Button, Chip, IconButton, Skeleton } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import RefreshIcon from '@mui/icons-material/Refresh';
import { motion } from 'framer-motion';
import { fetchPanelById } from '../api/api';
import { Footer } from '../components/Footer';
import { Navbar } from '../components/Navbar';
import { PanelPlaceholder } from '../components/PanelPlaceholder';

const fadeInUp = {
  initial: { opacity: 0, y: 22 },
  animate: { opacity: 1, y: 0 },
};

function DetailSkeleton() {
  return (
    <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr]">
      <Skeleton variant="rounded" sx={{ height: 520, bgcolor: 'rgba(255,255,255,0.08)' }} />
      <div className="space-y-5">
        <Skeleton sx={{ height: 58, bgcolor: 'rgba(255,255,255,0.08)' }} />
        <Skeleton sx={{ height: 34, width: '72%', bgcolor: 'rgba(255,255,255,0.08)' }} />
        <Skeleton variant="rounded" sx={{ height: 180, bgcolor: 'rgba(255,255,255,0.08)' }} />
        <Skeleton sx={{ height: 42, width: '60%', bgcolor: 'rgba(255,255,255,0.08)' }} />
      </div>
    </div>
  );
}

function Field({ label, value }) {
  if (!value) return null;
  return (
    <div>
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--accent)]">{label}</p>
      <p className="mt-1 text-lg text-white">{value}</p>
    </div>
  );
}

function PanelDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [panel, setPanel] = useState(null);
  const [imageFailed, setImageFailed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadPanel = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await fetchPanelById(id);
      setPanel(data?.panel || data?.data || data);
    } catch (requestError) {
      setError(requestError.response?.data?.detail || 'Could not load this panel.');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadPanel();
  }, [loadPanel]);

  const tags = Array.isArray(panel?.tags)
    ? panel.tags
    : typeof panel?.tags === 'string'
      ? panel.tags.split(',').map((tag) => tag.trim()).filter(Boolean)
      : [];

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text-primary)]">
      <Navbar />
      <main className="mx-auto max-w-7xl px-5 pb-16 pt-32 md:px-8">
        <IconButton
          aria-label="Go back"
          onClick={() => navigate(-1)}
          sx={{ mb: 4, color: 'white', border: '1px solid var(--border)', bgcolor: 'rgba(15,52,96,0.32)' }}
        >
          <ArrowBackIcon />
        </IconButton>

        {loading ? (
          <DetailSkeleton />
        ) : error ? (
          <div className="mx-auto max-w-xl">
            <Alert
              severity="error"
              action={
                <Button color="inherit" size="small" startIcon={<RefreshIcon />} onClick={loadPanel}>
                  Retry
                </Button>
              }
              sx={{ bgcolor: 'rgba(233,69,96,0.12)', color: 'white', border: '1px solid var(--border)' }}
            >
              {error}
            </Alert>
          </div>
        ) : (
          <motion.section
            className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr]"
            variants={fadeInUp}
            initial="initial"
            animate="animate"
            transition={{ duration: 0.42, ease: 'easeOut' }}
          >
            <div className="glass-panel overflow-hidden rounded-lg">
              <div className="aspect-[4/3] min-h-[320px]">
                {panel?.image_url && !imageFailed ? (
                  <img
                    src={panel.image_url}
                    alt={panel.name || 'Wall panel detail'}
                    onError={() => setImageFailed(true)}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <PanelPlaceholder />
                )}
              </div>
            </div>

            <div className="glass-panel rounded-lg p-6 md:p-8">
              <h1 className="font-syne text-4xl font-extrabold leading-tight md:text-5xl">{panel?.name || 'Untitled Panel'}</h1>
              <div className="mt-8 grid gap-6 sm:grid-cols-2">
                <Field label="Category" value={panel?.category} />
                <Field label="Color" value={panel?.color} />
                <Field label="Style" value={panel?.style} />
              </div>
              {panel?.description && (
                <div className="mt-8">
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--accent)]">Description</p>
                  <p className="mt-3 leading-8 text-[var(--text-secondary)]">{panel.description}</p>
                </div>
              )}
              {tags.length > 0 && (
                <div className="mt-8 flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <Chip
                      key={tag}
                      label={tag}
                      sx={{ bgcolor: 'rgba(233,69,96,0.12)', color: 'white', border: '1px solid var(--border)' }}
                      variant="outlined"
                    />
                  ))}
                </div>
              )}
            </div>
          </motion.section>
        )}
      </main>
      <Footer />
    </div>
  );
}

export default PanelDetailPage;
