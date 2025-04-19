import { AppSidebar } from "@/components/app-sidebar" // 사이드바 컴포넌트 가져오기
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb" // 경로 탐색(Breadcrumb) UI 컴포넌트 가져오기
import { Separator } from "@/components/ui/separator" // 구분선 컴포넌트 가져오기
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar" // 사이드바 관련 UI 컴포넌트 가져오기
import { Button } from "@/components/ui/button" // 버튼 UI 가져오기
import Link from "next/link" // 페이지 이동을 위한 Next.js Link 가져오기
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table" // 테이블 UI 컴포넌트 가져오기
import Scheduler from "../_components/scheduler" // 일정 관리 컴포넌트 가져오기
import { getSchoolActivity } from "@/serverAction/schoolActivity" // 교육 활동 데이터를 가져오는 서버 액션

// 🏫 CalendarPage 컴포넌트 (비동기 함수)
export default async function CalendarPage() {
  const data = await getSchoolActivity(); // ✅ 서버에서 교육 활동 데이터를 가져오기

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      {/* 일정 관리 컴포넌트(Scheduler) 렌더링, 서버에서 가져온 데이터 전달 */}
      <Scheduler data={data} />
    </div>
  );
}
