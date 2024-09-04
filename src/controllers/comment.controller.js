import mongoose from "mongoose";
import { Comment } from "../models/comment.model.js";
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Video } from "../models/video.model.js";

const getVideoComments = asyncHandler(async(req,res)=>{
  //**//
  const {videoId} = req.params;

  if (!videoId) {
      throw new apiError(400,"video id is missing")
  }

  const comments = await Comment.aggregate([
      {
          $match:{video: new mongoose.Types.ObjectId(`${videoId}`)}
      },
      {
          $lookup:{
              from:"users",
              localField:"owner",
              foreignField:"_id",
              as:"owner",
              pipeline:[
                  {
                      $project:{
                          username:1,
                          fullName:1,
                          avatar:1
                      }
                  }
              ]
          }
      }
  ])

  if(!comments){
      throw new apiError(404,"comments not found")
  }

  return res.status(200).json(new apiResponse(200,comments,"comments fetched successfully"))
})

const addComment = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const {content} = req.body;
  const CommentOwnerId = req.user?._id;

  if(!CommentOwnerId) throw new apiError(401, "User is Unauthorised.");
  if(!content || content.trim() === "") throw new apiError(400, "No comment was provided");

  const video = await Video.findById(videoId);
  if(!video) throw new apiError(400, "No such video exists");

  const comment = await Comment.create(
    {
        content : content.trim(),
        video: videoId,
        owner: CommentOwnerId
    }
  );

  if(!comment) throw new apiError(500, "An error occured while adding the comment.");

  return res
    .status(200)
    .json(new apiResponse(200, "Comment has successfully been added."));
});

const updateComment = asyncHandler(async (req, res) => {
  const {commentId} = req.params;
  const {content} = req.body;

  if(!content) throw new apiError(400, "No comment was provided.");
  const comment = await Comment.findById(commentId);
  if(!comment) throw new apiError(400, "Couldn't find any such comment.");

  comment.content = content.trim();
  const savedComment = await comment.save();

  if(!savedComment) throw new apiError(500, "Something went wrong while updating the comment.")

  return res
    .status(200)
    .json(new apiResponse(200, comment, "Comment has successfully been updated."))
});

const deleteComment = asyncHandler(async (req, res) => {
  const {commentId} = req.params;
  const comment = await Comment.findById(commentId);

  if(!comment) throw new apiError(400, "No such comment exists");

  const deletedComment = await comment.deleteOne();
  if(!deletedComment) throw new apiError(500, "Something went wrong while deleting the comment.");

  return res
    .status(200)
    .json(new apiResponse(200, "Comment has successfully been deleted."));
});

export { getVideoComments, addComment, updateComment, deleteComment };
