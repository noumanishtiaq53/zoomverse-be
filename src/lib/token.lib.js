import jwt from "jsonwebtoken";
import {
  ACCESS_TOKEN_EXPIRY,
  ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_SECRET,
  REFRESH_TOKEN_EXPIRY,
} from "../config/env.config.js";

export const signedToken = (payload, secret, otherOption) => {
  const signedTokenValue = jwt.sign(payload, secret, {
    expiresIn: otherOption?.expireTime,
  });
  return signedTokenValue;
};

export const verifyToken = async (token, secret) => {
  try {
    const decoded = await jwt.verify(token, secret);
    return decoded;
  } catch (error) {
    throw new Error("Something went wrong");
  }
};

export const signedAccessToken = (payload) => {
  const accessToken = signedToken(payload, ACCESS_TOKEN_SECRET, {
    expireTime: ACCESS_TOKEN_EXPIRY,
  });
  return accessToken;
};

export const signedRefreshToken = (payload) => {
  return signedToken(payload, REFRESH_TOKEN_SECRET, {
    expireTime: REFRESH_TOKEN_EXPIRY,
  });
};

export const verifyAccessToken = async (token) => {
  try {
    return verifyToken(token, ACCESS_TOKEN_SECRET);
  } catch (error) {
    return error;
  }
};

export const verifyRefreshToken = (token) => {
  try {
    return verifyToken(token, REFRESH_TOKEN_SECRET);
  } catch (error) {
    return error;
  }
};
