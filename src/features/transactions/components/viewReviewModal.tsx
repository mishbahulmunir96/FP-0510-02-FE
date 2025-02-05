"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { format } from "date-fns";
import { Star } from "lucide-react";

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
  console.log(review);
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Your Review</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {review.property && (
            <div>
              <h3 className="font-medium">{review.property.title}</h3>
              <p className="text-sm text-muted-foreground">
                {review.property.location}
              </p>
            </div>
          )}

          <div className="flex items-center space-x-1">
            {[...Array(review.rating)].map((_, index) => (
              <Star
                key={index}
                className="h-5 w-5 text-yellow-400"
                fill="currentColor"
              />
            ))}
          </div>

          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              {format(new Date(review.createdAt), "dd MMM yyyy")}
            </p>
            <p className="text-sm">{review.review}</p>
          </div>

          {review.replyMessage && (
            <div className="space-y-2 rounded-lg bg-secondary p-4">
              <p className="text-sm font-medium">Owner Response:</p>
              <p className="text-sm">{review.replyMessage}</p>
              {review.replyDate && (
                <p className="text-xs text-muted-foreground">
                  {format(new Date(review.replyDate), "dd MMM yyyy")}
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
