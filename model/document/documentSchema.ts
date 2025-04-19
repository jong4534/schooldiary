import { z } from "zod";

export const DocumentSchema = z.object({
  id: z.string().uuid().optional(),
  type: z.string(),
  manager: z.string(),
  content: z.string(),
  link: z.string().optional(),
  enddate: z.string().optional(),
  ect: z.string().optional(),
  created_at: z.string().datetime().optional(),
  updated_at: z.string().datetime().optional(),
});

export const CreateDocumentSchema = DocumentSchema.omit({
  id: true,
  created_at: true,
  updated_at: true,
});
export const UpdateDocumentSchema = DocumentSchema.partial().required({
  id: true,
});

export type Document = z.infer<typeof DocumentSchema>;
export type CreateDocument = z.infer<typeof CreateDocumentSchema>;
export type UpdateDocument = z.infer<typeof UpdateDocumentSchema>;
