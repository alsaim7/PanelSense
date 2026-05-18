import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Alert, Button, Chip, IconButton, Skeleton } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import RefreshIcon from '@mui/icons-material/Refresh';
import ShareIcon from '@mui/icons-material/Share';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import { motion } from 'framer-motion';
import { fetchPanelById } from '../api/api';
import { Footer } from '../components/Footer';
import { Navbar } from '../components/Navbar';
import { PanelPlaceholder } from '../components/PanelPlaceholder';
import { SEO } from '../components/SEO';
import { getCanonicalUrl, panelImageAlt, truncateDescription } from '../utils/seo';
import { isPanelLiked, toggleLikedPanel } from '../utils/likedPanels';

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
  const [liked, setLiked] = useState(false);
  const [likeBurst, setLikeBurst] = useState(false);
  const [shareStatus, setShareStatus] = useState('');

  const loadPanel = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await fetchPanelById(id);
      const nextPanel = data?.panel || data?.data || data;
      setPanel(nextPanel);
      setLiked(isPanelLiked(nextPanel?.id));
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

  const handleLike = () => {
    const result = toggleLikedPanel(panel);
    setLiked(result.liked);
    if (result.liked) {
      setLikeBurst(true);
      window.setTimeout(() => setLikeBurst(false), 650);
    }
  };

  const handleShare = async () => {
    const url = window.location.href;
    const title = panel?.name ? `${panel.name} | PanelSense` : 'PanelSense wall panel';

    try {
      if (navigator.share) {
        await navigator.share({ title, text: 'Take a look at this wall panel.', url });
        setShareStatus('Shared');
      } else {
        await navigator.clipboard.writeText(url);
        setShareStatus('Link copied');
      }
    } catch {
      setShareStatus('');
      return;
    }

    window.setTimeout(() => setShareStatus(''), 2200);
  };

  const openAssistant = () => {
    window.dispatchEvent(new CustomEvent('panelsense:open-assistant'));
  };

  const tags = Array.isArray(panel?.tags)
    ? panel.tags
    : typeof panel?.tags === 'string'
      ? panel.tags.split(',').map((tag) => tag.trim()).filter(Boolean)
      : [];

  const panelTitle = panel?.name || 'Decorative Wall Panel';
  const panelDescription = truncateDescription(
    panel?.description,
    `${panelTitle} decorative wall panel design for modern interiors. Compare color, style, category, panel images, and ask PanelSense AI for personalized panel suggestions.`,
  );
  const detailStructuredData = panel
    ? [
        {
          '@context': 'https://schema.org',
          '@type': 'Product',
          name: panelTitle,
          description: panelDescription,
          image: panel.image_url || getCanonicalUrl('/favicon.svg'),
          category: panel.category || 'Decorative wall panels',
          color: panel.color,
          material: panel.material || panel.texture || panel.category,
          brand: {
            '@type': 'Brand',
            name: 'PanelSense',
          },
          url: getCanonicalUrl(`/panel/${id}`),
        },
        {
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [
            {
              '@type': 'ListItem',
              position: 1,
              name: 'Wall panel designs',
              item: getCanonicalUrl('/'),
            },
            {
              '@type': 'ListItem',
              position: 2,
              name: panelTitle,
              item: getCanonicalUrl(`/panel/${id}`),
            },
          ],
        },
      ]
    : [];

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text-primary)]">
      <SEO
        title={panel ? `${panelTitle} Decorative Wall Panel Design` : 'Wall Panel Design Details'}
        description={panelDescription}
        image={panel?.image_url}
        type="product"
        canonicalPath={`/panel/${id}`}
        structuredData={detailStructuredData}
      />
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
            aria-labelledby="panel-detail-heading"
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
                    alt={panelImageAlt(panel, `${panelTitle} wall panel detail`)}
                    onError={() => setImageFailed(true)}
                    fetchPriority="high"
                    decoding="async"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <PanelPlaceholder />
                )}
              </div>
            </div>

            <div className="glass-panel rounded-lg p-6 md:p-8">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                <h1 id="panel-detail-heading" className="font-syne text-4xl font-extrabold leading-tight md:text-5xl">
                  {panelTitle}
                </h1>
                <div className="flex shrink-0 items-center gap-2">
                  <IconButton
                    aria-label={liked ? 'Remove from liked panels' : 'Add to liked panels'}
                    onClick={handleLike}
                    className={likeBurst ? 'liked-burst' : ''}
                    sx={{
                      color: liked ? 'var(--accent)' : 'white',
                      border: '1px solid var(--border)',
                      bgcolor: liked ? 'rgba(233,69,96,0.15)' : 'rgba(15,52,96,0.32)',
                    }}
                  >
                    {liked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                  </IconButton>
                  <IconButton
                    aria-label="Share this panel"
                    onClick={handleShare}
                    sx={{ color: 'white', border: '1px solid var(--border)', bgcolor: 'rgba(15,52,96,0.32)' }}
                  >
                    {shareStatus === 'Link copied' ? <ContentCopyIcon /> : <ShareIcon />}
                  </IconButton>
                </div>
              </div>
              <div className="mt-5 flex flex-wrap items-center gap-3">
                <Button
                  variant="contained"
                  startIcon={<SmartToyIcon />}
                  onClick={openAssistant}
                  sx={{ bgcolor: 'var(--accent)', '&:hover': { bgcolor: 'var(--accent-hover)' } }}
                >
                  Ask PanelSense AI
                </Button>
                {shareStatus && <span className="text-sm font-bold text-[var(--accent)]">{shareStatus}</span>}
              </div>
              <div className="mt-8 grid gap-6 sm:grid-cols-2">
                <Field label="Category" value={panel?.category} />
                <Field label="Color" value={panel?.color} />
                <Field label="Style" value={panel?.style} />
              </div>
              {panel?.description && (
                <div className="mt-8">
                  <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--accent)]">Description</h2>
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
              <p className="mt-8 rounded-lg border border-[var(--border)] bg-[rgba(233,69,96,0.08)] p-4 text-sm leading-6 text-[var(--text-secondary)]">
                Ask PanelSense AI about this decorative wall panel for matching colors, related interior panel designs, and
                alternate wall panels from the catalog.
              </p>
            </div>
          </motion.section>
        )}
      </main>
      <Footer />
    </div>
  );
}

export default PanelDetailPage;
