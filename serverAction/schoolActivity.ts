"use server";

import { createClient } from "@/utils/supabase/server";
import { InsertSchoolActivity } from "@/model/InsertSchoolActivity";

export async function createSchoolActivity(data: InsertSchoolActivity) {
  const supabase = await createClient();
  const { data: newData, error } = await supabase
    .from("school_activity")
    .insert(data);

  if (error) {
    console.log(error.message);
    throw new Error(error.message);
  }
  return newData;
}

export async function getSchoolActivity(diaryId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("school_activity")
    .select("*")
    .eq("diary_id", diaryId);

  if (error) throw new Error(error.message);

  return data;

  // return 1;
}

export async function updateSchoolActivity(id: number, updateData: InsertSchoolActivity) {
  const supabase = await createClient();
  const { data, error} = await supabase.from("school_activity").update(updateData).eq('id', id);
  if (error) throw new Error(error.message);

  return data;
}

export async function deleteSchoolActivity(id: number) {
  const supabase = await createClient();
  
  const { error } = await supabase.from("school_activity").delete().eq("id", id);

  if (error) throw new Error(error.message);

}