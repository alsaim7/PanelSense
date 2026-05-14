import { Button } from '@mui/material';
import MailOutlinedIcon from '@mui/icons-material/MailOutlined';
import { BrandLogo } from './BrandLogo';

export function Footer() {
  return (
    <footer id="contact" className="border-t border-[var(--border)] bg-[rgba(6,6,18,0.92)]">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-12 md:grid-cols-3 md:px-8">
        <div>
          <BrandLogo />
          <p className="mt-4 max-w-sm text-sm leading-6 text-[var(--text-secondary)]">
            Luxury wall panel discovery shaped for modern interiors, design studios, and thoughtful renovators.
          </p>
        </div>
        <div>
          <h3 className="font-syne mb-4 text-lg font-bold">Quick Links</h3>
          <a className="text-sm text-[var(--text-secondary)] transition hover:text-white" href="/">
            Home
          </a>
        </div>
        <div>
          <h3 className="font-syne mb-4 text-lg font-bold">Contact</h3>
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
        © {new Date().getFullYear()} PanelCraft. All rights reserved.
      </div>
    </footer>
  );
}
