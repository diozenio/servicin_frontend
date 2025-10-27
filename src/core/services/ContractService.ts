import { ContractAdapter } from "@/core/interfaces/adapters/ContractAdapter";
import { ContractUseCase } from "@/core/interfaces/usecases/ContractUseCase";
import {
  Contract,
  ContractRequest,
  ContractResponse,
} from "@/core/domain/models/contract";

export class ContractService implements ContractUseCase {
  constructor(private contractAdapter: ContractAdapter) {}

  async createContract(contract: ContractRequest): Promise<ContractResponse> {
    return await this.contractAdapter.createContract(contract);
  }

  async getContract(contractId: string): Promise<Contract | null> {
    return await this.contractAdapter.getContract(contractId);
  }

  async confirmPayment(contractId: string): Promise<boolean> {
    return await this.contractAdapter.updatePaymentStatus(contractId, "paid");
  }

  async updateServiceStatus(
    contractId: string,
    status: string
  ): Promise<boolean> {
    return await this.contractAdapter.updateServiceStatus(contractId, status);
  }

  async cancelContract(contractId: string, reason: string): Promise<boolean> {
    return await this.contractAdapter.cancelContract(contractId, reason);
  }
}
