import { MessageSchema, type Message } from "my-shared-ws";
import { WebSocket } from 'ws'

export const parseMessages = (data: WebSocket.RawData): Message | null => {
  try {
    const parsed = JSON.parse(data.toString());
    const result = MessageSchema.safeParse(parsed);
    if (!result.success) {
      console.error("Received invalid message:", result.error);
      return null;
    }
    return result.data;
  } catch (error) {
    console.error("Error parsing message:", error);
    return null;
  }
}