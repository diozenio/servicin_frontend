export type CreateReviewRequest = {
  appointmentId: string;
  rating: number;
  comment?: string;
};

export type Review = {
  id: string;
  serviceId: string;
  clientId: string;
  appointmentId: string;
  rating: number;
  comment: string | null;
  createdAt: string;
};

export type CreateReviewResponse = {
  id: string;
  serviceId: string;
  clientId: string;
  appointmentId: string;
  rating: number;
  comment: string | null;
  createdAt: string;
};
