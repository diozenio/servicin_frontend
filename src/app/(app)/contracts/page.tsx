"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { UserContracts } from "@/components/service/user-contracts";
import { ContractStatus } from "@/components/service/contract-status";
import { Contract } from "@/core/domain/models/contract";
import { useUserContracts } from "@/hooks/use-contract";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { ArrowLeftIcon, LoaderIcon } from "lucide-react";

export default function ContractsPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const {
    data: contracts = [],
    isLoading: isContractsLoading,
    error,
  } = useUserContracts();

  const [selectedContract, setSelectedContract] = useState<Contract | null>(
    null
  );

  useEffect(() => {
    if (!isAuthLoading && !isAuthenticated) {
      const returnUrl = encodeURIComponent("/contracts");
      router.push(`/auth/login?returnUrl=${returnUrl}`);
    }
  }, [isAuthenticated, isAuthLoading, router]);

  const isLoading = isAuthLoading || isContractsLoading;

  const handleViewContract = (contract: Contract) => {
    setSelectedContract(contract);
  };

  const handleBackToList = () => {
    setSelectedContract(null);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <LoaderIcon className="w-12 h-12 text-muted-foreground mx-auto mb-4 animate-spin" />
            <p className="text-muted-foreground">Carregando contratos...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-card-foreground mb-4">
            Erro ao carregar contratos
          </h1>
          <p className="text-muted-foreground mb-4">
            Não foi possível carregar seus contratos. Tente novamente.
          </p>
          <Button onClick={() => window.location.reload()}>
            Tentar novamente
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {selectedContract ? (
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" onClick={handleBackToList}>
              <ArrowLeftIcon className="w-4 h-4 mr-2" />
              Voltar
            </Button>
            <h1 className="text-2xl font-bold">Detalhes do Contrato</h1>
          </div>

          <ContractStatus contract={selectedContract} />
        </div>
      ) : (
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold">Meus Contratos</h1>
            <p className="text-muted-foreground mt-1">
              Gerencie seus contratos de serviços
            </p>
          </div>

          <UserContracts
            contracts={contracts}
            onViewContract={handleViewContract}
          />
        </div>
      )}
    </div>
  );
}
