"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { diarySchema } from "@/model/diary/diarySchema";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { createDiary } from "@/serverAction/diaryAction";
import { useRouter } from "next/navigation";
import { useState } from "react";

// id, createdAt, updatedAt 제외한 입력 스키마
const formSchema = diarySchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

type FormValues = z.infer<typeof formSchema>;

interface AddDiaryFormProps {
  userId: string;
}

export default function AddDiaryForm({ userId }: AddDiaryFormProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      isPublic: false,
      isGuestWrite: false,
      isGuestUpdate: false,
      isGuestDelete: false,
    },
  });

  const onSubmit = async (data: FormValues) => {
    setError(null);
    try {
      await createDiary(userId, data);
      router.push("/diary-list");
    } catch (e: any) {
      setError(e.message || "다이어리 생성에 실패했습니다.");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <label className="block mb-2 font-medium">다이어리 이름</label>
        <input
          {...register("title")}
          type="text"
          className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        {errors.title && (
          <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
        )}
      </div>
      <div className="flex flex-col gap-2">
        <label className="font-medium">옵션</label>
        <label className="flex items-center gap-2">
          <input type="checkbox" {...register("isPublic")} /> 공개 다이어리
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" {...register("isGuestWrite")} /> 비회원 글쓰기
          허용
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" {...register("isGuestUpdate")} /> 비회원 수정
          허용
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" {...register("isGuestDelete")} /> 비회원 삭제
          허용
        </label>
      </div>
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "생성 중..." : "다이어리 생성"}
      </Button>
    </form>
  );
}
