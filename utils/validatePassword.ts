import * as bycrypt from "bcrypt";

// compare the password with the hash
export const comparePassword = async (
  password: string,
  hash: string
): Promise<boolean> => {
  try {
    return await bycrypt.compare(password, hash);
  } catch (error) {
    throw new Error(
      "Something went wrong while comparing the password:" + error
    );
  }
};
