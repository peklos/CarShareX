import axios, { AxiosRequestConfig, AxiosError } from 'axios';

export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
}

/**
 * Универсальная обёртка для axios запросов
 * Возвращает {data, error} вместо выбрасывания исключений
 */
export async function apiRequest<T>(
  config: AxiosRequestConfig
): Promise<ApiResponse<T>> {
  try {
    const response = await axios(config);
    return {
      data: response.data,
      error: null,
    };
  } catch (err) {
    const error = err as AxiosError<any>;

    // Извлекаем детальное сообщение об ошибке
    let errorMessage = 'Произошла ошибка';

    if (error.response?.data?.detail) {
      // Бекенд FastAPI возвращает детали в response.data.detail
      errorMessage = error.response.data.detail;
    } else if (error.response?.data?.message) {
      errorMessage = error.response.data.message;
    } else if (error.message) {
      errorMessage = error.message;
    }

    console.error('API Error:', {
      url: config.url,
      method: config.method,
      status: error.response?.status,
      detail: error.response?.data?.detail,
      message: errorMessage,
    });

    return {
      data: null,
      error: errorMessage,
    };
  }
}

/**
 * GET запрос
 */
export async function apiGet<T>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
  return apiRequest<T>({ ...config, method: 'GET', url });
}

/**
 * POST запрос
 */
export async function apiPost<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
  return apiRequest<T>({ ...config, method: 'POST', url, data });
}

/**
 * PATCH запрос
 */
export async function apiPatch<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
  return apiRequest<T>({ ...config, method: 'PATCH', url, data });
}

/**
 * DELETE запрос
 */
export async function apiDelete<T>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
  return apiRequest<T>({ ...config, method: 'DELETE', url });
}
