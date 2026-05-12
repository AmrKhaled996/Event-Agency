import Cookies from "js-cookie";

export function setTokens(data) {
  const accessToken = data.accessToken.token;
  const expiresIn = data.accessToken.expiresIn;
  const refreshToken = data.refreshToken;

  const expires = expiresIn / 86400; // convert seconds → days

  Cookies.set("accessToken", accessToken, {
    expires,
    secure: false,
    sameSite: "strict",
  });

  Cookies.set("refreshToken", refreshToken, {
    expires: 7,
    secure: false,
    sameSite: "strict",
  });
}
export const refreshAccessToken = async (data) => {
  const accessToken = data.data.data.accessToken;
  const expiresIn = data.data.data.expiresIn;

  Cookies.remove("accessToken");
  const ref= Cookies.get("refreshToken");
  
  Cookies.set("accessToken", accessToken, {
    expires: expiresIn / 86400,
    secure: true,
    sameSite: "strict",
  });
};
export const adminRefreshAccessToken = async (data) => {
  const accessToken = data.data.accessToken.token
  const expiresIn = data.data.accessToken.expiresIn;

  Cookies.remove("accessToken");
  const ref= Cookies.get("refreshToken");
  
  Cookies.set("accessToken", accessToken, {
    expires: expiresIn / 86400,
    secure: true,
    sameSite: "strict",
  });
};

export function getAccessToken() {
  return Cookies.get("accessToken");
}

export function getRefreshToken() {
  const token=getAccessToken();
  const ref=Cookies.get("refreshToken");
  return ref
}

export function removeTokens() {
  Cookies.remove("accessToken");
  Cookies.remove("refreshToken");
}
