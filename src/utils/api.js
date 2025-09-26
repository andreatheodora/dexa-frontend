import axios from "axios";
import { URL_BASE } from "@/constants/api";

const api = axios.create({
  baseURL: URL_BASE,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
