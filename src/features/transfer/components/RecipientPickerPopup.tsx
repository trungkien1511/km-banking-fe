import React, { useCallback, useEffect, useId, useState } from "react";
import { AddressBook, UserCircle, ClockCounterClockwise } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import { useBeneficiaries } from "../hooks/useBeneficiaries";
import { useRecentRecipients } from "../hooks/useRecentRecipients";

interface RecipientPickerPopupProps {
  onSelect: (accountNumber: string) => void;
  onClose: () => void;
}

type TabId = "saved" | "recent";

export const RecipientPickerPopup: React.FC<RecipientPickerPopupProps> = ({
  onSelect,
  onClose,
}) => {
  const [tab, setTab] = useState<TabId>("saved");
  const popupId = useId();

  const savedQuery = useBeneficiaries();
  const recentQuery = useRecentRecipients(10);

  const saved = savedQuery.data ?? [];
  const recent = recentQuery.data ?? [];

  const handleSelect = useCallback(
    (accountNumber: string) => {
      onSelect(accountNumber);
      onClose();
    },
    [onSelect, onClose],
  );

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  const empty = tab === "saved" ? saved.length === 0 : recent.length === 0;
  const loading = tab === "saved" ? savedQuery.isLoading : recentQuery.isLoading;
  const items = tab === "saved" ? saved : recent;

  return (
    <div
      id={popupId}
      role="dialog"
      aria-label="Choose recipient"
      className="absolute z-30 left-0 right-0 top-[calc(100%+6px)] rounded-lg border border-border bg-card shadow-lg shadow-black/5 animate-fade-slide-up overflow-hidden"
    >
      <div
        className="flex border-b border-border/60"
        role="tablist"
        aria-label="Recipient sources"
      >
        <button
          type="button"
          role="tab"
          id={`${popupId}-tab-saved`}
          aria-selected={tab === "saved"}
          aria-controls={`${popupId}-panel-saved`}
          onClick={() => setTab("saved")}
          className={cn(
            "flex-1 flex items-center justify-center gap-1.5 py-2.5 text-sm font-semibold transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:ring-inset",
            tab === "saved"
              ? "text-primary border-b-2 border-primary"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          <AddressBook size={14} weight={tab === "saved" ? "fill" : "regular"} aria-hidden="true" />
          Saved Beneficiaries
        </button>
        <button
          type="button"
          role="tab"
          id={`${popupId}-tab-recent`}
          aria-selected={tab === "recent"}
          aria-controls={`${popupId}-panel-recent`}
          onClick={() => setTab("recent")}
          className={cn(
            "flex-1 flex items-center justify-center gap-1.5 py-2.5 text-sm font-semibold transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:ring-inset",
            tab === "recent"
              ? "text-primary border-b-2 border-primary"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          <ClockCounterClockwise size={14} weight={tab === "recent" ? "fill" : "regular"} aria-hidden="true" />
          Recent
        </button>
      </div>

      <div
        id={`${popupId}-panel-${tab}`}
        role="tabpanel"
        aria-labelledby={`${popupId}-tab-${tab}`}
        className="max-h-64 overflow-y-auto"
      >
        {loading ? (
          <p className="p-4 text-center text-sm text-muted-foreground">Loading…</p>
        ) : empty ? (
          <p className="p-4 text-center text-sm text-muted-foreground">
            {tab === "saved" ? "No saved beneficiaries yet" : "No recent recipients"}
          </p>
        ) : (
          <ul className="py-1" role="listbox" aria-label={tab === "saved" ? "Saved beneficiaries" : "Recent recipients"}>
            {items.map((item) => (
              <li key={item.accountNumber}>
                <button
                  type="button"
                  role="option"
                  onClick={() => handleSelect(item.accountNumber)}
                  className="w-full flex items-center gap-3 px-3.5 py-2.5 text-left hover:bg-muted/40 transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:ring-inset"
                >
                  <span className="w-9 h-9 rounded-full bg-muted flex-shrink-0 flex items-center justify-center text-muted-foreground">
                    <UserCircle size={20} weight="fill" aria-hidden="true" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-medium text-foreground truncate">
                      {"displayName" in item ? item.displayName : item.accountHolderName}
                    </span>
                    <span className="block text-sm text-muted-foreground font-mono truncate" translate="no">
                      {item.accountNumber}
                    </span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};