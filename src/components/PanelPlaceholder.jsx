import { BrandLogo } from './BrandLogo';

export function PanelPlaceholder({ label = 'Panel image unavailable' }) {
  return (
    <div className="flex h-full min-h-48 flex-col items-center justify-center gap-3 bg-[linear-gradient(135deg,rgba(26,26,46,0.9),rgba(15,52,96,0.55))] text-center">
      <BrandLogo size={44} showText={false} />
      <span className="px-4 text-xs font-bold uppercase tracking-[0.16em] text-[var(--text-secondary)]">{label}</span>
    </div>
  );
}
