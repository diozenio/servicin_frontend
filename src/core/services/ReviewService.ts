import {
  CreateReviewRequest,
  CreateReviewResponse,
} from "@/core/domain/models/review";
import { ApiResponse } from "@/core/types/api";
import { ReviewAdapter } from "@/core/interfaces/adapters/ReviewAdapter";
import { ReviewUseCase } from "@/core/interfaces/usecases/ReviewUseCase";

export class ReviewService implements ReviewUseCase {
  constructor(private reviewAdapter: ReviewAdapter) {}

  createReview(
    request: CreateReviewRequest
  ): Promise<ApiResponse<CreateReviewResponse>> {
    return this.reviewAdapter.createReview(request);
  }
}
