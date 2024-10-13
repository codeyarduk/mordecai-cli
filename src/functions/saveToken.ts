import keytar from "keytar";

async function saveToken(token: any) {
  const service = "wilson-cli";
  const account = "default";

  try {
    await keytar.setPassword(service, account, token);
  } catch (error) {
    console.error("Failed to save token:", error);
  }
}

export default saveToken;
