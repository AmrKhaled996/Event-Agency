// socket.js
import { io } from "socket.io-client";
import { getAccessToken } from "./cookieTokenService";
const token =getAccessToken();

const socket = io(`http://localhost:3000?token=${token}`,{
  auth: {
    token: token
  }}); // حط BASE_URL بتاعك هنا

export default socket;