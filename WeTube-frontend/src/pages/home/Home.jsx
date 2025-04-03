import React, { useEffect, useState } from 'react'
import styles from './Home.module.scss'
import { useUser, useVideo } from '../../api';
import LoadingScreen from '../../components/loadingScreen/LoadingScreen';
import { formatDistanceToNow } from 'date-fns';
import { useNavigate } from "react-router";
import { errorToast, successToast, warningToast } from '../../lib/toast';

const Home = () => {
  const {getAllVideos, videoLoading} = useVideo();
  const [allVideos, setAllVideos] = useState([]);
  let navigate = useNavigate();
  const getVideos = () => {
    getAllVideos((res, err) => {
      if(err){
        errorToast("Error loading Videos");
        return;
      }
      setAllVideos(res.data);
    });
  }

  useEffect(() => {
    getVideos();
  }, []);
  
  return (
    <div className={styles.main_container}>
      {(allVideos.length == 0) ? (
        <LoadingScreen/>
      ) : (
        allVideos.filter((video) => video.isPublished).map((video) => (
          <div key={video._id} className={styles.video} onClick = {()=> navigate(`/videos/${video._id}`)}>
            <img src={video.thumbnail ? video.thumbnail : "defaultThumbnail.png"} alt="thumbnail" />
            <div className={styles.channel}>
              <img src={video.owner.avatar} alt="avatar" />
              <p>{video.title}</p>
            </div>
            <div className={styles.details}>
              <div className={styles.det1}>
                <p>{new Intl.NumberFormat('en', { notation: 'compact' }).format(video.views)} views</p>
                <p>{video.owner.username}</p>
              </div>
              <div className={styles.det1}>
                <p>{formatDistanceToNow(video.createdAt, { addSuffix: true })}</p>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  )
}

export default Home