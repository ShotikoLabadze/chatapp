import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
});

export const setAuthToken = (token: string) => {
  api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
};

export default api;
