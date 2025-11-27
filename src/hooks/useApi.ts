// Hook personalizado para manejar llamadas a la API

import { useState, useEffect, useCallback } from 'react';

interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
}

interface UseApiOptions {
  immediate?: boolean; // Si debe ejecutarse inmediatamente al montar
}

/**
 * Hook para manejar llamadas a la API con estado de carga y error
 */
export function useApi<T>(
  apiFunction: () => Promise<T>,
  options: UseApiOptions = { immediate: true }
) {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: options.immediate ?? true,
    error: null,
  });

  const execute = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    
    try {
      const data = await apiFunction();
      setState({ data, loading: false, error: null });
      return data;
    } catch (error) {
      const err = error instanceof Error ? error : new Error('Error desconocido');
      setState({ data: null, loading: false, error: err });
      throw err;
    }
  }, [apiFunction]);

  useEffect(() => {
    if (options.immediate) {
      execute();
    }
  }, [execute, options.immediate]);

  const refetch = useCallback(() => {
    return execute();
  }, [execute]);

  return {
    ...state,
    refetch,
    execute,
  };
}

/**
 * Hook para manejar mutaciones (POST, PUT, DELETE)
 */
export function useMutation<TData, TVariables = void>(
  mutationFunction: (variables: TVariables) => Promise<TData>
) {
  const [state, setState] = useState<UseApiState<TData>>({
    data: null,
    loading: false,
    error: null,
  });

  const mutate = useCallback(
    async (variables: TVariables) => {
      setState({ data: null, loading: true, error: null });
      
      try {
        const data = await mutationFunction(variables);
        setState({ data, loading: false, error: null });
        return data;
      } catch (error) {
        const err = error instanceof Error ? error : new Error('Error desconocido');
        setState({ data: null, loading: false, error: err });
        throw err;
      }
    },
    [mutationFunction]
  );

  const reset = useCallback(() => {
    setState({ data: null, loading: false, error: null });
  }, []);

  return {
    ...state,
    mutate,
    reset,
  };
}
