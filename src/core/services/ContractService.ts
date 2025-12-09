import { ContractAdapter } from "@/core/interfaces/adapters/ContractAdapter";
import { ContractUseCase } from "@/core/interfaces/usecases/ContractUseCase";
import {
  Contract,
  ContractRequest,
  ContractResponse,
} from "@/core/domain/models/contract";
import { UserRole } from "../domain/models/user";

export class ContractService implements ContractUseCase {
  constructor(private contractAdapter: ContractAdapter) {}

  async createContract(
    userId: string,
    contract: ContractRequest
  ): Promise<ContractResponse> {
    return await this.contractAdapter.createContract(userId, contract);
  }

  async getContract(
    userId: string,
    contractId: string
  ): Promise<Contract | null> {
    return await this.contractAdapter.getContract(userId, contractId);
  }

  async getUserContracts(
    userId: string,
    userRole?: UserRole
  ): Promise<Contract[]> {
    return await this.contractAdapter.getUserContracts(userId, userRole);
  }

  async confirmPayment(userId: string, contractId: string): Promise<boolean> {
    return await this.contractAdapter.updatePaymentStatus(
      userId,
      contractId,
      "paid"
    );
  }

  async updateServiceStatus(
    userId: string,
    contractId: string,
    status: string
  ): Promise<boolean> {
    return await this.contractAdapter.updateServiceStatus(
      userId,
      contractId,
      status
    );
  }

  async cancelContract(
    userId: string,
    contractId: string,
    reason: string
  ): Promise<boolean> {
    return await this.contractAdapter.cancelContract(
      userId,
      contractId,
      reason
    );
  }

  async approveContract(userId: string, contractId: string): Promise<boolean> {
    return await this.contractAdapter.updateApprovalStatus(
      userId,
      contractId,
      "approved"
    );
  }

  async rejectContract(userId: string, contractId: string): Promise<boolean> {
    return await this.contractAdapter.updateApprovalStatus(
      userId,
      contractId,
      "rejected"
    );
  }
}
