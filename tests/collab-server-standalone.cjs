#!/usr/bin/env node
/**
 * collab-server-standalone.cjs — minimal, dependency-light y-websocket relay
 * for tests. Implements the standard y-protocols sync + awareness exchange
 * (the same wire protocol as collab.slatebox.com's vendored bin/utils.js,
 * minus auth/persistence/callbacks). Started automatically by Playwright
 * (see playwright.config.ts webServer).
 *
 * Usage: node tests/collab-server-standalone.cjs   # PORT env, default 1234
 */
const http = require("http");
const { WebSocketServer } = require("ws");
const Y = require("yjs");
const syncProtocol = require("y-protocols/dist/sync.cjs");
const awarenessProtocol = require("y-protocols/dist/awareness.cjs");
const encoding = require("lib0/dist/encoding.cjs");
const decoding = require("lib0/dist/decoding.cjs");

const PORT = process.env.PORT || 1234;

const MESSAGE_SYNC = 0;
const MESSAGE_AWARENESS = 1;

/** @type {Map<string, {doc: any, awareness: any, conns: Map<any, Set<number>>}>} */
const rooms = new Map();

function getRoom(name) {
  let room = rooms.get(name);
  if (!room) {
    const doc = new Y.Doc();
    const awareness = new awarenessProtocol.Awareness(doc);
    awareness.setLocalState(null);
    room = { doc, awareness, conns: new Map() };

    doc.on("update", (update, origin) => {
      const encoder = encoding.createEncoder();
      encoding.writeVarUint(encoder, MESSAGE_SYNC);
      syncProtocol.writeUpdate(encoder, update);
      const message = encoding.toUint8Array(encoder);
      room.conns.forEach((_ids, conn) => {
        if (conn !== origin) send(conn, message);
      });
    });

    awareness.on("update", ({ added, updated, removed }, origin) => {
      const changed = added.concat(updated, removed);
      const connControlled = room.conns.get(origin);
      if (connControlled) {
        added.forEach((id) => connControlled.add(id));
        removed.forEach((id) => connControlled.delete(id));
      }
      const encoder = encoding.createEncoder();
      encoding.writeVarUint(encoder, MESSAGE_AWARENESS);
      encoding.writeVarUint8Array(
        encoder,
        awarenessProtocol.encodeAwarenessUpdate(awareness, changed)
      );
      const message = encoding.toUint8Array(encoder);
      room.conns.forEach((_ids, conn) => send(conn, message));
    });

    rooms.set(name, room);
  }
  return room;
}

function send(conn, message) {
  if (conn.readyState === 1) {
    try {
      conn.send(message);
    } catch {
      conn.close();
    }
  }
}

const server = http.createServer((_req, res) => {
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end("slateboxjs test collab relay OK");
});

const wss = new WebSocketServer({ server });

wss.on("connection", (conn, req) => {
  const roomName = (req.url || "/default").slice(1).split("?")[0] || "default";
  const room = getRoom(roomName);
  room.conns.set(conn, new Set());
  conn.binaryType = "arraybuffer";

  conn.on("message", (data) => {
    const message = new Uint8Array(data);
    const decoder = decoding.createDecoder(message);
    const messageType = decoding.readVarUint(decoder);
    switch (messageType) {
      case MESSAGE_SYNC: {
        const encoder = encoding.createEncoder();
        encoding.writeVarUint(encoder, MESSAGE_SYNC);
        syncProtocol.readSyncMessage(decoder, encoder, room.doc, conn);
        if (encoding.length(encoder) > 1) {
          send(conn, encoding.toUint8Array(encoder));
        }
        break;
      }
      case MESSAGE_AWARENESS: {
        awarenessProtocol.applyAwarenessUpdate(
          room.awareness,
          decoding.readVarUint8Array(decoder),
          conn
        );
        break;
      }
    }
  });

  conn.on("close", () => {
    const controlled = room.conns.get(conn);
    room.conns.delete(conn);
    if (controlled) {
      awarenessProtocol.removeAwarenessStates(
        room.awareness,
        Array.from(controlled),
        null
      );
    }
  });

  // Initial sync step 1
  const encoder = encoding.createEncoder();
  encoding.writeVarUint(encoder, MESSAGE_SYNC);
  syncProtocol.writeSyncStep1(encoder, room.doc);
  send(conn, encoding.toUint8Array(encoder));

  // Send current awareness states
  const states = room.awareness.getStates();
  if (states.size > 0) {
    const awarenessEncoder = encoding.createEncoder();
    encoding.writeVarUint(awarenessEncoder, MESSAGE_AWARENESS);
    encoding.writeVarUint8Array(
      awarenessEncoder,
      awarenessProtocol.encodeAwarenessUpdate(
        room.awareness,
        Array.from(states.keys())
      )
    );
    send(conn, encoding.toUint8Array(awarenessEncoder));
  }
});

server.listen(PORT, () => {
  console.log(`collab relay listening on ws://localhost:${PORT}`);
});
