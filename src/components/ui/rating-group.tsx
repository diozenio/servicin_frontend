"use client";

import { RatingGroup } from "@ark-ui/react/rating-group";
import { StarIcon } from "lucide-react";
import { useState } from "react";
import { useCreateReview } from "@/hooks/use-review";
import { CreateReviewRequest } from "@/core/domain/models/review";

interface BasicRatingProps {
  appointmentId: string;
  onSuccess?: () => void;
}

export default function BasicRating({ appointmentId, onSuccess }: BasicRatingProps) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const { mutate: createReview, isPending } = useCreateReview();

  const ratingLabels = ["Poor", "Fair", "Good", "Very Good", "Excellent"];

  const handleSubmitReview = () => {
    if (rating > 0) {
      const reviewRequest: CreateReviewRequest = {
        appointmentId,
        rating,
        comment: comment || undefined,
      };
      createReview(reviewRequest, {
        onSuccess: () => {
          setRating(0);
          setComment("");
          onSuccess?.();
        },
      });
    }
  };

  return (
    <div className="max-w-sm w-full bg-white dark:bg-gray-800 rounded-lg shadow-base p-6">
      <div className="text-center space-y-4">
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Product Rating
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            How would you rate this product?
          </p>
        </div>

        <RatingGroup.Root
          count={5}
          value={rating}
          onValueChange={(details) => setRating(details.value)}
          allowHalf
        >
          <RatingGroup.Control className="inline-flex">
            <RatingGroup.Context>
              {({ items }) =>
                items.map((item) => (
                  <RatingGroup.Item
                    key={item}
                    index={item}
                    className="w-10 h-10 p-1 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 rounded-lg hover:scale-110 transition-transform"
                  >
                    <RatingGroup.ItemContext>
                      {({ half, highlighted }) => {
                        if (half) {
                          return (
                            <div className="relative w-8 h-8">
                              <StarIcon className="w-8 h-8 text-gray-300 dark:text-gray-600" />
                              <div className="absolute inset-0 overflow-hidden w-1/2">
                                <StarIcon className="w-8 h-8 text-yellow-400 fill-current" />
                              </div>
                            </div>
                          );
                        }
                        if (highlighted) {
                          return (
                            <StarIcon className="w-8 h-8 text-yellow-400 fill-current" />
                          );
                        }
                        return (
                          <StarIcon className="w-8 h-8 text-gray-300 dark:text-gray-600" />
                        );
                      }}
                    </RatingGroup.ItemContext>
                  </RatingGroup.Item>
                ))
              }
            </RatingGroup.Context>
            <RatingGroup.HiddenInput />
          </RatingGroup.Control>
        </RatingGroup.Root>

        {rating > 0 && (
          <div className="pt-2 space-y-3">
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                You rated this {rating} star{rating !== 1 ? "s" : ""}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {ratingLabels[Math.floor(rating) - 1]}
              </p>
            </div>

            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Add a comment (optional)"
              className="w-full text-sm p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
              rows={3}
            />

            <button
              onClick={handleSubmitReview}
              disabled={isPending}
              className="w-full px-4 py-2 bg-yellow-500 hover:bg-yellow-600 disabled:bg-gray-400 text-white font-medium rounded-md transition-colors"
            >
              {isPending ? "Submitting..." : "Submit Review"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
