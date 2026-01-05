/**
 * Narzędzia do SEO
 */

export interface SEOData {
  title: string;
  description: string;
  keywords?: string[];
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'product';
}

/**
 * Aktualizuje meta tagi SEO
 */
export const updateSEO = (data: SEOData) => {
  // Title
  if (document.title !== data.title) {
    document.title = `${data.title} | DlaMedica.pl`;
  }

  // Meta description
  let metaDescription = document.querySelector('meta[name="description"]');
  if (!metaDescription) {
    metaDescription = document.createElement('meta');
    metaDescription.setAttribute('name', 'description');
    document.head.appendChild(metaDescription);
  }
  metaDescription.setAttribute('content', data.description);

  // Meta keywords
  if (data.keywords && data.keywords.length > 0) {
    let metaKeywords = document.querySelector('meta[name="keywords"]');
    if (!metaKeywords) {
      metaKeywords = document.createElement('meta');
      metaKeywords.setAttribute('name', 'keywords');
      document.head.appendChild(metaKeywords);
    }
    metaKeywords.setAttribute('content', data.keywords.join(', '));
  }

  // Open Graph
  updateOGTag('og:title', data.title);
  updateOGTag('og:description', data.description);
  if (data.image) {
    updateOGTag('og:image', data.image);
  }
  if (data.url) {
    updateOGTag('og:url', data.url);
  }
  updateOGTag('og:type', data.type || 'website');

  // Twitter Card
  updateMetaTag('twitter:card', 'summary_large_image');
  updateMetaTag('twitter:title', data.title);
  updateMetaTag('twitter:description', data.description);
  if (data.image) {
    updateMetaTag('twitter:image', data.image);
  }
};

const updateOGTag = (property: string, content: string) => {
  let tag = document.querySelector(`meta[property="${property}"]`);
  if (!tag) {
    tag = document.createElement('meta');
    tag.setAttribute('property', property);
    document.head.appendChild(tag);
  }
  tag.setAttribute('content', content);
};

const updateMetaTag = (name: string, content: string) => {
  let tag = document.querySelector(`meta[name="${name}"]`);
  if (!tag) {
    tag = document.createElement('meta');
    tag.setAttribute('name', name);
    document.head.appendChild(tag);
  }
  tag.setAttribute('content', content);
};

/**
 * Generuje structured data (JSON-LD) dla produktu
 */
export const generateProductStructuredData = (product: {
  id: string;
  title: string;
  description: string;
  price: number;
  image: string;
  author: string;
  rating?: number;
  reviewCount?: number;
}) => {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.title,
    description: product.description,
    image: product.image,
    brand: {
      '@type': 'Brand',
      name: 'DlaMedica.pl',
    },
    offers: {
      '@type': 'Offer',
      price: product.price,
      priceCurrency: 'PLN',
      availability: 'https://schema.org/InStock',
    },
    author: {
      '@type': 'Person',
      name: product.author,
    },
    ...(product.rating && {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: product.rating,
        reviewCount: product.reviewCount || 0,
      },
    }),
  };
};

/**
 * Dodaje structured data do strony
 */
export const addStructuredData = (data: object) => {
  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.text = JSON.stringify(data);
  script.id = 'structured-data';
  
  // Usuń poprzedni structured data jeśli istnieje
  const existing = document.getElementById('structured-data');
  if (existing) {
    existing.remove();
  }
  
  document.head.appendChild(script);
};

/**
 * Aktualizuje meta tagi (alias dla updateSEO dla kompatybilności)
 */
export const updateMetaTags = (data: SEOData) => {
  updateSEO(data);
};

/**
 * Generuje dane SEO dla oferty pracy
 */
export const generateJobOfferSEO = (jobOffer: {
  title: string;
  description?: string;
  company?: string;
  location?: string;
  salary?: string;
  slug?: string;
}): SEOData => {
  const title = jobOffer.title || 'Oferta pracy';
  const description = jobOffer.description || 
    `${title}${jobOffer.company ? ` w ${jobOffer.company}` : ''}${jobOffer.location ? ` - ${jobOffer.location}` : ''}. ${jobOffer.salary ? `Wynagrodzenie: ${jobOffer.salary}.` : ''} Sprawdź szczegóły i aplikuj już dziś!`;
  
  const keywords = [
    'oferta pracy',
    'praca medyczna',
    jobOffer.title,
    jobOffer.company,
    jobOffer.location,
  ].filter(Boolean) as string[];

  return {
    title,
    description,
    keywords,
    type: 'article',
    url: jobOffer.slug ? `${window.location.origin}/praca/${jobOffer.slug}` : undefined,
  };
};
