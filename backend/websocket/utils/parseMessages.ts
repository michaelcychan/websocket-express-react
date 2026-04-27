import { clientMessageSchema, type ClientMessage } from "my-shared-ws";
import { WebSocket } from 'ws'

export const parseMessages = (data: WebSocket.RawData): ClientMessage | null => {
  try {
    const parsed = JSON.parse(data.toString());
    const result = clientMessageSchema.safeParse(parsed);
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