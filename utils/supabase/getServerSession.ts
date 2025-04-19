import { createClient } from "@/utils/supabase/server";
import { User } from "@supabase/supabase-js";
import { resolve } from "path";

export async function getServerSession() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;
  const res = await supabase.from("profiles").select("*").eq("id", user.id);
  if (!res.data) return null;
  const sessionData = { ...user, schoolId: res.data[0].school_id };
  return sessionData;
}
