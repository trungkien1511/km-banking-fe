export interface TransferPayload {
  sourceAccountId: string;
  destinationAccountNumber: string;
  amount: number;
  description?: string;
  idempotencyKey: string;
}

export interface RecipientLookup {
  accountNumber: string;
  /** Account holder's full name as returned by the API (not masked). */
  accountHolderName: string;
  /** ACTIVE | FROZEN | INACTIVE */
  status: string;
}

export interface RecentRecipient {
  accountNumber: string;
  accountHolderName: string;
  lastTransferAt: string; // ISO string from backend Instant
}

export interface Beneficiary {
  id: string;
  accountNumber: string;
  accountHolderName: string;
  displayName: string;
  createdAt: string;
}

export interface SaveBeneficiaryPayload {
  accountNumber: string;
  displayName: string;
}
