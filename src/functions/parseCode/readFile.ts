import fs from "fs";

interface readFileParams {
  path: string;
}

const readFile = async ({ path }: readFileParams) => {
  try {
    const data = await fs.promises.readFile(path, "utf8");
    return data;
  } catch (err) {
    console.error(err);
    return err;
  }
};

export default readFile;
