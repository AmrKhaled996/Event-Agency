import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { Star, MessageCircle, Send, User ,Info} from "lucide-react";
import { createReview, getEventReviews, getMyEventReview } from "../../APIs/reviewApis";
import { useUser } from "../../Context/AuthProvider";
import RatingStars from "./RatingStars";
import { Button } from "../shadcn/button";
import { extractDateTime } from "../../utils/dateFormater";
import EmptyState from "./EmptyState";
import { handleError } from "../../utils/errorHandler";

export default function EventReviews({ eventId, organizerUserId }) {
  const { t } = useTranslation();
  const { user } = useUser();
  const [reviews, setReviews] = useState([]);
  const [stats, setStats] = useState({ averageRating: 0, total: 0 });
  const [loading, setLoading] = useState(true);
  const [myReview, setMyReview] = useState(null);
  
  // Submission state
  const [submitting, setSubmitting] = useState(false);
  const [newRating, setNewRating] = useState(0);
  const [newComment, setNewComment] = useState("");

  const isOrganizer = user && organizerUserId && user.id === organizerUserId;

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const res = await getEventReviews(eventId);
      const { reviews, total, averageRating } = res.data.data;
      setReviews(reviews);
      setStats({ total, averageRating });
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMyReview = async () => {
    if (!user || isOrganizer) return;
    try {
      const res = await getMyEventReview(eventId);
      // The API returns { review: 0 } if no review found
      if (res.data.data.id) {
        setMyReview(res.data.data);
      }
    } catch (error) {
      console.error("Failed to fetch personal review", error);
    }
  };

  useEffect(() => {
    if (eventId) {
      fetchReviews();
      fetchMyReview();
    }
  }, [eventId, user, organizerUserId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newRating === 0) {
      toast.error(t("reviews.validation.ratingRequired", "Please select a rating"));
      return;
    }

    try {
      setSubmitting(true);
      const res = await createReview(eventId, {
        rating: newRating,
        comment: newComment
      });
      
      toast.success(t("reviews.feedback.success", "Review submitted successfully!"));
      setMyReview(res.data.data.review);
      setNewRating(0);
      setNewComment("");
      fetchReviews(); // Refresh list and stats
    } catch (error) {
      handleError(error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mt-12 space-y-8">
      {/* Header & Summary */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-gray-100">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <MessageCircle className="text-primary" />
            {t("reviews.title", "Ratings & Reviews")}
          </h2>
          <p className="text-gray-500 mt-1">
            {stats.total} {t("reviews.count", "reviews")}
          </p>
        </div>

        {stats.total > 0 && (
          <div className="flex items-center gap-4 bg-gray-50 px-6 py-4 rounded-2xl">
            <div className="text-4xl font-black text-gray-800">
              {stats.averageRating}
            </div>
            <div>
              <RatingStars rating={stats.averageRating} size={24} />
              <p className="text-sm text-gray-500 mt-1">
                {t("reviews.average", "Average Rating")}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Submission Form for logged in non-organizer users */}
      {user && !myReview && !isOrganizer && (
        <form 
          onSubmit={handleSubmit}
          className="bg-white border-2 border-primary/10 rounded-2xl p-6 shadow-sm space-y-4"
        >
          <h3 className="font-bold text-lg">{t("reviews.form.title", "Leave a Review")}</h3>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-600 block">
              {t("reviews.form.rating", "Your Rating")}
            </label>
            <RatingStars 
              rating={newRating} 
              onRatingChange={setNewRating} 
              interactive 
              size={32} 
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-600 block">
              {t("reviews.form.comment", "Your Feedback (Optional)")}
            </label>
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder={t("reviews.form.placeholder", "Tell us about your experience...")}
              className="w-full min-h-32 bg-gray-50 border border-gray-200 rounded-xl p-4 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all resize-none"
            />
          </div>

          <div className="flex justify-end">
            <Button 
              type="submit" 
              loading={submitting}
              className="px-8"
            >
              <Send size={18} className="mr-2" />
              {t("reviews.form.submit", "Post Review")}
            </Button>
          </div>
        </form>
      )}

      {/* Login Prompt for Guests */}
      {!user && (
        <div className="bg-primary/5 border border-primary/10 rounded-2xl p-8 text-center space-y-4">
          <h3 className="font-bold text-xl text-gray-800">
            {t("reviews.guest.title", "Want to share your experience?")}
          </h3>
          <p className="text-gray-600 max-w-md mx-auto">
            {t("reviews.guest.description", "Log in to leave a rating and review for this event and help others in the community.")}
          </p>
          <div className="pt-2">
            <Button asChild>
              <Link to="/login">{t("common.login", "Log In")}</Link>
            </Button>
          </div>
        </div>
      )}

      {/* Organizer Notice */}
      {isOrganizer && (
        <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4 text-gray-600 text-sm flex items-center gap-3 italic">
          <Info size={18} />
          {t("reviews.organizerRestriction", "Organizers cannot review their own events.")}
        </div>
      )}

      {/* Success message if already reviewed */}
      {user && myReview && (
        <div className="bg-green-50 border border-green-100 rounded-2xl p-4 text-green-700 text-sm flex items-center gap-3">
          <Star className="fill-green-500 text-green-500" size={18} />
          {t("reviews.alreadyReviewed", "You have already reviewed this event. Thank you!")}
        </div>
      )}

      {/* Reviews List */}
      <div className="space-y-6">
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-32 bg-gray-100 animate-pulse rounded-2xl w-full" />
            ))}
          </div>
        ) : reviews.length > 0 ? (
          <div className="grid gap-6">
            {reviews.map((review) => (
              <div 
                key={review.id} 
                className="bg-gray-50/50 rounded-2xl p-6 border border-gray-100 transition-hover hover:border-primary/20"
              >
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                      <User size={20} />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-800">{review.user?.name}</h4>
                      <p className="text-xs text-gray-400">
                        {extractDateTime(review.createdAt).date}
                      </p>
                    </div>
                  </div>
                  <RatingStars rating={review.rating} size={16} />
                </div>
                {review.comment && (
                  <p className="text-gray-600 leading-relaxed italic">
                    "{review.comment}"
                  </p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <EmptyState 
            title={t("reviews.empty.title", "No reviews yet")}
            description={t("reviews.empty.desc", "Be the first to share your experience with this event!")}
            icon={MessageCircle}
          />
        )}
      </div>
    </div>
  );
}
