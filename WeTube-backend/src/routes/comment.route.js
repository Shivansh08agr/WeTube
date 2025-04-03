import { Router } from "express";
import verifyJWT from "../middlewares/auth.middleware.js";
import { addComment, deleteComment, getVideoComments, updateComment } from "../controllers/comment.controller.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

router.route("/:videoId").get(getVideoComments);

router.route('/add-comment/:videoId').post(
    verifyJWT,
    upload.none(),
    addComment
);

router.route('/update-comment/:commentId').patch(
    verifyJWT,
    upload.none(),
    updateComment
);

router.route('/delete-comment/:commentId').post(
    verifyJWT,
    upload.none(),
    deleteComment
);

export default router;