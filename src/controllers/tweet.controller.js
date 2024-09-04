import { Tweet } from "../models/tweet.model.js";
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createTweet = asyncHandler(async (req, res) => {
  const { content } = req.body;

  if (!content) throw new apiError(400, "Content is required.");
  const tweet = await Tweet.create({
    owner: req.user._id,
    content,
  });
  await tweet.save();

  if (!tweet)
    throw new apiError(500, "An error occured while creating a tweet.");
  return res
    .status(200)
    .json(new apiResponse(200, tweet, "Tweet has successfully been created."));
});

const getUserTweets = asyncHandler(async (req, res) => {
  const tweets = await Tweet.aggregate([
    {
      $match: {},
    },
    {
      $lookup: {
        from: "users",
        localField: "owner",
        foreignField: "_id",
        as: "owner",
        pipeline: [
          {
            $project: {
              username: 1,
              fullName: 1,
              avatar: 1,
            },
          },
        ],
      },
    },
  ]);

  if (!tweets) {
    throw new apiError(400, "Error while fetching tweets");
  }

  return res
    .status(200)
    .json(new apiResponse(200, tweets, "All tweets fetched"));
});

const updateTweet = asyncHandler(async (req, res) => {
  const { content } = req.body;
  const { tweetId } = req.params;

  const tweet = await Tweet.findById(tweetId);
  if (!tweet) throw new apiError(400, "No such tweet exists");

  if (!content || content.trim() === "") {
    return res
      .status(200)
      .json(new apiResponse(200, tweet, "No changes were made."));
  }

  tweet.content = content;
  await tweet.save();

  return res
    .status(200)
    .json(new apiResponse(200, tweet, "Tweet has successfully been updated."));
});

const deleteTweet = asyncHandler(async (req, res) => {
  const { tweetId } = req.params;

  const tweet = await Tweet.findById(tweetId);
  if (!tweet) throw new apiError(400, "No such tweet exists");

  const deletedTweet = await tweet.deleteOne();
  if (!deletedTweet.deletedCount)
    throw new apiError(500, "An error occured while deleting the tweet.");

  return res
    .status(200)
    .json(
      new apiResponse(200, deletedTweet, "Tweet has successfully been deleted.")
    );
});

export { createTweet, getUserTweets, updateTweet, deleteTweet };
