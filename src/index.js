import express from "express";
import http from "http";
import path from "path";
import { Server } from "socket.io";

import { Speedometer } from "./Speedometer.js";

const app = express();
const httpServer = http.createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: true,
  },
  serveClient: false,
});

app.get("/", (req, res) => {
  const FILE = "index.html";
  res.sendFile(path.resolve(`public/${FILE}`));
});

const PORT = 3001;
httpServer.listen(PORT, () => {
  console.info(
    `Server started, listening on *:${PORT}, check status on http://localhost:${PORT}/`
  );
});

const LOGGING = true;
const INTERVAL = 100; // milliseconds
const SIMULATE = true;
const timeStart = Date.now();
const speedometer = new Speedometer(timeStart);
io.on("connection", (socket) => {
  console.log("A user connected.");
  setInterval(() => {
    const timeCurrent = Date.now();
    const data = {
      speed: SIMULATE ? speedometer.simulate(timeCurrent) : speedometer.fake(),
    };
    if (LOGGING) console.log(data);
    socket.broadcast.volatile.emit("telemetry", data);
  }, INTERVAL);
});
