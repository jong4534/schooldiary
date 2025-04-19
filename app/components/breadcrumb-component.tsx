'use client'; // ✅ Next.js 클라이언트 컴포넌트로 선언

import { usePathname } from 'next/navigation'; // <- 추가: 경로 확인 훅
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator, // <- 추가: 구분자 컴포넌트
} from "@/components/ui/breadcrumb"; // Breadcrumb UI 컴포넌트 가져오기

// 🏷️ BreadcrumbComponent 컴포넌트
export default function BreadcrumbComponent() {
  const pathname = usePathname(); // <- 추가: 현재 경로 가져오기

  // 경로에 따라 제목 결정
  let pageTitle = '';
  if (pathname === '/calendar') {
    pageTitle = '월중계획';
  } else if (pathname === '/docslink') {
    pageTitle = '공유문서';
  }
  // 다른 경로에 대한 기본값 또는 추가 로직이 필요하면 여기에 추가

  // 페이지 제목이 있을 경우에만 Breadcrumb 표시
  if (!pageTitle) {
    return null; 
  }

  return (
    // Breadcrumb (현재 페이지 위치 표시)
    <Breadcrumb>
      <BreadcrumbList>
        {/* 상위 메뉴 */}
        <BreadcrumbItem>
          <BreadcrumbPage>공동작업</BreadcrumbPage>
        </BreadcrumbItem>
        {/* 구분자 */}
        <BreadcrumbSeparator />
        {/* 현재 페이지 */}
        <BreadcrumbItem>
          <BreadcrumbPage>{pageTitle}</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}
