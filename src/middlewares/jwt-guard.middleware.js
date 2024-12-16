import { User } from "../models/user.model.js";
import { verifyAccessToken } from "../lib/token.lib.js";
import { UnAuthorizedError } from "../utils/api-error.js";

export const jwtGuard = async (req, _, next) => {
  try {
    const token =
      req?.cookies?.accessToken ||
      req?.header("Authorization")?.replace("Bearer ", "");

    if (!token) throw new UnAuthorizedError("Unauthorized request");

    const decodedToken = await verifyAccessToken(token);
    if (!decodedToken) throw new UnAuthorizedError("Unauthorized request");

    const user = User?.findById(decoded?._id).select("-password -refreshToken");

    req.user = user;

    next();
  } catch (error) {
    next(error);
  }
};
