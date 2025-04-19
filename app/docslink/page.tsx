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
  import { useState, useEffect } from "react"; // useState 훅 가져오기
  import { LucideEdit, LucideTrash } from "lucide-react"; // 아이콘 가져오기
  import { Document } from "@/model/document/documentSchema";
  import {
    createDocument,
    deleteDocument,
    getDocuments,
    updateDocument,
  } from "@/serverAction/documentAction";

  // 빈 문서 객체 초기 상태
  const emptyDocument = {
    manager: "",
    content: "",
    enddate: "",
    link: "",
    ect: "",
  };

  // DocsLinkPage 컴포넌트 정의 (클라이언트 컴포넌트)
  export default function DocsLinkPage() {
    // 상태 변수 정의
    const [docs, setDocs] = useState<Document[]>([]);
    const [loading, setLoading] = useState(true);
    const [newDoc, setNewDoc] = useState<Partial<Document>>({
      ...emptyDocument,
    });
    const [editingDoc, setEditingDoc] = useState<Document | null>(null);

    // 데이터 로드
    useEffect(() => {
      async function loadDocuments() {
        try {
          const documents = await getDocuments();
          setDocs(documents);
        } catch (error) {
          console.error("문서 로드 중 오류 발생:", error);
        } finally {
          setLoading(false);
        }
      }

      loadDocuments();
    }, []);

    // 입력 변경 핸들러
    const handleInputChange = (field: keyof Document, value: string) => {
      setNewDoc((prev) => ({
        ...prev,
        [field]: value,
      }));
    };

    // 행 추가 핸들러
    const handleAddDoc = async () => {
      if (!newDoc.manager && !newDoc.content) {
        // 필수 필드가 비어있으면 아무 작업도 하지 않음
        alert("담당자와 내용은 필수 항목입니다.");
        return;
      }

      try {
        const docToCreate = {
          type: (docs.length + 1).toString(), // 간단한 고유 키 생성
          manager: newDoc.manager || "",
          content: newDoc.content || "",
          enddate: newDoc.enddate,
          link: newDoc.link,
          ect: newDoc.ect,
        };

        await createDocument(docToCreate);
        const updatedDocs = await getDocuments();
        setDocs(updatedDocs);

        // 입력 필드 초기화
        setNewDoc({ ...emptyDocument });
      } catch (error) {
        console.error("문서 추가 중 오류 발생:", error);
        alert("문서를 추가하는 중 오류가 발생했습니다.");
      }
    };

    // 삭제 핸들러
    const handleDeleteDoc = async (id: string) => {
      if (confirm("이 문서를 삭제하시겠습니까?")) {
        try {
          await deleteDocument(id);
          const updatedDocs = await getDocuments();
          setDocs(updatedDocs);
        } catch (error) {
          console.error("문서 삭제 중 오류 발생:", error);
          alert("문서를 삭제하는 중 오류가 발생했습니다.");
        }
      }
    };

    // 수정 핸들러
    const handleEditClick = (doc: Document) => {
      setEditingDoc(doc);
      setNewDoc({
        manager: doc.manager,
        content: doc.content,
        enddate: doc.enddate || "",
        link: doc.link || "",
        ect: doc.ect || "",
      });
    };

    // 수정 저장 핸들러
    const handleUpdateDoc = async () => {
      if (!editingDoc?.id) return;

      try {
        const updatedDoc = {
          id: editingDoc.id,
          ...newDoc,
        };

        await updateDocument(updatedDoc);
        const updatedDocs = await getDocuments();
        setDocs(updatedDocs);

        // 입력 필드 초기화 및 편집 모드 종료
        setNewDoc({ ...emptyDocument });
        setEditingDoc(null);
      } catch (error) {
        console.error("문서 수정 중 오류 발생:", error);
        alert("문서를 수정하는 중 오류가 발생했습니다.");
      }
    };

    // 수정 취소 핸들러
    const handleCancelEdit = () => {
      setEditingDoc(null);
      setNewDoc({ ...emptyDocument });
    };

    if (loading) {
      return <div className="mt-10 text-center">로딩 중...</div>;
    }

    return (
      <div className="mt-10">
        <Table className="border-b">
          <TableCaption>문서 링크 목록</TableCaption>
          <TableHeader>
            <TableRow className="bg-gray-100 [&>*]:text-black [&>*]:font-medium">
              <TableHead className="w-[20px] border-r border-gray-300 text-center">
                순
              </TableHead>
              <TableHead className="w-[20px] border-r border-gray-300 text-center">
                담당자
              </TableHead>
              <TableHead className="w-[300px] border-r border-gray-300 text-center">
                내용
              </TableHead>
              <TableHead className="w-[100px] border-r border-gray-300 text-center">
                마감기한
              </TableHead>
              <TableHead className="w-[300px] border-r border-gray-300 text-center">
                링크
              </TableHead>
              <TableHead className="w-[300px] border-r border-gray-300 text-center">
                비고
              </TableHead>
              <TableHead className="w-[50px] text-center">관리</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {/* 입력 행 */}
            <TableRow className="border-b">
              <TableCell className="w-[20px] border-r border-gray-300 text-center"></TableCell>
              <TableCell className="w-[20px] border-r border-gray-300 p-0">
                <input
                  type="text"
                  className="w-full h-full px-2 py-2 border-0 focus:outline-none focus:ring-0 text-center"
                  placeholder="담당자"
                  value={newDoc.manager}
                  onChange={(e) => handleInputChange("manager", e.target.value)}
                />
              </TableCell>
              <TableCell className="w-[300px] border-r border-gray-300 p-0">
                <input
                  type="text"
                  className="w-full h-full px-2 py-2 border-0 focus:outline-none focus:ring-0 text-center"
                  placeholder="내용"
                  value={newDoc.content}
                  onChange={(e) => handleInputChange("content", e.target.value)}
                />
              </TableCell>
              <TableCell className="w-[100px] border-r border-gray-300 p-0">
                <div className="flex items-center h-full justify-center">
                  <Button
                    variant="outline"
                    size="sm"
                    className={`h-6 px-2 text-xs ml-1 mr-1 border-gray-300 ${
                      newDoc.enddate === "해당없음" ? "bg-gray-300" : ""
                    }`}
                    onClick={() => handleInputChange("enddate", "해당없음")}
                  >
                    해당없음
                  </Button>
                  <div
                    className="h-full cursor-pointer"
                    onClick={() => {
                      if (newDoc.enddate === "해당없음") {
                        handleInputChange("enddate", "");
                      }
                    }}
                  >
                    <input
                      type="date"
                      className="h-full px-2 py-2 border-0 focus:outline-none focus:ring-0 disabled:bg-gray-100 disabled:cursor-not-allowed"
                      value={
                        newDoc.enddate === "해당없음" ? "" : newDoc.enddate
                      }
                      onChange={(e) =>
                        handleInputChange("enddate", e.target.value)
                      }
                      disabled={newDoc.enddate === "해당없음"}
                      style={{
                        pointerEvents:
                          newDoc.enddate === "해당없음" ? "none" : "auto",
                      }}
                    />
                  </div>
                </div>
              </TableCell>
              <TableCell className="w-[300px] border-r border-gray-300 p-0">
                <input
                  type="text"
                  className="w-full h-full px-2 py-2 border-0 focus:outline-none focus:ring-0"
                  placeholder="링크를 입력하세요."
                  value={newDoc.link}
                  onChange={(e) => handleInputChange("link", e.target.value)}
                />
              </TableCell>
              <TableCell className="w-[300px] border-r border-gray-300 p-0">
                <input
                  type="text"
                  className="w-full h-full px-2 py-2 border-0 focus:outline-none focus:ring-0"
                  placeholder="참고할 내용을 입력하세요."
                  value={newDoc.ect}
                  onChange={(e) => handleInputChange("ect", e.target.value)}
                />
              </TableCell>
              <TableCell className="w-[50px] text-center">
                {editingDoc ? (
                  <div className="flex justify-center gap-1">
                    <Button
                      className="h-6 w-6 rounded-full bg-green-200 hover:bg-green-300 text-black"
                      variant="ghost"
                      size="sm"
                      onClick={handleUpdateDoc}
                    >
                      ✓
                    </Button>
                    <Button
                      className="h-6 w-6 rounded-full bg-red-200 hover:bg-red-300 text-black"
                      variant="ghost"
                      size="sm"
                      onClick={handleCancelEdit}
                    >
                      ✕
                    </Button>
                  </div>
                ) : (
                  <Button
                    className="h-6 w-6 rounded-full bg-gray-200 hover:bg-gray-300 text-black"
                    variant="ghost"
                    size="sm"
                    onClick={handleAddDoc}
                  >
                    +
                  </Button>
                )}
              </TableCell>
            </TableRow>
            {/* 기존 데이터 행들 */}
            {docs.map((doc) => (
              <TableRow key={doc.id}>
                <TableCell className="w-[20px] font-medium border-r border-gray-300 text-center">
                  {doc.type}
                </TableCell>
                <TableCell className="w-[20px] border-r border-gray-300 text-center">
                  {doc.manager}
                </TableCell>
                <TableCell className="w-[300px] border-r border-gray-300 text-center">
                  {doc.content}
                </TableCell>
                <TableCell className="w-[100px] border-r border-gray-300 text-center">
                  {doc.enddate}
                </TableCell>
                <TableCell className="w-[300px] border-r border-gray-300 text-left">
                  <a
                    href={doc.link || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 hover:underline"
                  >
                    {doc.link}
                  </a>
                </TableCell>
                <TableCell className="w-[300px] border-r border-gray-300 text-left">
                  {doc.ect}
                </TableCell>
                <TableCell className="w-[50px] text-center">
                  <div className="flex justify-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 rounded-full bg-gray-200 hover:bg-gray-300"
                      onClick={() => handleEditClick(doc)}
                    >
                      <LucideEdit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 rounded-full bg-gray-200 hover:bg-gray-200 text-black-300"
                      onClick={() => doc.id && handleDeleteDoc(doc.id)}
                    >
                      <LucideTrash className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter></TableFooter>
        </Table>
      </div>
    );
  }
  