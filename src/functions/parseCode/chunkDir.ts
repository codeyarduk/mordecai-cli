import fs from "fs";
import path from "path";
import ignore from "ignore";
import readFile from "./readFile";

const processDirectory = async (directoryPath: string): Promise<any[]> => {
  const fileData: any[] = [];
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
    ".mjs,",
    ".cjs",
    ".cts",
    ".mts",
    ".json",
    ".toml",
    ".html",
    ".css",
    ".scss",
    ".md",
    ".yaml",
    ".yml",
    ".svelte",
    ".vue",
    ".py",
    ".go",
    ".c",
    ".rs",
    ".rb",
    ".zig",
    ".java"];

  // Read .gitignore file
  const gitignorePath = path.join(directoryPath, ".gitignore");
  const ig = ignore();
  if (fs.existsSync(gitignorePath)) {
    const gitignoreContent = await fs.promises.readFile(gitignorePath, "utf8");
    const lines = gitignoreContent
      .split("\n")
      .map((line) => line.trim()) // Trim whitespace
      .filter((line) => line && !line.startsWith("#")) // Ignore empty lines and comments
      .map((line) => (line.endsWith("/") ? line.slice(0, -1) : line)); // Remove trailing slash if present

    ig.add(lines);
    // console.log(lines);
  }

  const isIgnored = (filePath: string): boolean => {
    const relativePath = path.relative(directoryPath, filePath);
    return ig.ignores(relativePath);
  };

  //
  const processFile = async (filePath: string) => {
    try {
      if (isIgnored(filePath)) {
        return;
      }
      const stats = await fs.promises.stat(filePath);
      const fileName = path.basename(filePath);
      const fileExtension = path.extname(filePath);

      if (stats.isDirectory()) {
        const subDirfileData = await processDirectory(filePath);
        fileData.push(...subDirfileData);
      } else if (
        stats.isFile() &&
        allowedFileExtensions.includes(fileExtension) &&
        !fileName.startsWith(".")
      ) {
        let data = await readFile({ path: filePath });
        if (filePath !== "package-lock.json") {
          fileData.push({
            file_extension: fileExtension,
            file_path: filePath,
            data_chunks: data,
          });
        }
      }
    } catch (error) {
      console.error(`Error processing file ${filePath}:`, error);
    }
  };

  const files = await fs.promises.readdir(directoryPath);
  for (const file of files) {
    const filePath = path.join(directoryPath, file);
    await processFile(filePath);
  }

  return fileData;
};

export default processDirectory;
