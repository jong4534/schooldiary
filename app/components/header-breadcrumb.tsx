'use client'; // ✅ Next.js 클라이언트 컴포넌트로 선언

import dynamic from "next/dynamic"; // 동적 로딩을 위한 next/dynamic 가져오기

// 🏷️ 클라이언트 컴포넌트를 동적 로딩 (SSR 비활성화)
const BreadcrumbComponent = dynamic(() => import('./breadcrumb-component'), { ssr: false });

export default function HeaderBreadcrumb() {
  return (
    <BreadcrumbComponent />
  );
}
