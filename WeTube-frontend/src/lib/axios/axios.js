import axios from "axios";
import { SLICE_NAMES } from "../../constants/enums";
import { errorToast } from "../toast";
import { useSelector } from "react-redux";
// instance
const axios_instance = axios.create({
  baseURL: `${import.meta.env.VITE_DEPLOYED_BACKEND_HOSTNAME}`,
  headers: {
    "Content-Type": "application/json",
  },
});

axios_instance.interceptors.request.use(
  (config) => {
    const token =
      JSON.parse(localStorage.getItem(SLICE_NAMES.USER))?.accessToken || null;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.log(error);
    return Promise.reject(error);
  },
);

axios_instance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
        errorToast("Login expired. Please login again.");
        return Promise.reject(error);
    }
      return Promise.reject(error);
  },
);

export { axios_instance };
