import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { CORS_ORIGIN } from "./config/env.config.js";
import { EXPRESS_PAYLOAD_LIMIT } from "./constants/express.constant.js";
import mainRouter from "./features/index.js";
import { API_VERSION } from "./constants/routes.constant.js";
import { errorHandler } from "./middlewares/error-handler.middleware.js";

const app = express();
app.use(
  cors({
    origin: CORS_ORIGIN,
  })
);

app.use(
  express?.json({
    limit: EXPRESS_PAYLOAD_LIMIT,
  })
);

app.use(
  express?.urlencoded({
    extended: true,
    limit: EXPRESS_PAYLOAD_LIMIT,
  })
);

app.use(express?.static("public"));

app.use(cookieParser());

app.use(API_VERSION?.VERSION_ONE, mainRouter);
app.use(errorHandler)

export { app };
