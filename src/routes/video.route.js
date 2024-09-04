import { Router } from "express";
import {
  deleteVideo,
  getAllVideos,
  getVideoById,
  publishAVideo,
  togglePublishStatus,
  updateVideo,
} from "../controllers/video.controller.js";
import verifyJWT from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

router.route("/").get(getAllVideos);

router.route("/publish-video").post(
  verifyJWT,
  upload.fields([
    {
      name: "video",
      maxCount: 1,
    },
    {
      name: "thumbnail",
      maxCount: 1,
    },
  ]),
  publishAVideo
);

router.route("/c/:videoId").get(getVideoById);

router
  .route("/update-video/:videoId")
  .patch(
    verifyJWT,
    upload.single("thumbnail") || upload.none(),
    updateVideo
  );

router.route("/delete-video/:videoId").post(verifyJWT, deleteVideo);

router.route("/toggle-publish-status/:videoId").get(verifyJWT, togglePublishStatus);

export default router;
