import {
  RELATIONSHIP_STATUS,
  USER_STATUS,
} from "../constants/db-enums.constant.js";
import { DB_MODELS } from "../constants/db-models.constant.js";
import { generateModel, generateSchema } from "../db/db.odm.js";
import { decryptPassword, encryptPassword } from "../lib/hash.lib.js";
import { signedAccessToken, signedRefreshToken } from "../lib/token.lib.js";

const userSchemaPattern = {
  userName: {
    type: String,
    trim: true,
    required: true,
    unique: true,
    lowercase: true,
    index: true,
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    unique: true,
    required: true,
    index: true,
  },
  password: {
    type: String,
    required: [true, "password is required"],
  },
  profileName: {
    type: String,
    trim: true,
    lowercase: true,
  },
  country: {
    type: String,
    trim: true,
  },
  city: {
    type: String,
    trim: true,
  },
  avatar: {
    type: String,
  },
  coverImage: {
    type: String,
  },
  dateOfBirth: {
    type: Date,
  },
  relationshipStatus: {
    type: String,
    enum: Object.values(RELATIONSHIP_STATUS),
  },
  status: {
    type: String,
    enum: Object.values(USER_STATUS),
    default: USER_STATUS?.IN_ACTIVE,
  },
  favoriteTvShows: {
    type: String,
  },
  favoriteMusicBands: {
    type: String,
  },
  favoriteMovies: {
    type: String,
  },
  favoriteBooks: {
    type: String,
  },
  favoriteGames: {
    type: String,
  },
  hobbies: {
    type: String,
  },
  refreshToken: {
    type: String,
  },
};

const userSchema = generateSchema(userSchemaPattern);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await encryptPassword(this.password);
  next();
});

userSchema.methods.isPasswordCorrect = async function (password) {
  return await decryptPassword(password, this.password);
};

userSchema.methods.generateAccessToken = async function () {
  const payload = {
    _id: this._id,
    firstName: this.firstName,
    lastName: this.lastName,
    email: this.email,
  };
  return await signedAccessToken(payload);
};

userSchema.methods.generateRefreshToken = async function () {
  const payload = {
    _id: this._id,
  };
  return await signedRefreshToken(payload);
};

export const User = generateModel(DB_MODELS?.USER, userSchema);
