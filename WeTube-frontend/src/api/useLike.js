import { useState } from "react";
import { axios_instance } from "../lib/axios";
import { errorToast } from "../lib/toast";
import { useSelector } from "react-redux";
import { SLICE_NAMES } from "../constants/enums";

const useLike = () => {
    const [likeLoading, setLikeLoading] = useState(false);
    const APPUSER = useSelector(state => state[SLICE_NAMES.USER]);
    
    const getAllLikedVideos = async (callback) => {
      setLikeLoading(true);
      try{
        const response = await axios_instance.get(`/likes/get-liked-videos`);
  
        if (![200, 201].includes(response?.status || response?.data?.status)) {
          errorToast("Error getting liked videos");
          setLikeLoading(false);
          return;
        }
  
        callback(response?.data, null);
      } catch (error) {
        callback(null, error?.response?.data);
      } finally {
        setLikeLoading(false);
      }
    }

    const toggleVideoLike = async (videoId, callback) => {
      setLikeLoading(true);
      try {
        const response = await axios_instance.post(`/likes/toggle-video-like/${videoId}`);
  
        if (![200, 201].includes(response?.status || response?.data?.status)) {
          errorToast("Error toggling like");
          setLikeLoading(false);
          return;
        }
  
        callback(response?.data, null);
      } catch (error) {
        callback(null, error?.response?.data);
      } finally {
        setLikeLoading(false);
      }
    };
    const getVideoLikedStatus = async (videoId, callback) => {
      setLikeLoading(true);
      try {
        const response = await axios_instance.get(`/likes/get-video-liked-status/${videoId}`);
  
        if (![200, 201].includes(response?.status || response?.data?.status)) {
          if(APPUSER){
            errorToast("Error getting like status of the video");
            return;
          }
          setLikeLoading(false);
          return;
        }
  
        callback(response?.data, null);
      } catch (error) {
        callback(null, error?.response?.data);
      } finally {
        setLikeLoading(false);
      }
    };
    return{
      toggleVideoLike,
      likeLoading,
      getVideoLikedStatus,
      getAllLikedVideos
    };
  };
  
  export default useLike;