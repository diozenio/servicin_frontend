import {
  Contract,
  ContractRequest,
  ContractResponse,
} from "@/core/domain/models/contract";

export interface ContractUseCase {
  createContract(contract: ContractRequest): Promise<ContractResponse>;
  getContract(contractId: string): Promise<Contract | null>;
  confirmPayment(contractId: string): Promise<boolean>;
  updateServiceStatus(contractId: string, status: string): Promise<boolean>;
}
