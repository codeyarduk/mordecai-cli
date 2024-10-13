import keytar from "keytar";

async function loadToken() {
  const service = "wilson-cli";
  const account = "default";

  const token = await keytar.getPassword(service, account);

  if (token) {
    try {
      const projects = await fetch(`${process.env.SITE_URL}/cli/workspaces`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token: token }),
      });
      if (projects.ok) {
        await projects.json();
        return token;
      } else {
        return null;
      }
    } catch (err) {
      return null;
    }
  }
  return null;
}

export default loadToken;
