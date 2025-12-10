export type CreateReviewRequest = {
    appointmentId: string; 
    rating: number;     
    comment?: string;      
};

export type Review = {
  id: string;
  serviceId: string;
  clientId: string;
  rating: number;
  comment: string | null; 
  createdAt: string;      
};

export type CreateReviewResponse = {
  message: string;
  review: Review;
};