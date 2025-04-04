import React, { useEffect, useState } from "react";
import styles from "./Profile.module.scss";
import { useUser } from "../../api";
import LoadingScreen from "./../../components/loadingScreen/LoadingScreen";
import { errorToast } from "../../lib/toast";
import { useDispatch } from "react-redux";
import { updateUser } from "../../store/reducers/userSlice";

const Profile = () => {
  const [user, setUser] = useState(null);
  const { userLoading, getCurrentUser, updateAvatar, updateCoverImage, updateUserDetails, changePassword } = useUser();
  const [avatar, setAvatar] = useState({
    file: null,
    url: "",
  });
  const [coverImage, setCoverImage] = useState({
    file: null,
    url: "",
  });
  const [editingField, setEditingField] = useState(null);
  const [formData, setFormData] = useState({
    fullName: "",
    username: "",
    email: "",
    oldPassword: "",
    newPassword: "",
  });
  const dispatch = useDispatch();

  const handleOpenCurrentProfile = () => {
    getCurrentUser((res, err) => {
      if (err) {
        errorToast("Error getting profile details");
        return;
      }
      setUser(res.data);
      setFormData({
        fullName: res.data.fullName || "",
        username: res.data.username || "",
        email: res.data.email || "",
      });
    });
  };

  const handleAvatar = (e) => {
    if (e.target.files[0]) {
      const file = e.target.files[0];
      setAvatar({
        file: file,
        url: URL.createObjectURL(file),
      });

      const payload = {
        avatar: file,
      };

      updateAvatar(payload, (res, err) => {
        if (err) {
          errorToast("Error updating avatar");
          return;
        }
        setUser((prevUser) => ({
          ...prevUser,
          avatar: res.data.avatar,
        }));
        dispatch(updateUser({ avatar: res.data.avatar }));
      });
    }
  };

  const handleCoverImage = (e) =>{
    if (e.target.files[0]) {
      const file = e.target.files[0];
      setCoverImage({
        file: file,
        url: URL.createObjectURL(file),
      });

      const payload = {
        coverImage: file,
      };

      updateCoverImage(payload, (res, err) => {
        if (err) {
          errorToast("Error updating cover image");
          return;
        }
        setUser((prevUser) => ({
          ...prevUser,
          coverImage: res.data.coverImage,
        }));
        dispatch(updateUser({ coverImage: res.data.coverImage }));
      });
    }
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = (field) => {
    if (field === "password") {
      if (!formData.oldPassword || !formData.newPassword) {
        errorToast("Both old and new passwords are required");
        return;
      }
      const payloadd = {
        oldPassword: formData.oldPassword,
        newPassword: formData.newPassword,
      };
      changePassword(payloadd, (res, err)=> {
        if(err){
          errorToast(`Error updating ${field}`)
          return;
        };
      })
    } else {
      const payload = {
        [field]: formData[field]
      }
      updateUserDetails(payload, (res, err)=>{
        if(err){
          errorToast(`Error updating ${field}`)
          return;
        };
      })
    }
    setEditingField(null);
  };

  useEffect(() => {
    handleOpenCurrentProfile();
  }, []);

  return userLoading ? (
    <LoadingScreen />
  ) : (
    <div className={styles.profile}>
      <div className={styles.container}>
        <label htmlFor="file" className={styles.forImage}>
          <img src={avatar?.url || user?.avatar} alt="Avatar" />
          Update Avatar
        </label>
        <input
          type="file"
          id="file"
          style={{ display: "none" }}
          onChange={handleAvatar}
        />
        <div className={styles.update}>
          <label htmlFor="fullName">Full Name:</label>
          <input
            type="text"
            placeholder="Full Name"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            readOnly={editingField !== "fullName"}
          />
          {editingField === "fullName" ? (
            <img
              src="/assets/save.svg"
              alt="Save"
              onClick={() => handleSave("fullName")}
              className={styles.icon}
            />
          ) : (
            <img
              src="/assets/edit.svg"
              alt="Edit"
              onClick={() => setEditingField("fullName")}
              className={styles.icon}
            />
          )}
        </div>
        <div className={styles.update}>
        <label htmlFor="username">User Name:</label>
          <input
            type="text"
            placeholder="Username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            readOnly={editingField !== "username"}
          />
          {editingField === "username" ? (
            <img
              src="/assets/save.svg"
              alt="Save"
              onClick={() => handleSave("username")}
              className={styles.icon}
            />
          ) : (
            <img
              src="/assets/edit.svg"
              alt="Edit"
              onClick={() => setEditingField("username")}
              className={styles.icon}
            />
          )}
        </div>
        <div className={styles.update}>
        <label htmlFor="email">Email:</label>
          <input
            type="text"
            placeholder="Email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            readOnly={editingField !== "email"}
          />
          {editingField === "email" ? (
            <img
              src="/assets/save.svg"
              alt="Save"
              onClick={() => handleSave("email")}
              className={styles.icon}
            />
          ) : (
            <img
              src="/assets/edit.svg"
              alt="Edit"
              onClick={() => setEditingField("email")}
              className={styles.icon}
            />
          )}
        </div>
        <div className={styles.updatePassword}>
          {editingField === "password" ? (
            <>
              <input
                type="password"
                placeholder="Old Password"
                name="oldPassword"
                value={formData.oldPassword}
                onChange={handleChange}
              />
              <div>
                <input
                  type="password"
                  placeholder="New Password"
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleChange}
                />
                <img
                  src="/assets/save.svg"
                  alt="Save"
                  onClick={() => handleSave("password")}
                  className={styles.icon}
                />
              </div>
            </>
          ) : (
            <div className={styles.visible}>
              <label htmlFor="password">Password:</label>
              <input
                type="password"
                name="password"
                placeholder="Password"
                value="********"
                readOnly
              />
              <img
                src="/assets/edit.svg"
                alt="Edit"
                onClick={() => setEditingField("password")}
                className={styles.icon}
              />
            </div>
          )}
        </div>
        <label htmlFor="coverfile" className={styles.coverImageDisplay}>
          <img src={coverImage?.url || user?.coverImage} alt="Cover Image" />
          Update Cover Image
        </label>
        <input
          type="file"
          id="coverfile"
          name="coverFile"
          style={{ display: "none" }}
          onChange={handleCoverImage}
        />
      </div>
    </div>
  );
};

export default Profile;