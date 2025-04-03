import React, { useEffect, useState } from "react";
import styles from "./LikedVideos.module.scss";
import { useLike } from "../../api";
import LoadingScreen from "../../components/loadingScreen/LoadingScreen";
import { errorToast } from "../../lib/toast";
import { formatDistanceToNow } from "date-fns";
import { useNavigate } from 'react-router';

const likedVideos = () => {
  const [videos, setVideos] = useState([]);
  const { likeLoading, getAllLikedVideos } = useLike();
  let navigate = useNavigate();

  const getAllVideos = () => {
    getAllLikedVideos((res, err) => {
      if (err) {
        errorToast("Error loading liked videos.");
        return;
      }
      setVideos(res.data);
      console.log(res.data);
    });
  };

  useEffect(()=>{
    getAllVideos();
  }, [])

  return (
    <div className={styles.main_container}>
      {videos.length > 0 && <h2>Liked Videos:</h2>}
      <div className={styles.likedVideos}>
      {(likeLoading && videos.length == 0) ? (
        <LoadingScreen />
      ) : (videos.length == 0) ? (
        <h2>No Liked Videos</h2>
      ) : (
        videos.filter(video => video.video.isPublished).map((video) => (
          <div
            key={video.video._id}
            className={styles.video}
            onClick={() => navigate(`/videos/${video.video._id}`)}
          >
            <img
              src={video.video.thumbnail ? video.video.thumbnail : "defaultThumbnail.png"}
              alt="thumbnail"
            />
            <div className={styles.channel}>
              <img src={video.video.owner.avatar} alt="avatar" />
              <p>{video.video.title}</p>
            </div>
            <div className={styles.details}>
              <div className={styles.det1}>
                <p>
                  {new Intl.NumberFormat("en", { notation: "compact" }).format(
                    video.video.views
                  )}{" "}
                  views
                </p>
                <p>{video.video.owner.username}</p>
              </div>
              <div className={styles.det1}>
                <p>
                  {formatDistanceToNow(video.video.createdAt, { addSuffix: true })}
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

export default likedVideos;
