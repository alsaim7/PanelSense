import { useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button, IconButton } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { motion } from 'framer-motion';
import { Footer } from '../components/Footer';
import { Navbar } from '../components/Navbar';
import { PanelPlaceholder } from '../components/PanelPlaceholder';
import { SEO } from '../components/SEO';
import { getCanonicalUrl, panelImageAlt } from '../utils/seo';

const gridVariants = {
  animate: { transition: { staggerChildren: 0.09 } },
};

const cardVariants = {
  initial: { opacity: 0, y: 22 },
  animate: { opacity: 1, y: 0 },
};

function useRecommendations() {
  const location = useLocation();
  return useMemo(() => {
    if (Array.isArray(location.state?.recommendations)) return location.state.recommendations;
    try {
      const stored = JSON.parse(localStorage.getItem('panelsense_recommendations') || '[]');
      return Array.isArray(stored) ? stored : [];
    } catch {
      return [];
    }
  }, [location.state]);
}

function useRecommendationMeta() {
  const location = useLocation();
  return useMemo(() => {
    if (location.state?.recommendationMeta) return location.state.recommendationMeta;
    try {
      return JSON.parse(localStorage.getItem('panelsense_recommendation_meta') || 'null');
    } catch {
      return null;
    }
  }, [location.state]);
}

function RecommendationCard({ recommendation }) {
  const [imageFailed, setImageFailed] = useState(false);
  const navigate = useNavigate();

  return (
    <motion.article
      variants={cardVariants}
      className="glass-panel overflow-hidden rounded-lg"
      whileHover={{ y: -6 }}
      transition={{ duration: 0.22, ease: 'easeOut' }}
    >
      <div className="aspect-[4/3]">
        {recommendation.image_url && !imageFailed ? (
          <img
            src={recommendation.image_url}
            alt={panelImageAlt(recommendation, `${recommendation.name || 'Recommended'} wall panel design`)}
            onError={() => setImageFailed(true)}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover"
          />
        ) : (
          <PanelPlaceholder />
        )}
      </div>
      <div className="flex min-h-64 flex-col justify-between gap-5 p-5">
        <div>
          <h2 className="font-syne text-2xl font-bold">{recommendation.name || 'Recommended Panel'}</h2>
          <p className="mt-3 leading-7 text-[var(--text-secondary)]">{recommendation.reason || 'A strong match for your stated room preferences.'}</p>
        </div>
        <Button
          fullWidth
          variant="contained"
          endIcon={<ArrowForwardIcon />}
          onClick={() => navigate(`/panel/${recommendation.id}`)}
          disabled={!recommendation.id}
          sx={{ bgcolor: 'var(--accent)', '&:hover': { bgcolor: 'var(--accent-hover)' } }}
        >
          View Details
        </Button>
      </div>
    </motion.article>
  );
}

function EmptyRecommendations() {
  return (
    <div className="glass-panel mx-auto flex max-w-2xl flex-col items-center justify-center rounded-lg p-10 text-center">
      <div className="font-syne mb-5 grid h-28 w-28 place-items-center rounded-lg border border-[var(--border)] bg-[rgba(233,69,96,0.08)] text-6xl font-extrabold text-[var(--accent)]">
        P
      </div>
      <h2 className="font-syne text-3xl font-bold">No recommendations found</h2>
      <p className="mt-3 text-[var(--text-secondary)]">Try starting the chat again.</p>
    </div>
  );
}

function RecommendationPage() {
  const navigate = useNavigate();
  const recommendations = useRecommendations();
  const recommendationMeta = useRecommendationMeta();
  const missingFields = Array.isArray(recommendationMeta?.missing_fields)
    ? recommendationMeta.missing_fields
    : [];

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text-primary)]">
      <SEO
        title="Personalized Wall Panel Suggestions"
        description="View personalized decorative wall panel suggestions selected from your room type, wall color, lighting, material, texture, and style preferences."
        canonicalPath="/recommendations"
        noindex
        structuredData={{
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Wall panel designs', item: getCanonicalUrl('/') },
            { '@type': 'ListItem', position: 2, name: 'Panel suggestions', item: getCanonicalUrl('/recommendations') },
          ],
        }}
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

        <section className="mb-12" aria-labelledby="recommendations-heading">
          <h1 id="recommendations-heading" className="font-syne accent-underline text-4xl font-extrabold leading-tight md:text-6xl">
            Recommended Panels for You
          </h1>
          <p className="mt-8 max-w-2xl leading-8 text-[var(--text-secondary)]">
            These decorative wall panel selections are based on your room type, wall color, lighting, texture, material,
            and style preferences, with PanelSense AI supporting the shortlist.
          </p>
          {recommendationMeta?.status === 'partial_data' && (
            <div className="mt-6 max-w-3xl rounded-lg border border-[var(--border)] bg-[rgba(233,69,96,0.08)] p-5">
              <h2 className="font-syne text-xl font-bold">Recommended with partial details</h2>
              {recommendationMeta.message && (
                <p className="mt-2 leading-7 text-[var(--text-secondary)]">{recommendationMeta.message}</p>
              )}
              {missingFields.length > 0 && (
                <p className="mt-2 text-sm text-[var(--text-secondary)]">
                  Missing or unclear: {missingFields.join(', ')}
                </p>
              )}
              {recommendationMeta.suggestion && (
                <p className="mt-2 text-sm text-[var(--text-secondary)]">{recommendationMeta.suggestion}</p>
              )}
            </div>
          )}
        </section>

        {recommendations.length ? (
          <motion.section className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3" variants={gridVariants} initial="initial" animate="animate">
            {recommendations.map((recommendation, index) => (
              <RecommendationCard key={recommendation.id || `${recommendation.name}-${index}`} recommendation={recommendation} />
            ))}
          </motion.section>
        ) : (
          <EmptyRecommendations />
        )}
      </main>
      <Footer />
    </div>
  );
}

export default RecommendationPage;
