import { Review, CreateReviewRequest, CreateReviewResponse } from "@/core/domain/models/review";
import { ApiResponse } from "@/core/types/api";

export interface ReviewUseCase {
  createReview(request: CreateReviewRequest): Promise<CreateReviewResponse>;
}
