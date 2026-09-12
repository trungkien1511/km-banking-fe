import { useQuery } from "@tanstack/react-query";
import { transferApi } from "../api/transfer.api";

export function useRecentRecipients(limit = 5) {
  return useQuery({
    queryKey: ["recentRecipients", limit],
    queryFn: () => transferApi.getRecentRecipients(limit),
    staleTime: 60_000,   // 1 minute
    gcTime: 300_000,     // 5 minutes
  });
}
