import readFile from './readFile';
import fs from "fs";
import path from "path";
import * as data from "./languages.json";
import ignore from "ignore";

const processFiles = async (filePaths: string[]): Promise<any[]> => {
  const chunkedFiles: any[] = [];
  const configPath = path.join(__dirname, "languages.json");
  let languageNodes: any;
  if (fs.existsSync(configPath)) {
    languageNodes = JSON.parse(fs.readFileSync(configPath, "utf8"));
  }

  const allowedFileExtensions = [
    ".js",
    ".ts",
    ".tsx",
    ".jsx",
    ".svelte",
    ".vue",
    ".astro",
    ".mjs,",
    ".cjs",
    ".cts",
    ".mts",
    ".json",
    ".md"
  ];

  // Read .gitignore file
  const gitignorePath = path.join(process.cwd(), ".gitignore");
  const ig = ignore();
  if (fs.existsSync(gitignorePath)) {
    const gitignoreContent = await fs.promises.readFile(gitignorePath, "utf8");
    const lines = gitignoreContent
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line && !line.startsWith("#"))
      .map((line) => (line.endsWith("/") ? line.slice(0, -1) : line));

    ig.add(lines);
  }

  const isIgnored = (filePath: string): boolean => {
    const relativePath = path.relative(process.cwd(), filePath);
    return ig.ignores(relativePath);
  };

  const processFile = async (filePath: string) => {
    try {
      if (isIgnored(filePath)) {
        return;
      }

      const stats = await fs.promises.stat(filePath);
      const fileName = path.basename(filePath);
      const fileExtension = path.extname(filePath);

      if (
        stats.isFile() &&
        allowedFileExtensions.includes(fileExtension) &&
        !fileName.startsWith(".")
      ) {
        //let nodesForChunking = languageNodes.global;

        const data = await readFile({
          path: filePath,
          //languageNodes: nodesForChunking,
        });

        chunkedFiles.push({
          file_path: filePath,
          data_chunks: data,
        });
      }
    } catch (error) {
      console.error(`Error processing file ${filePath}:`, error);
    }
  };

  for (const filePath of filePaths) {
    // console.log("PATH:", filePath);
    await processFile(filePath);
  }

  return chunkedFiles;
};

export default processFiles;
//
//
//
//
//
