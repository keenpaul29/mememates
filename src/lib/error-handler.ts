import { AxiosError } from 'axios';
import toast from 'react-hot-toast';

export interface ApiError {
  message: string;
  status?: number;
  errors?: string[];
}

type ErrorWithMessage = {
  message: string;
  isAxiosError?: boolean;
};

interface ApiResponse {
  message?: string;
  errors?: Record<string, string[]>;
}

export class ErrorHandler {
  // Handle generic errors
  static handleError(error: ErrorWithMessage): ApiError {
    // Axios error handling
    if (error.isAxiosError) {
      return this.handleAxiosError(error as AxiosError);
    }

    // Network error
    if (error.message === 'Network Error') {
      toast.error('Network error. Please check your connection.');
      return {
        message: 'Network error. Please check your connection.',
        status: 0
      };
    }

    // Generic error fallback
    const defaultError = {
      message: error.message || 'An unexpected error occurred',
      status: 500
    };

    toast.error(defaultError.message);
    return defaultError;
  }

  // Specific Axios error handling
  private static handleAxiosError(error: AxiosError<ApiResponse>): ApiError {
    // No response received
    if (!error.response) {
      toast.error('No response from server. Please try again.');
      return {
        message: 'No response from server',
        status: 0
      };
    }

    const { response } = error;
    const data = response.data;

    // Specific error handling based on status code
    switch (response.status) {
      case 400:
        toast.error(data?.message || 'Bad Request');
        return {
          message: data?.message || 'Bad Request',
          status: 400,
          errors: data?.errors ? Object.values(data.errors).flat() : undefined
        };

      case 401:
        toast.error('Unauthorized. Please log in again.');
        // Optionally trigger logout or redirect
        return {
          message: 'Unauthorized',
          status: 401
        };

      case 403:
        toast.error('You do not have permission to perform this action.');
        return {
          message: 'Forbidden',
          status: 403
        };

      case 404:
        toast.error('Requested resource not found.');
        return {
          message: 'Not Found',
          status: 404
        };

      case 422:
        const validationErrors = data?.errors 
          ? Object.values(data.errors).flat() 
          : ['Validation failed'];
        toast.error(validationErrors[0]);
        return {
          message: 'Validation Error',
          status: 422,
          errors: validationErrors
        };

      case 500:
        toast.error('Internal server error. Please try again later.');
        return {
          message: 'Internal Server Error',
          status: 500
        };

      default:
        toast.error(data?.message || 'An unexpected error occurred');
        return {
          message: data?.message || 'An unexpected error occurred',
          status: response.status
        };
    }
  }

  // Validation error handler
  static handleValidationErrors(errors: Record<string, string[]>): void {
    const firstError = Object.values(errors)[0][0];
    toast.error(firstError);
  }
}

// Utility for async error handling
export const asyncErrorHandler = <TArgs extends unknown[], TReturn>(
  fn: (...args: TArgs) => Promise<TReturn>
) => async (...args: TArgs): Promise<TReturn> => {
  try {
    return await fn(...args);
  } catch (error) {
    ErrorHandler.handleError(error as ErrorWithMessage);
    throw error;
  }
};
