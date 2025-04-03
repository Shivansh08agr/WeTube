import { User } from "../models/user.model.js";
import { Subscription } from "../models/subscription.model.js";
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const toggleSubscription = asyncHandler(async (req, res) => {
  const { channelId } = req.params;
  const channel = await User.findById(channelId);
  if (!channel) throw new apiError(400, "No such channel exists.");

  let isSubscribed = await Subscription.findOne({
    subscriber: req.user._id,
    channel: channelId,
  });
  let isChannelSubscribed;
  if (!isSubscribed) {
    isSubscribed = await Subscription.create({
      subscriber: req.user._id,
      channel: channelId,
    });
    isChannelSubscribed = true;
    if (!isSubscribed)
      throw new apiError(
        500,
        "Something went wrong while subscribing the channel."
      );
  } else {
    const deleteResult = await isSubscribed.deleteOne();
    isChannelSubscribed = false;
    if (!deleteResult.deletedCount)
      throw new apiError(
        500,
        "Something went wrong while unsubscribing the channel."
      );
  }

  return res
    .status(200)
    .json(
      new apiResponse(
        200,
        { isChannelSubscribed },
        isChannelSubscribed
          ? "Channel has successfully been Subscribed"
          : "Channel has successfully been Unsubscribed"
      )
    );
});

const getUserChannelSubscribers = asyncHandler(async (req, res) => {
  const { channelId } = req.params;

  const channel = await User.findById(channelId);
  if (!channel) throw new apiError(400, "No such channel exists.");

  const channelSubscribers = await Subscription.aggregate([
    { $match: { channel: new mongoose.Types.ObjectId(`${channelId}`) } },
    {
      $lookup: {
        from: "users",
        localField: "subscriber",
        foreignField: "_id",
        as: "subscriber",
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
    {
      $project: {
        subscriber: 1,
        createdAt: 1,
      },
    },
  ]);

  return res
    .status(200)
    .json(
      new apiResponse(200, channelSubscribers, "Channel's subscribers fetched")
    );
});

const getSubscribedChannels = asyncHandler(async (req, res) => {
  const { channelId } = req.params;

  const channel = await User.findById(channelId);
  if (!channel) throw new apiError(400, "No such channel exists.");

  const subscribedChannels = await Subscription.aggregate([
    {
      $match: { subscriber: new mongoose.Types.ObjectId(`${channelId}`) },
    },
    {
      $lookup: {
        from: "users",
        localField: "channel",
        foreignField: "_id",
        as: "channel",
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
    {
      $project: {
        channel: 1,
        createdAt: 1,
      },
    },
  ]);

  return res
    .status(200)
    .json(
      new apiResponse(
        200,
        subscribedChannels,
        "All subscribed channels fetched"
      )
    );
});

const getChannelSubscribedStatus = asyncHandler(async (req, res) => {
  const { channelId } = req.params;

  const channel = await User.findById(channelId);
  if (!channel) throw new apiError(400, "No such channel exists.");

  const isChannelSubscribed = await Subscription.findOne({
    subscriber: req.user?._id,
    channel: channelId,
  });

  const channelSubscribed = !!isChannelSubscribed;

  return res.status(200).json(new apiResponse(200, channelSubscribed));
});


export { toggleSubscription, getUserChannelSubscribers, getSubscribedChannels, getChannelSubscribedStatus };
