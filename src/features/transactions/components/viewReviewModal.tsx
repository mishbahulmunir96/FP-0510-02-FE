import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { format } from "date-fns";
import { Building2, MapPin, MessageSquare, Star } from "lucide-react";

interface ViewReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  review: {
    id: number;
    rating: number;
    review: string;
    createdAt: string;
    replyMessage?: string;
    replyDate?: string;
    property: {
      title: string;
      location: string;
    } | null;
  };
}

const ViewReviewModal = ({ isOpen, onClose, review }: ViewReviewModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl">Your Review</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Property Details */}
          {review.property && (
            <div className="space-y-2 rounded-lg bg-gray-50 p-4">
              <div className="flex items-center gap-2">
                <Building2 className="h-4 w-4 text-blue-600" />
                <h3 className="font-medium">{review.property.title}</h3>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <MapPin className="h-4 w-4" />
                <p>{review.property.location}</p>
              </div>
            </div>
          )}

          {/* Rating and Review */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="flex">
                {[...Array(5)].map((_, index) => (
                  <Star
                    key={index}
                    className={`h-5 w-5 ${
                      index < review.rating
                        ? "text-yellow-400"
                        : "text-gray-200"
                    }`}
                    fill={index < review.rating ? "currentColor" : "none"}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-500">
                {format(new Date(review.createdAt), "dd MMM yyyy")}
              </span>
            </div>

            <div className="rounded-lg border p-4">
              <p className="text-sm text-gray-700">{review.review}</p>
            </div>
          </div>

          {/* Owner Reply */}
          {review.replyMessage && (
            <div className="space-y-2 rounded-lg bg-blue-50 p-4">
              <div className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-blue-600" />
                <h4 className="font-medium text-gray-900">Owner Response</h4>
              </div>
              <p className="text-sm text-gray-700">{review.replyMessage}</p>
              {review.replyDate && (
                <p className="text-xs text-gray-500">
                  Replied on {format(new Date(review.replyDate), "dd MMM yyyy")}
                </p>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ViewReviewModal;
