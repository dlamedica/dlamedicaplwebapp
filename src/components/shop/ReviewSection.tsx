import React, { useState, useEffect } from 'react';
import { FaStar, FaThumbsUp, FaUser, FaCheckCircle } from 'react-icons/fa';
import { Review, createReview, getEbookReviews, getUserReview, updateReview, voteHelpful, getUserVote } from '../../services/reviewService';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../hooks/useToast';

interface ReviewSectionProps {
  ebookId: string;
  darkMode: boolean;
  fontSize: 'small' | 'medium' | 'large';
}

const ReviewSection: React.FC<ReviewSectionProps> = ({ ebookId, darkMode, fontSize }) => {
  const { user } = useAuth();
  const { showSuccess, showError } = useToast();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [userReview, setUserReview] = useState<Review | null>(null);
  const [loading, setLoading] = useState(true);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fontSizes = {
    small: { title: 'text-xl', text: 'text-sm', button: 'text-sm' },
    medium: { title: 'text-2xl', text: 'text-base', button: 'text-base' },
    large: { title: 'text-3xl', text: 'text-lg', button: 'text-lg' },
  }[fontSize];

  useEffect(() => {
    loadReviews();
  }, [ebookId]);

  const loadReviews = async () => {
    try {
      setLoading(true);
      const [allReviews, myReview] = await Promise.all([
        getEbookReviews(ebookId),
        user ? getUserReview(ebookId) : Promise.resolve(null),
      ]);
      setReviews(allReviews);
      setUserReview(myReview);
    } catch (error: any) {
      console.error('Error loading reviews:', error);
      showError('Nie udało się załadować recenzji');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      showError('Musisz być zalogowany, aby dodać recenzję');
      return;
    }

    try {
      setSubmitting(true);
      if (userReview) {
        // Update existing review
        await updateReview(userReview.id, { rating, title, comment });
        showSuccess('Recenzja zaktualizowana');
      } else {
        await createReview({ ebook_id: ebookId, rating, title, comment });
        showSuccess('Recenzja dodana! Dziękujemy za opinię.');
      }
      setShowReviewForm(false);
      setTitle('');
      setComment('');
      setRating(5);
      await loadReviews();
    } catch (error: any) {
      console.error('Error submitting review:', error);
      showError(error.message || 'Nie udało się dodać recenzji');
    } finally {
      setSubmitting(false);
    }
  };

  const handleVoteHelpful = async (reviewId: string, currentVote: boolean | null) => {
    if (!user) {
      showError('Musisz być zalogowany, aby głosować');
      return;
    }

    try {
      const newVote = currentVote === null ? true : !currentVote;
      await voteHelpful(reviewId, newVote);
      await loadReviews();
    } catch (error: any) {
      console.error('Error voting helpful:', error);
      showError('Nie udało się zagłosować');
    }
  };

  const averageRating = reviews.length > 0
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : 0;

  const ratingDistribution = [5, 4, 3, 2, 1].map(star => ({
    star,
    count: reviews.filter(r => r.rating === star).length,
    percentage: reviews.length > 0
      ? (reviews.filter(r => r.rating === star).length / reviews.length) * 100
      : 0,
  }));

  return (
    <div className={`mt-8 ${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg p-6`}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className={`${fontSizes.title} font-bold mb-2 ${
            darkMode ? 'text-white' : 'text-gray-900'
          }`}>
            Recenzje i oceny
          </h3>
          {reviews.length > 0 && (
            <div className="flex items-center gap-2">
              <div className="flex items-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <FaStar
                    key={star}
                    className={`${
                      star <= Math.round(averageRating)
                        ? 'text-yellow-400 fill-current'
                        : darkMode
                        ? 'text-gray-600'
                        : 'text-gray-300'
                    }`}
                    size={20}
                  />
                ))}
              </div>
              <span className={`${fontSizes.text} font-semibold ml-2 ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>
                {averageRating.toFixed(1)}
              </span>
              <span className={`${fontSizes.text} ${
                darkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
                ({reviews.length} {reviews.length === 1 ? 'recenzja' : 'recenzji'})
              </span>
            </div>
          )}
        </div>
        {user && !userReview && (
          <button
            onClick={() => setShowReviewForm(!showReviewForm)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
              darkMode
                ? 'bg-[#38b6ff] text-black hover:bg-[#2a9fe5]'
                : 'bg-[#38b6ff] text-black hover:bg-[#2a9fe5]'
            } ${fontSizes.button}`}
          >
            Dodaj recenzję
          </button>
        )}
      </div>

      {/* Rating Distribution */}
      {reviews.length > 0 && (
        <div className="mb-6 space-y-2">
          {ratingDistribution.map(({ star, count, percentage }) => (
            <div key={star} className="flex items-center gap-2">
              <span className={`${fontSizes.text} w-12 ${
                darkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
                {star} ★
              </span>
              <div className={`flex-1 h-2 rounded-full ${
                darkMode ? 'bg-gray-700' : 'bg-gray-200'
              }`}>
                <div
                  className="h-full bg-yellow-400 rounded-full"
                  style={{ width: `${percentage}%` }}
                />
              </div>
              <span className={`${fontSizes.text} w-12 text-right ${
                darkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
                {count}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Review Form */}
      {showReviewForm && user && !userReview && (
        <form onSubmit={handleSubmitReview} className={`mb-6 p-4 rounded-lg ${
          darkMode ? 'bg-gray-700' : 'bg-gray-50'
        }`}>
          <div className="mb-4">
            <label className={`block mb-2 ${fontSizes.text} font-medium ${
              darkMode ? 'text-white' : 'text-gray-900'
            }`}>
              Ocena
            </label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className="focus:outline-none"
                >
                  <FaStar
                    className={`${
                      star <= rating
                        ? 'text-yellow-400 fill-current'
                        : darkMode
                        ? 'text-gray-600'
                        : 'text-gray-300'
                    } transition-colors`}
                    size={24}
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="mb-4">
            <label className={`block mb-2 ${fontSizes.text} font-medium ${
              darkMode ? 'text-white' : 'text-gray-900'
            }`}>
              Tytuł recenzji (opcjonalnie)
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={`w-full px-4 py-2 rounded-lg border ${
                darkMode
                  ? 'bg-gray-600 border-gray-500 text-white'
                  : 'bg-white border-gray-300 text-gray-900'
              } focus:outline-none focus:ring-2 focus:ring-[#38b6ff]`}
              placeholder="Krótki tytuł recenzji"
            />
          </div>

          <div className="mb-4">
            <label className={`block mb-2 ${fontSizes.text} font-medium ${
              darkMode ? 'text-white' : 'text-gray-900'
            }`}>
              Twoja opinia
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={4}
              className={`w-full px-4 py-2 rounded-lg border ${
                darkMode
                  ? 'bg-gray-600 border-gray-500 text-white'
                  : 'bg-white border-gray-300 text-gray-900'
              } focus:outline-none focus:ring-2 focus:ring-[#38b6ff]`}
              placeholder="Podziel się swoją opinią o produkcie..."
            />
          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              disabled={submitting}
              className={`px-6 py-2 rounded-lg font-medium transition-colors duration-200 ${
                darkMode
                  ? 'bg-[#38b6ff] text-black hover:bg-[#2a9fe5]'
                  : 'bg-[#38b6ff] text-black hover:bg-[#2a9fe5]'
              } ${fontSizes.button} ${submitting ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {submitting ? 'Zapisywanie...' : 'Opublikuj recenzję'}
            </button>
            <button
              type="button"
              onClick={() => {
                setShowReviewForm(false);
                setTitle('');
                setComment('');
                setRating(5);
              }}
              className={`px-6 py-2 rounded-lg font-medium transition-colors duration-200 ${
                darkMode
                  ? 'bg-gray-600 text-white hover:bg-gray-500'
                  : 'bg-gray-200 text-gray-900 hover:bg-gray-300'
              } ${fontSizes.button}`}
            >
              Anuluj
            </button>
          </div>
        </form>
      )}

      {/* Reviews List */}
      {loading ? (
        <div className="text-center py-8">
          <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Ładowanie recenzji...</p>
        </div>
      ) : reviews.length === 0 ? (
        <div className="text-center py-8">
          <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
            Brak recenzji. Bądź pierwszy!
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div
              key={review.id}
              className={`p-4 rounded-lg ${
                darkMode ? 'bg-gray-700' : 'bg-gray-50'
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <FaUser className={darkMode ? 'text-gray-400' : 'text-gray-600'} />
                  <span className={`${fontSizes.text} font-medium ${
                    darkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    {review.user_name || 'Anonimowy'}
                  </span>
                  {review.is_verified_purchase && (
                    <FaCheckCircle className="text-green-500" title="Zweryfikowany zakup" />
                  )}
                </div>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <FaStar
                      key={star}
                      className={`${
                        star <= review.rating
                          ? 'text-yellow-400 fill-current'
                          : darkMode
                          ? 'text-gray-600'
                          : 'text-gray-300'
                      }`}
                      size={14}
                    />
                  ))}
                </div>
              </div>

              {review.title && (
                <h4 className={`${fontSizes.text} font-semibold mb-2 ${
                  darkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  {review.title}
                </h4>
              )}

              {review.comment && (
                <p className={`${fontSizes.text} mb-3 ${
                  darkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  {review.comment}
                </p>
              )}

              <div className="flex items-center justify-between">
                <span className={`text-xs ${
                  darkMode ? 'text-gray-500' : 'text-gray-500'
                }`}>
                  {new Date(review.created_at).toLocaleDateString('pl-PL')}
                </span>
                <button
                  onClick={() => handleVoteHelpful(review.id, null)}
                  className={`flex items-center gap-1 px-3 py-1 rounded-lg transition-colors duration-200 ${
                    darkMode
                      ? 'text-gray-400 hover:bg-gray-600'
                      : 'text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <FaThumbsUp />
                  <span className="text-xs">Pomocne ({review.helpful_count})</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReviewSection;

