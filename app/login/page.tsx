import { LoginForm } from "@/components/login-form"; // 로그인 폼 컴포넌트 가져오기

// 🔐 로그인 페이지 컴포넌트
export default function LoginPage() {
  return (
    // 페이지 전체를 중앙 정렬하는 컨테이너
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        {/* 로그인 폼 렌더링 */}
        <LoginForm />
      </div>
    </div>
  );
}
