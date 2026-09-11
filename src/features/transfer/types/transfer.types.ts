export interface TransferPayload {
  sourceAccountId: string;
  destinationAccountNumber: string;
  amount: number;
  description?: string;
  idempotencyKey: string;
}

export interface DepositPayload {
  accountId: string;
  amount: number;
  description?: string;
  idempotencyKey: string;
}

export interface WithdrawalPayload {
  accountId: string;
  amount: number;
  description?: string;
  idempotencyKey: string;
}

export interface RecipientLookup {
  accountNumber: string;
  /** Partially masked name, e.g. "NGUYEN ** ANH" */
  accountHolderName: string;
  /** ACTIVE | FROZEN | INACTIVE */
  status: string;
}
