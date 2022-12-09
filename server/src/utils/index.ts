const fs = require("fs");
const hbjs = require("handbrake-js");

export const deleteFile = async (filename: any) => {
  await fs.unlink(filename, (err: any) => {
    if (err) {
      throw err;
    }

    console.log("Delete File successfully.");
  });
};

export const convertVideo = (
  filePath: string,
  filename: string,
  dir: string
) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }
  const output = dir + "/" + filename;

  const options = {
    input: filePath,
    output: output,
    preset: "Very Fast 480p30",
  };

  return hbjs.spawn(options);
};
