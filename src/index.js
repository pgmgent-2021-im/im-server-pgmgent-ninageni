import express from "express";
import http from "http";
import path from "path";
import socketIO from "socket.io";

import { Odometer } from "./Odometer.js";
import { Speedometer } from "./Speedometer.js";

const app = express();
const server = http.createServer(app);
const io = socketIO(server, {
  origins: "*:*",
  serveClient: false,
});

app.get("/", (req, res) => {
  const FILE = "index.html";
  res.sendFile(path.resolve(`public/${FILE}`));
});

const PORT = 3001;
server.listen(PORT, () => {
  console.info(
    `Server started, listening on *:${PORT}, check status on http://localhost:${PORT}/`
  );
});

const SIMULATE = false;
const INTERVAL = 100; // milliseconds
const timeStart = Date.now();
const odometer0 = new Odometer(timeStart);
const speedometer0 = new Speedometer(timeStart);
io.on("connection", (socket) => {
  console.log("A user connected.");
  setInterval(() => {
    const timeCurrent = Date.now();
    socket.broadcast.volatile.emit("telemetry", {
      distance: SIMULATE ? odometer0.simulate(timeCurrent) : odometer0.fake(),
      speed: SIMULATE
        ? speedometer0.simulate(timeCurrent)
        : speedometer0.fake(),
    });
  }, INTERVAL);
});
