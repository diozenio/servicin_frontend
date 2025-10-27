import {
  Contract,
  ContractRequest,
  ContractResponse,
} from "@/core/domain/models/contract";

export interface ContractAdapter {
  createContract(contract: ContractRequest): Promise<ContractResponse>;
  getContract(contractId: string): Promise<Contract | null>;
  updatePaymentStatus(contractId: string, status: string): Promise<boolean>;
  updateServiceStatus(contractId: string, status: string): Promise<boolean>;
}
