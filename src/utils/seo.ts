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
 * Ustawia canonical URL
 */
export const setCanonicalURL = (url?: string) => {
  const canonicalUrl = url || window.location.href.split('?')[0];
  let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;

  if (!link) {
    link = document.createElement('link');
    link.rel = 'canonical';
    document.head.appendChild(link);
  }

  link.href = canonicalUrl;
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

/**
 * Generuje JSON-LD dla artykulu
 */
export const generateArticleStructuredData = (article: {
  title: string;
  description: string;
  author?: string;
  datePublished?: string;
  dateModified?: string;
  image?: string;
  url?: string;
}) => {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.description,
    author: {
      '@type': 'Organization',
      name: article.author || 'DlaMedica.pl',
    },
    publisher: {
      '@type': 'Organization',
      name: 'DlaMedica.pl',
      logo: {
        '@type': 'ImageObject',
        url: 'https://dlamedica.pl/logo.svg',
      },
    },
    datePublished: article.datePublished || new Date().toISOString(),
    dateModified: article.dateModified || article.datePublished || new Date().toISOString(),
    ...(article.image && { image: article.image }),
    ...(article.url && { mainEntityOfPage: article.url }),
  };
};

/**
 * Generuje JSON-LD dla wydarzenia
 */
export const generateEventStructuredData = (event: {
  name: string;
  description: string;
  startDate: string;
  endDate?: string;
  location?: string;
  isOnline?: boolean;
  url?: string;
  image?: string;
  price?: number;
  organizer?: string;
}) => {
  return {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: event.name,
    description: event.description,
    startDate: event.startDate,
    endDate: event.endDate || event.startDate,
    eventAttendanceMode: event.isOnline
      ? 'https://schema.org/OnlineEventAttendanceMode'
      : 'https://schema.org/OfflineEventAttendanceMode',
    location: event.isOnline
      ? { '@type': 'VirtualLocation', url: event.url }
      : { '@type': 'Place', name: event.location || 'TBA' },
    ...(event.image && { image: event.image }),
    ...(event.price !== undefined && {
      offers: {
        '@type': 'Offer',
        price: event.price,
        priceCurrency: 'PLN',
        availability: 'https://schema.org/InStock',
      },
    }),
    organizer: {
      '@type': 'Organization',
      name: event.organizer || 'DlaMedica.pl',
    },
  };
};

/**
 * Generuje JSON-LD dla oferty pracy
 */
export const generateJobPostingStructuredData = (job: {
  title: string;
  description: string;
  company: string;
  location?: string;
  salaryMin?: number;
  salaryMax?: number;
  employmentType?: string;
  datePosted?: string;
  validThrough?: string;
}) => {
  return {
    '@context': 'https://schema.org',
    '@type': 'JobPosting',
    title: job.title,
    description: job.description,
    datePosted: job.datePosted || new Date().toISOString(),
    validThrough: job.validThrough,
    hiringOrganization: {
      '@type': 'Organization',
      name: job.company,
    },
    jobLocation: {
      '@type': 'Place',
      address: {
        '@type': 'PostalAddress',
        addressLocality: job.location || 'Polska',
        addressCountry: 'PL',
      },
    },
    ...(job.salaryMin && job.salaryMax && {
      baseSalary: {
        '@type': 'MonetaryAmount',
        currency: 'PLN',
        value: {
          '@type': 'QuantitativeValue',
          minValue: job.salaryMin,
          maxValue: job.salaryMax,
          unitText: 'MONTH',
        },
      },
    }),
    employmentType: job.employmentType || 'FULL_TIME',
  };
};

/**
 * Generuje JSON-LD dla organizacji (strona glowna)
 */
export const generateOrganizationStructuredData = () => {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'DlaMedica.pl',
    url: 'https://dlamedica.pl',
    logo: 'https://dlamedica.pl/logo.svg',
    description: 'Portal edukacyjny dla medykow - kalkulatory, baza lekow, wydarzenia, oferty pracy',
    sameAs: [
      'https://www.facebook.com/dlamedica',
      'https://www.linkedin.com/company/dlamedica',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer service',
      email: 'kontakt@dlamedica.pl',
    },
  };
};

/**
 * Generuje JSON-LD dla strony z FAQ
 */
export const generateFAQStructuredData = (faqs: Array<{ question: string; answer: string }>) => {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
};
