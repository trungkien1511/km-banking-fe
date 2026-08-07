import { create } from 'zustand'
import type { DashboardData, Account, Transaction } from '@/features/dashboard/types/dashboard.types'

interface DashboardState {
  dashboardData: DashboardData | null
  isLoading: boolean
  error: string | null

  // Actions
  setDashboardData: (data: DashboardData) => void
  setLoading: (isLoading: boolean) => void
  setError: (error: string | null) => void
  reset: () => void
}

const initialState = {
  dashboardData: null,
  isLoading: false,
  error: null,
}

export const useDashboardStore = create<DashboardState>((set) => ({
  ...initialState,

  setDashboardData: (data: DashboardData) => set({ dashboardData: data }),
  setLoading: (isLoading: boolean) => set({ isLoading }),
  setError: (error: string | null) => set({ error }),
  reset: () => set(initialState),
}))

// Stable fallbacks — must be module-level constants so their references never change.
// Using `?? []` inline creates a new array object on every render, causing Zustand
// to detect a "change" every cycle → infinite re-render loop.
const EMPTY_ACCOUNTS: Account[] = []
const EMPTY_TRANSACTIONS: Transaction[] = []

// Selector hooks — each subscribes to only its own slice to avoid unnecessary rerenders

export const useTotalBalance = (): number =>
  useDashboardStore((state) => state.dashboardData?.totalBalance ?? 0)

export const useAccounts = (): Account[] =>
  useDashboardStore((state) => state.dashboardData?.accounts ?? EMPTY_ACCOUNTS)

export const useRecentTransactions = (): Transaction[] => {
  const all = useDashboardStore(
    (state) => state.dashboardData?.recentTransactions ?? EMPTY_TRANSACTIONS,
  )
  return all.filter((t) => t.status !== 'PENDING').slice(0, 10)
}

// Pending transactions — PENDING status only, shown in the pending section.
// Falls back to EMPTY_TRANSACTIONS to preserve referential stability.
export const usePendingTransactions = (): Transaction[] =>
  useDashboardStore((state) => {
    const all = state.dashboardData?.recentTransactions ?? EMPTY_TRANSACTIONS
    return all.filter((t) => t.status === 'PENDING')
  })

export const useDashboardLoading = (): boolean =>
  useDashboardStore((state) => state.isLoading)

export const useDashboardError = (): string | null =>
  useDashboardStore((state) => state.error)
