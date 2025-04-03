import React, { useEffect, useState } from "react";
import styles from "./WatchHistory.module.scss";
import { useUser } from "../../api";
import LoadingScreen from "../../components/loadingScreen/LoadingScreen";
import { errorToast } from "../../lib/toast";
import { formatDistanceToNow } from "date-fns";
import { useNavigate } from "react-router";

const WatchHistory = () => {
  const [videos, setVideos] = useState([]);
  const { getAllHistoryVideos, userLoading } = useUser();
  let navigate = useNavigate();

  const getAllVideos = () => {
    getAllHistoryVideos((res, err) => {
      if (err) {
        errorToast("Error loading watch history videos.");
        return;
      }
      console.log(res.data);
      setVideos(res.data);
    });
  };

  useEffect(() => {
    getAllVideos();
  }, []);

  return (
    <div className={styles.main_container}>
      <h2>Watch History:</h2>
      <div className={styles.watchHistory}>
        {userLoading && videos.length == 0 ? (
          <LoadingScreen />
        ) : videos.length == 0 ? (
          <h1>No Watch history available</h1>
        ) : (
          videos.filter((video) => video.isPublished).map((video) => (
            <div
              key={video._id}
              className={styles.video}
              onClick={() => navigate(`/videos/${video._id}`)}
            >
              <img
                src={video.thumbnail ? video.thumbnail : "defaultThumbnail.png"}
                alt="thumbnail"
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

export default WatchHistory;
