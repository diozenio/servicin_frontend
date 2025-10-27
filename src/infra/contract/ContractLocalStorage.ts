import { ContractAdapter } from "@/core/interfaces/adapters/ContractAdapter";
import {
  Contract,
  ContractRequest,
  ContractResponse,
} from "@/core/domain/models/contract";
import { LocalStorage, STORAGE_KEYS } from "@/lib/local-storage";

export class ContractLocalStorage implements ContractAdapter {
  private getContracts(): Contract[] {
    return LocalStorage.get(STORAGE_KEYS.CONTRACTS, []);
  }

  private saveContracts(contracts: Contract[]) {
    LocalStorage.set(STORAGE_KEYS.CONTRACTS, contracts);
  }

  private getNextId(): number {
    const contracts = this.getContracts();
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

  async createContract(contract: ContractRequest): Promise<ContractResponse> {
    try {
      const contracts = this.getContracts();
      const nextId = this.getNextId();

      const newContract: Contract = {
        id: `contract_${nextId}`,
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

      contracts.push(newContract);
      this.saveContracts(contracts);

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
    const contracts = this.getContracts();
    return contracts.find((contract) => contract.id === contractId) || null;
  }

  async updatePaymentStatus(
    contractId: string,
    status: string
  ): Promise<boolean> {
    const contracts = this.getContracts();
    const contract = contracts.find((c) => c.id === contractId);

    if (contract) {
      contract.paymentStatus = status as any;
      contract.updatedAt = new Date().toISOString();
      this.saveContracts(contracts);
      return true;
    }

    return false;
  }

  async updateServiceStatus(
    contractId: string,
    status: string
  ): Promise<boolean> {
    const contracts = this.getContracts();
    const contract = contracts.find((c) => c.id === contractId);

    if (contract) {
      contract.serviceStatus = status as any;
      contract.updatedAt = new Date().toISOString();
      this.saveContracts(contracts);
      return true;
    }

    return false;
  }

  async cancelContract(contractId: string, reason: string): Promise<boolean> {
    const contracts = this.getContracts();
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

      this.saveContracts(contracts);
      return true;
    }

    return false;
  }
}
