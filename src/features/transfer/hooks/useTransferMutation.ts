import { useMutation, useQueryClient } from "@tanstack/react-query";
import { transferApi } from "../api/transfer.api";
import type {
  TransferPayload,
  DepositPayload,
  WithdrawalPayload,
} from "../types/transfer.types";
import type { Transaction } from "@/features/dashboard/types/dashboard.types";

const createTransactionMutation =
  <TVariables>(mutationFn: (payload: TVariables) => Promise<Transaction>) =>
  () => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      },
    });
  };

export const useTransferMutation = createTransactionMutation<TransferPayload>(
  transferApi.transfer,
);

export const useDepositMutation = createTransactionMutation<DepositPayload>(
  transferApi.deposit,
);

export const useWithdrawalMutation =
  createTransactionMutation<WithdrawalPayload>(transferApi.withdraw);
