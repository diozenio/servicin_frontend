"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useCreateService } from "@/hooks/use-service";
import { useAuth } from "@/hooks/use-auth";
import { useCategories } from "@/hooks/use-categories";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Field, FieldLabel } from "@/components/ui/field";
import { PlusCircle, Trash2 } from "lucide-react";
import { CreateServicePayload } from "@/core/domain/models/service";

type AvailabilitySlot = {
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  slotDuration: number;
};

const DAYS_OF_WEEK = [
  { value: 0, label: "Domingo" },
  { value: 1, label: "Segunda-feira" },
  { value: 2, label: "Terça-feira" },
  { value: 3, label: "Quarta-feira" },
  { value: 4, label: "Quinta-feira" },
  { value: 5, label: "Sexta-feira" },
  { value: 6, label: "Sábado" },
];

export default function NewServicePage() {
  const router = useRouter();
  const { user, isLoading: isLoadingUser } = useAuth();
  const { data: categories = [], isLoading: isLoadingCategories } =
    useCategories();
  const { mutate: createService, isPending } = useCreateService();

  const [formData, setFormData] = React.useState({
    name: "",
    description: "",
    price: "",
    categoryId: "",
  });

  const [availabilities, setAvailabilities] = React.useState<
    AvailabilitySlot[]
  >([
    {
      dayOfWeek: 1,
      startTime: "09:00",
      endTime: "17:00",
      slotDuration: 60,
    },
  ]);

  const [errors, setErrors] = React.useState<Record<string, string>>({});

  React.useEffect(() => {
    if (!isLoadingUser && !user) {
      router.push("/auth/login?returnUrl=/services/new");
    }
  }, [user, isLoadingUser, router]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleCategoryChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      categoryId: value,
    }));
    if (errors.categoryId) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.categoryId;
        return newErrors;
      });
    }
  };

  const handleAvailabilityChange = (
    index: number,
    field: keyof AvailabilitySlot,
    value: string | number
  ) => {
    const newValue =
      field === "dayOfWeek" || field === "slotDuration" ? Number(value) : value;

    if (field === "dayOfWeek") {
      const isDuplicate = availabilities.some(
        (slot, i) => i !== index && slot.dayOfWeek === newValue
      );

      if (isDuplicate) {
        const dayName = DAYS_OF_WEEK.find((d) => d.value === newValue)?.label;
        setErrors((prev) => ({
          ...prev,
          [`availability-${index}`]: `${dayName} já está sendo usado em outro horário`,
        }));
        return;
      } else {
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors[`availability-${index}`];
          return newErrors;
        });
      }
    }

    setAvailabilities((prev) =>
      prev.map((slot, i) =>
        i === index
          ? {
              ...slot,
              [field]: newValue,
            }
          : slot
      )
    );
  };

  const addAvailability = () => {
    setAvailabilities((prev) => [
      ...prev,
      {
        dayOfWeek: 1,
        startTime: "09:00",
        endTime: "17:00",
        slotDuration: 60,
      },
    ]);
  };

  const removeAvailability = (index: number) => {
    if (availabilities.length > 1) {
      setAvailabilities((prev) => prev.filter((_, i) => i !== index));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Nome do serviço é obrigatório";
    }

    if (!formData.price || Number(formData.price) <= 0) {
      newErrors.price = "Preço deve ser maior que zero";
    }

    if (!formData.categoryId) {
      newErrors.categoryId = "Categoria é obrigatória";
    }

    const daysUsed = new Set<number>();
    availabilities.forEach((slot, index) => {
      if (daysUsed.has(slot.dayOfWeek)) {
        const dayName = DAYS_OF_WEEK.find(
          (d) => d.value === slot.dayOfWeek
        )?.label;
        newErrors[
          `availability-${index}`
        ] = `${dayName} já está sendo usado em outro horário`;
      }
      daysUsed.add(slot.dayOfWeek);
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm() || !user) return;

    const payload: CreateServicePayload = {
      providerId: user.id,
      categoryId: Number(formData.categoryId),
      addressId: user.address.id,
      name: formData.name,
      description: formData.description || undefined,
      price: Number(formData.price),
      availability: availabilities,
    };

    createService(payload, {
      onSuccess: (response) => {
        if (response.success && response.data) {
          router.push(`/services/${(response.data as any).id}`);
        } else {
          router.push("/search");
        }
      },
      onError: (error) => {
        console.error("Erro ao criar serviço:", error);
        setErrors({ submit: "Erro ao criar serviço. Tente novamente." });
      },
    });
  };

  if (isLoadingUser) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 rounded-full bg-muted animate-pulse mx-auto" />
          <p className="mt-4 text-muted-foreground">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-serif font-bold mb-2">
            Criar Novo Serviço
          </h1>
          <p className="text-muted-foreground">
            Preencha os dados abaixo para criar um novo serviço
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="border rounded-lg p-6 bg-card">
            <h2 className="text-xl font-semibold mb-4">Informações Básicas</h2>
            <div className="space-y-4">
              <Field>
                <FieldLabel htmlFor="name">
                  Nome do Serviço <span className="text-red-500">*</span>
                </FieldLabel>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Ex: Corte de cabelo masculino"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={errors.name ? "border-red-500" : ""}
                />
                {errors.name && (
                  <p className="text-sm text-red-500 mt-1">{errors.name}</p>
                )}
              </Field>

              <Field>
                <FieldLabel htmlFor="description">Descrição</FieldLabel>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Descreva seu serviço..."
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                />
              </Field>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field>
                  <FieldLabel htmlFor="price">
                    Preço (R$) <span className="text-red-500">*</span>
                  </FieldLabel>
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    value={formData.price}
                    onChange={handleInputChange}
                    className={errors.price ? "border-red-500" : ""}
                  />
                  {errors.price && (
                    <p className="text-sm text-red-500 mt-1">{errors.price}</p>
                  )}
                </Field>

                <Field>
                  <FieldLabel htmlFor="categoryId">
                    Categoria <span className="text-red-500">*</span>
                  </FieldLabel>
                  <Select
                    value={formData.categoryId}
                    onValueChange={handleCategoryChange}
                    disabled={isLoadingCategories}
                  >
                    <SelectTrigger
                      className={errors.categoryId ? "border-red-500" : ""}
                    >
                      <SelectValue placeholder="Selecione uma categoria" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem
                          key={category.id}
                          value={category.id.toString()}
                        >
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.categoryId && (
                    <p className="text-sm text-red-500 mt-1">
                      {errors.categoryId}
                    </p>
                  )}
                </Field>
              </div>
            </div>
          </div>

          <div className="border rounded-lg p-6 bg-card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Disponibilidade</h2>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addAvailability}
              >
                <PlusCircle className="w-4 h-4 mr-2" />
                Adicionar Horário
              </Button>
            </div>

            <div className="space-y-4">
              {availabilities.map((slot, index) => (
                <div key={index} className="border rounded-lg p-4 bg-muted/30">
                  <div className="flex items-start gap-4">
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-4">
                      <Field>
                        <FieldLabel>Dia da Semana</FieldLabel>
                        <Select
                          value={slot.dayOfWeek.toString()}
                          onValueChange={(value) =>
                            handleAvailabilityChange(index, "dayOfWeek", value)
                          }
                        >
                          <SelectTrigger
                            className={
                              errors[`availability-${index}`]
                                ? "border-red-500"
                                : ""
                            }
                          >
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {DAYS_OF_WEEK.map((day) => (
                              <SelectItem
                                key={day.value}
                                value={day.value.toString()}
                              >
                                {day.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {errors[`availability-${index}`] && (
                          <p className="text-sm text-red-500 mt-1">
                            {errors[`availability-${index}`]}
                          </p>
                        )}
                      </Field>

                      <Field>
                        <FieldLabel>Hora Início</FieldLabel>
                        <Input
                          type="time"
                          value={slot.startTime}
                          onChange={(e) =>
                            handleAvailabilityChange(
                              index,
                              "startTime",
                              e.target.value
                            )
                          }
                        />
                      </Field>

                      <Field>
                        <FieldLabel>Hora Fim</FieldLabel>
                        <Input
                          type="time"
                          value={slot.endTime}
                          onChange={(e) =>
                            handleAvailabilityChange(
                              index,
                              "endTime",
                              e.target.value
                            )
                          }
                        />
                      </Field>

                      <Field>
                        <FieldLabel>Duração (min)</FieldLabel>
                        <Input
                          type="number"
                          min="15"
                          step="15"
                          value={slot.slotDuration}
                          onChange={(e) =>
                            handleAvailabilityChange(
                              index,
                              "slotDuration",
                              e.target.value
                            )
                          }
                        />
                      </Field>
                    </div>

                    {availabilities.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeAvailability(index)}
                        className="mt-6"
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {errors.submit && (
            <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded">
              {errors.submit}
            </div>
          )}

          <div className="flex gap-4 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              disabled={isPending}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Criando..." : "Criar Serviço"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
