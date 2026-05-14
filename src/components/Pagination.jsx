import { IconButton } from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

function getPages(page, totalPages) {
  if (totalPages <= 5) return Array.from({ length: totalPages }, (_, index) => index + 1);
  if (page <= 3) return [1, 2, 3, 4, 'ellipsis-end', totalPages];
  if (page >= totalPages - 2) return [1, 'ellipsis-start', totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
  return [1, 'ellipsis-start', page - 1, page, page + 1, 'ellipsis-end', totalPages];
}

export function Pagination({ page, totalPages, onChange }) {
  if (totalPages <= 1) return null;
  const pages = getPages(page, totalPages);

  return (
    <div className="flex flex-wrap items-center justify-center gap-2">
      <IconButton
        aria-label="Previous page"
        disabled={page <= 1}
        onClick={() => onChange(page - 1)}
        sx={{ color: 'white', border: '1px solid var(--border)', '&.Mui-disabled': { color: 'rgba(255,255,255,0.25)' } }}
      >
        <ChevronLeftIcon />
      </IconButton>
      {pages.map((item) =>
        typeof item === 'string' ? (
          <span key={item} className="px-2 text-[var(--text-secondary)]">
            …
          </span>
        ) : (
          <button
            key={item}
            type="button"
            aria-label={`Go to page ${item}`}
            aria-current={item === page ? 'page' : undefined}
            onClick={() => onChange(item)}
            className={`h-10 min-w-10 rounded-lg border px-3 text-sm font-bold transition ${
              item === page
                ? 'border-[var(--accent)] bg-[var(--accent)] text-white'
                : 'border-[var(--border)] bg-transparent text-[var(--text-primary)] hover:border-[var(--accent)]'
            }`}
          >
            {item}
          </button>
        ),
      )}
      <IconButton
        aria-label="Next page"
        disabled={page >= totalPages}
        onClick={() => onChange(page + 1)}
        sx={{ color: 'white', border: '1px solid var(--border)', '&.Mui-disabled': { color: 'rgba(255,255,255,0.25)' } }}
      >
        <ChevronRightIcon />
      </IconButton>
    </div>
  );
}
