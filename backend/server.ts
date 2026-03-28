import express from "express";
import { createServer } from "http";
import rootRouter from "./routes/rootRouter";
import { setUpWebSocketServer } from "./websocket/setUpWebSocketServer";

const app = express();
const server = createServer(app);

const port: number = parseInt(process.env.PORT || '8080', 10);

setUpWebSocketServer(server);

app.use('/', rootRouter);

server.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
