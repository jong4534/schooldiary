import { z } from "zod";

export const InsertSchoolActivitySchema = z.object({
  start_date: z.string(),
  end_date: z.string(),
  content: z.string(),
  target: z.string().optional(),
  schedule_time: z.string().optional(),
  location: z.string().optional(),
  manager: z.string().optional(),
  meal: z.string().optional(),
  note: z.string().optional(),
});

export type InsertSchoolActivity = z.infer<typeof InsertSchoolActivitySchema>;