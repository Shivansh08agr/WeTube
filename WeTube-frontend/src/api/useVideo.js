import { useState } from "react";
import { axios_instance } from "../lib/axios";
import { errorToast } from "../lib/toast";

const useVideo = () => {
  const [videoLoading, setVideoLoading] = useState(false);
  const getAllVideos = async (callback) => {
    setVideoLoading(true);
    try {
      const response = await axios_instance.get("/videos");
      if (![200, 201].includes(response?.status || response?.data?.status)) {
        errorToast("Error getting videos");
        setVideoLoading(false);
        return;
      }

      callback(response?.data, null);
    } catch (error) {
      callback(null, error?.response?.data);
    } finally {
      setVideoLoading(false);
    }
  };
  const getAllUserVideos = async (callback) => {
    setVideoLoading(true);
    try {
      const response = await axios_instance.get(`/videos/my-videos`);
      if (![200, 201].includes(response?.status || response?.data?.status)) {
        errorToast("Error getting videos");
        setVideoLoading(false);
        return;
      }

      callback(response?.data, null);
    } catch (error) {
      callback(null, error?.response?.data);
    } finally {
      setVideoLoading(false);
    }
  };
  const getVideoById = async (videoId, callback) => {
    setVideoLoading(true);
    try {
      const response = await axios_instance.get(`/videos/c/${videoId}`);

      if (![200, 201].includes(response?.status || response?.data?.status)) {
        errorToast("Error getting video");
        setVideoLoading(false);
        return;
      }

      callback(response?.data, null);
    } catch (error) {
      callback(null, error?.response?.data);
    } finally {
      setVideoLoading(false);
    }
  };
  const incrementVideoViews = async (videoId, callback) => {
    setVideoLoading(true);
    try {
      const response = await axios_instance.patch(`/videos/views/${videoId}`);

      if (![200, 201].includes(response?.status || response?.data?.status)) {
        errorToast("Error getting video");
        setVideoLoading(false);
        return;
      }

      callback(response?.data, null);
    } catch (error) {
      callback(null, error?.response?.data);
    } finally {
      setVideoLoading(false);
    }
  };

  const checkPublishStatus = async (videoId, callback) => {
    setVideoLoading(true);
    try {
      const response = await axios_instance.get(`/videos/publish-status/${videoId}`);

      if (![200, 201].includes(response?.status || response?.data?.status)) {
        errorToast("Error getting video");
        setVideoLoading(false);
        return;
      }

      callback(response?.data, null);
    } catch (error) {
      callback(null, error?.response?.data);
    } finally {
      setVideoLoading(false);
    }
  };

  const togglePublishStatus = async (videoId, callback) => {
    setVideoLoading(true);
    try {
      const response = await axios_instance.get(`/videos/toggle-publish-status/${videoId}`);

      if (![200, 201].includes(response?.status || response?.data?.status)) {
        errorToast("Error toggling publish status of the video");
        setVideoLoading(false);
        return;
      }

      callback(response?.data, null);
    } catch (error) {
      callback(null, error?.response?.data);
    } finally {
      setVideoLoading(false);
    }
  };

  const deleteVideo = async (videoId, callback) => {
    setVideoLoading(true);
    try {
      const response = await axios_instance.post(`/videos/delete-video/${videoId}`);

      if (![200, 201].includes(response?.status || response?.data?.status)) {
        errorToast("Error deleting the video.");
        setVideoLoading(false);
        return;
      }

      callback(response?.data, null);
    } catch (error) {
      callback(null, error?.response?.data);
    } finally {
      setVideoLoading(false);
    }
  };

  const updateVideo = async (videoId, payload, callback) => {
    setVideoLoading(true);
    try {
      const response = await axios_instance.patch(`/videos/update-video/${videoId}`, payload, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (![200, 201].includes(response?.status || response?.data?.status)) {
        errorToast("Error deleting the video.");
        setVideoLoading(false);
        return;
      }

      callback(response?.data, null);
    } catch (error) {
      callback(null, error?.response?.data);
    } finally {
      setVideoLoading(false);
    }
  };

  const uploadVideo = async (payload, callback) => {
    setVideoLoading(true);
    try {
      const response = await axios_instance.post(`/videos/publish-video`, payload, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (![200, 201].includes(response?.status || response?.data?.status)) {
        errorToast("Error uploading the video.");
        setVideoLoading(false);
        return;
      }

      callback(response?.data, null);
    } catch (error) {
      callback(null, error?.response?.data);
    } finally {
      setVideoLoading(false);
    }
  };


  return{
    getAllVideos,
    videoLoading,
    getVideoById,
    getAllUserVideos,
    incrementVideoViews,
    checkPublishStatus,
    togglePublishStatus,
    deleteVideo,
    updateVideo,
    uploadVideo
  };
};

export default useVideo;
