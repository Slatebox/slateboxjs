#!/usr/bin/env node

/**
 * @type {any}
 */
require("dotenv").config();
const WebSocket = require("ws");
const http = require("http");
const wss = new WebSocket.Server({ noServer: true });
const setupWSConnection = require("./utils.js").setupWSConnection;
const isAuthenticated = require("../src/auth/isAuthenticated.js");

const host = process.env.HOST || "localhost";
const port = process.env.PORT || 1122;
const devMode = process.env.COLLAB_DEV_MODE === "1";

const server = http.createServer((request, response) => {
  response.writeHead(200, { "Content-Type": "text/plain" });
  response.end("SB Websocket Server Is Rocking" + (devMode ? " (DEV MODE - no auth)" : ""));
});

wss.on("connection", setupWSConnection);

server.on("upgrade", (request, socket, head) => {
  // In dev mode, skip authentication entirely
  if (devMode) {
    wss.handleUpgrade(request, socket, head, (ws) => {
      wss.emit("connection", ws, request);
    });
    return;
  }

  // Production: authenticate via isAuthenticated
  /**
   * @param {any} ws
   */
  const handleAuth = async (ws) => {
    try {
      await isAuthenticated(request);
      // if no exception, then it is valid
      wss.emit("connection", ws, request);
    } catch (err) {
      console.error("unable to auth", err);
      ws.send("Unauthenticated");
    }
  };
  wss.handleUpgrade(request, socket, head, handleAuth);
});

server.listen(port, host, () => {
  console.log(`running at '${host}' on port ${port}${devMode ? ' [DEV MODE - no auth]' : ''}`);
});
