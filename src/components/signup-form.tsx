"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { DatePicker } from "@/components/ui/date-picker";
import { Steps } from "@/components/ui/steps";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/hooks/use-auth";
import { useStates, useCitiesByState } from "@/hooks/use-locations";
import { useState } from "react";
import { SignupRequest } from "@/core/domain/models/user";

const STEPS = [
  { label: "Credenciais", description: "Dados pessoais e acesso" },
  { label: "Endereço", description: "Localização" },
  { label: "Contato", description: "Informações de contato" },
];

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const { signup, isSigningUp, signupError } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<SignupRequest>({
    email: "",
    password: "",
    userType: "INDIVIDUAL",
    address: {
      street: "",
      cityId: "",
      stateId: "",
      zipCode: "",
      neighborhood: "",
      number: "",
    },
    contacts: [
      {
        type: "PHONE",
        value: "",
      },
    ],
    fullName: "",
    cpf: "",
    birthDate: null,
  });

  const { data: states = [], isLoading: isLoadingStates } = useStates();
  const { data: cities = [], isLoading: isLoadingCities } = useCitiesByState(
    formData.address.stateId || null
  );

  const validateStep = (step: number): boolean => {
    if (step === 1) {
      return !!(
        formData.fullName &&
        formData.email &&
        formData.cpf &&
        formData.birthDate &&
        formData.password
      );
    }
    if (step === 2) {
      return !!(
        formData.address.zipCode &&
        formData.address.stateId &&
        formData.address.cityId &&
        formData.address.street &&
        formData.address.number &&
        formData.address.neighborhood
      );
    }
    if (step === 3) {
      return !!formData.contacts[0]?.value;
    }
    return false;
  };

  const handleNext = () => {
    if (validateStep(currentStep) && currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (currentStep < STEPS.length) {
      handleNext();
      return;
    }
    try {
      await signup(formData);
    } catch {}
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { id, value } = e.target;

    if (id.startsWith("address.")) {
      const addressField = id.replace(
        "address.",
        ""
      ) as keyof SignupRequest["address"];
      setFormData((prev) => ({
        ...prev,
        address: {
          ...prev.address,
          [addressField]: value,
        },
      }));
    } else if (id === "phone") {
      setFormData((prev) => ({
        ...prev,
        contacts: [
          {
            type: "PHONE",
            value: value,
          },
        ],
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [id]: value,
      }));
    }
  };

  const formatCPF = (value: string) => {
    const cleaned = value.replace(/\D/g, "");
    if (cleaned.length <= 11) {
      return cleaned
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
    }
    return value;
  };

  const formatCEP = (value: string) => {
    const cleaned = value.replace(/\D/g, "");
    if (cleaned.length <= 8) {
      return cleaned.replace(/(\d{5})(\d)/, "$1-$2");
    }
    return value;
  };

  const handleCPFChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCPF(e.target.value);
    setFormData((prev) => ({
      ...prev,
      cpf: formatted.replace(/\D/g, ""),
    }));
  };

  const handleCEPChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCEP(e.target.value);
    setFormData((prev) => ({
      ...prev,
      address: {
        ...prev.address,
        zipCode: formatted.replace(/\D/g, ""),
      },
    }));
  };

  const formatPhone = (value: string) => {
    const cleaned = value.replace(/\D/g, "");
    if (cleaned.length <= 10) {
      return cleaned
        .replace(/(\d{2})(\d)/, "($1) $2")
        .replace(/(\d{4})(\d)/, "$1-$2");
    } else if (cleaned.length <= 11) {
      return cleaned
        .replace(/(\d{2})(\d)/, "($1) $2")
        .replace(/(\d{5})(\d)/, "$1-$2");
    }
    return value;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhone(e.target.value);
    const cleaned = formatted.replace(/\D/g, "");
    setFormData((prev) => ({
      ...prev,
      contacts: [
        {
          type: "PHONE",
          value: cleaned,
        },
      ],
    }));
  };

  const renderStepContent = () => {
    if (currentStep === 1) {
      return (
        <>
          <Field>
            <FieldLabel htmlFor="fullName">Nome Completo</FieldLabel>
            <Input
              id="fullName"
              type="text"
              placeholder="João Silva"
              value={formData.fullName}
              onChange={handleChange}
              required
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="email">Email</FieldLabel>
            <Input
              id="email"
              type="email"
              placeholder="m@example.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <FieldDescription>
              Usaremos isso para entrar em contato. Não compartilharemos seu
              email com ninguém.
            </FieldDescription>
          </Field>
          <Field>
            <FieldLabel htmlFor="cpf">CPF</FieldLabel>
            <Input
              id="cpf"
              type="text"
              placeholder="000.000.000-00"
              value={formatCPF(formData.cpf)}
              onChange={handleCPFChange}
              maxLength={14}
              required
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="birthDate">Data de Nascimento</FieldLabel>
            <DatePicker
              id="birthDate"
              value={formData.birthDate || ""}
              onChange={(date) => {
                setFormData((prev) => ({
                  ...prev,
                  birthDate: date || null,
                }));
              }}
              placeholder="Selecione sua data de nascimento"
              required
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="password">Senha</FieldLabel>
            <Input
              id="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <FieldDescription>
              Deve ter pelo menos 8 caracteres.
            </FieldDescription>
          </Field>
        </>
      );
    }

    if (currentStep === 2) {
      return (
        <>
          <Field>
            <FieldLabel htmlFor="address.zipCode">CEP</FieldLabel>
            <Input
              id="address.zipCode"
              type="text"
              placeholder="00000-000"
              value={formatCEP(formData.address.zipCode)}
              onChange={handleCEPChange}
              maxLength={9}
              required
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="address.stateId">Estado</FieldLabel>
            <Select
              value={formData.address.stateId}
              onValueChange={(value) => {
                setFormData((prev) => ({
                  ...prev,
                  address: {
                    ...prev.address,
                    stateId: value,
                    cityId: "",
                  },
                }));
              }}
              disabled={isLoadingStates}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecione um estado" />
              </SelectTrigger>
              <SelectContent>
                {states.map((state) => (
                  <SelectItem key={state.id} value={state.id}>
                    {state.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <Field>
            <FieldLabel htmlFor="address.cityId">Cidade</FieldLabel>
            <Select
              value={formData.address.cityId}
              onValueChange={(value) => {
                setFormData((prev) => ({
                  ...prev,
                  address: {
                    ...prev.address,
                    cityId: value,
                  },
                }));
              }}
              disabled={!formData.address.stateId || isLoadingCities}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecione uma cidade" />
              </SelectTrigger>
              <SelectContent>
                {cities.map((city) => (
                  <SelectItem key={city.id} value={city.id}>
                    {city.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <Field>
            <FieldLabel htmlFor="address.street">Rua</FieldLabel>
            <Input
              id="address.street"
              type="text"
              placeholder="Rua das Flores"
              value={formData.address.street}
              onChange={handleChange}
              required
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="address.number">Número</FieldLabel>
            <Input
              id="address.number"
              type="text"
              placeholder="123"
              value={formData.address.number}
              onChange={handleChange}
              required
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="address.neighborhood">Bairro</FieldLabel>
            <Input
              id="address.neighborhood"
              type="text"
              placeholder="Centro"
              value={formData.address.neighborhood}
              onChange={handleChange}
              required
            />
          </Field>
        </>
      );
    }

    if (currentStep === 3) {
      return (
        <>
          <Field>
            <FieldLabel htmlFor="phone">Telefone</FieldLabel>
            <Input
              id="phone"
              type="tel"
              placeholder="(11) 99999-9999"
              value={formatPhone(formData.contacts[0]?.value || "")}
              onChange={handlePhoneChange}
              autoComplete="tel"
              maxLength={15}
              required
            />
            <FieldDescription>
              Seu telefone será usado para entrar em contato.
            </FieldDescription>
          </Field>
        </>
      );
    }

    return null;
  };

  return (
    <form
      className={cn("flex flex-col gap-6", className)}
      onSubmit={handleSubmit}
      {...props}
    >
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center mb-6">
          <h1 className="text-2xl font-bold">Crie sua conta</h1>
          <p className="text-muted-foreground text-sm text-balance">
            Preencha o formulário abaixo para criar sua conta
          </p>
        </div>
        <Steps currentStep={currentStep} steps={STEPS} className="mb-8" />
        {renderStepContent()}
        {signupError && (
          <Field>
            <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md">
              {signupError.message}
            </div>
          </Field>
        )}
        <Field>
          <div className="flex gap-3">
            {currentStep > 1 && (
              <Button
                type="button"
                variant="outline"
                onClick={handlePrevious}
                className="flex-1"
              >
                Voltar
              </Button>
            )}
            <Button
              type="submit"
              disabled={isSigningUp || !validateStep(currentStep)}
              className={currentStep === 1 ? "w-full" : "flex-1"}
            >
              {currentStep < STEPS.length
                ? "Próximo"
                : isSigningUp
                ? "Criando conta..."
                : "Criar Conta"}
            </Button>
          </div>
        </Field>
        <Field>
          <FieldDescription className="text-center">
            Já tem uma conta?{" "}
            <a href="/auth/login" className="underline underline-offset-4">
              Entrar
            </a>
          </FieldDescription>
        </Field>
      </FieldGroup>
    </form>
  );
}
