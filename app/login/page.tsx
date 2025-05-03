"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { createClient } from "@/utils/supabase/client";
import Link from "next/link";

const schema = z.object({
  email: z.string().email("유효한 이메일을 입력하세요."),
  password: z.string().min(6, "비밀번호는 6자 이상이어야 합니다."),
});

type FormData = z.infer<typeof schema>;

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    setError("");
    const supabase = createClient();
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });
    if (signInError) {
      setError(signInError.message);
    } else {
      // 로그인 성공 시 원하는 페이지로 이동 등 처리
      window.location.href = "/"; // 예시: 홈으로 이동
    }
    setLoading(false);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white p-8 rounded-lg shadow-md w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">로그인</h2>
        <div className="mb-4">
          <Label htmlFor="email">이메일</Label>
          <Input
            id="email"
            type="email"
            {...register("email")}
            className="mt-1"
            disabled={loading}
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
          )}
        </div>
        <div className="mb-6">
          <Label htmlFor="password">비밀번호</Label>
          <Input
            id="password"
            type="password"
            {...register("password")}
            className="mt-1"
            disabled={loading}
          />
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">
              {errors.password.message}
            </p>
          )}
        </div>
        <Button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white"
          disabled={loading}
        >
          {loading ? "로그인 중..." : "로그인"}
        </Button>
        {error && <p className="text-red-600 text-center mt-4">{error}</p>}
        <Link href="/signup">회원가입</Link>
      </form>
    </div>
  );
}
