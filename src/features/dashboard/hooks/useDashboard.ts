import { useQuery } from '@tanstack/react-query'
import { useEffect } from 'react'
import { dashboardApi } from '@/features/dashboard/api/dashboard.api'
import { useDashboardStore } from '@/features/dashboard/store/dashboard-store'

export const useDashboard = () => {
  const setDashboardData = useDashboardStore((state) => state.setDashboardData)
  const setLoading = useDashboardStore((state) => state.setLoading)
  const setError = useDashboardStore((state) => state.setError)

  const query = useQuery({
    queryKey: ['dashboard'],
    queryFn: () => dashboardApi.getDashboard(),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: true,
    retry: 1,
  })

  // Sync react-query state into zustand store
  // Use isLoading (not isFetching) — isLoading is true only on first fetch with no
  // cached data, so the spinner shows during initial load but not background refetches.
  useEffect(() => {
    setLoading(query.isLoading)
  }, [query.isLoading, setLoading])

  useEffect(() => {
    if (query.data !== undefined) {
      setDashboardData(query.data)
    }
  }, [query.data, setDashboardData])

  useEffect(() => {
    if (query.error instanceof Error) {
      setError(query.error.message)
    } else if (query.error !== null && query.error !== undefined) {
      setError('An unexpected error occurred')
    } else {
      setError(null)
    }
  }, [query.error, setError])

  return query
}
