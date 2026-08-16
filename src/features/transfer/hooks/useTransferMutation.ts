import { useMutation, useQueryClient } from "@tanstack/react-query";
import { transferApi } from "../api/transfer.api";

export const useTransferMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: transferApi.transfer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
};

export const useDepositMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: transferApi.deposit,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
};

export const useWithdrawalMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: transferApi.withdraw,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
};
