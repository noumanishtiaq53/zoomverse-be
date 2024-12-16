import dotenv from "dotenv";
import { connectDB } from "./db/db.config.js";
import { PORT } from "./config/env.config.js";
import { app } from "./app.js";

dotenv.config({
  path: "./.env",
});

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`app is listening on ${PORT}`);
    });
  })
  .catch((error) => {
  });
