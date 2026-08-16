export interface TransferPayload {
  sourceAccountId: string;
  destinationAccountNumber: string;
  amount: number;
  description?: string;
}

export interface DepositPayload {
  accountId: string;
  amount: number;
  description?: string;
}

export interface WithdrawalPayload {
  accountId: string;
  amount: number;
  description?: string;
}
