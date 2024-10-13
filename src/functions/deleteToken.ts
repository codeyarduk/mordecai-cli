import keytar from "keytar";

async function deleteToken() {
  try {
    await keytar.deletePassword("wilson-cli", "default");
    console.log("Successfully logged out!");
  } catch (error) {
    console.error("Error deleting token:", error);
  }
}

export default deleteToken;
