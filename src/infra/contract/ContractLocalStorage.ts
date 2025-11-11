import { ContractAdapter } from "@/core/interfaces/adapters/ContractAdapter";
import {
  Contract,
  ContractRequest,
  ContractResponse,
} from "@/core/domain/models/contract";
import { LocalStorage, STORAGE_KEYS } from "@/lib/local-storage";

export class ContractLocalStorage implements ContractAdapter {
  private getContracts(userId: string): Contract[] {
    const userKey = LocalStorage.getUserSpecificKey(
      STORAGE_KEYS.CONTRACTS,
      userId
    );
    const contracts = LocalStorage.get(userKey, []);
    return contracts;
  }

  private saveContracts(userId: string, contracts: Contract[]) {
    const userKey = LocalStorage.getUserSpecificKey(
      STORAGE_KEYS.CONTRACTS,
      userId
    );
    LocalStorage.set(userKey, contracts);
  }

  private getNextId(userId: string): number {
    const contracts = this.getContracts(userId);
    if (contracts.length === 0) {
      return 1;
    }

    const maxId = Math.max(
      ...contracts.map((c) => {
        const idNumber = parseInt(c.id.replace("contract_", ""));
        return isNaN(idNumber) ? 0 : idNumber;
      })
    );

    return maxId + 1;
  }

  async createContract(
    userId: string,
    contract: ContractRequest
  ): Promise<ContractResponse> {
    try {
      const contracts = this.getContracts(userId);
      const nextId = this.getNextId(userId);

      const newContract: Contract = {
        id: `contract_${nextId}`,
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

      contracts.push(newContract);
      this.saveContracts(userId, contracts);

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
    const contracts = this.getContracts(userId);
    return contracts.find((contract) => contract.id === contractId) || null;
  }

  private getAllContracts(): Contract[] {
    const contractKeys = LocalStorage.getKeysContaining(STORAGE_KEYS.CONTRACTS);
    const allContracts: Contract[] = [];

    contractKeys.forEach((key) => {
      const contracts = LocalStorage.get<Contract[]>(key, []);
      allContracts.push(...contracts);
    });

    return allContracts;
  }

  async getUserContracts(
    userId: string,
    userRole?: "provider" | "customer"
  ): Promise<Contract[]> {
    const allContracts = this.getAllContracts();

    if (userRole === "provider") {
      return allContracts.filter((contract) => contract.providerId === userId);
    }

    return allContracts.filter((contract) => contract.customerId === userId);
  }

  async updatePaymentStatus(
    userId: string,
    contractId: string,
    status: string
  ): Promise<boolean> {
    const allContracts = this.getAllContracts();
    const contract = allContracts.find((c) => c.id === contractId);

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

      const customerContracts = this.getContracts(contract.customerId);
      const customerIndex = customerContracts.findIndex(
        (c) => c.id === contractId
      );
      if (customerIndex !== -1) {
        customerContracts[customerIndex] = contract;
        this.saveContracts(contract.customerId, customerContracts);
      } else {
        customerContracts.push(contract);
        this.saveContracts(contract.customerId, customerContracts);
      }

      return true;
    }

    return false;
  }

  async updateServiceStatus(
    userId: string,
    contractId: string,
    status: string
  ): Promise<boolean> {
    const contracts = this.getContracts(userId);
    const contract = contracts.find((c) => c.id === contractId);

    if (contract) {
      contract.serviceStatus = status as
        | "not_started"
        | "in_progress"
        | "completed"
        | "cancelled";
      contract.updatedAt = new Date().toISOString();
      this.saveContracts(userId, contracts);
      return true;
    }

    return false;
  }

  async cancelContract(
    userId: string,
    contractId: string,
    reason: string
  ): Promise<boolean> {
    const allContracts = this.getAllContracts();
    const contract = allContracts.find((c) => c.id === contractId);

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

      const customerContracts = this.getContracts(contract.customerId);
      const customerIndex = customerContracts.findIndex(
        (c) => c.id === contractId
      );
      if (customerIndex !== -1) {
        customerContracts[customerIndex] = contract;
        this.saveContracts(contract.customerId, customerContracts);
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
    const allContracts = this.getAllContracts();
    const contract = allContracts.find((c) => c.id === contractId);

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

    const customerContracts = this.getContracts(contract.customerId);
    const customerIndex = customerContracts.findIndex(
      (c) => c.id === contractId
    );
    if (customerIndex !== -1) {
      customerContracts[customerIndex] = contract;
      this.saveContracts(contract.customerId, customerContracts);
    } else {
      customerContracts.push(contract);
      this.saveContracts(contract.customerId, customerContracts);
    }

    return true;
  }
}
