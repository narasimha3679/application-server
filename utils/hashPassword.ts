import { genSalt, hash } from "bcrypt";

const saltRounds = 10;

// Generate a hash from a password.
export const hashPassword = async (password: string): Promise<string> => {
    try {
  // Generate a salt for the hash.
  const salt = await genSalt(saltRounds);
  // Generate the hash from the password.
  return await hash(password, salt);
    } catch (error) {
    // We throw an error in case something went wrong.
    throw new Error('Something went wrong while hashing the password:'+ error);
    }
};
