"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldDescription,
} from "@/components/ui/field";
import { RatingGroup } from "@ark-ui/react/rating-group";
import { StarIcon } from "lucide-react";
import { useState } from "react";
import { useCreateReview } from "@/hooks/use-review"; 
import { CreateReviewRequest } from "@/core/domain/models/review";

interface ServiceReviewFormProps extends React.ComponentProps<"form"> {
  appointmentId: string;
  serviceName?: string;
  onSuccessReview?: () => void;
}

export function ServiceReviewForm({
  className,
  appointmentId,
  serviceName = "este serviço",
  onSuccessReview,
  ...props
}: ServiceReviewFormProps) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const { mutate: createReview, isPending } = useCreateReview();

  const ratingLabels = ["Ruim", "Razoável", "Bom", "Muito Bom", "Excelente"];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) return;

    const reviewRequest: CreateReviewRequest = {
      appointmentId,
      rating,
      comment: comment || undefined,
    };

    createReview(reviewRequest, {
      onSuccess: () => {
        setRating(0);
        setComment("");
        onSuccessReview?.();
      },
    });
  };

  return (
    <form
      className={cn("flex flex-col gap-6", className)}
      onSubmit={handleSubmit}
      {...props}
    >
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">Avalie o Serviço</h1>
          <p className="text-muted-foreground text-sm text-balance">
            Como foi sua experiência com <span className="font-medium text-foreground">{serviceName}</span>?
          </p>
        </div>

        <Field className="items-center">
          <RatingGroup.Root
            count={5}
            value={rating}
            onValueChange={(details) => setRating(details.value)}
            allowHalf
            className="flex flex-col items-center gap-2"
          >
            <RatingGroup.Label className="sr-only">Avaliação em estrelas</RatingGroup.Label>
            <RatingGroup.Control className="inline-flex gap-1">
              <RatingGroup.Context>
                {({ items }) =>
                  items.map((item) => (
                    <RatingGroup.Item
                      key={item}
                      index={item}
                      className="group transition-transform hover:scale-110 focus:outline-none"
                    >
                      <RatingGroup.ItemContext>
                        {({ half, highlighted }) => (
                          <div className="relative">
                            <StarIcon className="w-8 h-8 text-muted stroke-muted-foreground/20 fill-muted" />
                            <div
                              className={cn(
                                "absolute inset-0 overflow-hidden",
                                highlighted ? "w-full" : "w-0",
                                half && "w-1/2"
                              )}
                            >
                              <StarIcon className="w-8 h-8 text-yellow-400 fill-yellow-400 stroke-yellow-500" />
                            </div>
                          </div>
                        )}
                      </RatingGroup.ItemContext>
                    </RatingGroup.Item>
                  ))
                }
              </RatingGroup.Context>
              <RatingGroup.HiddenInput />
            </RatingGroup.Control>
          </RatingGroup.Root>

          <div className="h-6 text-center">
            {rating > 0 && (
              <span className="text-sm font-medium text-primary animate-in fade-in slide-in-from-bottom-1">
                {ratingLabels[Math.ceil(rating) - 1] || `${rating} Estrelas`}
              </span>
            )}
          </div>
        </Field>

        <Field>
          <FieldLabel htmlFor="comment">Comentário (Opcional)</FieldLabel>
          <textarea
            id="comment"
            placeholder="Conte-nos mais detalhes sobre o serviço..."
            className="flex min-h-[100px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 resize-none"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <FieldDescription>
            Seu feedback ajuda outros usuários e melhora nossos serviços.
          </FieldDescription>
        </Field>

        <Field>
          <Button type="submit" disabled={isPending || rating === 0} className="w-full">
            {isPending ? "Enviando..." : "Enviar Avaliação"}
          </Button>
        </Field>
      </FieldGroup>
    </form>
  );
}