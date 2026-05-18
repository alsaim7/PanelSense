import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Box, Button, Drawer, IconButton, List, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import FavoriteIcon from '@mui/icons-material/Favorite';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import { BrandLogo } from './BrandLogo';

export function Navbar() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const goHome = () => {
    setOpen(false);
    navigate('/');
  };

  const goContact = () => {
    setOpen(false);
    if (window.location.pathname !== '/') {
      navigate('/');
      window.setTimeout(() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }), 120);
      return;
    }
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  };

  const openAssistant = () => {
    setOpen(false);
    window.dispatchEvent(new CustomEvent('panelsense:open-assistant'));
  };

  const navLinkClass = ({ isActive }) =>
    `relative py-2 text-sm font-bold text-[var(--text-primary)] after:absolute after:bottom-0 after:left-0 after:h-0.5 after:bg-[var(--accent)] after:transition-all ${
      isActive ? 'after:w-full' : 'after:w-0 hover:after:w-full'
    }`;

  return (
    <header className="fixed left-0 right-0 top-0 z-50 border-b border-[var(--border)] bg-[rgba(10,10,26,0.94)]">
      <nav className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 md:px-8" aria-label="Primary navigation">
        <button type="button" onClick={goHome} className="flex items-center text-left" aria-label="Go to home">
          <BrandLogo />
        </button>

        <div className="hidden items-center gap-8 md:flex">
          <NavLink to="/" className={navLinkClass}>
            Home
          </NavLink>
          <NavLink to="/liked" className={navLinkClass}>
            Liked Panels
          </NavLink>
          <button
            type="button"
            onClick={goContact}
            className="relative py-2 text-sm font-bold text-[var(--text-primary)] after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-[var(--accent)] after:transition-all hover:after:w-full"
          >
            Contact
          </button>
          <Button
            variant="contained"
            startIcon={<SmartToyIcon />}
            onClick={openAssistant}
            sx={{
              bgcolor: 'var(--accent)',
              borderRadius: 2,
              boxShadow: '0 12px 30px rgba(233,69,96,0.22)',
              '&:hover': { bgcolor: 'var(--accent-hover)' },
            }}
          >
            Ask AI
          </Button>
        </div>

        <IconButton className="md:!hidden" aria-label="Open navigation" onClick={() => setOpen(true)} sx={{ color: 'white' }}>
          <MenuIcon />
        </IconButton>
      </nav>

      <Drawer
        anchor="right"
        open={open}
        onClose={() => setOpen(false)}
        slotProps={{
          paper: {
            sx: {
              width: 280,
              bgcolor: 'var(--primary)',
              color: 'var(--text-primary)',
              borderLeft: '1px solid var(--border)',
            },
          },
        }}
      >
        <Box className="flex items-center justify-between p-5">
          <BrandLogo size={34} />
          <IconButton aria-label="Close navigation" onClick={() => setOpen(false)} sx={{ color: 'white' }}>
            <CloseIcon />
          </IconButton>
        </Box>
        <List>
          <ListItemButton onClick={goHome}>
            <ListItemText primary="Home" />
          </ListItemButton>
          <ListItemButton
            onClick={() => {
              setOpen(false);
              navigate('/liked');
            }}
          >
            <ListItemIcon sx={{ color: 'var(--accent)', minWidth: 36 }}>
              <FavoriteIcon />
            </ListItemIcon>
            <ListItemText primary="Liked Panels" />
          </ListItemButton>
          <ListItemButton onClick={openAssistant}>
            <ListItemIcon sx={{ color: 'var(--accent)', minWidth: 36 }}>
              <SmartToyIcon />
            </ListItemIcon>
            <ListItemText primary="Ask AI" />
          </ListItemButton>
          <ListItemButton onClick={goContact}>
            <ListItemText primary="Contact" />
          </ListItemButton>
        </List>
      </Drawer>
    </header>
  );
}
