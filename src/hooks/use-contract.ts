import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ContractService } from "@/core/services/ContractService";
import { ContractLocalStorage } from "@/infra/contract/ContractLocalStorage";
import { Contract, ContractRequest } from "@/core/domain/models/contract";
import { useAuth } from "@/hooks/use-auth";

const contractService = new ContractService(new ContractLocalStorage());

export function useCreateContract() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (contract: ContractRequest) => {
      if (!user) {
        throw new Error("User must be authenticated to create a contract");
      }
      console.log("Creating contract for user:", user.id, contract);
      const result = await contractService.createContract(user.id, contract);
      console.log("Contract creation result:", result);
      return result;
    },
    onSuccess: () => {
      console.log("Contract created successfully, invalidating queries");
      queryClient.invalidateQueries({ queryKey: ["contracts"] });
      queryClient.invalidateQueries({ queryKey: ["userContracts"] });
    },
  });
}

export function useContract(contractId: string) {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["contract", contractId],
    queryFn: () => {
      if (!user) {
        throw new Error("User must be authenticated to view contract");
      }
      return contractService.getContract(user.id, contractId);
    },
    enabled: !!contractId && !!user,
  });
}

export function useUserContracts() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["userContracts"],
    queryFn: async () => {
      if (!user) {
        throw new Error("User must be authenticated to view contracts");
      }
      console.log("Fetching contracts for user:", user.id);
      const contracts = await contractService.getUserContracts(user.id);
      console.log("Retrieved contracts:", contracts);
      return contracts;
    },
    enabled: !!user,
  });
}

export function useConfirmPayment() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: (contractId: string) => {
      if (!user) {
        throw new Error("User must be authenticated to confirm payment");
      }
      return contractService.confirmPayment(user.id, contractId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contracts"] });
      queryClient.invalidateQueries({ queryKey: ["userContracts"] });
    },
  });
}

export function useUpdateServiceStatus() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: ({
      contractId,
      status,
    }: {
      contractId: string;
      status: string;
    }) => {
      if (!user) {
        throw new Error("User must be authenticated to update service status");
      }
      return contractService.updateServiceStatus(user.id, contractId, status);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contracts"] });
      queryClient.invalidateQueries({ queryKey: ["userContracts"] });
    },
  });
}

export function useCancelContract() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: ({
      contractId,
      reason,
    }: {
      contractId: string;
      reason: string;
    }) => {
      if (!user) {
        throw new Error("User must be authenticated to cancel contract");
      }
      return contractService.cancelContract(user.id, contractId, reason);
    },
    onSuccess: (_, { contractId }) => {
      // Invalidate contract queries to refresh the data
      queryClient.invalidateQueries({ queryKey: ["contract", contractId] });
      queryClient.invalidateQueries({ queryKey: ["contracts"] });
      queryClient.invalidateQueries({ queryKey: ["userContracts"] });
      // Also invalidate schedule queries to reflect the released time slot
      queryClient.invalidateQueries({ queryKey: ["schedule"] });
    },
  });
}
