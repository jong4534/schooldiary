import { AppSidebar } from "@/components/app-sidebar"; // 앱 사이드바 컴포넌트 가져오기
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb"; // Breadcrumb UI 가져오기
import { Separator } from "@/components/ui/separator"; // 구분선 컴포넌트 가져오기
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"; // 사이드바 관련 UI 컴포넌트 가져오기
import { Button } from "@/components/ui/button"; // 버튼 UI 가져오기
import Link from "next/link"; // 페이지 이동을 위한 Next.js Link 가져오기

// ⚙️ 설정 페이지 컴포넌트
export default function SettingPage() {
  return (
    <SidebarProvider>
      {/* ✅ 사이드바 컴포넌트 */}
      <AppSidebar />

      <SidebarInset>
        {/* ✅ 헤더 영역 */}
        <header className="flex h-16 shrink-0 items-center gap-2 border-b">
          <div className="flex items-center gap-2 px-3">
            <SidebarTrigger /> {/* 사이드바 토글 버튼 */}
            <Separator orientation="vertical" className="mr-2 h-4" /> {/* 구분선 */}
            
            {/* Breadcrumb (현재 위치 표시) */}
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbPage>설정</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

        {/* ✅ 설정 페이지 컨텐츠 영역 */}
        <div className="flex flex-1 flex-col gap-4 p-4">
          <h1 className="text-2xl font-semibold">설정</h1> {/* 설정 페이지 제목 */}
          
          {/* 버튼 (예제) */}
          <Button variant="destructive">버튼</Button>

          {/* 특정 유저 페이지로 이동하는 링크 */}
          <Link href="/user/3" className="text-blue-500 hover:underline">
            유저3페이지
          </Link>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
