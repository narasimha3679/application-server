import * as fs from "fs";
import * as path from "path";

export const saveImage = async (base64Image: string): Promise<string> => {
  // remove "data:image/png;base64," from the start of the string
  const base64Data = base64Image.replace(/^data:image\/png;base64,/, "");

  // generate a unique filename
  const filename = Date.now() + ".png";

  // create the path to save the image
  const imagePath = path.join(__dirname, `../images/${filename}`);

  // write the image file and return the path
  await fs.promises.writeFile(imagePath, base64Data, "base64");

  return imagePath;
};
