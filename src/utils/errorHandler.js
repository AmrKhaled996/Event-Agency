import { toast } from 'sonner';
import { mapApiError } from './apiErrorMapper';

/**
 * Global Error Handler for Frontend.
 * Centralizes error mapping and user feedback (Toasts).
 */
export const handleError = (error, options = {}) => {
  const { 
    silent = false, 
    customMessage = null,
    onMapped = null 
  } = options;

  const message = customMessage || mapApiError(error);

  if (onMapped && typeof onMapped === 'function') {
    onMapped(message, error);
  }

  if (!silent) {
    toast.error(message, {
      duration: 5000,
      closeButton: true,
    });
  }

  if (import.meta.env.DEV) {
    console.error('[Global Error Handler]:', {
      originalError: error,
      mappedMessage: message,
      status: error.response?.status,
      code: error.response?.data?.code
    });
  }

  return message;
};

/**
 * Specifically for catching and handling errors in async components/hooks.
 */
export const catchAsync = (fn, options = {}) => {
  return (...args) => {
    return fn(...args).catch((err) => handleError(err, options));
  };
};
