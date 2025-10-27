import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ContractService } from "@/core/services/ContractService";
import { ContractMock } from "@/infra/contract/ContractMock";
import { Contract, ContractRequest } from "@/core/domain/models/contract";

const contractService = new ContractService(new ContractMock());

export function useCreateContract() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (contract: ContractRequest) =>
      contractService.createContract(contract),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contracts"] });
    },
  });
}

export function useContract(contractId: string) {
  return useQuery({
    queryKey: ["contract", contractId],
    queryFn: () => contractService.getContract(contractId),
    enabled: !!contractId,
  });
}

export function useConfirmPayment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (contractId: string) =>
      contractService.confirmPayment(contractId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contracts"] });
    },
  });
}

export function useUpdateServiceStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      contractId,
      status,
    }: {
      contractId: string;
      status: string;
    }) => contractService.updateServiceStatus(contractId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contracts"] });
    },
  });
}
