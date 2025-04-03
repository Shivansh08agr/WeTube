import React, { useEffect, useState } from "react";
import styles from "./MyVideos.module.scss";
import { useVideo } from "../../api";
import LoadingScreen from "../../components/loadingScreen/LoadingScreen";
import { errorToast } from "../../lib/toast";
import { formatDistanceToNow } from "date-fns";
import { useNavigate } from "react-router";
import { useSelector } from "react-redux";
import { SLICE_NAMES } from "../../constants/enums";

const MyVideos = () => {
  const [videos, setVideos] = useState([]);
  const [publishStatus, setPublishStatus] = useState({});
  const { videoLoading, getAllUserVideos, checkPublishStatus, togglePublishStatus, deleteVideo } = useVideo();
  let navigate = useNavigate();
  const APPUSER = useSelector((state) => state[SLICE_NAMES.USER]);

  const getAllVideos = () => {
    getAllUserVideos((res, err) => {
      if (err) {
        errorToast("Error loading uploaded videos.");
        return;
      }
      setVideos(res.data);

      // Fetch publish status for all videos
      fetchPublishStatus(res.data);
    });
  };

  const fetchPublishStatus = (videos) => {
    const statusPromises = videos.map((video) =>
      new Promise((resolve) => {
        checkPublishStatus(video._id, (res, err) => {
          if (err) {
            resolve({ videoId: video._id, isPublished: false });
          } else {
            resolve({ videoId: video._id, isPublished: res.data.isPublished });
          }
        });
      })
    );

    Promise.all(statusPromises).then((statuses) => {
      const statusMap = {};
      statuses.forEach((status) => {
        statusMap[status.videoId] = status.isPublished;
      });
      setPublishStatus(statusMap);
    });
  };

  const toggleStatus = (videoId) => {
    togglePublishStatus(videoId, (res, err) => {
      if (err) {
        errorToast("Error toggling publish status of the video.");
        return;
      }
      // Update the publish status in the state
      setPublishStatus((prevStatus) => ({
        ...prevStatus,
        [videoId]: res.data.isPublished,
      }));
    });
  };

  const handleDelete = (videoId) => {
    deleteVideo(videoId, (res, err)=> {
      if (err) {
        errorToast("Error deleting the video.")
      }
      getAllVideos();
    })
  }

  useEffect(() => {
    if (APPUSER) getAllVideos();
  }, [APPUSER]);

  return (
    <div className={styles.main_container}>
      <h2>My Videos:</h2>
      <div className={styles.watchHistory}>
        {videoLoading && videos.length === 0 ? (
          <LoadingScreen />
        ) : videos.length === 0 ? (
          <h2>No uploaded videos available</h2>
        ) : (
          videos.map((video) => (
            <div key={video._id} className={styles.video}>
              <div className={styles.adminControls}>
                <div className={styles.togglePublish}>
                  <label className={styles.switch}>
                    <input
                      type="checkbox"
                      checked={publishStatus[video._id] || false}
                      onChange={() => toggleStatus(video._id)}
                    />
                    <span className={styles.slider}></span>
                  </label>
                </div>
                <div className={styles.editNdelete}>
                  <img src="../../../src/assets/edit.svg" alt="edit" onClick={() => navigate(`videos/edit-video/${video._id}`)}/>
                  <img src="../../../src/assets/delete.svg" alt="delete" onClick={()=> handleDelete(video._id)}/>
                </div>
              </div>
              <img
                src={video.thumbnail ? video.thumbnail : "defaultThumbnail.png"}
                alt="thumbnail"
                onClick={() => navigate(`/videos/${video._id}`)}
              />
              <div className={styles.channel}>
                <img src={video.owner.avatar} alt="avatar" />
                <p>{video.title}</p>
              </div>
              <div className={styles.details}>
                <div className={styles.det1}>
                  <p>
                    {new Intl.NumberFormat("en", {
                      notation: "compact",
                    }).format(video.views)}{" "}
                    views
                  </p>
                  <p>{video.owner.username}</p>
                </div>
                <div className={styles.det1}>
                  <p>
                    {formatDistanceToNow(video.createdAt, { addSuffix: true })}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MyVideos;