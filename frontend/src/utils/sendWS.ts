import type { Message } from "my-shared-ws";

export const sendWS = (ws: WebSocket, data: string) => {
  const message: Message = {
    type: "message",
    content: data,
    sender: "Client",
    timestamp: Date.now(),
  }
  ws.send(JSON.stringify(message));
}