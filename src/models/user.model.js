import { USER_STATUS } from "../constants/db.constant.js";
import { ROLES } from "../constants/roles.constant.js";
import { DB_MODELS } from "../constants/db-models.constant.js";
import { generateModel, generateSchema, ObjectIdType } from "../db/db.odm.js";
import { decryptPassword, encryptPassword } from "../lib/hash.lib.js";
import { signedAccessToken, signedRefreshToken } from "../lib/token.lib.js";

const userSchemaPattern = {
  firstName: {
    type: String,
    trim: true,
    lowercase: true,
  },
  lastName: {
    type: String,
    trim: true,
    lowercase: true,
  },
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
  phoneNumber: {
    type: String,
    trim: true,
    unique: true,
    required: true,
  },
  address: {
    type: String,
    trim: true,
  },
  avatar: {
    type: String,
  },
  role: {
    type: String,
    enum: Object.values(ROLES),
  },
  password: {
    type: String,
    required: [true, "password is required"],
  },
  status: {
    type: String,
    enum: Object.values(USER_STATUS),
    default: USER_STATUS?.IN_ACTIVE,
  },
  product: {
    type: ObjectIdType,
    ref: DB_MODELS?.PRODUCT,
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
