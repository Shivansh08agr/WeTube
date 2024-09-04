import { Like } from "../models/like.model.js";
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Video } from "../models/video.model.js";
import { Comment } from "../models/comment.model.js";
import { Tweet } from "../models/tweet.model.js";

const toggleVideoLike = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const video = Video.findById(videoId);
  if (!video) throw new apiError(400, "No such video exists.");

  let videoLiked;
  const isLiked = await Like.findOne({
    video: videoId,
    likedBy: req.user?._id,
  });

  if (!isLiked) {
    const like = await Like.create({
      video: videoId,
      likedBy: req.user?._id,
    });
    if (!like)
      throw new apiError(500, "An error occured while liking the video.");
    videoLiked = true;
  } else {
    await Like.findByIdAndDelete(isLiked._id);
    videoLiked = false;
  }

  return res
    .status(200)
    .json(new apiResponse(200, videoLiked, videoLiked? "Video has successfully been liked" : "User's like in video has successfully been removed"));
});

const toggleCommentLike = asyncHandler(async (req, res) => {
  const { commentId } = req.params;
  const comment  = await Comment.findById(commentId);
  if(!comment) throw new apiError(400, "No such comment exists.");

  let isCommentLiked;

  const isLiked = await Like.findOne(
    {
        comment: commentId,
        likedBy: req.user?._id
    }
  )

  if(!isLiked){
    const like = await Like.create(
        {
            comment: commentId,
            likedBy: req.user?._id
        }
    )
    if(!like) throw new apiError(500, "An error occured while liking the video.");

    isCommentLiked = true;
  }
  else{
    await Like.findByIdAndDelete(isLiked._id);
    isCommentLiked = false;
  }
   
  return res
    .status(200)
    .json(new apiResponse(200, isCommentLiked, isCommentLiked? "Comment has successfully been liked" : "User's like in comment has successfully been removed"));
});

const toggleTweetLike = asyncHandler(async (req, res) => {
  const { tweetId } = req.params;
  const tweet = await Tweet.findById(tweetId);
  if(!tweet) throw new apiError(400, "No such tweet exists.");

  let isTweetLiked;
  const isLiked = await Like.findOne(
    {
        tweet: tweetId,
        likedBy: req.user?._id
    }
  );
  if(!isLiked){
    const like = await Like.create(
        {
            tweet: tweet.id,
            likedBy: req.user?._id
        }
    );

    if(!like) throw new apiError(500, "An error occured while saving the Like for the user.")
    isTweetLiked = true;
  }
  else{
    await Like.findByIdAndDelete(isLiked._id);
    isTweetLiked = false;
  }

  return res
    .status(200)
    .json(new apiResponse(200, isTweetLiked, isTweetLiked? "Tweet has successfully been liked." : "User's like on Tweet has successfully been removed."))
});

const getLikedVideos = asyncHandler(async (req, res) => {
  
    const likedVideos = await Like.find({
      likedBy: req.user?._id,
      video: { $ne: null }
    }).populate("video");
  
    if (!likedVideos || likedVideos.length === 0) {
      return res.status(200).json(new apiResponse(200, [], "No liked videos found"));
    }

    return res.status(200).json(new apiResponse(200, likedVideos, "Liked videos fetched successfully"));
  });

export { toggleCommentLike, toggleTweetLike, toggleVideoLike, getLikedVideos };
