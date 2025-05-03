import { createClient } from "@/utils/supabase/server";

export interface Diary {
  id: string;
  title: string;
  created_at: string;
  updated_at: string;
}

export async function getUserDiaries(userId: string): Promise<Diary[]> {
  const supabase = await createClient();
  const { data: diaries, error } = await supabase
    .from("user_diary")
    .select("diary:diary_id(id, title, created_at, updated_at)")
    .eq("user_id", userId);

  if (error) {
    // 에러 처리 필요시 여기에 추가
    return [];
  }

  return (diaries || []).map((row: any) => row.diary).filter((d: any) => d);
}
