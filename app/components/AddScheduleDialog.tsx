"use client"; // Next.js 클라이언트 컴포넌트로 선언

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod"; // Zod 유효성 검사를 위한 리졸버
import { FieldErrors, useForm } from "react-hook-form"; // React Hook Form 가져오기
import { useState } from "react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

import {
  Form,
  FormField,
  FormControl,
  FormItem,
  FormDescription,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"; // 폼 관련 UI 컴포넌트
import {
  InsertSchoolActivity,
  InsertSchoolActivitySchema,
} from "@/model/InsertSchoolActivity"; // 교육 활동 모델 및 유효성 검사 스키마
import { createSchoolActivity } from "@/serverAction/schoolActivity"; // 교육 활동 생성 API 호출

import { format } from "date-fns"; // 날짜 포맷팅 라이브러리
import { SelectSchoolActivity } from "@/model/SelectSchoolActivity";

// 다이얼로그 속성 정의
interface AddScheduleDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  selectedSchedule: SelectSchoolActivity | undefined;
  selectedDate: string;
}

// 🏫 일정 추가 다이얼로그 컴포넌트
export default function AddScheduleDialog({
  open,
  setOpen,
  selectedSchedule,
  selectedDate,
}: AddScheduleDialogProps) {
  const router = useRouter();
  const today = format(new Date(), "yyyy-MM-dd"); // 현재 날짜를 'YYYY-MM-DD' 형식으로 변환

  // React Hook Form 설정
  const form = useForm<InsertSchoolActivity>({
    resolver: zodResolver(InsertSchoolActivitySchema),
    defaultValues: {
      start_date: selectedDate,
      end_date: selectedDate,
      content: "",
      target: "",
      schedule_time: "",
      location: "",
      manager: "",
      meal: "",
      note: "",
    },
  });

  useEffect(() => {
    if (open) {
      form.reset({
        start_date: selectedDate,
        end_date: selectedDate,
        content: "",
        target: "",
        schedule_time: "",
        location: "",
        manager: "",
        meal: "",
        note: "",
      });
    }
  }, [selectedDate, open, form]);

  // ✅ 일정 추가 버튼 클릭 시 실행되는 함수
  const onSubmit = async (data: InsertSchoolActivity) => {
    console.log(data); // 입력 데이터 콘솔 출력
    const res = await createSchoolActivity(data); // 서버에 데이터 전송
    console.log(res); // 서버 응답 로그 출력
    setOpen(false); // 일정 추가 후 다이얼로그 닫기
    router.refresh(); // 페이지 새로고침
  };

  // ❌ 폼 입력 오류 발생 시 실행되는 함수
  const onError = (error: FieldErrors<InsertSchoolActivity>) => {
    console.log(error);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>교육활동 내용 추가</DialogTitle>
          <DialogDescription>새로운 교육 활동을 추가하세요.</DialogDescription>
        </DialogHeader>
        {/* ✅ 폼 생성 */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit, onError)}>
            {/* 시작일 입력 필드 */}
            <FormField
              control={form.control}
              name="start_date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>시작일</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* 종료일 입력 필드 */}
            <FormField
              control={form.control}
              name="end_date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>종료일</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* 활동 내용 입력 필드 */}
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>활동 내용</FormLabel>
                  <FormControl>
                    <Input type="text" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* 대상 입력 필드 */}
            <FormField
              control={form.control}
              name="target"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>대상</FormLabel>
                  <FormControl>
                    <Input type="text" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* 시간 입력 필드 */}
            <FormField
              control={form.control}
              name="schedule_time"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>시간</FormLabel>
                  <FormControl>
                    <Input type="text" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* 장소 입력 필드 */}
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>장소</FormLabel>
                  <FormControl>
                    <Input type="text" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* 담당자 입력 필드 */}
            <FormField
              control={form.control}
              name="manager"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>담당자</FormLabel>
                  <FormControl>
                    <Input type="text" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* 급식 입력 필드 */}
            <FormField
              control={form.control}
              name="meal"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>급식</FormLabel>
                  <FormControl>
                    <Input type="text" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* 비고 입력 필드 */}
            <FormField
              control={form.control}
              name="note"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>비고</FormLabel>
                  <FormControl>
                    <Input type="text" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* 버튼 영역 */}
            <div className="flex justify-end gap-2 pt-2">
              <Button type="submit">추가</Button>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                닫기
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
