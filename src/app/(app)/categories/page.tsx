"use client";

import * as React from "react";
import { useCategories, useCreateCategory } from "@/hooks/use-categories";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Field, FieldLabel } from "@/components/ui/field";
import { PlusCircle, Tag } from "lucide-react";
import { CreateCategoryPayload } from "@/core/domain/models/category";

export default function CategoriesPage() {
  const { data: categories = [], isLoading } = useCategories();
  const { mutate: createCategory, isPending } = useCreateCategory();

  const [isFormOpen, setIsFormOpen] = React.useState(false);
  const [formData, setFormData] = React.useState({
    name: "",
    description: "",
  });
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [successMessage, setSuccessMessage] = React.useState("");

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

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Nome da categoria é obrigatório";
    }

    if (formData.name.trim().length < 3) {
      newErrors.name = "Nome deve ter pelo menos 3 caracteres";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    const payload: CreateCategoryPayload = {
      name: formData.name.trim(),
      description: formData.description.trim() || "",
    };

    createCategory(payload, {
      onSuccess: () => {
        setFormData({ name: "", description: "" });
        setIsFormOpen(false);
        setSuccessMessage("Categoria criada com sucesso!");
        setTimeout(() => setSuccessMessage(""), 3000);
      },
      onError: (error) => {
        console.error("Erro ao criar categoria:", error);
        setErrors({ submit: "Erro ao criar categoria. Tente novamente." });
      },
    });
  };

  const handleCancel = () => {
    setFormData({ name: "", description: "" });
    setErrors({});
    setIsFormOpen(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 rounded-full bg-muted animate-pulse mx-auto" />
          <p className="mt-4 text-muted-foreground">Carregando categorias...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-serif font-bold mb-2">Categorias</h1>
            <p className="text-muted-foreground">
              Gerencie as categorias de serviços
            </p>
          </div>
          <Button
            onClick={() => setIsFormOpen(!isFormOpen)}
            disabled={isPending}
          >
            <PlusCircle className="w-4 h-4 mr-2" />
            Nova Categoria
          </Button>
        </div>

        {successMessage && (
          <div className="mb-6 bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded">
            {successMessage}
          </div>
        )}

        {isFormOpen && (
          <div className="mb-8 border rounded-lg p-6 bg-card">
            <h2 className="text-xl font-semibold mb-4">Criar Nova Categoria</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Field>
                <FieldLabel htmlFor="name">
                  Nome <span className="text-red-500">*</span>
                </FieldLabel>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Ex: Beleza e Estética"
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
                  placeholder="Descreva a categoria..."
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={3}
                />
              </Field>

              {errors.submit && (
                <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded">
                  {errors.submit}
                </div>
              )}

              <div className="flex gap-4 justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancel}
                  disabled={isPending}
                >
                  Cancelar
                </Button>
                <Button type="submit" disabled={isPending}>
                  {isPending ? "Criando..." : "Criar Categoria"}
                </Button>
              </div>
            </form>
          </div>
        )}

        <div className="border rounded-lg bg-card">
          <div className="p-6 border-b">
            <h2 className="text-xl font-semibold">
              Categorias Existentes ({categories.length})
            </h2>
          </div>

          {categories.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              <Tag className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Nenhuma categoria encontrada</p>
              <p className="text-sm mt-1">
                Clique em "Nova Categoria" para criar a primeira
              </p>
            </div>
          ) : (
            <div className="divide-y">
              {categories.map((category) => (
                <div
                  key={category.id}
                  className="p-6 hover:bg-muted/30 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Tag className="w-4 h-4 text-muted-foreground" />
                        <h3 className="text-lg font-semibold">
                          {category.name}
                        </h3>
                      </div>
                      {category.description && (
                        <p className="text-muted-foreground">
                          {category.description}
                        </p>
                      )}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      ID: {category.id}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
