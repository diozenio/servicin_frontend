"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { UserContracts } from "@/components/service/user-contracts";
import { ContractStatus } from "@/components/service/contract-status";
import { Contract } from "@/core/domain/models/contract";
import { ContractService } from "@/core/services/ContractService";
import { ContractMock } from "@/infra/contract/ContractMock";
import { Button } from "@/components/ui/button";
import { ArrowLeftIcon, CalendarIcon } from "lucide-react";

const mockContracts: Contract[] = [
  {
    id: "contract_1",
    serviceId: "service_1",
    providerId: "provider_1",
    customerId: "customer_1",
    customerName: "João Silva",
    customerPhone: "(11) 99999-9999",
    customerEmail: "joao@email.com",
    date: "2024-01-15",
    timeSlot: "14:00",
    notes: "Serviço de limpeza residencial",
    paymentMethod: "pix",
    paymentStatus: "paid",
    serviceStatus: "not_started",
    totalAmount: 150.0,
    createdAt: "2024-01-10T10:00:00Z",
    updatedAt: "2024-01-10T10:00:00Z",
  },
  {
    id: "contract_2",
    serviceId: "service_2",
    providerId: "provider_2",
    customerId: "customer_1",
    customerName: "João Silva",
    customerPhone: "(11) 99999-9999",
    customerEmail: "joao@email.com",
    date: "2024-01-20",
    timeSlot: "09:00",
    notes: "Manutenção de ar condicionado",
    paymentMethod: "credit_card",
    paymentStatus: "pending",
    serviceStatus: "not_started",
    totalAmount: 200.0,
    createdAt: "2024-01-12T14:30:00Z",
    updatedAt: "2024-01-12T14:30:00Z",
  },
  {
    id: "contract_3",
    serviceId: "service_3",
    providerId: "provider_3",
    customerId: "customer_1",
    customerName: "João Silva",
    customerPhone: "(11) 99999-9999",
    customerEmail: "joao@email.com",
    date: "2024-01-05",
    timeSlot: "16:00",
    notes: "Instalação de sistema de segurança",
    paymentMethod: "pix",
    paymentStatus: "refunded",
    serviceStatus: "cancelled",
    cancellationReason:
      "Mudança de planos - não será mais necessário o serviço",
    cancelledAt: "2024-01-08T11:20:00Z",
    totalAmount: 500.0,
    createdAt: "2024-01-03T09:15:00Z",
    updatedAt: "2024-01-08T11:20:00Z",
  },
];

export default function ContractsPage() {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [selectedContract, setSelectedContract] = useState<Contract | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);

  const contractService = new ContractService(new ContractMock());

  useEffect(() => {
    const loadContracts = async () => {
      setIsLoading(true);
      try {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setContracts(mockContracts);
      } catch (error) {
        console.error("Error loading contracts:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadContracts();
  }, []);

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
            <CalendarIcon className="w-12 h-12 text-muted-foreground mx-auto mb-4 animate-pulse" />
            <p className="text-muted-foreground">Carregando contratos...</p>
          </div>
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
