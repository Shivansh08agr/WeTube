import mongoose, { isValidObjectId } from "mongoose";
import { Playlist } from "../models/playlist.model.js";
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Video } from "../models/video.model.js";


const getUserPlaylists = asyncHandler(async(req,res)=>{
    //**//
    const {userId} = req.user._id;

    if(!userId){
        throw new apiError(401,"Unauthorized access")
    }
    const playlist = await Playlist.aggregate([
        {
            $match:{owner : new mongoose.Types.ObjectId(`${userId}`)}
        },
        {
            $lookup:{
                from:"videos",
                localField:"video",
                foreignField:"_id",
                as:"video"
            }
        }
    ])

    if (!playlist?.length) {
        throw new apiError(404,"playlist not found")
    }

    return res.status(200).json(new apiResponse(200,playlist, "playlist fetched"));

});

const createPlaylist = asyncHandler(async (req, res) => {
  const { name, description } = req.body;
  if (!name) throw new apiError(400, "Playlist must have a name");

  let playlist= await Playlist.findOne(
    {
        name
    }
  );
  if (playlist)
    throw new apiError(400, "Playlist already exists.");

  playlist = await Playlist.create({
    name,
    description: description || "",
  });
  if (!playlist)
    throw new apiError(500, "An error occured while creating the playlist.");
  playlist.owner = req?.user._id;

  await playlist.save();

  return res
    .status(200)
    .json(new apiResponse(200, playlist, "Playlist has successfully been created."));
});

const addVideoToPlaylist = asyncHandler(async (req, res) => {
  const { playlistId, videoId } = req.params;
  
  const playlist = await Playlist.findById(playlistId);
  const video = await Video.findById(videoId);

  if(!playlist) throw new apiError(400, "No such playlist exists.");
  if(!video) throw new apiError(400, "No such video exists.");

  if(!playlist.video?.includes(videoId)){
    await playlist.video.push(videoId);
    await playlist.save();
  };

  if(!playlist.video?.includes(videoId)){
    throw new apiError(500, "Something went wrong while adding the video to the playlist.");
  };

  return res
        .status(200)
        .json(new apiResponse(200, playlist, "Video has successfully been added to the playlist."));
});

const getPlaylistById = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;

  const playlist = await Playlist.findById(playlistId);
  if(!playlist) throw new apiError(400, "No such playlist exists.");
  const showPlaylistVideos = await playlist.populate("video");

  if(!showPlaylistVideos || showPlaylistVideos.length === 0) {
    return res
        .status(200)
        .json(new apiResponse(200, {}, "This is an empty playlist"));
  }

  return res
    .status(200)
    .json(new apiResponse(200, showPlaylistVideos, "Playlist has successfully been fetched"));
});

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
  const { playlistId, videoId } = req.params;
  const playlist = await Playlist.findById(playlistId);
  const video = await Video.findById(videoId);

  if(!playlist) throw new apiError(400, "No such playlist exists.");
  if(!video) throw new apiError(400, "No such video exists.");

  playlist.video = playlist.video.filter(vId=> vId.toString() !== videoId);
  await playlist.save();

  if(playlist.video.includes(videoId)) throw new apiError(500, "Something went wrong while removing the video from the playlist.")

  return res
    .status(200)
    .json(new apiResponse(200, playlist, "Video has successfully been removed from the playlist."));
});

const deletePlaylist = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;

  const playlist = await Playlist.findById(playlistId);
  if(!playlist) throw new apiError(400, "No such playlist exists.");

  const deletedPlaylist = await playlist.deleteOne();

  if(deletedPlaylist.acknoledged === false) throw new apiError(500, "Something went wrong while deleting the playlist.");

  return res
    .status(200)
    .json(new apiResponse(200, {"is playlist deleted: ": deletedPlaylist.acknoledged}, "Playlist has been deleted."));
});

const updatePlaylist = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;
  const { name, description } = req.body;
  
  if(
    [name, description].some(field=> field?.trim()=== "")
  ) new apiResponse(200, {}, "No changes were made");

  const playlist = await Playlist.findById(playlistId);
  if(!playlist) throw new apiError(400, "No such playlist exists.");

  if(name) playlist.name = name;
  if(description) playlist.description = description;

  await playlist.save();

  return res
    .status(200)
    .json(new apiResponse(200, playlist, "Playlist has been updated."));
});

export {
  createPlaylist,
  getUserPlaylists,
  getPlaylistById,
  addVideoToPlaylist,
  removeVideoFromPlaylist,
  deletePlaylist,
  updatePlaylist,
};
