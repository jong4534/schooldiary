export interface Document {
  id?: string;
  type: string;
  manager: string;
  content: string;
  enddate?: string | null;
  link?: string | null;
  ect?: string | null;
  created_at?: string;
} 