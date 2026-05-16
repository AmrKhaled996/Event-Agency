// socket.js
import { io } from "socket.io-client";
import { getAccessToken } from "./cookieTokenService";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:3000";

const socket = io(SOCKET_URL, {
  autoConnect: false,
  auth: (cb) => {
    cb({ token: getAccessToken() });
  }
});

export const connectSocket = () => {
  const token = getAccessToken();
  if (token) {
    socket.auth = { token };
    if (socket.disconnected) {
      socket.connect();
    }
  }
};


export const disconnectSocket = () => {
  if (socket.connected) {
    socket.disconnect();
  }
};

export default socket;
