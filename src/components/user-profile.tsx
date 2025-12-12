"use client";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/use-auth";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { Switch } from "./ui/switch";
import {
  useServiceProvider,
  useUpdateServiceProviderSettings,
} from "@/hooks/use-provider";
import { Dialog, DialogTrigger } from "@radix-ui/react-dialog";
import DeleteAccountDialog from "./delete-account-dialog";

export function UserProfile() {
  const { user } = useAuth();

  const isIndividual = user?.userType === "INDIVIDUAL";
  const isProvider = user?.role === "PROVIDER";

  const { provider } = useServiceProvider(isProvider ? user?.id ?? null : null);

  const [showContact, setShowContact] = useState(
    () => provider?.showContactInfo ?? false
  );
  const [autoAcceptAppointments, setAutoAcceptAppointments] = useState(
    () => provider?.autoAcceptAppointments ?? false
  );

  const { mutate: updateSettings } = useUpdateServiceProviderSettings();

  useEffect(() => {
    if (provider) {
      setShowContact(provider.showContactInfo ?? false);
      setAutoAcceptAppointments(provider.autoAcceptAppointments ?? false);
    }
  }, [provider]);

  const displayName = isIndividual
    ? user?.individual?.fullName
    : user?.company?.corporateName;
  const initials =
    displayName
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "U";

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div className="flex-1">
            <h1 className="text-3xl md:text-4xl font-serif font-semibold text-foreground mb-2">
              {displayName}
            </h1>
            <p className="text-muted-foreground">{user?.email}</p>
          </div>

          <div className="flex items-start gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => console.log("asda")}
              className="text-destructive hover:text-destructive hover:bg-destructive/10"
            ></Button>

            <Avatar className="h-24 w-24 border-2 border-primary/20">
              <AvatarImage
                src={user?.photoUrl || undefined}
                alt={displayName}
              />
              <AvatarFallback className="bg-primary/10 text-lg font-semibold">
                {initials}
              </AvatarFallback>
            </Avatar>
          </div>
        </div>

        <div className="space-y-8">
          {/* Dados Pessoais*/}
          <div>
            <h2 className="text-lg font-semibold text-foreground mb-4">
              Informações Pessoais
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">
                  {isIndividual ? "Nome Completo" : "Razão Social"}
                </label>
                <p className="text-base text-foreground">
                  {displayName || "—"}
                </p>
              </div>

              {isIndividual && user.individual ? (
                <>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">
                      CPF
                    </label>
                    <p className="text-base text-foreground">
                      {user?.individual.cpf}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">
                      Data de nascimento
                    </label>
                    <p className="text-base text-foreground">
                      {dayjs(user?.individual.birthDate).format("DD/MM/YYYY")}
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">
                      CNPJ
                    </label>
                    <p className="text-base text-foreground">
                      {user?.company?.cnpj}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">
                      Nome Fantasia
                    </label>
                    <p className="text-base text-foreground">
                      {user?.company?.tradeName}
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Endereço */}
          <div>
            <h2 className="text-lg font-semibold text-foreground mb-4">
              Endereço
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">
                  País
                </label>
                <p className="text-base text-foreground">
                  {user?.address.country.name || "—"}
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">
                  Estado
                </label>
                <p className="text-base text-foreground">
                  {user?.address.state.name || "—"}
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">
                  Cidade
                </label>
                <p className="text-base text-foreground">
                  {user?.address.city.name || "—"}
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">
                  Bairro
                </label>
                <p className="text-base text-foreground">
                  {user?.address.neighborhood || "—"}
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">
                  Rua
                </label>
                <p className="text-base text-foreground">
                  {user?.address.street || "—"}
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">
                  Número
                </label>
                <p className="text-base text-foreground">
                  {user?.address.number || "—"}
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">
                  CEP
                </label>
                <p className="text-base text-foreground">
                  {user?.address.zipCode || "—"}
                </p>
              </div>
            </div>
          </div>
          {/* Opções */}
          <div>
            <h2 className="text-lg font-semibold text-foreground mb-4">
              Ações
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {isProvider && (
                <>
                  <div className="flex items-center gap-3 p-4 border border-border rounded-lg bg-card">
                    <Switch
                      id="show-contact"
                      checked={showContact}
                      onCheckedChange={(value) => {
                        setShowContact(value);
                        if (user?.id) {
                          updateSettings({
                            id: user.id,
                            payload: { showContactInfo: value },
                          });
                        }
                      }}
                    />
                    <label
                      htmlFor="show-contact"
                      className="text-sm font-medium text-foreground cursor-pointer"
                    >
                      Mostrar contato
                    </label>
                  </div>

                  <div className="flex items-center gap-3 p-4 border border-border rounded-lg bg-card">
                    <Switch
                      id="auto-accept-appointments"
                      checked={autoAcceptAppointments}
                      onCheckedChange={(value) => {
                        setAutoAcceptAppointments(value);
                        if (user?.id) {
                          updateSettings({
                            id: user.id,
                            payload: { autoAcceptAppointments: value },
                          });
                        }
                      }}
                    />
                    <label
                      htmlFor="auto-accept-appointments"
                      className="text-sm font-medium text-foreground cursor-pointer"
                    >
                      Aceitar agendamentos automaticamente
                    </label>
                  </div>
                </>
              )}

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-3">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="destructive"
                        className="hover:bg-destructive/40!"
                      >
                        Excluir conta
                      </Button>
                    </DialogTrigger>

                    <DeleteAccountDialog />
                  </Dialog>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
