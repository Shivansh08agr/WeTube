import mongoose, { isValidObjectId } from "mongoose";
import { Video } from "../models/video.model.js";
import { User } from "../models/user.model.js";
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { deleteFromCloudinary, uploadOnCloudinary } from "../utils/cloudinary.js";

const getUserUploadedVideos = asyncHandler(async (req, res) => {
  const userId = req.user?._id;

  if (!userId) {
    throw new apiError(400, "User ID is required");
  }

  const videos = await Video.find({ owner: userId })
    .populate("owner", "username avatar subscribersCount")
    .sort({ createdAt: -1 }); // Sort by newest first

  if (!videos || videos.length === 0) {
    return res
      .status(200)
      .json(new apiResponse(200, [], "No videos uploaded by this user"));
  }

  return res
    .status(200)
    .json(new apiResponse(200, videos, "User uploaded videos fetched successfully"));
});

const getAllVideos = asyncHandler(async (req, res) => {
  //**//
  const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query;

  let sortCriteria = {}
  let videoQuery = {}

  if (userId) {
      videoQuery.userId = userId
  }

  if (query) {
      videoQuery.$or = [
          { title: { $regex: query, $options: 'i' } },
          { description: { $regex: query, $options: 'i' } }
      ]
  }
  
  if (sortBy && sortType) {
      sortCriteria[sortBy] = sortType === "desc" ? -1 : 1;
  }
  
  const videos = await Video.find(videoQuery)
  .sort(sortCriteria)
  .skip((page - 1) * limit)
  .limit(limit)
  .populate('owner', 'username avatar subsribersCount');
  
  if (!videos) {
      throw new apiError(400, "error while fetching all videos")
  }
  
  return res.status(200).json(new apiResponse(200, videos, "videos fetched"))
});

const publishAVideo = asyncHandler(async (req, res) => {
  const { title, description } = req.body;

  if ([title, description].some((field) => field.trim() === "")) {
    throw new apiError(400, "Title and Description are required");
  }

  let videoLocalField;
  let thumbnailLocalField;

  if (
    req.files &&
    Array.isArray(req.files.video) &&
    req.files.video.length > 0
  ) {
    videoLocalField = req.files.video[0]?.path;
  }

  if (
    req.files &&
    Array.isArray(req.files.thumbnail) &&
    req.files.thumbnail.length > 0
  ) {
    thumbnailLocalField = req.files.thumbnail[0]?.path;
  }

  console.log(req.files);
  const videoPublished = await uploadOnCloudinary(videoLocalField);
  const thumbnail = await uploadOnCloudinary(thumbnailLocalField);

  if (!videoPublished)
    throw new apiError(500, "An error occured while uploading the file.");

  if (!thumbnail)
    throw new apiError(500, "An error occured while uploading the file.");

  //   console.log(videoPublished);
  const video = await Video.create({
    title,
    description,
    videoFile: videoPublished.url,
    thumbnail: thumbnail.url,
    duration: videoPublished.duration,
  });
  video.owner = req.user?._id;
  video.save();
  return res
    .status(200)
    .json(new apiResponse(200, video, "Video has successfully been uploaded."));
});

const getVideoById = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  if (!videoId) throw new apiError(400, "No video Id was found.");
  const video = await Video.findById(videoId).populate('owner', 'username avatar');
  console.log(video);
  if (video=== null) throw new apiError(400, "Invalid video Id");

  return res.status(200).json(new apiResponse(200, video, "Video was found."));
});

const updateVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const { title, description } = req.body;
  let thumbnailLocalFile;
  if (
    req.file
  ) {
    thumbnailLocalFile = req.file.path;
  }
console.log(req.file);
  if (!(title || description || thumbnailLocalFile))
    throw new apiError(400, "No changes were made.");

  const video = await Video.findById(videoId);

  if (!video) {
    throw new apiError(400, "Invalid video Id");
  }
// console.log(thumbnailLocalFile, req.file.thumbnail)
  if (title) video.title = title;
  if (description) video.description = description;
  if (thumbnailLocalFile) {
    const thumbnail = await uploadOnCloudinary(thumbnailLocalFile);
    if (!thumbnail) throw new apiError(500, "An error occurred while uploading the thumbnail.");
    video.thumbnail = thumbnail.url;
  }
// console.log(video);
  await video.save();

  return res
    .status(200)
    .json(
      new apiResponse(
        200,
        video,
        "Video details have successfully been updated"
      )
    );
});

const deleteVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  const video = await Video.findById(videoId);

  if(!video) throw new apiError(400, "No such video exists");
  await deleteFromCloudinary(video.thumbnail);
  await deleteFromCloudinary(video.videoFile);

  await video.deleteOne();

  return res
    .status(200)
    .json(new apiResponse(200, "Video has been deleted successfully"));
});

const togglePublishStatus = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const video = await Video.findById(videoId);
  if(!video) throw new apiError(400, "No such video was found");
  video.isPublished = !video.isPublished;
  await video.save();
  return res
    .status(200)
    .json(new apiResponse(200, video, video.isPublished? "Video has been successfully published." : "Video has been successfully unpublished."));
});

const checkVideoPublishStatus = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  if (!videoId) {
    throw new apiError(400, "Video ID is required");
  }

  const video = await Video.findById(videoId).select("isPublished");

  if (!video) {
    throw new apiError(404, "Video not found");
  }

  return res
    .status(200)
    .json(new apiResponse(200, { isPublished: video.isPublished }, "Video publish status fetched successfully"));
});

const incrementVideoViews = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  if (!videoId) {
    throw new apiError(400, "Video ID is required");
  }

  const video = await Video.findByIdAndUpdate(
    videoId,
    { $inc: { views: 1 } }, // Increment the views field by 1
    { new: true } // Return the updated document
  );

  if (!video) {
    throw new apiError(404, "Video not found");
  }

  return res
    .status(200)
    .json(new apiResponse(200, video, "Video views incremented successfully"));
});

export {
  getAllVideos,
  publishAVideo,
  getVideoById,
  updateVideo,
  deleteVideo,
  togglePublishStatus,
  getUserUploadedVideos,
  incrementVideoViews,
  checkVideoPublishStatus,
};
