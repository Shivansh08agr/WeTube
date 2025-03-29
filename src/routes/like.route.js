import { Router } from "express";
import verifyJWT from "../middlewares/auth.middleware.js";
import { getLikedVideos, getVideoLikedStatus, toggleCommentLike, toggleTweetLike, toggleVideoLike } from "../controllers/like.controller.js";

const router = Router();

router.route('/toggle-video-like/:videoId').post(
    verifyJWT,
    toggleVideoLike
);

router.route('/get-video-liked-status/:videoId').get(
    verifyJWT,
    getVideoLikedStatus
);

router.route('/toggle-comment-like/:commentId').post(
    verifyJWT,
    toggleCommentLike
);

router.route('/toggle-tweet-like/:commentId').post(
    verifyJWT,
    toggleTweetLike
);

router.route('/get-liked-videos').get(
    verifyJWT,
    getLikedVideos
);

export default router;