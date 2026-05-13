// socket.js
import { io } from "socket.io-client";
import { getAccessToken } from "./cookieTokenService";
const token =getAccessToken();

const socket = io(`${import.meta.env.VITE_SOCKET_URL || "http://localhost:8000"}?token=${token}`,{
  auth: {
    token: token
  }}); 

export default socket;