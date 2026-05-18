import { useCallback, useEffect, useMemo, useState } from 'react';
import { Alert, Button } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import { motion } from 'framer-motion';
import { fetchPanels } from '../api/api';
import { FilterBar } from '../components/FilterBar';
import { Footer } from '../components/Footer';
import { Navbar } from '../components/Navbar';
import { Pagination } from '../components/Pagination';
import { PanelCard } from '../components/PanelCard';
import { PanelCardSkeleton } from '../components/PanelCardSkeleton';
import { SearchBar } from '../components/SearchBar';
import { SEO } from '../components/SEO';
import { getCanonicalUrl } from '../utils/seo';

const LIMIT = 12;

function normalizePanelResponse(data) {
  const panels = Array.isArray(data) ? data : data?.items || data?.panels || data?.results || data?.data || [];
  const total = data?.total ?? data?.count ?? panels.length;
  const totalPages = data?.totalPages ?? data?.total_pages ?? Math.max(1, Math.ceil(total / LIMIT));
  return { panels, totalPages };
}

function uniqueOptions(panels, key) {
  return [...new Set(panels.map((panel) => panel?.[key]).filter(Boolean))].sort((a, b) => String(a).localeCompare(String(b)));
}

function EmptyState() {
  return (
    <div className="glass-panel col-span-full flex min-h-72 flex-col items-center justify-center rounded-lg p-8 text-center">
      <div className="font-syne mb-5 grid h-24 w-24 place-items-center rounded-lg border border-[var(--border)] bg-[rgba(233,69,96,0.08)] text-5xl font-extrabold text-[var(--accent)]">
        P
      </div>
      <h3 className="font-syne text-2xl font-bold">No panels found</h3>
      <p className="mt-2 text-[var(--text-secondary)]">Try different filters.</p>
    </div>
  );
}

function HomePage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [color, setColor] = useState('');
  const [style, setStyle] = useState('');
  const [panels, setPanels] = useState([]);
  const [allFetchedPanels, setAllFetchedPanels] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadPanels = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await fetchPanels({ page, limit: LIMIT, search, category, color, style });
      const normalized = normalizePanelResponse(data);
      setPanels(normalized.panels);
      setAllFetchedPanels((current) => {
        const merged = [...current, ...normalized.panels];
        return [...new Map(merged.map((panel) => [panel.id || panel.name, panel])).values()];
      });
      setTotalPages(normalized.totalPages);
    } catch (requestError) {
      const message = requestError.response?.data?.detail || 'Could not load panels. Check your backend connection.';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [category, color, page, search, style]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadPanels();
  }, [loadPanels]);

  const filterOptions = useMemo(
    () => ({
      categories: uniqueOptions(allFetchedPanels, 'category'),
      colors: uniqueOptions(allFetchedPanels, 'color'),
      styles: uniqueOptions(allFetchedPanels, 'style'),
    }),
    [allFetchedPanels],
  );

  const homeStructuredData = useMemo(
    () => [
      {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: 'PanelSense',
        url: getCanonicalUrl('/'),
        description:
          'Modern wall panel catalog for decorative wall panels, panel images, wooden wall panels, PVC wall panels, fluted wall panels, and laminate panel designs.',
        potentialAction: {
          '@type': 'SearchAction',
          target: `${getCanonicalUrl('/')}?search={search_term_string}`,
          'query-input': 'required name=search_term_string',
        },
      },
      {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: 'PanelSense',
        url: getCanonicalUrl('/'),
        logo: getCanonicalUrl('/favicon.svg'),
      },
      {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: [
          {
            '@type': 'Question',
            name: 'How does PanelSense help me find wall panel designs?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'PanelSense lets you browse and filter wall panel designs by category, color, style, texture, and specifications. The platform also includes PanelSense AI for personalized panel suggestions.',
            },
          },
          {
            '@type': 'Question',
            name: 'Can I filter PVC, wooden, fluted, and laminate panel designs?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Yes. You can browse and filter decorative panels by category, color, style, texture, and specifications to compare PVC wall panels, wooden wall panels, fluted wall panels, laminate panel designs, and modern wall panels.',
            },
          },
        ],
      },
      panels.length
        ? {
            '@context': 'https://schema.org',
            '@type': 'ItemList',
            name: 'Decorative wall panel designs',
            itemListElement: panels.slice(0, 12).map((panel, index) => ({
              '@type': 'ListItem',
              position: index + 1,
              url: getCanonicalUrl(`/panel/${panel.id}`),
              name: panel.name,
            })),
          }
        : null,
    ],
    [panels],
  );

  const handleSearchChange = useCallback(
    (value) => {
      if (value === search) return;
      setSearch(value);
      setPage(1);
    },
    [search],
  );

  const handleCategoryChange = useCallback(
    (value) => {
      if (value === category) return;
      setCategory(value);
      setPage(1);
    },
    [category],
  );

  const handleColorChange = useCallback(
    (value) => {
      if (value === color) return;
      setColor(value);
      setPage(1);
    },
    [color],
  );

  const handleStyleChange = useCallback(
    (value) => {
      if (value === style) return;
      setStyle(value);
      setPage(1);
    },
    [style],
  );

  const clearFilters = useCallback(() => {
    setCategory('');
    setColor('');
    setStyle('');
    setPage(1);
  }, []);

  return (
    <div className="min-h-screen overflow-hidden bg-[var(--bg)] text-[var(--text-primary)]">
      <SEO
        title="Wall Panel Designs, Panel Images, and Decorative Panel Catalog"
        description="Explore PanelSense for wall panel designs, decorative wall panels, panel images, interior wall panel ideas, wooden wall panels, PVC wall panels, fluted wall panels, and laminate panel designs."
        structuredData={homeStructuredData}
      />
      <Navbar />
      <main className="mx-auto max-w-7xl px-5 pb-16 pt-32 md:px-8">
        <section className="mb-12 max-w-4xl" aria-labelledby="home-heading">
          <motion.p
            className="mb-4 text-sm font-bold uppercase tracking-[0.28em] text-[var(--accent)]"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          >
            Decorative wall panel catalog
          </motion.p>
          <h1 id="home-heading" className="font-syne accent-underline text-5xl font-extrabold leading-tight md:text-7xl">
            {'Explore Modern Wall Panel Designs'.split(' ').map((word, index) => (
              <motion.span
                key={`${word}-${index}`}
                className="mr-3 inline-block"
                initial={{ opacity: 0, y: 34 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.18, duration: 0.95, ease: [0.22, 1, 0.36, 1] }}
              >
                {word}
              </motion.span>
            ))}
          </h1>
          <p className="mt-8 max-w-2xl text-lg leading-8 text-[var(--text-secondary)]">
            Browse panel images, compare decorative wall panels, and filter modern wall panels by color, material, category,
            texture, and style. Use smart recommendations when you want personalized panel suggestions for your room.
          </p>
        </section>

        <section className="space-y-5" aria-label="Search and filter decorative wall panels">
          <SearchBar value={search} onChange={handleSearchChange} />
          <FilterBar
            category={category}
            color={color}
            style={style}
            options={filterOptions}
            onCategoryChange={handleCategoryChange}
            onColorChange={handleColorChange}
            onStyleChange={handleStyleChange}
            onClear={clearFilters}
          />
        </section>

        {error && (
          <Alert
            severity="error"
            className="!mt-8"
            action={
              <Button color="inherit" size="small" startIcon={<RefreshIcon />} onClick={loadPanels}>
                Retry
              </Button>
            }
            sx={{ bgcolor: 'rgba(233,69,96,0.12)', color: 'white', border: '1px solid var(--border)' }}
          >
            {error}
          </Alert>
        )}

        <section className="panel-grid mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3" aria-label="Wall panel design results">
          {loading
            ? Array.from({ length: LIMIT }).map((_, index) => <PanelCardSkeleton key={index} />)
            : panels.length
              ? panels.map((panel) => <PanelCard key={panel.id || panel.name} panel={panel} />)
              : <EmptyState />}
        </section>

        <div className="mt-12">
          <Pagination page={page} totalPages={totalPages} onChange={setPage} />
        </div>

        <section className="mt-20 grid gap-8 lg:grid-cols-[0.9fr_1.1fr]" aria-labelledby="seo-content-heading">
          <div>
            <p className="mb-3 text-sm font-bold uppercase tracking-[0.24em] text-[var(--accent)]">Panel discovery</p>
            <h2 id="seo-content-heading" className="font-syne text-3xl font-bold md:text-4xl">
              Wall panel inspiration for modern interiors
            </h2>
          </div>
          <div className="space-y-5 leading-8 text-[var(--text-secondary)]">
            <p>
              PanelSense helps homeowners, interior designers, and renovators move from endless browsing to confident panel
              selection. Search decorative wall panels by color, style, category, texture, and finish while building a clear
              wall panel catalog for bedrooms, TV units, offices, feature walls, and commercial interiors.
            </p>
            <p>
              Explore modern wall panels, wooden wall panels, PVC wall panels, fluted wall panels, textured finishes, panel
              images, and laminate panel designs. When browsing is not enough, PanelSense AI can provide personalized panel
              suggestions based on your interior preferences.
            </p>
          </div>
        </section>

        <section className="mt-16 grid gap-5 md:grid-cols-3" aria-labelledby="browse-heading">
          <h2 id="browse-heading" className="sr-only">
            Browse panel design categories
          </h2>
          {['Wooden wall panels for warm feature walls', 'PVC wall panels for practical interiors', 'Laminate panel designs for modern rooms'].map(
            (item) => (
              <article key={item} className="glass-panel rounded-lg p-6">
                <h3 className="font-syne text-xl font-bold">{item}</h3>
                <p className="mt-3 text-sm leading-6 text-[var(--text-secondary)]">
                  Compare panel images, finishes, colors, textures, and styles before asking for a tailored shortlist.
                </p>
              </article>
            ),
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
}

export default HomePage;
