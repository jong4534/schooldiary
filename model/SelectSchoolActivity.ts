import { z } from "zod";

export const SelectSchoolActivitySchema = z.object({
  id: z.number(),
  start_date: z.string(),
  end_date: z.string(),
  content: z.string(),
  target: z.string().optional(),
  schedule_time: z.string().optional(),
  location: z.string().optional(),
  manager: z.string().optional(),
  meal: z.string().optional(),
  note: z.string().optional(),
  diary_id: z.string(),
  created_at: z.string(),
});

export type SelectSchoolActivity = z.infer<typeof SelectSchoolActivitySchema>;