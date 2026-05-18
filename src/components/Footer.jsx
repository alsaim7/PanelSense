import { Button } from '@mui/material';
import MailOutlinedIcon from '@mui/icons-material/MailOutlined';
import { Link } from 'react-router-dom';
import { BrandLogo } from './BrandLogo';

export function Footer() {
  return (
    <footer id="contact" className="border-t border-[var(--border)] bg-[rgba(6,6,18,0.92)]">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-12 md:grid-cols-3 md:px-8">
        <div>
          <BrandLogo />
          <p className="mt-4 max-w-sm text-sm leading-6 text-[var(--text-secondary)]">
            Decorative wall panel discovery, panel images, and modern interior panel ideas for design studios, homeowners,
            and thoughtful renovators.
          </p>
        </div>
        <nav aria-label="Footer navigation">
          <h2 className="font-syne mb-4 text-lg font-bold">Quick Links</h2>
          <Link className="block text-sm text-[var(--text-secondary)] transition hover:text-white" to="/">
            Home
          </Link>
          <Link className="mt-3 block text-sm text-[var(--text-secondary)] transition hover:text-white" to="/liked">
            Liked Panels
          </Link>
        </nav>
        <div>
          <h2 className="font-syne mb-4 text-lg font-bold">Contact</h2>
          <p className="text-sm leading-6 text-[var(--text-secondary)]">
            Built by{' '}
            <a className="font-bold text-white underline decoration-[var(--accent)]" href="https://alsaim.pages.dev/" target="_blank" rel="noreferrer">
              Al Saim Shakeel
            </a>
          </p>
          <p className="mt-3 text-sm text-[var(--text-secondary)]">Need custom software? Let&apos;s talk:</p>
          <Button
            className="!mt-4"
            href="mailto:alsaimshakeel45@gmail.com"
            startIcon={<MailOutlinedIcon />}
            variant="outlined"
            sx={{ borderColor: 'var(--accent)', color: 'var(--text-primary)', '&:hover': { borderColor: 'var(--accent-hover)' } }}
          >
            Email Al Saim
          </Button>
        </div>
      </div>
      <div className="border-t border-[var(--border)] px-5 py-5 text-center text-sm text-[var(--text-secondary)]">
        &copy; {new Date().getFullYear()} PanelSense. All rights reserved.
      </div>
    </footer>
  );
}
