import { useEffect, useRef, useState } from 'react';
import { InputAdornment, TextField } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

export function SearchBar({ value, onChange }) {
  const [draft, setDraft] = useState(value || '');
  const onChangeRef = useRef(onChange);

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  useEffect(() => {
    const timeout = window.setTimeout(() => onChangeRef.current(draft), 300);
    return () => window.clearTimeout(timeout);
  }, [draft]);

  return (
    <TextField
      fullWidth
      value={draft}
      onChange={(event) => setDraft(event.target.value)}
      placeholder="Search by panel name, texture, finish..."
      aria-label="Search panels"
      slotProps={{
        input: {
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon sx={{ color: 'var(--accent)' }} />
            </InputAdornment>
          ),
        },
      }}
      sx={{
        '& .MuiOutlinedInput-root': {
          bgcolor: 'var(--glass)',
          borderRadius: 2,
          color: 'var(--text-primary)',
          backdropFilter: 'blur(18px)',
          '& fieldset': { borderColor: 'var(--border)' },
          '&:hover fieldset': { borderColor: 'rgba(233,69,96,0.48)' },
          '&.Mui-focused fieldset': { borderColor: 'var(--accent)', boxShadow: '0 0 0 3px rgba(233,69,96,0.12)' },
        },
      }}
    />
  );
}
