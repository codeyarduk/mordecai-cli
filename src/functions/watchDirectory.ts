import chokidar from "chokidar";
import path from "path";
import chalk from "chalk";
import processFiles from "./parseCode/chunkFiles";
async function watchDirectory(
  directoryPath: string,
  remote: string,
  workspaceId: string,
  token: string,
) {

  const watcher = chokidar.watch(directoryPath, {
    persistent: true,
    ignoreInitial: true,
  });
  let counter = 0;

  let filesToUpdate: Array<string> = [];
  let timeoutId: NodeJS.Timeout | null = null;

  watcher.on("change", async (filePath) => {
    let fileRepeated: boolean = false;

    const fileExtension = path.extname(filePath);

    // const response = await fetch(`${END_POINT_PROD}/cli/chunk`, {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify({
    //     data: JSON.stringify(data),
    //     token: newToken,
    //     workspaceId: workspaceId,
    //   }),
    // });

    filesToUpdate.map((file) => {
      if (file === filePath) {
        fileRepeated = true;
      }
    });

    if (!fileRepeated) {
      filesToUpdate.push(filePath);
    }

    if (timeoutId !== null) {
      clearTimeout(timeoutId);
    }

    timeoutId = setTimeout(async () => {
      //   console.log("the following files need to get chunked:");
      //   console.log(filesToUpdate);
      const data = await processFiles(filesToUpdate);
      // console.log(data);
      //const response = await fetch(`${END_POINT_PROD}/cli/chunk`, {
      //  method: "POST",
      //  headers: {
      //    "Content-Type": "application/json",
      //  },
      //  body: JSON.stringify({
      //    data: JSON.stringify(data),
      //    // data: {},
      //    token: token,
      //    workspaceId: workspaceId,
      //    update: true,
      //  }),
      //});
      //console.log(await response.json());

      filesToUpdate = [];
      timeoutId = null;
    }, 10000);
  });
  //
  console.log(
    // ""
    chalk.red("KEEP THIS TERMINAL WINDOW OPEN WHILE PROGRAMMING!"),
    // chalk.bold.red("KEEP THIS TERMINAL WINDOW OPEN WHILE PROGRAMMING")
  );

  console.log(
    chalk.bold("mordecai"),
    "is syncing to remote " + chalk.bold.yellow(remote),
  );
}

export default watchDirectory;
