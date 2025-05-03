"use server";

import { createClient } from "@/utils/supabase/server";
import { z } from "zod";
import { CreateDiaryInput, diarySchema } from "@/model/diary/diarySchema";

export async function createDiary(
  userId: string,
  formData: CreateDiaryInput
): Promise<{ id: string }> {
  "use server";

  const supabase = await createClient();
  // 1. diary 생성 (snake_case로 변환)
  const { data: diary, error } = await supabase
    .from("diary")
    .insert([
      {
        title: formData.title,
        is_public: formData.isPublic ?? false,
        is_guest_write: formData.isGuestWrite ?? false,
        is_guest_update: formData.isGuestUpdate ?? false,
        is_guest_delete: formData.isGuestDelete ?? false,
      },
    ])
    .select()
    .single();
  if (error || !diary) {
    throw new Error("다이어리 생성에 실패했습니다.");
  }
  // 2. user_diary에 연결
  await supabase
    .from("user_diary")
    .insert([{ user_id: userId, diary_id: diary.id }]);
  return { id: diary.id };
}
