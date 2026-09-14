import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider } from 'react-router-dom';
import { Toaster } from 'sonner';
import { router } from '@/app/router';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      {/*
       * Sonner Toaster — tokens from the dark shell (default :root).
       * We use CSS variables directly so toasts always match the shell
       * surface colors rather than Sonner's own hardcoded defaults.
       */}
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            padding: '16px',
            borderRadius: 'var(--radius-md, 8px)',
            background: 'var(--color-surface-elevated)',
            color: 'var(--color-foreground)',
            border: '1px solid var(--color-border)',
            boxShadow: 'var(--shadow-elevated)',
          },
        }}
      />
    </QueryClientProvider>
  );
}

export default App;