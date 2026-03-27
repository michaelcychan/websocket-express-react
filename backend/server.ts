import express from "express";
import { createServer } from "http";
import { WebSocketServer, WebSocket } from "ws";

const app = express();
const server = createServer(app);

const port: number = parseInt(process.env.PORT || '8080', 10);
const maxClients = 5;

const clients = new Map<WebSocket, {id: number}>();
let nextId = 0;

const wss = new WebSocketServer({ 
  server,
  path: '/chat'
 });

app.get('/', (req, res) => {
  console.log("Received request at /");
  res.status(200).json({ message: 'Server is up and running!', port });
})

server.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});

wss.on('connection', (ws) => {
  
  if (wss.clients.size > maxClients) {
    console.log("Maximum clients reached. Closing new connection.");
    ws.close(1000, "Maximum clients reached");
    return;
  }
  clients.set(ws, { id: nextId++ });
  console.log("WebSocket connection established for client ID:", clients.get(ws)?.id);
  
  
  ws.on('message', (message) => {
    console.log(`Received message from client ID ${clients.get(ws)?.id}: ${message}`);
    for (const client of wss.clients) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(`Client ${clients.get(ws)?.id} says: ${message}`);
      }
    }
  });
  ws.on('close', () => {
    console.log("WebSocket connection closed for client ID:", clients.get(ws)?.id);
    clients.delete(ws);
  })
})