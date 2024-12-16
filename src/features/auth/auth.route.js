import { Router } from "express";
import { ROUTES } from "../../constants/routes.constant.js";
import {
  changeCurrentPassword,
  getCurrentUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  registerUser,
} from "./auth.controller.js";
import { upload } from "../../middlewares/file-upload.middleware.js";
import { jwtGuard } from "../../middlewares/jwt-guard.middleware.js";

const authRouter = Router();

authRouter.route(ROUTES?.REGISTER).post(
  upload.fields([
    {
      name: "avatar",
      maxCount: 1,
    },
  ]),
  registerUser
);
authRouter.route(ROUTES?.LOGIN).post(loginUser);

authRouter.route(ROUTES?.LOGOUT).post(jwtGuard, logoutUser);

authRouter.route(ROUTES?.REFRESH_TOKEN).post(refreshAccessToken);

authRouter
  .route(ROUTES?.CHANGE_PASSWORD)
  ?.post(jwtGuard, changeCurrentPassword);

authRouter.route(ROUTES?.AUTH_USER).get(jwtGuard, getCurrentUser);

export { authRouter };
