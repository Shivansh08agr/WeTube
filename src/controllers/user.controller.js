import { asyncHandler } from "../utils/asyncHandler.js";
import { apiError } from "../utils/apiError.js";
import { User } from "../models/user.model.js";
import {
  deleteFromCloudinary,
  uploadOnCloudinary,
} from "../utils/cloudinary.js";
import { apiResponse } from "../utils/apiResponse.js";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

const generateAccessandRefreshTokens = async (userId) => {
  try {
    const user = await User.findOne(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (err) {
    throw new apiError(
      500,
      "Something went wrong while generating refresh and access token"
    );
  }
};

const options = {
  httpOnly: true,
  secure: true,
};

const registerUser = asyncHandler(async (req, res) => {
  // get user details from frontend
  const { fullName, username, email, password } = req.body;
  // console.log(req.body);
  // validation - not empty
  if (
    [fullName, username, email, password].some((field) => field?.trim() === "")
  ) {
    throw new apiError(404, "All fields are required");
  }
  if (!email.includes("@")) throw new apiError(404, "Email must have @ in it.");
  if (password.length < 6)
    throw new apiError(404, "password must be 6 characters or above");
  // check whether the user already exists: username, emailID
  const existedUser = await User.findOne({
    $or: [{ username }, { email }], //it means check from either email or username as both are unique
  });
  if (existedUser) {
    throw new apiError(409, "User with email or username already exists");
  }

  // check for images, avatar
  let avatarLocalImages = req.files?.avatar?.[0]?.path;
  // const coverImageLocalImages = req.files?.coverImage[0]?.path; it will not work because coverImage is not required and it may return undefined which we can't work with

  let coverImageLocalImages;
  if (
    req.files &&
    Array.isArray(req.files.coverImage) &&
    req.files.coverImage.length > 0
  ) {
    coverImageLocalImages = req?.files?.coverImage[0]?.path;
  }

  // console.log(req.files);
  let avatar;
  if (avatarLocalImages) avatar = await uploadOnCloudinary(avatarLocalImages);

  // store them in cloudinary
  let coverImage;
  if(coverImageLocalImages){
    coverImage = await uploadOnCloudinary(coverImageLocalImages);
  }
  // if (!avatar) throw new apiError(500, "An error occured while uploading the file.");
  // create users object: create entry in DB
  const user = await User.create({
    fullName,
    avatar: avatar?.url || "https://res.cloudinary.com/dnfmwwo76/image/upload/fl_preserve_transparency/v1739292614/nlda2l8kzbuotk0cnmna.jpg?_s=public-apps",
    coverImage: coverImage?.url || "https://res.cloudinary.com/dnfmwwo76/image/upload/fl_preserve_transparency/v1739468141/coverImage_l8tw1d.jpg?_s=public-apps",
    email,
    password,
    username: username.toLowerCase(),
  });
  // remove password and refresh token field from response
  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );
  // check for user creation
  if (!createdUser)
    throw new apiError(500, "Something went wrong while registering the user");
  //
  const { accessToken, refreshToken } = await generateAccessandRefreshTokens(
    user._id
  );
  // return res
  return res
    .status(201)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(new apiResponse(200, createdUser, "User registered successfully"));
});

const loginUser = asyncHandler(async (req, res) => {
  // take username or email with password from frontend
  // check if the password matches with the username/userID if it does login the user and if it doesn't throw err WRONG PASSWORD
  // access token and refresh token for forgot password
  // send through secure cookies
  // return response
  const { email, username, password } = req.body;
  if (!(username || email))
    throw new apiError(400, "Username or Email is required.");

  const user = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (!user) throw new apiError(404, "User does not exist");

  const isPasswordValid = await user.isPasswordCorrect(password);
  if (!isPasswordValid) throw new apiError(404, "Invalid user credentials");

  const { accessToken, refreshToken } = await generateAccessandRefreshTokens(
    user._id
  );
  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new apiResponse(
        200,
        {
          user: loggedInUser,
          accessToken,
          refreshToken,
        },
        "User logged in successfully"
      )
    );
});

const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $unset: {
        refreshToken: 1, // this removes the field from document
      },
    },
    {
      new: true,
    }
  );

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new apiResponse(200, {}, "User logged out"));
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken =
    req.cookies.refreshToken || req.body.refreshToken;
  if (!incomingRefreshToken) throw new apiError(401, "Unauthorized Request");

  try {
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    const user = await User.findById(decodedToken?._id);
    if (!user) throw new apiError(401, "Invalid Refresh Token");

    if (incomingRefreshToken !== user?.refreshToken) {
      throw new apiError(401, "Refresh token is used or expired");
    }

    const { accessToken, newRefreshToken } =
      await generateAccessandRefreshTokens(user._id);

    res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", newRefreshToken, options)
      .json(
        new apiResponse(
          200,
          { accessToken, refreshToken: newRefreshToken },
          "Access token refreshed"
        )
      );
  } catch (error) {
    throw new apiError(401, error.message || "Invalid refresh Token");
  }
});

const changeCurrentPassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const user = await User.findById(req.user?._id);
  const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);

  if (!isPasswordCorrect) throw new apiError(400, "Invalid old password");

  user.password = newPassword;
  await user.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(new apiResponse(200, {}, "Password changed successfully"));
});

const getCurrentUser = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .json(new apiResponse(200, req.user, "Current user fetched"));
});

const updateAccountDetails = asyncHandler(async (req, res) => {
  const { fullName, email, username } = req.body;
  if (!(fullName || email || username))
    throw new apiError(400, "No changes were made");

  const updateFields = {};
  if (username) updateFields.username = username;
  if (email) updateFields.email = email;
  if (fullName) updateFields.fullName = fullName;

  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: updateFields,
    },
    {
      new: true,
    }
  ).select("-password");

  return res
    .status(200)
    .json(
      new apiResponse(
        200,
        user,
        "Account details have been updated successfully"
      )
    );
});

const updateAvatar = asyncHandler(async (req, res) => {
  // console.log(req?.file?.path);
  const avatarLocalPath = req.file?.path;

  if (!avatarLocalPath) {
    return res
      .status(400)
      .json(new apiResponse(400, {}, "No avatar file uploaded"));
  }

  if (req.user?.avatar) {
    await deleteFromCloudinary(req?.user?.avatar);
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath);

  if (!avatar) {
    return res
      .status(500)
      .json(new apiResponse(500, {}, "Failed to upload avatar to Cloudinary"));
  }

  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        avatar: avatar.url,
      },
    },
    {
      new: true,
    }
  )
    .select("-password")
    .lean();

  return res
    .status(200)
    .json(new apiResponse(200, user, "Avatar has been updated successfully"));
});

const updateCoverImage = asyncHandler(async (req, res) => {
  const coverImageLocalPath = req?.file?.path;

  if (!coverImageLocalPath) {
    return res
      .status(400)
      .json(new apiResponse(400, {}, "No coverImage file uploaded"));
  }

  if (req.user?.coverImage) {
    await deleteFromCloudinary(req.user?.coverImage);
  }

  const coverImage = await uploadOnCloudinary(coverImageLocalPath);

  if (!coverImage) {
    return res
      .status(500)
      .json(
        new apiResponse(500, {}, "Failed to upload coverImage to Cloudinary")
      );
  }

  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        coverImage: coverImage.url,
      },
    },
    {
      new: true,
    }
  )
    .select("-password")
    .lean();

  return res
    .status(200)
    .json(
      new apiResponse(200, user, "CoverImage has been updated successfully")
    );
});

const getUserChannelProfile = asyncHandler(async (req, res) => {
  const { username } = req.params;

  if (!username?.trim()) throw new apiError(400, "Username is missing");

  const channel = await User.aggregate([
    {
      $match: {
        username: username?.toLowerCase(),
      },
    },
    {
      $lookup: {
        from: "subscriptions",
        localField: "_id", // user id
        foreignField: "channel",
        as: "subscribers",
      },
    },
    {
      $lookup: {
        from: "subscriptions",
        localField: "_id",
        foreignField: "subscriber",
        as: "subscribedTo",
      },
    },
    {
      $addFields: {
        subsribersCount: {
          $size: "$subscribers",
        },
        channelSubscribedToCount: {
          $size: "$subscribedTo",
        },
        isSubscribed: {
          $cond: {
            if: { $in: [req.user?._id, "$subscribers.subscriber"] },
            then: true,
            else: false,
          },
        },
      },
    },
    {
      $project: {
        fullName: 1,
        username: 1,
        subsribersCount: 1,
        channelSubscribedToCount: 1,
        avatar: 1,
        coverImage: 1,
        email: 1,
        isSubscribed: 1,
      },
    },
  ]);

  if (!channel?.length) {
    throw new apiError(404, "Channel does not exist");
  }

  return res
    .status(200)
    .json(
      new apiResponse(200, channel[0], "User channel fetched successfully")
    );
});

const getWatchHistory = asyncHandler(async (req, res) => {
  const user = await User.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(req.user._id),
      },
    },
    {
      $lookup: {
        from: "videos",
        localField: "watchHistory",
        foreignField: "_id", // vid id
        as: "watchHistory",
        pipeline: [
          {
            $lookup: {
              from: "users",
              localField: "owner",
              foreignField: "_id", //owner id
              as: "owner",
              pipeline: [
                {
                  $project: {
                    fullName: 1,
                    username: 1,
                    avatar: 1,
                  },
                },
              ],
            },
          },
          {
            $addFields: {
              owner: {
                $first: "$owner",
              },
            },
          },
        ],
      },
    },
  ]);

  return res
    .status(200)
    .json(
      new apiResponse(
        200,
        user[0].watchHistory,
        "Watch history fetched successfully"
      )
    );
});

export {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  changeCurrentPassword,
  getCurrentUser,
  updateAccountDetails,
  updateAvatar,
  updateCoverImage,
  getUserChannelProfile,
  getWatchHistory,
};
