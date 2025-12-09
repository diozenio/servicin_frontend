import { Review, CreateReviewRequest, CreateReviewResponse } from "@/core/domain/models/review";
import { ApiResponse } from "@/core/types/api";

export interface ReviewAdapter {
  createReview(request: CreateReviewRequest): Promise<CreateReviewResponse>;
}
