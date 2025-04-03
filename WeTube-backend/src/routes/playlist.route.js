import { Router } from "express";
import verifyJWT from "../middlewares/auth.middleware.js";
import {
  addVideoToPlaylist,
  createPlaylist,
  deletePlaylist,
  getPlaylistById,
  getUserPlaylists,
  removeVideoFromPlaylist,
  updatePlaylist,
} from "../controllers/playlist.controller.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

router
    .route("/")
    .get(verifyJWT, upload.none(), getUserPlaylists);

router
    .route("/create-playlist")
    .post(verifyJWT, upload.none(), createPlaylist);

router
    .route("/update-playlist/:playlistId")
    .post(verifyJWT, upload.none(), updatePlaylist);

router
    .route("/delete-playlist/:playlistId")
    .post(verifyJWT, deletePlaylist);

router
    .route("/:playlistId")
    .get(verifyJWT, getPlaylistById);

router
  .route("/add-video-to-playlist/:videoId/:playlistId")
  .post(verifyJWT, upload.none(), addVideoToPlaylist);

router
  .route("/remove-video-from-playlist/:videoId/:playlistId")
  .post(verifyJWT, upload.none(), removeVideoFromPlaylist);

export default router;
