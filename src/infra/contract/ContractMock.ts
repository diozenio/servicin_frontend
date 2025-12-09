import { ContractAdapter } from "@/core/interfaces/adapters/ContractAdapter";
import {
  Contract,
  ContractRequest,
  ContractResponse,
} from "@/core/domain/models/contract";
import { UserRole } from "@/core/domain/models/user";

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
        customerId: userId,
        customerName: contract.customerName,
        customerPhone: contract.customerPhone,
        customerEmail: contract.customerEmail,
        date: contract.date,
        timeSlot: contract.timeSlot,
        notes: contract.notes,
        paymentMethod: contract.paymentMethod,
        paymentStatus: "pending",
        serviceStatus: "not_started",
        approvalStatus: "pending",
        totalAmount: 150.0,
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

  async getUserContracts(
    userId: string,
    userRole?: UserRole
  ): Promise<Contract[]> {
    if (userRole === "PROVIDER") {
      return this.contracts.filter(
        (contract) => contract.providerId === userId
      );
    }
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

      if (status === "paid" && contract.approvalStatus !== "pending") {
        contract.approvalStatus = "pending";
      }

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

  async updateApprovalStatus(
    userId: string,
    contractId: string,
    status: string
  ): Promise<boolean> {
    const contract = this.contracts.find((c) => c.id === contractId);

    if (!contract) {
      return false;
    }

    if (contract.providerId !== userId) {
      return false;
    }

    contract.approvalStatus = status as "pending" | "approved" | "rejected";
    contract.updatedAt = new Date().toISOString();

    if (status === "rejected" && contract.paymentStatus === "paid") {
      contract.paymentStatus = "refunded";
    }

    return true;
  }
}
