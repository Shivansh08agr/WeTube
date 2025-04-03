import "video-react/dist/video-react.css";
import styles from "./Video.module.scss";
import { use, useEffect, useState } from "react";
import { errorToast } from "../../lib/toast";
import { useParams } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import LoadingScreen from "../../components/loadingScreen/LoadingScreen";
import { useSelector } from "react-redux";
import { SLICE_NAMES } from "../../constants/enums";
import { useComment, useLike, useSubscribe, useUser, useVideo } from "../../api";

const Video = () => {
  const { videoLoading, getVideoById, incrementVideoViews } = useVideo();
  const {addToHistory} = useUser();
  const { toggleVideoLike, getVideoLikedStatus, likeLoading } = useLike();
  const {toggleSubscriptionStatus, subscribeLoading, getChannelSubscribedStatus} = useSubscribe();
  const [video, setVideo] = useState(null);
  const [like, setLike] = useState(false);
  const { videoId } = useParams();
  const APPUSER = useSelector(state => state[SLICE_NAMES.USER]);
  const {getAllComments, commentLoading, addComment, deleteComment, updateComment} = useComment();
  const [allComments, setAllComments] = useState([]);
  const [formData, setFormData] = useState({
      content: "",
  });
  const [updatedContent, setUpdatedContent] = useState("");
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [isSubscribed, setIsSubscribed] = useState();
  const [channelId, setChannelId] = useState()

  const getVideo = () => {
    getVideoById(videoId, (res, err) => {
      if (err) {
        errorToast("Error loading Video");
        return;
      }
      setVideo(res.data);
      setChannelId(res.data.owner._id);
    });
  };

  const getComments = () => {
    getAllComments(videoId, (res, err) => {
      if(err){
        errorToast("Error loading Comments");
        return;
      }
      setAllComments(res.data);
    });
  }
  function handleChange(e) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  }
  const handleSubmitComment = (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
    };
    if(payload.content.length == 0){
      errorToast("Please write a comment first.");
      return;
    }
    addComment(videoId, payload, (res, err)=> {
      if(err){
        errorToast("An error occured while adding the comment");
        return;
      }
      getComments();
    });
    
    setFormData({
      ...formData,
      content: "",
    });
  }

  const handleDelete = (commentId) => {
    deleteComment(commentId, (res, err)=>{
      if(err){
        errorToast("An error occured while deleting the comment");
        return;
      }
    });
    location.reload();
  }

  const handleUpdate = (commentId) => {
    if (updatedContent.trim() === "") {
      errorToast("Comment content cannot be empty.");
      return;
    }
  
    const payload = { content: updatedContent };
  
    updateComment(commentId, payload, (res, err) => {
      console.log("Updating comment:", commentId, payload);
      if (err) {
        errorToast("An error occurred while updating the comment.");
        return;
      }
      setEditingCommentId(null);
      setUpdatedContent("");
      getComments();
    });
  };

  const toggleVLike = () => {
    toggleVideoLike(videoId, (res, err) => {
      if (err) {
        errorToast("Error toggling like");
        return;
      }
      setLike(res.data);
    });
  };

  const getVideoLikeStatus = () => {
    if(APPUSER){
      getVideoLikedStatus(videoId, (res, err) => {
        if (err) {
          if(APPUSER){
            errorToast("Error checking like status of the video");
          }
          return;
        }
        setLike(res.data);
      });
    }
    return;
  };

  const addVideoToHistory = () => {
    const payload = {videoId};
      addToHistory(payload, (res, err)=> {
        if (err) {
          errorToast("Error adding video to watch history");
          return;
        }
      })

      incrementVideoViews(videoId, (res, err)=> {
        if (err) {
          errorToast("Error incrementing views to video");
          return;
        }
      })
  }



  const getChannelSubscribeStatus = () => {
    if(APPUSER){
      getChannelSubscribedStatus(channelId, (res, err) => {
        if (err) {
          if(APPUSER){
            errorToast("Error checking subscription status of the video");
          }
          return;
        }
        setIsSubscribed(res.data);
      });
    }
    return;
  };

  const handleSubscription = (channelId) => {
    toggleSubscriptionStatus(channelId, (res, err) => {
      if(err){
        errorToast("Error toggling subscription status of the video");
      }
      setIsSubscribed(res.data.isChannelSubscribed);
    });
  }

  useEffect(() => {
    getVideo();
    getVideoLikeStatus();
    getComments();
    if(APPUSER && channelId)getChannelSubscribeStatus();
    if(APPUSER) addVideoToHistory();
  }, [videoId, channelId]);

  if (videoLoading || likeLoading || !video) {
    return <LoadingScreen />;
  }

  return (
    <div className={styles.video}>
      <div className={styles.videoControls}>
        <video controls className={styles.videoPlayer}>
          <source src={video?.videoFile} type="video/mp4" />
        </video>
        <div className={styles.controller}>
          <div>
            <div className={styles.details}>
              <p>{video?.title}</p>
              <p>
                {video?.views} Views |{" "}
                {formatDistanceToNow(new Date(video.createdAt), {
                  addSuffix: true,
                })}
              </p>
            </div>
            <div className={styles.buttons}>
              <div className={styles.likeDislike} onClick={toggleVLike}>
                <img
                  src={
                    like
                      ? "../../../src/assets/like.svg"
                      : "../../../src/assets/thumbs-up.svg"
                  }
                  alt="like"
                />
              </div>
            </div>
          </div>
          <div className={styles.ownerInfo}>
            <div>
              <img src={video.owner.avatar} alt="channel's avatar" />
              <p>{video.owner.username}</p>
            </div>
            <button onClick={()=> handleSubscription(video.owner._id)}>{isSubscribed ? "Subscribed" : "Subscribe"}</button>
          </div>
          <p>{video.description}</p>
        </div>
      </div>
      <div className={styles.comment}>
        <h2>Comments</h2>
        <div className={styles.addComment}>
          <input type="text" placeholder="Add a comment" name="content" onChange={(e) => handleChange(e)} value={formData.content}/>
          <img src="../../../src/assets/send.svg" alt="add comment" onClick={(e) => handleSubmitComment(e)}/>
        </div>
        <div className={styles.viewComments}>
          {(allComments.length == 0) ? (
            <p>Be the first to Comment</p>
          ): (
            allComments.map((comment) => (
              <div key={comment._id} className={styles.commentStr}>
                <img src={comment.owner[0].avatar} alt="avatar" />
                <div className={styles.details}>
                  <div>
                    <p>{comment.owner[0].username}</p>
                    <p className={styles.date}>
                      {formatDistanceToNow(new Date(comment.updatedAt), { addSuffix: true })}
                    </p>
                  </div>
                  <div className={styles.content}>
                    {editingCommentId === comment._id ? (
                      <input
                        type="text"
                        value={updatedContent}
                        onChange={(e) => setUpdatedContent(e.target.value)}
                      />
                    ) : (
                      <p>{comment.content}</p>
                    )}
                    {APPUSER && APPUSER.user._id === comment.owner[0]._id && (
                      <div>
                        {editingCommentId === comment._id ? (
                          <img
                            src="../../../src/assets/save.svg"
                            alt="save"
                            onClick={() => handleUpdate(comment._id)}
                          />
                        ) : (
                          <img
                            src="../../../src/assets/edit.svg"
                            alt="edit"
                            onClick={() => {
                              setEditingCommentId(comment._id);
                              setUpdatedContent(comment.content);
                            }}
                          />
                        )}
                        <img
                          src="../../../src/assets/delete.svg"
                          alt="delete"
                          onClick={() => handleDelete(comment._id)}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Video;
