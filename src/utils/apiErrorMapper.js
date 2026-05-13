import i18next from 'i18next';

/**
 * Maps backend error codes or JSend fail data to localized strings.
 * @param {Object} error - The error object from Axios.
 * @returns {string} - The localized error message.
 */
export const mapApiError = (error) => {
  const { response } = error;
  
  if (!response) {
    return i18next.t('apiErrors.NETWORK_ERROR', 'Network error. Please check your connection.');
  }

  const { data } = response;
  const mainCode = data?.code || data?.data?.code;

  if (mainCode && mainCode !== 'VALIDATION_ERROR') {
    const translationKey = `apiErrors.${mainCode}`;
    const translatedMessage = i18next.t(translationKey);
    if (translatedMessage !== translationKey) {
      return translatedMessage;
    }
  }

  if (data?.status === 'fail' && data?.data) {
    if (Array.isArray(data.data) && data.data.length > 0) {
      const firstErr = data.data[0];
      if (firstErr.code) {
        const subKey = `apiErrors.${firstErr.code}`;
        const subMsg = i18next.t(subKey);
        if (subMsg !== subKey) return subMsg;
      }
      if (typeof firstErr.message === 'string') return firstErr.message;
    }

    if (typeof data.data === 'object' && !Array.isArray(data.data)) {
      const keys = Object.keys(data.data);
      if (keys.length > 0) {
        const val = data.data[keys[0]];
        if (typeof val === 'string') {
          const mappedCode = backendStringMap[val];
          if (mappedCode) return i18next.t(`apiErrors.${mappedCode}`, val);
          return val;
        }
      }
    }
  }

  if (mainCode) {
    const translationKey = `apiErrors.${mainCode}`;
    const translatedMessage = i18next.t(translationKey);
    if (translatedMessage !== translationKey) return translatedMessage;
  }

  if (data?.message && typeof data.message === 'string') {
    const mappedCode = backendStringMap[data.message];
    if (mappedCode) return i18next.t(`apiErrors.${mappedCode}`, data.message);
    return data.message;
  }

  const status = response.status;
  if (status === 401) return i18next.t('apiErrors.UNAUTHORIZED');
  if (status === 403) return i18next.t('apiErrors.FORBIDDEN');
  if (status === 404) return i18next.t('apiErrors.NOT_FOUND');
  if (status >= 500) return i18next.t('apiErrors.INTERNAL_SERVER_ERROR');

  return i18next.t('apiErrors.UNKNOWN_ERROR', 'An unexpected error occurred.');
};


// Internal mapping of common hardcoded backend English error strings
const backendStringMap = {
  "Invalid credentials": "INVALID_CREDENTIALS",
  "Email already verified": "EMAIL_ALREADY_VERIFIED",
  "Invalid or expired refresh token": "UNAUTHORIZED",
  "User not found": "USER_NOT_FOUND",
  "Email address is already in use": "EMAIL_ALREADY_IN_USE",
  "Token expired or invalid": "EXPIRED_OTP",
  "Invalid token": "INVALID_OTP",
  "Event not found": "EVENT_NOT_FOUND",
  "Attendee not found": "USER_NOT_FOUND",
  "User email not verified": "EMAIL_NOT_VERIFIED",
  "Order not found": "NOT_FOUND",
  "Governorate not found": "NOT_FOUND"
};
