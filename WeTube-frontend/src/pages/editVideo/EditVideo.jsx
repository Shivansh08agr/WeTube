import React, { useEffect, useState } from "react";
import useVideo from "../../api/useVideo";
import { useNavigate, useParams } from "react-router-dom";
import { errorToast } from "../../lib/toast";
import styles from "./EditVideo.module.scss";

const EditVideo = () => {
  const { getVideoById, videoLoading, updateVideo } = useVideo();
  const { videoId } = useParams();
  const navigate = useNavigate();
  const [thumbnail, setThumbnail] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
  });

  function handleThumbnailChange(e) {
    console.log(e.target.files);
    const file = e.target.files[0];
    if (file) {
      setThumbnail(file);
    }
  }

  function handleChange(e) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  }

  function handleSubmit(e) {
    e.preventDefault();
    const payload = new FormData();
    payload.append("title", formData.title);
    payload.append("description", formData.description);
    if (thumbnail) {
      payload.append("thumbnail", thumbnail);
    }
    updateVideo(videoId, payload, (res, err) => {
      if (err) {
        errorToast("Error updating video details.");
        return;
      }
    });
    navigate(-1);
  }

  function getVideo() {
    getVideoById(videoId, (res, err) => {
      if (err) {
        errorToast("Error fetching video details.");
        return;
      }
      setFormData({
        title: res.data.title || "",
        description: res.data.description || "",
      });
    });
  }

  useEffect(() => {
    getVideo();
  }, []);

  return (
    <div className={styles.EditVideo}>
      <form onSubmit={handleSubmit}>
      <label htmlFor="thumbnail">
          Upload video thumbnail
        </label>
        <input
          type="file"
          id="thumbnail"
          accept="image/*"
          onChange={handleThumbnailChange}
        />
        <input
          type="text"
          placeholder="Title"
          name="title"
          value={formData.title}
          onChange={handleChange}
        />
        <input
          type="text"
          placeholder="Description"
          name="description"
          value={formData.description}
          onChange={handleChange}
        />
        <button type="submit">Update</button>
      </form>
    </div>
  );
};

export default EditVideo;