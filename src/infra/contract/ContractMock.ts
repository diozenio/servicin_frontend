import { ContractAdapter } from "@/core/interfaces/adapters/ContractAdapter";
import {
  Contract,
  ContractRequest,
  ContractResponse,
} from "@/core/domain/models/contract";

export class ContractMock implements ContractAdapter {
  private contracts: Contract[] = [];
  private nextId = 1;

  async createContract(
    userId: string,
    contract: ContractRequest
  ): Promise<ContractResponse> {
    try {
      const newContract: Contract = {
        id: `contract_${this.nextId++}`,
        serviceId: contract.serviceId,
        providerId: contract.providerId,
        customerId: userId, // Use actual user ID
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
    } catch {
      return {
        success: false,
        message: "Erro ao criar contrato",
      };
    }
  }

  async getContract(
    userId: string,
    contractId: string
  ): Promise<Contract | null> {
    return (
      this.contracts.find(
        (contract) =>
          contract.id === contractId && contract.customerId === userId
      ) || null
    );
  }

  async getUserContracts(userId: string): Promise<Contract[]> {
    return this.contracts.filter((contract) => contract.customerId === userId);
  }

  async updatePaymentStatus(
    userId: string,
    contractId: string,
    status: string
  ): Promise<boolean> {
    const contract = this.contracts.find(
      (c) => c.id === contractId && c.customerId === userId
    );
    if (contract) {
      contract.paymentStatus = status as
        | "pending"
        | "paid"
        | "failed"
        | "refunded";
      contract.updatedAt = new Date().toISOString();
      return true;
    }
    return false;
  }

  async updateServiceStatus(
    userId: string,
    contractId: string,
    status: string
  ): Promise<boolean> {
    const contract = this.contracts.find(
      (c) => c.id === contractId && c.customerId === userId
    );
    if (contract) {
      contract.serviceStatus = status as
        | "not_started"
        | "in_progress"
        | "completed"
        | "cancelled";
      contract.updatedAt = new Date().toISOString();
      return true;
    }
    return false;
  }

  async cancelContract(
    userId: string,
    contractId: string,
    reason: string
  ): Promise<boolean> {
    const contract = this.contracts.find(
      (c) => c.id === contractId && c.customerId === userId
    );
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
