import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ContractService } from "@/core/services/ContractService";
import { ContractLocalStorage } from "@/infra/contract/ContractLocalStorage";
import { ContractRequest } from "@/core/domain/models/contract";
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
      const result = await contractService.createContract(user.id, contract);
      return result;
    },
    onSuccess: () => {
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
    queryKey: ["userContracts", user?.id, user?.role],
    queryFn: async () => {
      if (!user) {
        throw new Error("User must be authenticated to view contracts");
      }
      const contracts = await contractService.getUserContracts(user.id, user.role);
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
      queryClient.invalidateQueries({ queryKey: ["contract", contractId] });
      queryClient.invalidateQueries({ queryKey: ["contracts"] });
      queryClient.invalidateQueries({ queryKey: ["userContracts"] });
      queryClient.invalidateQueries({ queryKey: ["schedule"] });
    },
  });
}

export function useApproveContract() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: (contractId: string) => {
      if (!user) {
        throw new Error("User must be authenticated to approve contract");
      }
      return contractService.approveContract(user.id, contractId);
    },
    onSuccess: (_, contractId) => {
      queryClient.invalidateQueries({ queryKey: ["contract", contractId] });
      queryClient.invalidateQueries({ queryKey: ["contracts"] });
      queryClient.invalidateQueries({ queryKey: ["userContracts"] });
    },
  });
}

export function useRejectContract() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: (contractId: string) => {
      if (!user) {
        throw new Error("User must be authenticated to reject contract");
      }
      return contractService.rejectContract(user.id, contractId);
    },
    onSuccess: (_, contractId) => {
      queryClient.invalidateQueries({ queryKey: ["contract", contractId] });
      queryClient.invalidateQueries({ queryKey: ["contracts"] });
      queryClient.invalidateQueries({ queryKey: ["userContracts"] });
    },
  });
}
