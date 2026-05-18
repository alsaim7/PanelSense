import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';
import { defaultKeywords, getCanonicalUrl, SITE_NAME, truncateDescription } from '../utils/seo';

const DEFAULT_DESCRIPTION =
  'PanelSense is a modern wall panel catalog for browsing decorative wall panels, panel images, wooden wall panels, PVC wall panels, and laminate panel designs.';

export function SEO({
  title,
  description = DEFAULT_DESCRIPTION,
  image = '/favicon.svg',
  type = 'website',
  keywords = [],
  canonicalPath,
  noindex = false,
  structuredData = [],
}) {
  const location = useLocation();
  const canonicalUrl = getCanonicalUrl(canonicalPath || location.pathname);
  const metaTitle = title ? `${title} | ${SITE_NAME}` : `${SITE_NAME} | Wall Panel Designs and Decorative Panel Catalog`;
  const metaDescription = truncateDescription(description, DEFAULT_DESCRIPTION);
  const absoluteImage = image?.startsWith('http') ? image : getCanonicalUrl(image || '/favicon.svg');
  const schemas = Array.isArray(structuredData) ? structuredData.filter(Boolean) : [structuredData].filter(Boolean);

  return (
    <Helmet>
      <title>{metaTitle}</title>
      <meta name="description" content={metaDescription} />
      <meta name="keywords" content={[...defaultKeywords, ...keywords].join(', ')} />
      <link rel="canonical" href={canonicalUrl} />

      {noindex && <meta name="robots" content="noindex,follow" />}
      {!noindex && <meta name="robots" content="index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1" />}

      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:type" content={type} />
      <meta property="og:title" content={metaTitle} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content={absoluteImage} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={metaTitle} />
      <meta name="twitter:description" content={metaDescription} />
      <meta name="twitter:image" content={absoluteImage} />

      {schemas.map((schema, index) => (
        <script key={`${schema['@type'] || 'schema'}-${index}`} type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      ))}
    </Helmet>
  );
}
