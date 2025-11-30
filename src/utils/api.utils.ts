// Utilidades para manejo de la API

export class ApiError extends Error {
  status?: number;
  data?: unknown;

  constructor(message: string, status?: number, data?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

// Helper para manejar respuestas de la API
export async function handleApiResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    let errorMessage = `Error ${response.status}: ${response.statusText}`;
    let errorData: unknown;
    const responseClone = response.clone();

    try {
      errorData = await response.json();
      if (errorData && typeof errorData === 'object' && 'message' in errorData) {
        errorMessage = (errorData as { message: string }).message;
      }
    } catch {
      // Si no se puede parsear el JSON, intentar leer como texto
      try {
        const errorText = await responseClone.text();
        console.error(`API Error ${response.status} Body (Text):`, errorText);
        // Si es HTML, probablemente sea una página de error del servidor
        if (errorText.includes('<!DOCTYPE html>')) {
          errorMessage = `Error ${response.status}: El servidor devolvió HTML en lugar de JSON. Revisa la consola.`;
        }
      } catch (e) {
        console.error("Error reading error response body:", e);
      }
    }

    console.error(`API Error ${response.status} on ${response.url}:`, errorData || errorMessage);
    throw new ApiError(errorMessage, response.status, errorData);
  }

  // Manejar respuestas vacías (204 No Content)
  if (response.status === 204) {
    return {} as T;
  }

  try {
    return await response.json();
  } catch (error) {
    throw new ApiError('Error al parsear la respuesta del servidor');
  }
}

// Helper para hacer peticiones GET
export async function apiGet<T>(url: string, headers?: HeadersInit): Promise<T> {
  const response = await fetch(url, {
    method: 'GET',
    headers,
  });
  return handleApiResponse<T>(response);
}

// Helper para hacer peticiones POST
export async function apiPost<T>(
  url: string,
  body?: unknown,
  headers?: HeadersInit
): Promise<T> {
  const response = await fetch(url, {
    method: 'POST',
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });
  return handleApiResponse<T>(response);
}

// Helper para hacer peticiones PUT
export async function apiPut<T>(
  url: string,
  body?: unknown,
  headers?: HeadersInit
): Promise<T> {
  const response = await fetch(url, {
    method: 'PUT',
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });
  return handleApiResponse<T>(response);
}

// Helper para hacer peticiones DELETE
export async function apiDelete<T>(url: string, headers?: HeadersInit): Promise<T> {
  const response = await fetch(url, {
    method: 'DELETE',
    headers,
  });
  return handleApiResponse<T>(response);
}
