import React, { useState } from "react";
import styles from "./Register.module.scss";
import { Link, useNavigate } from "react-router-dom";
import useUser from "../../api/useUser";

const Register = () => {
  const { register, userLoading } = useUser();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "",
    username: "",
    email: "",
    password: "",
  });
  const [avatar, setAvatar] = useState({
    file: null,
    url: "",
  });
  const [coverImage, setCoverImage] = useState({
    file: null,
    url: "",
  });

  function handleAvatar(e) {
    if (e.target.files[0]) {
      setAvatar({
        file: e.target.files[0],
        url: URL.createObjectURL(e.target.files[0]),
      });
    }
  }

  function handleCoverImage(e) {
    if (e.target.files[0]) {
      setCoverImage({
        file: e.target.files[0],
        url: URL.createObjectURL(e.target.files[0]),
      });
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
    const payload = {
      ...formData,
      avatar: avatar.file,
      coverImage: coverImage.file,
    };
    register(payload, (res, err) => {
      if (err) {
        console.error("Error registering user:", err);
        return;
      }
      navigate("/login");
    });
  }

  return (
    <div className={styles.register}>
      <form onSubmit={handleSubmit}>
        <label htmlFor="file">
          <img src={avatar.url || "/assets/defaultAvatar.png"} alt="Avatar" />
          Upload an avatar
        </label>
        <input
          type="file"
          id="file"
          style={{ display: "none" }}
          onChange={handleAvatar}
        />
        <input
          type="text"
          placeholder="Full Name"
          name="fullName"
          value={formData.fullName}
          onChange={handleChange}
        />
        <input
          type="text"
          placeholder="Username"
          name="username"
          value={formData.username}
          onChange={handleChange}
        />
        <input
          type="text"
          placeholder="Email"
          name="email"
          value={formData.email}
          onChange={handleChange}
        />
        <input
          type="password"
          placeholder="password (min 6 characters)"
          name="password"
          value={formData.password}
          onChange={handleChange}
        />
        <label htmlFor="coverImage" className={styles.coverImageDisplay}>
          <img src={coverImage.url || "/assets/coverImage.png"} alt="Cover" />
          Upload a cover image
        </label>
        <input
          type="file"
          id="coverImage"
          style={{ display: "none" }}
          onChange={handleCoverImage}
        />
        <button type="submit" disabled={userLoading}>
          {userLoading ? "Signing up..." : "Sign up"}
        </button>
        <p>
          Already a user?{" "}
          <Link to="/login" className={styles.already_a_member}>
            Sign in
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Register;