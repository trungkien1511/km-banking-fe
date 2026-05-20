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
      <Toaster 
        position="bottom-right" 
        toastOptions={{
          style: {
            padding: '16px',
            borderRadius: '8px',
            border: '1px solid var(--color-border, #e2e8f0)',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
          }
        }}
      />
    </QueryClientProvider>
  );
}

export default App;