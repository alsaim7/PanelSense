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
      <Navbar />
      <main className="mx-auto max-w-7xl px-5 pb-16 pt-32 md:px-8">
        <section className="mb-12 max-w-4xl">
          <motion.p
            className="mb-4 text-sm font-bold uppercase tracking-[0.28em] text-[var(--accent)]"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          >
            Architectural wall finishes
          </motion.p>
          <h1 className="font-syne accent-underline text-5xl font-extrabold leading-tight md:text-7xl">
            {'Find Your Perfect Wall Panel'.split(' ').map((word, index) => (
              <motion.span
                key={word}
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
            Browse refined textures, filter by finish, and let the AI assistant narrow the collection to panels that suit your room.
          </p>
        </section>

        <section className="space-y-5">
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

        <section className="panel-grid mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {loading
            ? Array.from({ length: LIMIT }).map((_, index) => <PanelCardSkeleton key={index} />)
            : panels.length
              ? panels.map((panel) => <PanelCard key={panel.id || panel.name} panel={panel} />)
              : <EmptyState />}
        </section>

        <div className="mt-12">
          <Pagination page={page} totalPages={totalPages} onChange={setPage} />
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default HomePage;
