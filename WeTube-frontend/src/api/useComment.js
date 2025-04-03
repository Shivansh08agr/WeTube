import { useState } from "react";
import { axios_instance } from "../lib/axios";
import { errorToast } from "../lib/toast";

const useComment = () => {
    const [commentLoading, setCommentLoading] = useState(false);
    const getAllComments = async (videoId, callback) => {
      setCommentLoading(true);
      try {
        const response = await axios_instance.get(`/comments/${videoId}`);
        if (![200, 201].includes(response?.status || response?.data?.status)) {
          errorToast("Error getting comments");
          setCommentLoading(false);
          return;
        }
  
        callback(response?.data, null);
      } catch (error) {
        callback(null, error?.response?.data);
      } finally {
        setCommentLoading(false);
      }
    };

    const addComment = async (videoId, payload, callback) => {
      setCommentLoading(true);
      try {
        const response = await axios_instance.post(`/comments/add-comment/${videoId}`, payload);
        if (![200, 201].includes(response?.status || response?.data?.status)) {
          errorToast("Error getting comments");
          setCommentLoading(false);
          return;
        }
  
        callback(response?.data, null);
      } catch (error) {
        callback(null, error?.response?.data);
      } finally {
        setCommentLoading(false);
      }
    };

    const updateComment = async (commentId, payload, callback) => {
        setCommentLoading(true);
        try {
            const response = await axios_instance.patch(`/comments/update-comment/${commentId}`, payload);
            if (![200, 201].includes(response?.status || response?.data?.status)) {
              errorToast("Error updating comment");
              setCommentLoading(false);
              return;
            }
      
            callback(response?.data, null);
          } catch (error) {
            callback(null, error?.response?.data);
          } finally {
            setCommentLoading(false);
          }
    }

    const deleteComment = async (commentId, callback) => {
        setCommentLoading(true);
        try {
            const response = await axios_instance.post(`/comments/delete-comment/${commentId}`);
            if (![200, 201].includes(response?.status || response?.data?.status)) {
              errorToast("Error deleting comment");
              setCommentLoading(false);
              return;
            }
      
            callback(response?.data, null);
          } catch (error) {
            callback(null, error?.response?.data);
          } finally {
            setCommentLoading(false);
          }
    }

    return{
        getAllComments,
        commentLoading,
        addComment,
        deleteComment,
        updateComment
    };
  };
  
  export default useComment;
  