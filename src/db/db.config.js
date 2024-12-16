import mongoose from "mongoose";
import { DATABASE_NAME, DATABASE_URI } from "../config/env.config";

export const connectDB = async () => {
  try {
    await mongoose?.connect(`${DATABASE_URI}/${DATABASE_NAME}`);
  } catch (error) {
    process.exit(1);
  }
};
