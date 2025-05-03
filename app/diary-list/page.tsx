import Link from "next/link";
import { getServerSession } from "@/utils/supabase/getServerSession";
import { getUserDiaries, Diary } from "@/serverAction/userDiaryAction";

export default async function DiaryListPage() {
  // 로그인 유저 정보 가져오기
  const user = await getServerSession();
  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <p className="mb-4 text-lg">로그인이 필요합니다.</p>
        <Link href="/login" className="text-blue-600 underline">
          로그인 페이지로 이동
        </Link>
      </div>
    );
  }

  // 유저가 속한 다이어리 목록 가져오기
  const diaryList: Diary[] = await getUserDiaries(user.id);

  return (
    <div className="max-w-xl mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-6 text-center">
        내가 속한 다이어리
      </h1>
      {diaryList.length === 0 ? (
        <div className="flex flex-col items-center gap-4 py-10">
          <p className="text-gray-500">아직 속한 다이어리가 없습니다.</p>
          <Link
            href="/diary-list/add"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            새 다이어리 만들기
          </Link>
        </div>
      ) : (
        <ul className="space-y-4">
          {diaryList.map((diary) => (
            <li
              key={diary.id}
              className="border rounded p-4 flex items-center justify-between"
            >
              <span className="font-medium">{diary.title}</span>
              <Link
                href={`/${diary.id}/calendar`}
                className="text-blue-600 hover:underline text-sm"
              >
                다이어리로 이동
              </Link>
            </li>
          ))}
        </ul>
      )}
      {diaryList.length > 0 && (
        <div className="flex justify-center mt-8">
          <Link
            href="/diary-list/add"
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition"
          >
            새 다이어리 만들기
          </Link>
        </div>
      )}
    </div>
  );
}
