import { Card, CardContent, Skeleton } from '@mui/material';

export function PanelCardSkeleton() {
  return (
    <Card
      sx={{
        bgcolor: 'rgba(15,52,96,0.28)',
        border: '1px solid var(--border)',
        boxShadow: 'var(--shadow)',
        overflow: 'hidden',
      }}
    >
      <Skeleton variant="rectangular" animation={false} sx={{ height: 230, bgcolor: 'rgba(255,255,255,0.08)' }} />
      <CardContent>
        <Skeleton animation={false} sx={{ bgcolor: 'rgba(255,255,255,0.08)', height: 32, width: '82%' }} />
        <Skeleton animation={false} sx={{ bgcolor: 'rgba(255,255,255,0.08)', height: 24, width: '48%', mt: 1 }} />
        <Skeleton variant="rounded" animation={false} sx={{ bgcolor: 'rgba(233,69,96,0.16)', height: 42, mt: 4 }} />
      </CardContent>
    </Card>
  );
}
