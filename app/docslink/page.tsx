"use client"; // 클라이언트 컴포넌트로 변경

import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"
  import { Button } from "@/components/ui/button"
  import { useState } from "react" // useState 훅 가져오기
  import { LucideEdit, LucideTrash } from "lucide-react" // 아이콘 가져오기
  
  // 초기 데이터 (컴포넌트 외부 또는 내부에서 정의)
  const initialDocs = [
    {
      type: "1",
      manager: "김종윤",
      content: "정보공시 담당자 지정",
      link: "https://www.google.com",
      enddate: "2025-04-15",
      ect: "정보공시 담당자 지정 완료해 주세요.",
    },
    {
      type: "2",
      manager: "Pending",
      content: "$150.00",
      link: "https://docs.google.com/spreadsheets/d/1Ae88oBqcp7qEgPJslRQnXONjGxbiSavZpdsrFF5Uh7k/edit?gid=0#gid=0",
      enddate: "Credit Card",
      ect: "Credit Card",
    },
    {
      type: "3",
      manager: "Unpaid",
      content: "$350.00",
      link: "Bank Transfer",
      enddate: "Credit Card",
      ect: "Credit Card",
    },
    {
      type: "4",
      manager: "Paid",
      content: "$450.00",
      link: "Credit Card",
      enddate: "Credit Card",
      ect: "Credit Card",
    },
    {
      type: "5",
      manager: "Paid",
      content: "$550.00",
      link: "PayPal",
      enddate: "Credit Card",
      ect: "Credit Card",
    },
    {
      type: "6",
      manager: "Pending",
      content: "$200.00",
      link: "Bank Transfer",
      enddate: "Credit Card",
      ect: "Credit Card",
    },
    {
      type: "7",
      manager: "Unpaid",
      content: "$300.00",
      link: "Credit Card",
      enddate: "Credit Card",
      ect: "Credit Card",
    },
  ]
  
  // DocsLinkPage 컴포넌트 정의 (클라이언트 컴포넌트)
  export default function DocsLinkPage() {
    // 상태 변수 정의
    const [docs, setDocs] = useState(initialDocs); // 테이블 데이터 상태
    const [newManager, setNewManager] = useState("");
    const [newContent, setNewContent] = useState("");
    const [newEndDate, setNewEndDate] = useState("");
    const [newLink, setNewLink] = useState("");
    const [newEct, setNewEct] = useState("");
  
    // 행 추가 핸들러
    const handleAddDoc = () => {
      if (!newManager && !newContent && !newEndDate && !newLink && !newEct) {
        // 모든 필드가 비어있으면 아무 작업도 하지 않음
        alert("입력된 내용이 없습니다.");
        return;
      }
  
      const newDoc = {
        type: (docs.length + 1).toString(), // 간단한 고유 키 생성
        manager: newManager,
        content: newContent,
        enddate: newEndDate,
        link: newLink,
        ect: newEct,
      };
  
      setDocs([...docs, newDoc]); // 기존 docs 배열에 새 객체 추가
  
      // 입력 필드 초기화
      setNewManager("");
      setNewContent("");
      setNewEndDate("");
      setNewLink("");
      setNewEct("");
    };
  
    return (
      <div className="mt-10">
        <Table className="border-b">
          <TableCaption>A list of your recent invoices.</TableCaption>
          <TableHeader>
            <TableRow className="bg-gray-100 [&>*]:text-black [&>*]:font-medium">
              <TableHead className="w-[20px] border-r border-gray-300 text-center">순</TableHead>
              <TableHead className="w-[20px] border-r border-gray-300 text-center">담당자</TableHead>
              <TableHead className="w-[300px] border-r border-gray-300 text-center">내용</TableHead>
              <TableHead className="w-[100px] border-r border-gray-300 text-center">마감기한</TableHead>
              <TableHead className="w-[300px] border-r border-gray-300 text-center">링크</TableHead>
              <TableHead className="w-[300px] border-r border-gray-300 text-center">비고</TableHead>
              <TableHead className="w-[50px] text-center">""</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {/* 입력 행 */}
            <TableRow className="border-b">
              <TableCell className="w-[20px] border-r border-gray-300 text-center"></TableCell>
              <TableCell className="w-[20px] border-r border-gray-300 p-0"><input type="text" className="w-full h-full px-2 py-2 border-0 focus:outline-none focus:ring-0 text-center" placeholder="담당자" value={newManager} onChange={(e) => setNewManager(e.target.value)} /></TableCell>
              <TableCell className="w-[300px] border-r border-gray-300 p-0"><input type="text" className="w-full h-full px-2 py-2 border-0 focus:outline-none focus:ring-0 text-center" placeholder="내용" value={newContent} onChange={(e) => setNewContent(e.target.value)} /></TableCell>
              <TableCell className="w-[100px] border-r border-gray-300 p-0">
                <div className="flex items-center h-full justify-center">
                  <Button variant="outline" size="sm" className={`h-6 px-2 text-xs ml-1 mr-1 border-gray-300 ${newEndDate === "해당없음" ? 'bg-gray-300' : ''}`} onClick={() => setNewEndDate("해당없음")}>해당없음</Button>
                  <div className="h-full cursor-pointer" onClick={() => { if (newEndDate === "해당없음") { setNewEndDate(""); } }}>
                    <input type="date" className="h-full px-2 py-2 border-0 focus:outline-none focus:ring-0 disabled:bg-gray-100 disabled:cursor-not-allowed" value={newEndDate === "해당없음" ? "" : newEndDate} onChange={(e) => setNewEndDate(e.target.value)} disabled={newEndDate === "해당없음"} style={{ pointerEvents: newEndDate === "해당없음" ? 'none' : 'auto' }} />
                  </div>
                </div>
              </TableCell>
              <TableCell className="w-[300px] border-r border-gray-300 p-0"><input type="text" className="w-full h-full px-2 py-2 border-0 focus:outline-none focus:ring-0" placeholder="링크를 입력하세요." value={newLink} onChange={(e) => setNewLink(e.target.value)} /></TableCell>
              <TableCell className="w-[300px] border-r border-gray-300 p-0"><input type="text" className="w-full h-full px-2 py-2 border-0 focus:outline-none focus:ring-0" placeholder="참고할 내용을 입력하세요." value={newEct} onChange={(e) => setNewEct(e.target.value)} /></TableCell>
              <TableCell className="w-[50px] text-center"><Button className="h-6 w-6 rounded-full bg-gray-200 hover:bg-gray-300 text-black" variant="ghost" size="sm" onClick={handleAddDoc}>+</Button></TableCell>
            </TableRow>
            {/* 기존 데이터 행들 - JSX 포맷팅 정리 */}
            {docs
              .sort((a, b) => parseInt(b.type) - parseInt(a.type))
              .map((doc) => (
                <TableRow key={doc.type}>
                  <TableCell className="w-[20px] font-medium border-r border-gray-300 text-center">{doc.type}</TableCell>
                  <TableCell className="w-[20px] border-r border-gray-300 text-center">{doc.manager}</TableCell>
                  <TableCell className="w-[300px] border-r border-gray-300 text-center">{doc.content}</TableCell>
                  <TableCell className="w-[100px] border-r border-gray-300 text-center">{doc.enddate}</TableCell>
                  <TableCell className="w-[300px] border-r border-gray-300 text-left"><a href={doc.link} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 hover:underline">{doc.link}</a></TableCell>
                  <TableCell className="w-[300px] border-r border-gray-300 text-left">{doc.ect}</TableCell>
                  <TableCell className="w-[50px] text-center">
                    <div className="flex justify-center gap-1">
                      <Button variant="ghost" size="sm" className="h-6 w-6 rounded-full bg-gray-200 hover:bg-gray-300" onClick={() => console.log("Edit clicked for:", doc.type)}><LucideEdit className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="sm" className="h-6 w-6 rounded-full bg-gray-200 hover:bg-gray-200 text-black-300" onClick={() => console.log("Delete clicked for:", doc.type)}><LucideTrash className="h-4 w-4" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
          <TableFooter>

          </TableFooter>
        </Table>
      </div>
    )
  }
  