import bcrypt from "bcrypt";

const PASSWORD_HASH_SALT = 10;

export const encryptPassword = (password) => {
  try {
    const hashedPassword = bcrypt.hash(password, PASSWORD_HASH_SALT);
    return hashedPassword;
  } catch (error) {
    throw new Error("Something went wrong");
  }
};

export const decryptPassword = (password, encryptedPassword) => {
  try {
    const deHashedPassword = bcrypt.compare(password, encryptedPassword);
    return deHashedPassword;
  } catch (error) {
    throw new Error("Something went wrong");
  }
};
