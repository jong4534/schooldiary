import Scheduler from "../../_components/scheduler"; // 일정 관리 컴포넌트 가져오기
import { getSchoolActivity } from "@/serverAction/schoolActivity"; // 교육 활동 데이터를 가져오는 서버 액션

interface CalendarPageProps {
  params: Promise<{ diaryId: string }>;
}

// 🏫 CalendarPage 컴포넌트 (비동기 함수)
export default async function CalendarPage({ params }: CalendarPageProps) {
  const { diaryId } = await params;
  const data = await getSchoolActivity(diaryId); // ✅ 서버에서 교육 활동 데이터를 가져오기

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      {/* 일정 관리 컴포넌트(Scheduler) 렌더링, 서버에서 가져온 데이터 전달 */}
      <Scheduler data={data} diaryId={diaryId} />
    </div>
  );
}
