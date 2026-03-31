import { WebSocket, WebSocketServer } from 'ws'
import { createServer } from "http";
import { parse } from 'url';
import { mockAuthentication } from './mockAuthentication';
import type { ClientType } from './clientType';
import { messageSchemas } from "my-shared-ws";
import { parseMessages } from './utils/parseMessages';

const maxClients = 5;
const clients = new Map<WebSocket, ClientType>();
let nextId = 0;

export const setUpWebSocketServer = (server: ReturnType<typeof createServer>) => {
  const wss =  new WebSocketServer({
    server,
    path: '/chat'
  });
  wss.on('connection', async (ws, request) => {
    if (!request.url) {
      console.log("Connection attempt without URL. Closing connection.");
      ws.close(1000, "URL required");
      return;
    }
    const {query} = parse(request.url, true);
    if (!query.username || typeof query.username !== 'string') {
      console.log("Connection attempt without username. Closing connection.");
      ws.close(1000, "Username required");
      return;
    }

    const user = await mockAuthentication(query.username);
    if (!user) {
      console.log(`Authentication failed for username: ${query.username}. Closing connection.`);
      ws.close(1000, "Authentication failed");
      return;
    }
    
    if (wss.clients.size > maxClients) {
      console.log("Maximum clients reached. Closing new connection.");
      ws.close(1000, "Maximum clients reached");
      return;
    }
    clients.set(ws, { id: nextId++, name: user.username });
    console.log("WebSocket connection established for client:", clients.get(ws)?.name);

    for (const client of wss.clients) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(`Client ${clients.get(ws)?.name} has joined the chat.`);
      }
    }
    
    ws.on('message', (message) => {
      const msg = parseMessages(message);
      if (!msg) return;
      for (const client of wss.clients) {
        if (client.readyState === WebSocket.OPEN) {
          client.send(`Client ${clients.get(ws)?.name} says: ${msg.content}`);
        }
      }
    });
    ws.on('close', () => {
      console.log("WebSocket connection closed for client ID:", clients.get(ws)?.name);
      for (const client of wss.clients) {
        if (client.readyState === WebSocket.OPEN) {
          client.send(`Client ${clients.get(ws)?.name} has left the chat.`);
        }
      }
      clients.delete(ws);
    })
  })
  return wss;
}