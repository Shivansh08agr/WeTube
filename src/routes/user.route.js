import { Router } from "express";
import {
  loginUser,
  registerUser,
  logoutUser,
  refreshAccessToken,
  updateAvatar,
  changeCurrentPassword,
  getCurrentUser,
  updateAccountDetails,
  updateCoverImage,
  getUserChannelProfile,
  getWatchHistory,
  addToWatchHistory,
} from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import verifyJWT from "../middlewares/auth.middleware.js";
const router = Router();

router.route("/register").post(
  upload.fields([
    {
      name: "avatar",
      maxCount: 1,
    },
    {
      name: "coverImage",
      maxCount: 1,
    },
  ]),
  registerUser
);

router.route("/login").post(loginUser);

router.route("/logout").post(verifyJWT, logoutUser);

router.route("/refresh-token").post(refreshAccessToken);

router.route("/change-password").post(verifyJWT, upload.none(), changeCurrentPassword);

router.route("/current-user").get(verifyJWT, getCurrentUser);

router.route("/update-account").post(verifyJWT,  upload.none(), updateAccountDetails); //upload.none() is very important

router.route("")

router.route("/avatar").patch(
  upload.single("avatar"),
  verifyJWT,
  updateAvatar
);

router.route("/coverImage").patch(
  verifyJWT,
  upload.single("coverImage"),
  updateCoverImage
);

router.route("/c/:username").get(verifyJWT, getUserChannelProfile);

router.route("/watch-history").get(verifyJWT, getWatchHistory);

router.route("/add-to-watch-history").post(verifyJWT, addToWatchHistory);

export default router;
