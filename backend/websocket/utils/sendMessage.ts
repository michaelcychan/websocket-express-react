import { WebSocket } from 'ws'
import type{ ClientMessage, SystemMessage } from "my-shared-ws";

type SendClientMessageProps = {
  ws: WebSocket,
  message: {
    content: string;
    sender: string;
  }
}

export const sendClientMessage = ({ws, message}:SendClientMessageProps ) => {
  const clientMessage: ClientMessage = {
    type: "message",
    content: message.content,
    sender: message.sender,
    timestamp: Date.now(),
  }
  ws.send(JSON.stringify(clientMessage));
}

type SendSystemMessageProps = {
  ws: WebSocket,
  message: {
    content: string;
  }
}

export const sendSystemMessage = ({ws, message}:SendSystemMessageProps ) => {
  const systemMessage: SystemMessage = {
    type: "system",
    content: message.content,
    timestamp: Date.now(),
  }
  ws.send(JSON.stringify(systemMessage));
}