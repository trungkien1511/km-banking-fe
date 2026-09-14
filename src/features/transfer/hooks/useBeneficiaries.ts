import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { transferApi } from "../api/transfer.api";
import type { SaveBeneficiaryPayload } from "../types/transfer.types";

export function useBeneficiaries() {
  return useQuery({
    queryKey: ["beneficiaries"],
    queryFn: transferApi.getBeneficiaries,
    staleTime: 120_000,
  });
}

export function useSaveBeneficiary() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: SaveBeneficiaryPayload) =>
      transferApi.saveBeneficiary(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["beneficiaries"] });
    },
  });
}