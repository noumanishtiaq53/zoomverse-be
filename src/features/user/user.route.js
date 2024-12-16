import { Router } from "express";
import {
  getAllUsers,
  getUserChannelProfile,
  getWatchHistory,
  updateUser,
  updateUserAvatar,
} from "./user.controller.js";
import { ROUTES } from "../../constants/routes.constant.js";
import { upload } from "../../middlewares/file-upload.middleware.js";
import { jwtGuard } from "../../middlewares/jwt-guard.middleware.js";

const userRouter = Router();

userRouter.route(ROUTES?.BASE).get(getAllUsers);
userRouter.route(ROUTES?.BASE).patch(jwtGuard, updateUser);
userRouter
  .route(ROUTES?.USER_AVATAR)
  .patch(jwtGuard, upload?.single("avatar"), updateUserAvatar);

userRouter.route(ROUTES?.CHANNEL_DETAILS).get(jwtGuard, getUserChannelProfile);
userRouter.route(ROUTES?.WATCH_HISTORY).get(jwtGuard, getWatchHistory);

export { userRouter };
