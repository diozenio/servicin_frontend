import {
  Contract,
  ContractRequest,
  ContractResponse,
} from "@/core/domain/models/contract";

export interface ContractUseCase {
  createContract(
    userId: string,
    contract: ContractRequest
  ): Promise<ContractResponse>;
  getContract(userId: string, contractId: string): Promise<Contract | null>;
  getUserContracts(userId: string): Promise<Contract[]>;
  confirmPayment(userId: string, contractId: string): Promise<boolean>;
  updateServiceStatus(
    userId: string,
    contractId: string,
    status: string
  ): Promise<boolean>;
  cancelContract(
    userId: string,
    contractId: string,
    reason: string
  ): Promise<boolean>;
}
