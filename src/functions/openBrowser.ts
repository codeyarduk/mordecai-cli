import { exec } from "child_process";

function openBrowser(url: string) {
  let command;
  switch (process.platform) {
    case "darwin":
      command = `open "${url}"`;
      break;
    case "win32":
      command = `explorer "${url}"`;
      break;
    default:
      command = `xdg-open "${url}"`;
  }

  exec(command, (error) => {
    if (error) {
      // On Windows, ignore the error if it's just the exit code 1
      if (process.platform === "win32" && error.code === 1) {
        return; // This is expected behavior, so we just return without logging an error
      }
      console.error("Failed to open browser:", error);
    }
  });
}

export default openBrowser;
