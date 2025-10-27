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
    console.log("ContractLocalStorage: Getting contracts with key", userKey);
    const contracts = LocalStorage.get(userKey, []);
    console.log("ContractLocalStorage: Retrieved from localStorage", contracts);
    return contracts;
  }

  private saveContracts(userId: string, contracts: Contract[]) {
    const userKey = LocalStorage.getUserSpecificKey(
      STORAGE_KEYS.CONTRACTS,
      userId
    );
    console.log(
      "ContractLocalStorage: Saving contracts with key",
      userKey,
      contracts
    );
    const success = LocalStorage.set(userKey, contracts);
    console.log("ContractLocalStorage: Save result", success);
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
      console.log(
        "ContractLocalStorage: Creating contract for user",
        userId,
        contract
      );
      const contracts = this.getContracts(userId);
      console.log(
        "ContractLocalStorage: Current contracts for user",
        contracts
      );
      const nextId = this.getNextId(userId);

      const newContract: Contract = {
        id: `contract_${nextId}`,
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

      contracts.push(newContract);
      console.log("ContractLocalStorage: Saving contracts", contracts);
      this.saveContracts(userId, contracts);

      return {
        success: true,
        message: "Contrato criado com sucesso",
        contractId: newContract.id,
        contract: newContract,
      };
    } catch (error) {
      console.error("ContractLocalStorage: Error creating contract", error);
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

  async getUserContracts(userId: string): Promise<Contract[]> {
    console.log("ContractLocalStorage: Getting contracts for user", userId);
    const contracts = this.getContracts(userId);
    console.log("ContractLocalStorage: Retrieved contracts", contracts);
    return contracts;
  }

  async updatePaymentStatus(
    userId: string,
    contractId: string,
    status: string
  ): Promise<boolean> {
    const contracts = this.getContracts(userId);
    const contract = contracts.find((c) => c.id === contractId);

    if (contract) {
      contract.paymentStatus = status as any;
      contract.updatedAt = new Date().toISOString();
      this.saveContracts(userId, contracts);
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
      contract.serviceStatus = status as any;
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
    const contracts = this.getContracts(userId);
    const contract = contracts.find((c) => c.id === contractId);

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

      this.saveContracts(userId, contracts);
      return true;
    }

    return false;
  }
}
