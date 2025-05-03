"use client"; // Next.js에서 클라이언트 컴포넌트로 사용하도록 선언

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { format } from "date-fns"; // 날짜 포맷팅을 위한 라이브러리
import { useRouter } from "next/navigation"; // Next.js 라우팅을 위한 훅
import AddScheduleDialog from "../components/AddScheduleDialog"; // 일정 추가 다이얼로그 컴포넌트 가져오기
import { SelectSchoolActivity } from "@/model/SelectSchoolActivity"; // 교육 활동 데이터 타입 가져오기
import { LucideEdit, LucideTrash } from "lucide-react";
import EditScheduleDialog from "../components/EditScheduleDialog";
import { deleteSchoolActivity } from "@/serverAction/schoolActivity";

// Scheduler 컴포넌트에 필요한 props 정의
interface SchedulerProps {
  data: SelectSchoolActivity[]; // 교육 활동 데이터 배열
  diaryId: string;
}

// Scheduler 컴포넌트 정의
const Scheduler = ({ data, diaryId }: SchedulerProps) => {
  const router = useRouter(); // Next.js 라우터 사용
  const [currentDate, setCurrentDate] = useState(new Date()); // 현재 날짜 상태
  const [open, setOpen] = useState(false); // 다이얼로그 상태 추가
  const [editOpen, setEditOpen] = useState(false);
  const [selectedSchedule, setSelectedSchedule] =
    useState<SelectSchoolActivity>();
  const [selectedDate, setSelectedDate] = useState<string>(
    format(new Date(), "yyyy-MM-dd")
  ); //내가 추가

  // 현재 월의 일 수 계산
  const daysInMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0
  ).getDate();

  // 현재 월의 첫 번째 날의 요일을 계산 (0: 일요일, 1: 월요일, ...)
  const firstDayOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  ).getDay();

  // 이전 달로 이동하는 함수
  const prevMonth = () => {
    const prevDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() - 1,
      1
    );
    console.log(format(prevDate, "yyyy-MM-dd")); // 콘솔에 이전 달 정보 출력
    setCurrentDate(prevDate); // 현재 날짜 업데이트
    router.push(`?month=${format(prevDate, "yyyy-MM")}`); // URL 쿼리 업데이트
  };

  // 다음 달로 이동하는 함수
  const nextMonth = () => {
    const nextMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      1
    );
    setCurrentDate(nextMonth); // 현재 날짜 업데이트
    router.push(`?month=${format(nextMonth, "yyyy-MM")}`); // URL 쿼리 업데이트
  };

  // 일정 추가 버튼 클릭 시 다이얼로그 열기
  const handleAddSchedule = () => {
    setOpen(true);
  };

  // 달력 렌더링 함수
  const renderCalendar2 = () => {
    const days: React.ReactNode[] = [];

    // 헤더(요일 및 컬럼 제목) 추가
    days.push(
      <div key={"header"} className="p-2 w-full border flex gap-2 bg-gray-100">
        <div className="border-r border-r-gray-400 px-2 w-[150px] flex items-center justify-center font-medium">
          날짜
        </div>
        <div className="flex gap-2 flex-1">
          <div className="border-r border-r-gray-400 flex-1 flex items-center justify-center font-medium">
            교육활동 내용
          </div>
        </div>
        <div className="flex gap-2 flex-[0.5]">
          <div className="flex-1 flex items-center justify-center font-medium">
            비고
          </div>
        </div>
      </div>
    );

    // 각 날짜별 셀 추가
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        day
      );
      const dayOfWeek = ["일", "월", "화", "수", "목", "금", "토"][
        date.getDay()
      ];
      const isWeekend = dayOfWeek === "토" || dayOfWeek === "일"; // 주말 여부 확인

      // 날짜를 "00월 00일(월)" 형식으로 변환
      const formattedYear = currentDate.getFullYear();
      const formattedDay = day < 10 ? `0${day}` : day;
      const formattedMonth =
        currentDate.getMonth() + 1 < 10
          ? `0${currentDate.getMonth() + 1}`
          : currentDate.getMonth() + 1;

      days.push(
        <div
          key={day}
          className={`p-2 w-full border flex gap-2 ${
            isWeekend ? "bg-red-50" : ""
          }`} // 주말이면 배경색 변경
        >
          <div className="border-r border-r-gray-200 px-2 w-[150px] flex items-center">
            <div className="flex items-center gap-1">
              <span className="font-light">
                {formattedMonth}월 {formattedDay}일({dayOfWeek})
              </span>{" "}
              {/* 날짜와 요일 한 줄로 표시 */}
              <Button
                onClick={() => {
                  const selected = `${formattedYear}-${formattedMonth}-${formattedDay}`;
                  setSelectedDate(selected);
                  setOpen(true);
                  console.log("💡 selectedDate:", selectedDate);
                }}
                className="ml-2 w-4 h-4 text-xs p-0 rounded-full bg-gray-400 text-white"
              >
                +
              </Button>
            </div>
          </div>
          <div className="flex gap-2 flex-1">
            {/* 교육활동 내용 영역 */}
            <div className="flex-1">
              {data.map((item) => {
                if (
                  item.start_date ===
                  `${formattedYear}-${formattedMonth}-${formattedDay}`
                ) {
                  return (
                    <div key={item.id} className="flex rounded-md">
                      {/* ✅ 교육활동 내용 */}
                      <div
                        className="flex-1 px-2 py-0.5 cursor-pointer hover:bg-accent text-sm leading-tight"
                        onClick={() => {
                          setSelectedSchedule(item);
                          setEditOpen(true);
                        }}
                      >
                        <span className="font-medium">{item.content}</span>
                        {item.target && item.target.trim() !== "" && (
                          <span className="text-muted-foreground text-sm">
                            {" "}
                            | 대상: {item.target}
                          </span>
                        )}
                        {item.location && item.location.trim() !== "" && (
                          <span className="text-muted-foreground text-sm">
                            {" "}
                            | 장소: {item.location}
                          </span>
                        )}
                        {item.manager && item.manager.trim() !== "" && (
                          <span className="text-muted-foreground text-sm">
                            {" "}
                            | 담당자: {item.manager}
                          </span>
                        )}
                        {item.meal && item.meal.trim() !== "" && (
                          <span className="text-muted-foreground text-sm">
                            {" "}
                            | 급식: {item.meal}
                          </span>
                        )}
                      </div>

                      {/* <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedSchedule(item);
                            setEditOpen(true);
                          }}
                        >
                          <LucideEdit />
                        </Button> */}
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={async (e) => {
                          e.stopPropagation();
                          if (window.confirm("정말로 삭제하시겠습니까?")) {
                            await deleteSchoolActivity(item.id);
                            router.refresh();
                          }
                        }}
                      >
                        <LucideTrash />
                      </Button>

                      {/* 비고 칸 */}
                      <div className="flex flex-[0.52] gap-1 items-center justify-start pr-2">
                        {item.note && (
                          <span className="text-muted-foreground text-black text-sm text-left whitespace-pre-wrap pl-5">
                            {item.note}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                }
              })}
            </div>
          </div>
        </div>
      );
    }
    return days;
  };

  return (
    <>
      {/* ✅ 일정 추가 다이얼로그 추가 */}
      <AddScheduleDialog
        open={open}
        setOpen={setOpen}
        selectedSchedule={selectedSchedule}
        selectedDate={selectedDate}
        diaryId={diaryId}
      />
      <EditScheduleDialog
        open={editOpen}
        setOpen={setEditOpen}
        selectedSchedule={selectedSchedule}
      />

      {/* 헤더 영역 - 상단 패딩 축소 */}
      <div className="flex justify-center items-center gap-2 pt-1 px-4 pb-4">
        <div className="flex items-center gap-4">
          {/* 이전 달 버튼 */}
          <Button
            onClick={prevMonth}
            size="sm"
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 w-8 h-8 rounded-md p-0 shadow-none"
          >
            &lt;
          </Button>
          {/* 현재 년도 및 월 표시 */}
          <p className="font-medium text-lg">
            {currentDate.getFullYear()}년 {currentDate.getMonth() + 1}월
          </p>
          {/* 다음 달 버튼 */}
          <Button
            onClick={nextMonth}
            size="sm"
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 w-8 h-8 rounded-md p-0 shadow-none"
          >
            &gt;
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-1 w-full p-4">{renderCalendar2()}</div>
    </>
  );
};

export default Scheduler;
