import { Box } from '@mui/material';

export function BrandLogo({ size = 38, showText = true }) {
  const cell = size * 0.34;
  const gap = size * 0.08;

  return (
    <Box className="flex items-center gap-3" aria-label="PanelSense">
      <Box
        component="span"
        sx={{
          width: size,
          height: size,
          display: 'grid',
          gridTemplateColumns: `repeat(2, ${cell}px)`,
          gridTemplateRows: `repeat(2, ${cell}px)`,
          gap: `${gap}px`,
          alignContent: 'center',
          justifyContent: 'center',
          borderRadius: 1.5,
          background: 'linear-gradient(135deg, var(--accent), #ff7a8d)',
          boxShadow: '0 0 24px rgba(233,69,96,0.32)',
        }}
      >
        {[0, 1, 2, 3].map((item) => (
          <Box
            key={item}
            component="span"
            sx={{
              width: cell,
              height: cell,
              borderRadius: '3px',
              background: item === 3 ? 'var(--primary)' : 'rgba(255,255,255,0.92)',
            }}
          />
        ))}
      </Box>
      {showText && <span className="font-syne text-xl font-extrabold tracking-normal">PanelSense</span>}
    </Box>
  );
}
