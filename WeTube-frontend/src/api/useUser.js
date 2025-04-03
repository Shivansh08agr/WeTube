import { useState } from "react";
import { axios_instance } from "../lib/axios/axios";
import { errorToast } from "../lib/toast";

const useUser = () => {
  const [userLoading, setUserLoading] = useState(false);

  const getUserById = async (callback) => {
    setUserLoading(true);
    try {
      const response = await axios_instance.get("/users");
      if (![200, 201].includes(response?.status || response?.data?.status)) {
        errorToast("Error getting user");
        setUserLoading(false);
        return;
      }

      callback(response?.data, null);
    } catch (error) {
      callback(null, error?.response?.data);
    } finally {
      setUserLoading(false);
    }
  };

  const register = async (payload, callback) => {
    setUserLoading(true);
    try {
      const formData = new FormData();
      formData.append("username", payload.username);
      formData.append("fullName", payload.fullName);
      formData.append("email", payload.email);
      formData.append("password", payload.password);
      formData.append("avatar", payload.avatar);
      formData.append("coverImage", payload.coverImage);

      const response = await axios_instance.post("/users/register", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (![200, 201].includes(response?.status || response?.data?.status)) {
        errorToast(response?.data?.message || "Failed to register");
        setUserLoading(false);
        return;
      }

      callback(response?.data, null);
    } catch (error) {
      callback(null, error?.response?.data);
    } finally {
      setUserLoading(false);
    }
  };

  const login = async (
    payload,
    callback,
  ) => {
    setUserLoading(true);
    try {
      const response = await axios_instance.post("/users/login", payload);

      if (![200, 201].includes(response?.status || response?.data?.status)) {
        errorToast(response?.data?.message || "Failed to login.");
        setUserLoading(false);
        return;
      }

      callback(response?.data, null);
    } catch (error) {
      callback(null, error);
    } finally {
      setUserLoading(false);
    }
  };

  const updateUserDetails = async (
    payload,
    callback,
  ) => {
    setUserLoading(true);
    try {
      const response = await axios_instance.post("/users/update-account", payload);

      if (![200, 201].includes(response?.status || response?.data?.status)) {
        errorToast(response?.data?.message || "Failed to update user details.");
        setUserLoading(false);
        return;
      }

      callback(response?.data, null);
    } catch (error) {
      callback(null, error);
    } finally {
      setUserLoading(false);
    }
  };

  const changePassword = async (
    payload,
    callback,
  ) => {
    setUserLoading(true);
    try {
      const response = await axios_instance.post("/users/change-password", payload);

      if (![200, 201].includes(response?.status || response?.data?.status)) {
        errorToast(response?.data?.message || "Failed to update user credentials.");
        setUserLoading(false);
        return;
      }

      callback(response?.data, null);
    } catch (error) {
      callback(null, error);
    } finally {
      setUserLoading(false);
    }
  };

  const logout = async (
    callback,
  ) => {
    setUserLoading(true);
    try {
      const response = await axios_instance.post("/users/logout");

      if (![200, 201].includes(response?.status || response?.data?.status)) {
        errorToast(response?.data?.message || "Failed to logout.");
        setUserLoading(false);
        return;
      }

      callback(response?.data, null);
    } catch (error) {
      callback(null, error);
    } finally {
      setUserLoading(false);
    }
  };

  const getCurrentUser = async (
    callback,
  ) => {
    setUserLoading(true);
    try {
      const response = await axios_instance.get("/users/current-user");

      if (![200, 201].includes(response?.status || response?.data?.status)) {
        errorToast(response?.data?.message || "Failed to open your profile.");
        setUserLoading(false);
        return;
      }

      callback(response?.data, null);
    } catch (error) {
      callback(null, error);
    } finally {
      setUserLoading(false);
    }
  }

  const updateAvatar = async (payload, callback) => {
    setUserLoading(true);
    try {
      const formData = new FormData();
      formData.append("avatar", payload.avatar);
  
      const response = await axios_instance.patch("/users/avatar", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
  
      if (![200, 201].includes(response?.status || response?.data?.status)) {
        errorToast(response?.data?.message || "Failed to update avatar.");
        setUserLoading(false);
        return;
      }
  
      callback(response?.data, null);
    } catch (error) {
      callback(null, error);
    } finally {
      setUserLoading(false);
    }
  };

  const updateCoverImage = async (payload, callback) => {
    setUserLoading(true);
    try {
      const formData = new FormData();
      formData.append("coverImage", payload.coverImage);
  
      const response = await axios_instance.patch("/users/coverImage", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
  
      if (![200, 201].includes(response?.status || response?.data?.status)) {
        errorToast(response?.data?.message || "Failed to update cover image.");
        setUserLoading(false);
        return;
      }
  
      callback(response?.data, null);
    } catch (error) {
      callback(null, error);
    } finally {
      setUserLoading(false);
    }
  };

  const addToHistory = async (payload, callback) => {
    setUserLoading(true);
    try{
      const response = await axios_instance.post(`/users/add-to-watch-history`, payload);

      if (![200, 201].includes(response?.status || response?.data?.status)) {
        errorToast("Error adding video to user history");
        setUserLoading(false);
        return;
      }

      callback(response?.data, null);
    } catch (error) {
      callback(null, error?.response?.data);
    } finally {
      setUserLoading(false);
    }
  }

  const getAllHistoryVideos = async (callback) => {
    setUserLoading(true);
    try{
      const response = await axios_instance.get(`/users/watch-history`);

      if (![200, 201].includes(response?.status || response?.data?.status)) {
        errorToast("Error getting videos from user history");
        setUserLoading(false);
        return;
      }

      callback(response?.data, null);
    } catch (error) {
      callback(null, error?.response?.data);
    } finally {
      setUserLoading(false);
    }
  }

  return {
    getUserById,
    userLoading,
    register,
    login,
    logout,
    getCurrentUser,
    updateAvatar,
    updateCoverImage,
    updateUserDetails,
    changePassword,
    getAllHistoryVideos,
    addToHistory
  };
};

export default useUser;