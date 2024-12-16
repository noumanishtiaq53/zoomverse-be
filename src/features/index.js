import { Router } from "express";
import { userRouter } from "./user/user.route.js";
import { authRouter } from "./auth/auth.route.js";
import { ROUTES } from "../constants/routes.constant.js";

const mainRouter = Router();

mainRouter?.use(ROUTES?.USERS, userRouter);
mainRouter?.use(ROUTES?.AUTH, authRouter);

export default mainRouter;
