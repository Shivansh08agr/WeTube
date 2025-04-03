import React, { useState } from "react";
import "video-react/dist/video-react.css";
import useVideo from "../../api/useVideo";
import { useNavigate } from "react-router-dom";
import { errorToast } from "../../lib/toast";
import styles from "./UploadVideo.module.scss";

const UploadVideo = () => {
  const { uploadVideo } = useVideo();
  const navigate = useNavigate();
  const [thumbnail, setThumbnail] = useState(null);
  const [videos, setVideos] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
  });

  function handleThumbnailChange(e) {
    const file = e.target.files[0];
    if (file) {
      setThumbnail(file);
    }
  }

  function handleVideoChange(e) {
    const file = e.target.files[0];
    if (file) {
      setVideos(file);
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
    if (!thumbnail || !videos) {
      errorToast("Please upload both a thumbnail and a video.");
      return;
    }

    const payload = new FormData();
    payload.append("title", formData.title);
    payload.append("description", formData.description);
    payload.append("thumbnail", thumbnail);
    payload.append("video", videos);

    uploadVideo(payload, (res, err) => {
      if (err) {
        errorToast("Error uploading video.");
        return;
      }
      navigate("/");
    });
  }

  return (
    <div className={styles.UploadVideo}>
      <h1>Upload your video</h1>
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

        <label htmlFor="videoFile">
          Upload your video
        </label>
        <input
          type="file"
          id="videoFile"
          accept="video/*"
          onChange={handleVideoChange}
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

        <button type="submit">Upload</button>
      </form>
    </div>
  );
};

export default UploadVideo;
