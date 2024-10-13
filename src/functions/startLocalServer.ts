import http from "http";

function startLocalServer(CALLBACK_PORT = 8300) {
  return new Promise((resolve, reject) => {
    const server = http.createServer((req, res) => {
      if (!req.url) {
        res.writeHead(400, { "Content-Type": "text/plain" });
        res.end("Bad Request");
        return;
      }
      // Add CORS headers
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
      res.setHeader("Access-Control-Allow-Headers", "Content-Type");

      if (req.method === "OPTIONS") {
        // Handle preflight requests
        res.writeHead(204);
        res.end();
        return;
      }
      const url = new URL(req.url, `http://localhost:${CALLBACK_PORT}`);
      if (url.pathname === "/callback") {
        const token = url.searchParams.get("token");
        if (token) {
          res.writeHead(200, { "Content-Type": "text/html" });
          res.end(
            "<h1>Authentication successful! You can close this window.</h1>"
          );
          server.close();
          resolve(token);
        } else {
          reject(new Error("No token received"));
        }
      } else {
        res.writeHead(405, { "Content-Type": "text/html" });
        res.end(
          "<h1>Method not allowed. Please send a valid token request.</h1>"
        );
      }
    });

    server.listen(CALLBACK_PORT, (err: void) => {
      if (err as any) {
        reject(err);
      }
    });

    // Timeout after 5 minutes
    setTimeout(() => {
      server.close();
      reject(new Error("Authentication timed out"));
    }, 300000);
  });
}

export default startLocalServer;
