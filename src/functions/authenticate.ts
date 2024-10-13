import Spinner from "./spinner";
import startLocalServer from "./startLocalServer";
import openBrowser from "./openBrowser";
async function authenticate() {
  const port = 8300;
  const authUrl = `${process.env.SITE_URL}/auth/cli?port=${port}`;

  const spinner = new Spinner();
  spinner.start("Waiting for authentication");

  try {
    const serverPromise = startLocalServer(port);
    openBrowser(authUrl);
    const token = await serverPromise;
    spinner.stop();

    if (token) {
      console.log(`Authentication successful!`);
      return token;
    } else {
      console.log("Authentication failed");
      return null;
    }
  } catch (error) {
    spinner.stop();
    console.error("Authentication error:", error);
    return null;
  }
}

export default authenticate;
