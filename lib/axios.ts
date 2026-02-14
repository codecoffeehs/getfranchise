import axios from "axios";

const isDev = process.env.NODE_ENV !== "production";

const baseURL = isDev
  ? "http://localhost:5151"
  : process.env.NEXT_PUBLIC_API_BASE_URL;

const axiosClient = axios.create({
  baseURL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosClient;
