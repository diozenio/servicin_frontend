import { Review, CreateReviewRequest, CreateReviewResponse } from "@/core/domain/models/review";
import { ApiResponse } from "@/core/types/api";
import { ReviewAdapter } from "@/core/interfaces/adapters/ReviewAdapter";
import { client } from "@/lib/client";

export class ReviewAPI implements ReviewAdapter {
  async createReview(request: CreateReviewRequest): Promise<CreateReviewResponse> {
    const response = await client.post("/reviews", request);
    return response.data as CreateReviewResponse;
  }
}
