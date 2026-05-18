import { memo, useState } from 'react';
import { Button, Card, CardContent, CardMedia } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { Link } from 'react-router-dom';
import { PanelPlaceholder } from './PanelPlaceholder';
import { panelImageAlt } from '../utils/seo';

function PanelCardComponent({ panel }) {
  const [imageFailed, setImageFailed] = useState(false);
  const panelPath = panel?.id ? `/panel/${panel.id}` : '/';

  return (
    <div className="panel-card-shell">
      <Card
        component="article"
        className="h-full overflow-hidden"
        sx={{
          bgcolor: 'rgba(15,52,96,0.34)',
          border: '1px solid var(--border)',
          boxShadow: 'var(--shadow)',
          transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
          '&:hover': {
            borderColor: 'rgba(233,69,96,0.62)',
            boxShadow: '0 18px 50px rgba(233,69,96,0.18)',
          },
        }}
      >
        <div className="aspect-[4/3] overflow-hidden">
          {panel?.image_url && !imageFailed ? (
            <CardMedia
              component="img"
              image={panel.image_url}
              alt={panelImageAlt(panel)}
              onError={() => setImageFailed(true)}
              loading="lazy"
              decoding="async"
              sx={{ height: '100%', width: '100%', objectFit: 'cover' }}
            />
          ) : (
            <PanelPlaceholder />
          )}
        </div>
        <CardContent className="flex min-h-40 flex-col justify-between gap-5">
          <h3 className="font-syne line-clamp-2 text-xl font-bold text-white">{panel?.name || 'Untitled Panel'}</h3>
          <Button
            fullWidth
            component={Link}
            to={panelPath}
            variant="outlined"
            endIcon={<ArrowForwardIcon />}
            aria-label={`View details for ${panel?.name || 'panel'}`}
            disabled={!panel?.id}
            sx={{
              borderColor: 'var(--accent)',
              color: 'var(--text-primary)',
              '&:hover': { borderColor: 'var(--accent-hover)', bgcolor: 'rgba(233,69,96,0.1)' },
            }}
          >
            View
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

export const PanelCard = memo(PanelCardComponent);
