import { ContractAdapter } from "@/core/interfaces/adapters/ContractAdapter";
import {
  Contract,
  ContractRequest,
  ContractResponse,
} from "@/core/domain/models/contract";

export class ContractMock implements ContractAdapter {
  private contracts: Contract[] = [];
  private nextId = 1;

  async createContract(contract: ContractRequest): Promise<ContractResponse> {
    try {
      const newContract: Contract = {
        id: `contract_${this.nextId++}`,
        serviceId: contract.serviceId,
        providerId: contract.providerId,
        customerId: `customer_${Date.now()}`, // Mock customer ID
        customerName: contract.customerName,
        customerPhone: contract.customerPhone,
        customerEmail: contract.customerEmail,
        date: contract.date,
        timeSlot: contract.timeSlot,
        notes: contract.notes,
        paymentMethod: contract.paymentMethod,
        paymentStatus: "pending",
        serviceStatus: "not_started",
        totalAmount: 150.0, // Mock amount
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      this.contracts.push(newContract);

      return {
        success: true,
        message: "Contrato criado com sucesso",
        contractId: newContract.id,
        contract: newContract,
      };
    } catch (error) {
      return {
        success: false,
        message: "Erro ao criar contrato",
      };
    }
  }

  async getContract(contractId: string): Promise<Contract | null> {
    return (
      this.contracts.find((contract) => contract.id === contractId) || null
    );
  }

  async updatePaymentStatus(
    contractId: string,
    status: string
  ): Promise<boolean> {
    const contract = this.contracts.find((c) => c.id === contractId);
    if (contract) {
      contract.paymentStatus = status as any;
      contract.updatedAt = new Date().toISOString();
      return true;
    }
    return false;
  }

  async updateServiceStatus(
    contractId: string,
    status: string
  ): Promise<boolean> {
    const contract = this.contracts.find((c) => c.id === contractId);
    if (contract) {
      contract.serviceStatus = status as any;
      contract.updatedAt = new Date().toISOString();
      return true;
    }
    return false;
  }

  async cancelContract(contractId: string, reason: string): Promise<boolean> {
    const contract = this.contracts.find((c) => c.id === contractId);
    if (contract) {
      if (contract.serviceStatus !== "not_started") {
        return false;
      }

      contract.serviceStatus = "cancelled";
      contract.cancellationReason = reason;
      contract.cancelledAt = new Date().toISOString();
      contract.updatedAt = new Date().toISOString();

      if (contract.paymentStatus === "paid") {
        contract.paymentStatus = "refunded";
      }

      return true;
    }
    return false;
  }
}
