import { User } from "../../models/user.model.js";
import {
  ApiError,
  BadRequestError,
  ConflictError,
  NotFoundError,
  UnAuthorizedError,
} from "../../utils/api-error.js";
import { uploadOnCloudinary } from "../../lib/file-upload.lib.js";
import { HTTP_CODES } from "../../constants/http-codes.constant.js";
import { ApiResponse } from "../../utils/api-response.js";
import { verifyRefreshToken } from "../../lib/token.lib.js";
import { tokenCookiesOptions } from "../../config/cookies.config.js";

const generateAccessAndRefreshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = await user.generateAccessToken();
    const refreshToken = await user.generateRefreshToken();
    user.refreshToken = refreshToken;

    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError();
  }
};

const registerUser = async (req, res, next) => {
  try {
    const { firstName, lastName, email, phoneNumber, password } = req.body;

    if (
      [firstName, email, phoneNumber, password]?.some((field) => !field?.trim())
    ) {
      throw new NotFoundError("All fields are required");
    }

    const isUserExist = await User.findOne({
      email,
    });

    if (isUserExist) throw new ConflictError("Email already exists");

    const avatarLocalPath = req?.files?.avatar?.[0]?.path;

    let isUploadComplete;

    if (avatarLocalPath) {
      isUploadComplete = await uploadOnCloudinary(avatarLocalPath);
      if (!isUploadComplete)
        throw new BadRequestError("Avatar is not uploaded required");
    }

    const user = await User.create({
      firstName,
      lastName,
      email,
      phoneNumber,
      avatar: isUploadComplete?.url,
      password,
    });

    const isUserCreated = await User.findById(user?._id).select(
      "-password -refreshToken"
    );

    if (!isUserCreated) throw new ApiError();

    return res
      .status(HTTP_CODES?.CREATED)
      .json(
        new ApiResponse(
          HTTP_CODES?.CREATED,
          isUserCreated,
          "User registered successfully"
        )
      );
  } catch (error) {
    next(error);
  }
};

const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req?.body;

    if (!email && !password)
      throw new BadRequestError("Credentials are required");

    const isUserExists = await User.findOne({ email });
    if (!isUserExists) throw new ConflictError("User not exists");

    const isPasswordValid = await isUserExists?.isPasswordCorrect(password);
    if (!isPasswordValid) throw new UnAuthorizedError("invalid Credentials");

    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
      isUserExists?._id
    );

    const loggedInUser = await User.findById(isUserExists?.id)?.select(
      "-password -refreshToken"
    );

    return res
      .status(HTTP_CODES?.SUCCESS)
      .cookie("accessToken", accessToken, tokenCookiesOptions)
      .cookie("refreshToken", refreshToken, tokenCookiesOptions)
      .json(
        new ApiResponse(
          HTTP_CODES?.SUCCESS,
          {
            user: loggedInUser,
            accessToken,
            refreshToken,
          },
          "User logged in successfully"
        )
      );
  } catch (error) {
    next(error);
  }
};

const logoutUser = async (req, res, next) => {
  try {
    const authUser = User?.findByIdAndUpdate(
      req?.user?._id,
      {
        $set: {
          refreshToken: undefined,
        },
      },
      {
        new: true,
      }
    );

    return res
      .status(HTTP_CODES?.SUCCESS)
      .clearCookie("accessToken", tokenCookiesOptions)
      .clearCookie("refreshToken", tokenCookiesOptions)
      .json(new ApiResponse(HTTP_CODES?.SUCCESS, {}, "User logged out"));
  } catch (error) {
    next(error);
  }
};

const refreshAccessToken = async (req, res, next) => {
  try {
    const incomingRefreshToken =
      req?.cookies?.refreshToken || req?.body?.refreshToken;

    if (!incomingRefreshToken)
      throw new UnAuthorizedError("unauthorized request");

    const decodedToken = await verifyRefreshToken(incomingRefreshToken);

    const user = await User.findById(decodedToken?._id);

    if (!user) throw new UnAuthorizedError("invalid refresh token");

    if (incomingRefreshToken !== user?.refreshToken)
      throw new UnAuthorizedError("Refresh token is expired or used");

    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
      user?._id
    );

    return res
      .status(HTTP_CODES?.SUCCESS)
      .cookie("accessToken", accessToken, tokenCookiesOptions)
      .cookie("refreshToken", refreshToken, tokenCookiesOptions)
      .json(
        new ApiResponse(
          HTTP_CODES?.SUCCESS,
          {
            accessToken,
            refreshToken,
          },
          "Access token refreshed"
        )
      );
  } catch (error) {
    next(error);
  }
};

const changeCurrentPassword = async (req, res, next) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id);

    const isPasswordValid = await user.isPasswordCorrect(oldPassword);

    if (!isPasswordValid) throw new BadRequestError("Invalid credentials");

    user.password = newPassword;

    await user.save({ validateBeforeSave: false });

    return res
      .status(HTTP_CODES.SUCCESS)
      .json(
        new ApiResponse(HTTP_CODES.SUCCESS, {}, "Password changed successfully")
      );
  } catch (error) {
    next(error);
  }
};

const getCurrentUser = async (req, res, next) => {
  try {
    return res
      .status(HTTP_CODES.SUCCESS)
      .json(
        new ApiResponse(
          HTTP_CODES.SUCCESS,
          req.user,
          "User fetched Successfully"
        )
      );
  } catch (error) {
    next(error);
  }
};




export {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  changeCurrentPassword,
  getCurrentUser,
};
