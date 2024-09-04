import { Router } from "express";
import verifyJWT from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import { createTweet, deleteTweet, getUserTweets, updateTweet } from "../controllers/tweet.controller.js";

const router = Router();

router
    .route('/create-tweet')
    .post(
        verifyJWT,
        upload.none(),
        createTweet
    );
router
    .route('/update-tweet/:tweetId')
    .post(
        verifyJWT,
        upload.none(),
        updateTweet
    );
router
    .route('/delete-tweet/:tweetId')
    .post(
        verifyJWT,
        deleteTweet
    );
router
    .route('/get-user-tweets')
    .get(
        verifyJWT,
        getUserTweets
    );

export default router;