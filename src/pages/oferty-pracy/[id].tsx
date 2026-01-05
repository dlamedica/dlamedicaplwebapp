import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import JobOfferDetailPage from '../../components/pages/JobOfferDetailPage';
import { getJobOfferBySlug, JobOffer } from '../../lib/types/job-offers';
import { updateMetaTags, generateJobOfferSEO } from '../../utils/seo';

interface JobOfferDetailProps {
  darkMode: boolean;
  fontSize: 'small' | 'medium' | 'large';
}

/**
 * Job Offer Detail Page - Dynamic Route Handler
 * Equivalent to Next.js pages/oferty-pracy/[id].tsx
 * 
 * This component handles the dynamic routing for individual job offers.
 * It extracts the slug from the URL, fetches the job offer data,
 * and handles SEO meta tags for better search engine optimization.
 */
const JobOfferDetail: React.FC<JobOfferDetailProps> = ({ darkMode, fontSize }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [slug, setSlug] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [jobOffer, setJobOffer] = useState<JobOffer | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Set default meta tags for job offers page
  useEffect(() => {
    updateMetaTags({
      title: 'Oferta pracy | DlaMedica.pl',
      description: 'Szczegóły oferty pracy dla specjalistów medycznych na portalu DlaMedica.pl',
      keywords: 'oferta pracy, medycy, lekarze, pielęgniarki, praca medyczna',
    });
  }, []);

  // Handle route parameter and fetch job offer data
  useEffect(() => {
    const fetchJobOfferData = async () => {
      if (!id) {
        navigate('/praca', { replace: true });
        return;
      }

      setSlug(id);
      setIsLoading(true);
      setError(null);

      try {
        const { data, error: fetchError } = await getJobOfferBySlug(id);
        
        if (fetchError) {
          setError(fetchError.message);
          // Set 404-like meta tags
          updateMetaTags({
            title: 'Oferta nie została znaleziona | DlaMedica.pl',
            description: 'Przepraszamy, nie można znaleźć oferty pracy o podanym adresie.',
          });
        } else if (data) {
          setJobOffer(data);
          // Set dynamic meta tags for the specific job offer
          const seoData = generateJobOfferSEO(data);
          updateMetaTags(seoData);
        } else {
          setError('Oferta pracy nie została znaleziona');
        }
      } catch (err) {
        setError('Wystąpił błąd podczas ładowania oferty pracy');
        console.error('Error fetching job offer:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchJobOfferData();
  }, [id, navigate]);

  // Show loading state
  if (isLoading) {
    return (
      <div className={`min-h-screen py-12 ${darkMode ? 'bg-black' : 'bg-white'} transition-colors duration-300`}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#38b6ff] mx-auto"></div>
            <p className={`mt-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Ładowanie oferty pracy...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error || !slug) {
    return (
      <div className={`min-h-screen py-12 ${darkMode ? 'bg-black' : 'bg-white'} transition-colors duration-300`}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className={`text-6xl mb-4 ${darkMode ? 'text-gray-600' : 'text-gray-400'}`}>
              🔍
            </div>
            <h1 className={`text-2xl md:text-3xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-black'}`}>
              {error || 'Oferta nie została znaleziona'}
            </h1>
            <p className={`text-base md:text-lg ${darkMode ? 'text-gray-300' : 'text-gray-600'} mb-6`}>
              Przepraszamy, nie można znaleźć oferty o podanym adresie.
            </p>
            <button
              onClick={() => navigate('/praca')}
              className="inline-flex items-center px-6 py-3 text-base font-semibold rounded-lg transition-colors duration-200 bg-[#38b6ff] text-black hover:bg-[#2a9fe5] shadow-md hover:shadow-lg"
            >
              ← Powrót do listy ofert
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <JobOfferDetailPage
      darkMode={darkMode}
      fontSize={fontSize}
      slug={slug}
    />
  );
};

// Export static props for better SEO (Next.js style)
export const getStaticPaths = async () => {
  // This would be used in Next.js to pre-generate paths
  // For React Router, this is just documentation
  return {
    paths: [],
    fallback: 'blocking'
  };
};

export const getStaticProps = async ({ params }: { params: { id: string } }) => {
  // This would be used in Next.js for SSG
  // For React Router, this is just documentation
  try {
    const { data: jobOffer } = await getJobOfferBySlug(params.id);
    
    return {
      props: {
        jobOffer,
        slug: params.id,
      },
      revalidate: 3600, // Revalidate every hour
    };
  } catch (error) {
    return {
      notFound: true,
    };
  }
};

export default JobOfferDetail;