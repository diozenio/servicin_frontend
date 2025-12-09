import {
  Contract,
  ContractRequest,
  ContractResponse,
} from "@/core/domain/models/contract";
import { UserRole } from "@/core/domain/models/user";

export interface ContractUseCase {
  createContract(
    userId: string,
    contract: ContractRequest
  ): Promise<ContractResponse>;
  getContract(userId: string, contractId: string): Promise<Contract | null>;
  getUserContracts(userId: string, userRole?: UserRole): Promise<Contract[]>;
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
  approveContract(userId: string, contractId: string): Promise<boolean>;
  rejectContract(userId: string, contractId: string): Promise<boolean>;
}
