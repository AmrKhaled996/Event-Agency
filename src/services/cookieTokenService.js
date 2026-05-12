import Cookies from "js-cookie";

/**
 * Sets initial tokens after login or signup.
 * @param {Object} data - The response data containing accessToken and refreshToken.
 */
export function setTokens(data) {
  // Defensive extraction based on observed structures
  const accessToken = data.accessToken?.token || data.accessToken;
  const expiresIn = data.accessToken?.expiresIn || data.expiresIn || 3600;
  const refreshToken = data.refreshToken;

  const expires = expiresIn / 86400; // convert seconds → days

  Cookies.set("accessToken", accessToken, {
    expires,
    secure: true,
    sameSite: "strict",
  });

  if (refreshToken) {
    Cookies.set("refreshToken", refreshToken, {
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
    Cookies.set("accessToken", accessToken, {
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
    Cookies.set("accessToken", accessToken, {
      expires: expiresIn / 86400,
      secure: true,
      sameSite: "strict",
    });
  }
};

export function getAccessToken() {
  return Cookies.get("accessToken");
}

export function getRefreshToken() {
  return Cookies.get("refreshToken");
}

export function removeTokens() {
  Cookies.remove("accessToken");
  Cookies.remove("refreshToken");
}
