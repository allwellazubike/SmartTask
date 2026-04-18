import axios from "axios";

const api = axios.create({
  baseURL: "https://smarttask.pxxl.click", // Note: User said backend runs at 3000 but our express default was 5000? Let's use what the user said (http://localhost:3000/api)
});


api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
