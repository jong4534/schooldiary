import { cn } from "@/lib/utils"; // ✅ 클래스명을 동적으로 조합하는 유틸리티 함수
import { Button } from "@/components/ui/button"; // ✅ 버튼 컴포넌트
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"; // ✅ 카드 UI 컴포넌트
import { Input } from "@/components/ui/input"; // ✅ 입력 필드 컴포넌트
import { Label } from "@/components/ui/label"; // ✅ 라벨 컴포넌트

// 🔐 로그인 폼 컴포넌트
export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  return (
    // ✅ 컨테이너 div (클래스명 동적 조합 가능)
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      
      {/* ✅ 로그인 카드 */}
      <Card>
        {/* ✅ 카드 헤더 (타이틀 & 설명) */}
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>

        {/* ✅ 카드 컨텐츠 (로그인 폼) */}
        <CardContent>
          <form>
            <div className="flex flex-col gap-6">
              
              {/* ✅ 이메일 입력 필드 */}
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                />
              </div>

              {/* ✅ 비밀번호 입력 필드 */}
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  {/* 🔗 비밀번호 찾기 링크 */}
                  <a
                    href="#"
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                  >
                    Forgot your password?
                  </a>
                </div>
                <Input id="password" type="password" required />
              </div>

              {/* ✅ 로그인 버튼 */}
              <Button type="submit" className="w-full">
                Login
              </Button>

              {/* ✅ 구글 로그인 버튼 */}
              <Button variant="outline" className="w-full">
                Login with Google
              </Button>
            </div>

            {/* ✅ 회원가입 링크 */}
            <div className="mt-4 text-center text-sm">
              Don&apos;t have an account?{" "}
              <a href="#" className="underline underline-offset-4">
                Sign up
              </a>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
