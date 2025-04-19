"use client"; // ✅ Next.js에서 클라이언트 컴포넌트로 동작하도록 지정

// 📦 UI 컴포넌트 임포트
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

// 📦 폼 관련 라이브러리 및 유효성 검사 스키마
import { zodResolver } from "@hookform/resolvers/zod";
import { FieldErrors, useForm } from "react-hook-form";
import { useEffect } from "react";

// 📦 shadcn/ui 기반 폼 레이아웃 컴포넌트
import { Form, FormField, FormControl, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

// 📦 데이터 타입과 Zod 유효성 스키마
import { InsertSchoolActivity, InsertSchoolActivitySchema } from "@/model/InsertSchoolActivity";

// 📦 서버 액션: 생성/수정
import { createSchoolActivity, updateSchoolActivity } from "@/serverAction/schoolActivity";

// 📦 날짜 포맷 유틸, 라우터
import { format } from "date-fns";
import { SelectSchoolActivity } from "@/model/SelectSchoolActivity";
import { useRouter } from "next/navigation";

// 🎯 다이얼로그 Props 타입 정의
interface EditScheduleDialogProps {
  open: boolean; // 다이얼로그 열림 여부
  setOpen: (open: boolean) => void; // 다이얼로그 상태 변경 함수
  selectedSchedule: SelectSchoolActivity | undefined; // 선택된 일정 데이터
}

// 🏫 일정 수정 다이얼로그 컴포넌트
export default function EditScheduleDialog({
  open,
  setOpen,
  selectedSchedule,
}: EditScheduleDialogProps) {
  const router = useRouter(); // 페이지 새로고침을 위한 Next.js 라우터

  // ✅ 폼 초기 설정
  const form = useForm<InsertSchoolActivity>({
    resolver: zodResolver(InsertSchoolActivitySchema), // Zod 유효성 검사 연결
    defaultValues: {
      // ❗ 초기값은 selectedSchedule이 열릴 때 반영되지 않음 → useEffect에서 수동 처리
      start_date: selectedSchedule?.start_date,
      end_date: selectedSchedule?.end_date,
      content: selectedSchedule?.content,
      target: selectedSchedule?.target,
      schedule_time: selectedSchedule?.schedule_time,
      location: selectedSchedule?.location,
      manager: selectedSchedule?.manager,
      meal: selectedSchedule?.meal,
      note: selectedSchedule?.note,
    },
  });

  // ✅ 저장 버튼 클릭 시 실행
  const onSubmit = async (data: InsertSchoolActivity) => {
    console.log("입력된 데이터:", data);

    if (!selectedSchedule) return;

    // 서버로 수정 요청
    const res = await updateSchoolActivity(selectedSchedule.id, data);
    console.log("서버 응답:", res);

    setOpen(false); // 다이얼로그 닫기
    router.refresh(); // 페이지 새로고침
  };

  // ❌ 유효성 검사 실패 시 실행
  const onError = (error: FieldErrors<InsertSchoolActivity>) => {
    console.log("폼 에러:", error);
  };

  // 📌 선택된 일정이 변경되었을 때 폼 필드 값 반영 (다이얼로그 열릴 때 값 반영 보장)
  useEffect(() => {
    if (selectedSchedule) {
      form.setValue("start_date", selectedSchedule.start_date);
      form.setValue("end_date", selectedSchedule.end_date);
      form.setValue("content", selectedSchedule.content);
      form.setValue("target", selectedSchedule.target);
      form.setValue("schedule_time", selectedSchedule.schedule_time);
      form.setValue("location", selectedSchedule.location);
      form.setValue("manager", selectedSchedule.manager);
      form.setValue("meal", selectedSchedule.meal);
      form.setValue("note", selectedSchedule.note);
    }
  }, [selectedSchedule]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>교육활동 내용 추가</DialogTitle>
          <DialogDescription>새로운 교육 활동을 추가하세요.</DialogDescription>
        </DialogHeader>

        {/* ✅ 폼 영역 */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit, onError)}>
            {/* 📅 시작일 필드 */}
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

            {/* 📅 종료일 필드 */}
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

            {/* 📝 활동 내용 */}
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

            {/* 👥 대상 */}
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

            {/* ⏰ 시간 */}
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

            {/* 📍 장소 */}
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

            {/* 🧑 담당자 */}
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

            {/* 🍱 급식 */}
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

            {/* 🗒️ 비고 */}
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

            {/* 🔘 버튼 영역 */}
            <div className="flex justify-end gap-2 pt-2">
              <Button type="submit">수정</Button>
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
