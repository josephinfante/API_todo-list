import bycrypt from "bcrypt";

export const encrypt = async (password: string) => {
  let salt = await bycrypt.genSalt(10);
  let hashedPassword = await bycrypt.hash(password, salt);
  return hashedPassword;
};

export const decrypt = async (password: string, hashedPassword: string) => {
  let match = await bycrypt.compare(password, hashedPassword);
  return match;
};
