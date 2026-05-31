#!/usr/bin/env node
/**
 * Simple y-websocket test server — no auth, for local Collab.ts testing.
 */
const WebSocket = require("ws");
const http = require("http");
const wss = new WebSocket.Server({ noServer: true });
const { setupWSConnection } = require("y-websocket/bin/utils");

const port = process.env.PORT || 1234;

const server = http.createServer((_req, res) => {
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end("collab-test-server ok");
});

wss.on("connection", setupWSConnection);

server.on("upgrade", (request, socket, head) => {
  wss.handleUpgrade(request, socket, head, (ws) => {
    wss.emit("connection", ws, request);
  });
});

server.listen(port, () => {
  console.log(`collab-test-server running on port ${port}`);
});
