import { Mongoose } from "mongoose";
import {
  DB_COLLECTION_NAME,
  DB_MODELS,
} from "../../constants/db-models.constant.js";
import { HTTP_CODES } from "../../constants/http-codes.constant.js";
import { User } from "../../models/user.model.js";
import { NotFoundError } from "../../utils/api-error.js";
import { asyncHandler } from "../../utils/async-handler.js";
import { getMongooseId } from "../../db/db.odm.js";

const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find();
  res.json(users);
});

const updateUser = async (req, res, next) => {
  try {
    const { address } = req?.body;

    if (!address) throw new BadRequestError("Address is required");

    const user = await User.findByIdAndUpdate(
      req?.user?._id,
      {
        $set: {
          address,
        },
      },
      { new: true }
    ).select("-password -refreshToken");

    return res
      .status(HTTP_CODES?.SUCCESS)
      .json(
        new ApiResponse(
          HTTP_CODES?.SUCCESS,
          { user },
          "User address updated successfully"
        )
      );
  } catch (error) {
    next(error);
  }
};

const updateUserAvatar = async (req, res, next) => {
  try {
    const localAvatarFile = req?.file?.path;
    if (!localAvatarFile) throw new BadRequestError("Avatar file is required");
    const isAvatarUpload = await uploadAvatarToCloudinary(localAvatarFile);
    if (!isAvatarUpload) throw new InternalServerError("Avatar upload failed");

    const user = await User.findByIdAndUpdate(
      req?.user?._id,
      {
        $set: {
          avatar: isAvatarUpload?.url,
        },
      },
      { new: true }
    ).select("-password -refreshToken");

    return res
      .status(HTTP_CODES?.SUCCESS)
      .json(
        new ApiResponse(
          HTTP_CODES?.SUCCESS,
          { user },
          "User avatar updated successfully"
        )
      );
  } catch (error) {
    next(error);
  }
};

const getUserChannelProfile = async (req, res, next) => {
  try {
    const { channelId } = req?.params;
    if (!channelId) throw new BadRequestError("channel id is missing");

    const channel = await User.aggregate([
      {
        $match: {
          _id: getMongooseId(channelId),
        },
      },
      {
        $lookup: {
          from: DB_COLLECTION_NAME?.SUBSCRIPTIONS,
          localField: "_id",
          foreignField: "channel",
          as: "subscriber",
        },
      },
      {
        $lookup: {
          from: DB_COLLECTION_NAME?.SUBSCRIPTIONS,
          localField: "_id",
          foreignField: "subscriber",
          as: "subscribedTo",
        },
      },
      {
        $addFields: {
          subscriberCount: {
            $size: "$subscriber",
          },
          channelSubscribedToCount: {
            $size: "$subscribedTo",
          },
          isSubscribed: {
            $cond: {
              if: { $in: [req?.user?._id, "$subscriber.subscriber"] },
              then: true,
              else: false,
            },
          },
        },
      },
      {
        $project: {
          firstName: 1,
          lastName: 1,
          email: 1,
          phoneNumber: 1,
          subscriberCount: 1,
          channelSubscribedToCount: 1,
          isSubscribed: 1,
          avatar: 1,
        },
      },
    ]);

    if (!channel?.length) throw new NotFoundError("channel not found");

    return res
      ?.status(HTTP_CODES?.SUCCESS)
      ?.json(
        new ApiResponse(
          HTTP_CODES?.SUCCESS,
          channel?.[0],
          "User channel fetch successfully"
        )
      );
  } catch (error) {
    next(error);
  }
};

const getWatchHistory = async (req, res, next) => {
  try {
    const user = await User.aggregate([
      {
        $match: {
          _id: getMongooseId(req?.user?._id),
        },
      },
      {
        $lookup: {
          from: DB_COLLECTION_NAME?.VIDEOS,
          localField: "watchHistory",
          foreignField: "_id",
          as: "watchHistory",
          pipeline: [
            {
              $lookup: {
                from: DB_COLLECTION_NAME?.USERS,
                localField: "owner",
                foreignField: "_id",
                as: "owner",
                pipeline: [
                  {
                    $project: {
                      firstName: 1,
                      lastName: 1,
                      avatar: 1,
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
          ],
        },
      },
    ]);
    return res
      .status(HTTP_CODES?.SUCCESS)
      ?.json(
        new ApiResponse(HTTP_CODES?.SUCCESS, user?.[0]?.watchHistory, "suceess")
      );
  } catch (error) {
    next(error);
  }
};

export {
  getAllUsers,
  updateUser,
  updateUserAvatar,
  getUserChannelProfile,
  getWatchHistory,
};
