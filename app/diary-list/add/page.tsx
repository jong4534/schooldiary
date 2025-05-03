import { redirect } from "next/navigation";
import { getServerSession } from "@/utils/supabase/getServerSession";
import AddDiaryForm from "./_components/AddDiaryForm";

export default async function AddDiaryPage() {
  const user = await getServerSession();
  if (!user) {
    redirect("/login");
  }

  return (
    <div className="max-w-md mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-6 text-center">
        새 다이어리 만들기
      </h1>
      <AddDiaryForm userId={user.id} />
    </div>
  );
}
