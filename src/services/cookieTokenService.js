import Cookies from "js-cookie";

const APP_ACCESS_TOKEN_KEY = "app_access_token";
const APP_REFRESH_TOKEN_KEY = "app_refresh_token";
const ADMIN_ACCESS_TOKEN_KEY = "admin_access_token";
const ADMIN_REFRESH_TOKEN_KEY = "admin_refresh_token";

/**
 * Sets initial tokens after login or signup.
 * @param {Object} data - The response data containing accessToken and refreshToken.
 * @param {Boolean} isAdmin - Whether to set admin tokens.
 */
export function setTokens(data, isAdmin = false) {
  const accessTokenKey = isAdmin ? ADMIN_ACCESS_TOKEN_KEY : APP_ACCESS_TOKEN_KEY;
  const refreshTokenKey = isAdmin ? ADMIN_REFRESH_TOKEN_KEY : APP_REFRESH_TOKEN_KEY;

  // Defensive extraction based on observed structures
  const accessToken = data.accessToken?.token || data.accessToken;
  const expiresIn = data.accessToken?.expiresIn || data.expiresIn || 3600;
  const refreshToken = data.refreshToken;

  const expires = expiresIn / 86400; // convert seconds → days

  Cookies.set(accessTokenKey, accessToken, {
    expires,
    secure: true,
    sameSite: "strict",
  });

  if (refreshToken) {
    Cookies.set(refreshTokenKey, refreshToken, {
      expires: 7,
      secure: true,
      sameSite: "strict",
    });
  }
}

/**
 * Refreshes the access token for regular users.
 * @param {Object} data - The API response data.
 */
export const refreshAccessToken = async (data) => {
  // Handle various nested structures observed in the codebase
  const tokenData = data.data?.data || data.data || data;
  const accessToken = tokenData.accessToken;
  const expiresIn = tokenData.expiresIn || 3600;

  if (accessToken) {
    Cookies.set(APP_ACCESS_TOKEN_KEY, accessToken, {
      expires: expiresIn / 86400,
      secure: true,
      sameSite: "strict",
    });
  }
};

/**
 * Refreshes the access token for admin users.
 * @param {Object} data - The API response data.
 */
export const adminRefreshAccessToken = async (data) => {
  const tokenData = data.data || data;
  const accessToken = tokenData.accessToken?.token || tokenData.accessToken;
  const expiresIn = tokenData.accessToken?.expiresIn || tokenData.expiresIn || 3600;

  if (accessToken) {
    Cookies.set(ADMIN_ACCESS_TOKEN_KEY, accessToken, {
      expires: expiresIn / 86400,
      secure: true,
      sameSite: "strict",
    });
  }
};

/**
 * Gets the access token.
 * @param {Boolean} isAdmin - Whether to get the admin access token.
 */
export function getAccessToken(isAdmin = false) {
  return Cookies.get(isAdmin ? ADMIN_ACCESS_TOKEN_KEY : APP_ACCESS_TOKEN_KEY);
}

/**
 * Gets the refresh token.
 * @param {Boolean} isAdmin - Whether to get the admin refresh token.
 */
export function getRefreshToken(isAdmin = false) {
  return Cookies.get(isAdmin ? ADMIN_REFRESH_TOKEN_KEY : APP_REFRESH_TOKEN_KEY);
}

/**
 * Removes tokens.
 * @param {Boolean} isAdmin - Whether to remove admin tokens.
 */
export function removeTokens(isAdmin = false) {
  if (isAdmin) {
    Cookies.remove(ADMIN_ACCESS_TOKEN_KEY);
    Cookies.remove(ADMIN_REFRESH_TOKEN_KEY);
  } else {
    Cookies.remove(APP_ACCESS_TOKEN_KEY);
    Cookies.remove(APP_REFRESH_TOKEN_KEY);
  }
}
