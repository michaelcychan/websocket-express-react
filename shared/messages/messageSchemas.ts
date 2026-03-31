import { z } from "zod";

export const MessageSchema = z.object({
  type: z.literal("message"),
  content: z.string(),
  sender: z.string(),
  timestamp: z.number(),
})

export type Message = z.infer<typeof MessageSchema>;

export const SystemHeartBeatSchema = z.object({
  type: z.literal("heartbeat"),
  timestamp: z.number(),
})
export type SystemHeartBeat = z.infer<typeof SystemHeartBeatSchema>;