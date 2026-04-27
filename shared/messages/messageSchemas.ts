import { z } from "zod";

export const clientMessageSchema = z.object({
  type: z.literal("message"),
  content: z.string(),
  sender: z.string(),
  timestamp: z.number(),
})

export type ClientMessage = z.infer<typeof clientMessageSchema>;

export const systemHeartBeatSchema = z.object({
  type: z.literal("heartbeat"),
  timestamp: z.number(),
})
export type SystemHeartBeat = z.infer<typeof systemHeartBeatSchema>;

export const systemMessageSchema = z.object({
  type: z.literal("system"),
  content: z.string(),
  timestamp: z.number(),
})

export type SystemMessage = z.infer<typeof systemMessageSchema>;

export const messageSchema = z.union([clientMessageSchema, systemMessageSchema, systemHeartBeatSchema]);
export type Message = z.infer<typeof messageSchema>;