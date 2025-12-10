import {
  CreateReviewRequest,
  CreateReviewResponse,
} from "@/core/domain/models/review";
import { ApiResponse } from "@/core/types/api";
import { ReviewAdapter } from "@/core/interfaces/adapters/ReviewAdapter";
import { client } from "@/lib/client";

export class ReviewAPI implements ReviewAdapter {
  async createReview(
    request: CreateReviewRequest
  ): Promise<ApiResponse<CreateReviewResponse>> {
    const { data } = await client.post("/reviews/", request);
    return data;
  }
}
