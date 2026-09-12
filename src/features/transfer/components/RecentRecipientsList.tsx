import React from "react";
import { UserCircle } from "@phosphor-icons/react";
import { useRecentRecipients } from "../hooks/useRecentRecipients";

interface RecentRecipientsListProps {
  onSelect: (accountNumber: string) => void;
}

export const RecentRecipientsList: React.FC<RecentRecipientsListProps> = ({ onSelect }) => {
  const { data: recipients, isLoading } = useRecentRecipients(5);

  if (isLoading || !recipients || recipients.length === 0) return null;

  return (
    <div className="space-y-1.5">
      <p className="text-xs text-subtle-foreground font-medium uppercase tracking-wide">
        Recent
      </p>
      <div
        className="flex gap-3 overflow-x-auto pb-1"
        role="list"
        aria-label="Recent recipients"
      >
        {recipients.map((r) => (
          <button
            key={r.accountNumber}
            type="button"
            role="listitem"
            onClick={() => onSelect(r.accountNumber)}
            className="flex-shrink-0 flex flex-col items-center gap-1.5 w-16 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-lg p-1 hover:bg-muted/40 transition-colors duration-150"
          >
            <span className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
              <UserCircle size={24} weight="fill" aria-hidden="true" />
            </span>
            <span
              className="text-[10px] text-muted-foreground text-center leading-tight truncate w-full"
              title={r.accountHolderName}
            >
              {/* Show the last token of the masked name as the avatar label */}
              {r.accountHolderName.split(" ").pop()}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};
