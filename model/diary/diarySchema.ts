import { z } from "zod";

export const diarySchema = z.object({
  id: z.string().describe("다이어리 아이디"),
  title: z.string().describe("다이어리 제목 2025 칠곡초등학교"),
  isPublic: z.boolean().describe("공개 여부"),
  isGuestWrite: z.boolean().describe("게스트 작성 여부"),
  isGuestUpdate: z.boolean().describe("게스트 수정 여부"),
  isGuestDelete: z.boolean().describe("게스트 삭제 여부"),
  createdAt: z.string().describe("생성일"),
  updatedAt: z.string().describe("수정일"),
});

// 다이어리 생성에 필요한 입력값만 별도 스키마 정의 (id, createdAt 등 제외)
export const createDiaryInputSchema = z.object({
  title: z.string().min(2, "다이어리 이름을 입력하세요."),
  isPublic: z.boolean().optional(),
  isGuestWrite: z.boolean().optional(),
  isGuestUpdate: z.boolean().optional(),
  isGuestDelete: z.boolean().optional(),
});

export type CreateDiaryInput = z.infer<typeof createDiaryInputSchema>;
