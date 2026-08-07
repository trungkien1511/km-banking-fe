import React from 'react';
import { ArrowDownLeft, ArrowUpRight, ArrowLeftRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Transaction } from '@/features/dashboard/types/dashboard.types';

interface TransactionCardProps {
  transaction: Transaction;
}

const STATUS_DOT: Record<Transaction['status'], string> = {
  PENDING:   'bg-amber-400',
  COMPLETED: 'bg-emerald-500',
  FAILED:    'bg-red-500',
  CANCELLED: 'bg-slate-500',
};

const TYPE_LABEL: Record<Transaction['transactionType'], string> = {
  DEPOSIT:    'Deposit',
  WITHDRAWAL: 'Withdrawal',
  TRANSFER:   'Transfer',
  FEE:        'Fee',
};

// js-cache-function-results
const currencyFormatterCache = new Map<string, Intl.NumberFormat>();
const formatCurrency = (amount: number, currency: string = 'VND'): string => {
  let fmt = currencyFormatterCache.get(currency);
  if (fmt === undefined) {
    fmt = new Intl.NumberFormat('vi-VN', { style: 'currency', currency, maximumFractionDigits: 0 });
    currencyFormatterCache.set(currency, fmt);
  }
  return fmt.format(amount);
};

const dateFormatter = new Intl.DateTimeFormat('vi-VN', {
  day: '2-digit',
  month: 'short',
  hour: '2-digit',
  minute: '2-digit',
});
const formatDate = (dateStr: string): string =>
  dateFormatter.format(new Date(dateStr));

export const TransactionCard = React.memo(function TransactionCard({
  transaction,
}: TransactionCardProps) {
  const isIncoming = transaction.direction === 'IN';
  const isNeutral  = transaction.direction === null;
  const typeLabel  = TYPE_LABEL[transaction.transactionType];

  return (
    <div
      className="
        flex items-center gap-3
        px-4 py-3
        border-b border-white/[0.05] last:border-b-0
        transition-colors duration-100
        hover:bg-white/[0.03]
      "
    >
      {/* Direction icon */}
      <div
        className={cn(
          'flex h-8 w-8 shrink-0 items-center justify-center rounded-full',
          isNeutral
            ? 'bg-white/[0.06] text-(--color-text-muted)'
            : isIncoming
              ? 'bg-emerald-400/10 text-emerald-400'
              : 'bg-red-400/10 text-red-400',
        )}
        aria-hidden="true"
      >
        {isNeutral ? (
          <ArrowLeftRight className="h-3.5 w-3.5" strokeWidth={1.75} />
        ) : isIncoming ? (
          <ArrowDownLeft className="h-3.5 w-3.5" strokeWidth={1.75} />
        ) : (
          <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={1.75} />
        )}
      </div>

      {/* Description + meta */}
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-(--color-text-primary)">
          {transaction.description !== null ? transaction.description : typeLabel}
        </p>
        <div className="mt-0.5 flex items-center gap-1.5">
          {/* Status dot - semantic state only */}
          <span
            className={cn('h-1.5 w-1.5 rounded-full shrink-0', STATUS_DOT[transaction.status])}
            aria-hidden="true"
          />
          <p className="text-[11px] text-(--color-text-muted)">
            {formatDate(transaction.createdAt)}
          </p>
        </div>
      </div>

      {/* Amount */}
      <p
        className={cn(
          'shrink-0 font-mono text-sm font-semibold tabular-nums',
          isNeutral
            ? 'text-(--color-text-primary)'
            : isIncoming
              ? 'text-emerald-400'
              : 'text-red-400',
        )}
      >
        {!isNeutral && (isIncoming ? '+' : '-')}
        {formatCurrency(transaction.amount, transaction.currency)}
      </p>
    </div>
  );
});
