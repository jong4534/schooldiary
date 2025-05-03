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
  import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
  } from "@/components/ui/dialog"
  import { Input } from "@/components/ui/input"
  import { Label } from "@/components/ui/label"
  import { Textarea } from "@/components/ui/textarea"
  import { useState, useEffect } from "react"; // useState 훅 가져오기
  import { LucideEdit } from "lucide-react"; // 아이콘 가져오기
  import type { Document } from "@/model/document/documentSchema";
  import {
    createDocument,
    deleteDocument,
    getDocuments,
    updateDocument,
  } from "@/serverAction/documentAction";
  import { useRouter } from "next/navigation";
  import {
    DndContext,
    closestCenter,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent,
  } from '@dnd-kit/core';
  import {
    SortableContext,
    useSortable,
    verticalListSortingStrategy,
    arrayMove,
  } from '@dnd-kit/sortable';
  import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
  } from "@/components/ui/alert-dialog"

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
    const [saving, setSaving] = useState(false);
    const [newDoc, setNewDoc] = useState<Partial<Document>>({
      ...emptyDocument,
    });
    const [editingDoc, setEditingDoc] = useState<Document | null>(null);
    const [open, setOpen] = useState(false);
    const [manageOpen, setManageOpen] = useState(false);
    const [selectedDoc, setSelectedDoc] = useState<Document | null>(null);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [docToDelete, setDocToDelete] = useState<string | null>(null);
    const [tempDocs, setTempDocs] = useState<Document[]>([]); // 임시 순서 저장
    const [isOrderChanged, setIsOrderChanged] = useState(false); // 순서 변경 여부
    const router = useRouter();

    const sensors = useSensors(useSensor(PointerSensor));

    // 데이터 로드
    useEffect(() => {
      async function loadDocuments() {
        try {
          const documents = await getDocuments();
          setDocs(documents || []);
          setTempDocs(documents || []); // 초기 데이터도 임시 상태에 저장
        } catch (error) {
          console.error("문서 로드 중 오류 발생:", error);
          setDocs([]);
          setTempDocs([]);
        } finally {
          setLoading(false);
        }
      }

      loadDocuments();
    }, []);

    const isExpired = (enddate: string | null | undefined): boolean => {
      if (!enddate || enddate === "해당없음") return false;
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const dateToCheck = new Date(enddate);
      return dateToCheck < today;
    };

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
        alert("담당자와 내용은 필수 항목입니다.");
        return;
      }

      setSaving(true);
      try {
        const docToCreate = {
          type: String(docs.length + 1).padStart(3, '0'),
          manager: newDoc.manager || "",
          content: newDoc.content || "",
          enddate: newDoc.enddate,
          link: newDoc.link,
          ect: newDoc.ect,
        };

        const createdDoc = await createDocument(docToCreate);
        
        // 새로운 문서를 상태에 즉시 추가
        const updatedDocs = [createdDoc, ...docs];
        setDocs(updatedDocs);
        setTempDocs(updatedDocs);
        
        setNewDoc({ ...emptyDocument });
        setOpen(false);
      } catch (error) {
        console.error("문서 추가 중 오류 발생:", error);
        alert("문서를 추가하는 중 오류가 발생했습니다.");
      } finally {
        setSaving(false);
      }
    };

    // 삭제 핸들러
    const handleDeleteDoc = async (id: string) => {
      try {
        await deleteDocument(id);
        // 삭제된 문서를 제외한 새로운 배열 생성
        const updatedDocs = docs.filter(doc => doc.id !== id);
        // 남은 문서들의 type 재정렬
        const reorderedDocs = updatedDocs.map((doc, index) => ({
          ...doc,
          type: String(index + 1).padStart(3, '0')
        }));
        
        // 상태 업데이트
        setDocs(reorderedDocs);
        setTempDocs(reorderedDocs);
        
        // 다이얼로그 닫기
        setManageOpen(false);
        setSelectedDoc(null);
        setDeleteDialogOpen(false);
        setDocToDelete(null);

        // 순서도 함께 업데이트
        try {
          await Promise.all(reorderedDocs.map(async (doc) => {
            if (!doc.id) return;
            await updateDocument({
              id: doc.id,
              type: doc.type
            });
          }));
        } catch (error) {
          console.error("순서 업데이트 중 오류 발생:", error);
        }
      } catch (error) {
        console.error("문서 삭제 중 오류 발생:", error);
        alert("문서를 삭제하는 중 오류가 발생했습니다.");
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

    const handleManageClick = (doc: Document) => {
      setSelectedDoc(doc);
      setManageOpen(true);
    };

    const handleManageUpdate = async () => {
      if (!selectedDoc?.id) return;
      try {
        const docToUpdate = {
          id: selectedDoc.id,
          type: selectedDoc.type,
          manager: selectedDoc.manager,
          content: selectedDoc.content,
          enddate: selectedDoc.enddate,
          link: selectedDoc.link,
          ect: selectedDoc.ect
        };
        const updatedDoc = await updateDocument(docToUpdate);
        
        // 현재 문서 목록에서 수정된 문서를 찾아 업데이트
        const updatedDocs = docs.map(doc => 
          doc.id === updatedDoc.id ? updatedDoc : doc
        );
        const updatedTempDocs = tempDocs.map(doc => 
          doc.id === updatedDoc.id ? updatedDoc : doc
        );
        
        setDocs(updatedDocs);
        setTempDocs(updatedTempDocs);
        setManageOpen(false);
        setSelectedDoc(null);
      } catch (error) {
        console.error("문서 수정 중 오류 발생:", error);
        alert("문서를 수정하는 중 오류가 발생했습니다.");
      }
    };

    const handleDragEnd = async (event: DragEndEvent) => {
      const { active, over } = event;
      if (!active?.id || !over?.id || active.id === over.id) return;

      const oldIndex = tempDocs.findIndex((doc) => doc.id === active.id);
      const newIndex = tempDocs.findIndex((doc) => doc.id === over.id);
      
      if (oldIndex === -1 || newIndex === -1) return;

      // 임시 상태만 업데이트
      const newDocs = arrayMove([...tempDocs], oldIndex, newIndex);
      const updatedDocs = newDocs.map((doc, index) => ({
        ...doc,
        type: String(index + 1).padStart(3, '0')
      }));
      
      setTempDocs(updatedDocs);
      setIsOrderChanged(true); // 순서 변경 표시
    };

    // 순서 변경 저장
    const handleSaveOrder = async () => {
      try {
        setSaving(true);
        // 순서대로 type 값을 다시 부여 (역순으로)
        const updatedDocs = tempDocs.map((doc, index) => ({
          ...doc,
          type: String(tempDocs.length - index).padStart(3, '0')
        }));

        // 각 문서의 순서를 개별적으로 업데이트
        await Promise.all(updatedDocs.map(async (doc) => {
          if (!doc.id) return;
          await updateDocument({
            id: doc.id,
            type: doc.type
          });
        }));
        
        setDocs(updatedDocs);
        setTempDocs(updatedDocs);
        setIsOrderChanged(false);
      } catch (error) {
        console.error("순서 업데이트 중 오류 발생:", error);
        alert("순서 저장 중 오류가 발생했습니다.");
      } finally {
        setSaving(false);
      }
    };

    // 순서 변경 취소
    const handleCancelOrder = () => {
      setTempDocs(docs); // 임시 상태를 원래 상태로 복원
      setIsOrderChanged(false);
    };

    const SortableRow = ({ doc }: { doc: Document }) => {
      const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
      } = useSortable({
        id: doc.id || '',
      });

      const style = {
        transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
        transition,
        zIndex: isDragging ? 1 : 0,
        position: isDragging ? 'relative' : 'static',
        opacity: isDragging ? 0.5 : 1,
      } as React.CSSProperties;

      const expired = isExpired(doc.enddate);

      return (
        <TableRow 
          ref={setNodeRef} 
          style={style}
          className={expired ? "line-through text-gray-500" : ""}
        >
          <TableCell 
            className="w-[30px] border-r border-gray-300 text-center cursor-move bg-gray-50 hover:bg-gray-100" 
            {...attributes} 
            {...listeners}
          >
            ⋮⋮
          </TableCell>
          <TableCell className="w-[50px] min-w-[50px] font-medium border-r border-gray-300 text-center">
            {!isOrderChanged ? doc.type : ""}
          </TableCell>
          <TableCell className="w-[100px] border-r border-gray-300 text-center">
            {doc.manager}
          </TableCell>
          <TableCell className="w-[300px] border-r border-gray-300 text-left">
            <div className="whitespace-pre-wrap">
              {doc.content}
            </div>
          </TableCell>
          <TableCell className="w-[100px] border-r border-gray-300 text-center">
            {doc.enddate}
          </TableCell>
          <TableCell className="w-[150px] border-r border-gray-300 text-left">
            <a
              href={doc.link || "#"}
              target="_blank"
              rel="noopener noreferrer"
              className={`text-blue-600 hover:text-blue-800 hover:underline ${expired ? "text-gray-500" : ""}`}
            >
              {doc.link}
            </a>
          </TableCell>
          <TableCell className="w-[300px] border-r border-gray-300 text-left">
            <div className="whitespace-pre-wrap">
              {doc.ect}
            </div>
          </TableCell>
          <TableCell className="w-[50px] text-center">
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 rounded-full bg-gray-200 hover:bg-gray-300"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setSelectedDoc(doc);
                setManageOpen(true);
              }}
            >
              <LucideEdit className="h-4 w-4" />
            </Button>
          </TableCell>
        </TableRow>
      );
    };

    const handleSetSelectedDoc = (prev: Document | null, updates: Partial<Document>) => {
      if (!prev) return null;
      return { ...prev, ...updates };
    };

    if (loading) {
      return (
        <div className="mt-10 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-2"></div>
            <div>로딩 중...</div>
          </div>
        </div>
      );
    }

    return (
      <div className="mt-10">
        <div className="flex gap-2 mb-2">
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button
                className="h-8 px-4 bg-blue-500 hover:bg-blue-600 text-white"
                variant="ghost"
              >
                만들기
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>새 문서 추가</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="content" className="text-right">내용</Label>
                  <Input
                    id="content"
                    className="col-span-3"
                    value={newDoc.content}
                    onChange={(e) => handleInputChange("content", e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="manager" className="text-right">담당자</Label>
                  <Input
                    id="manager"
                    className="col-span-3"
                    value={newDoc.manager}
                    onChange={(e) => handleInputChange("manager", e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="enddate" className="text-right">마감기한</Label>
                  <div className="col-span-3 flex gap-2">
                    <div className="flex-1 relative">
                      <Input
                        type="date"
                        id="enddate"
                        className="w-full"
                        value={newDoc.enddate === "해당없음" ? "" : newDoc.enddate}
                        onChange={(e) => handleInputChange("enddate", e.target.value)}
                        disabled={newDoc.enddate === "해당없음"}
                        onClick={() => {
                          if (newDoc.enddate === "해당없음") {
                            handleInputChange("enddate", "");
                          }
                        }}
                      />
                      {newDoc.enddate === "해당없음" && (
                        <div 
                          className="absolute inset-0 cursor-pointer"
                          onClick={() => handleInputChange("enddate", "")}
                        />
                      )}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className={newDoc.enddate === "해당없음" ? "bg-gray-300" : ""}
                      onClick={() => handleInputChange("enddate", "해당없음")}
                    >
                      해당없음
                    </Button>
                  </div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="link" className="text-right">링크</Label>
                  <Input
                    id="link"
                    className="col-span-3"
                    value={newDoc.link}
                    onChange={(e) => handleInputChange("link", e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="ect" className="text-right">설명</Label>
                  <Textarea
                    id="ect"
                    className="col-span-3 min-h-[100px]"
                    value={newDoc.ect}
                    onChange={(e) => handleInputChange("ect", e.target.value)}
                    placeholder="설명을 입력하세요..."
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setOpen(false)}>취소</Button>
                <Button 
                  onClick={handleAddDoc} 
                  disabled={saving}
                  className="relative"
                >
                  {saving ? (
                    <>
                      <span className="opacity-0">추가</span>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="animate-spin h-4 w-4 border-b-2 border-white"></div>
                      </div>
                    </>
                  ) : (
                    "추가"
                  )}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
          
          {isOrderChanged && (
            <>
              <Button
                className="h-8 px-4 bg-green-500 hover:bg-green-600 text-white relative"
                variant="ghost"
                onClick={handleSaveOrder}
                disabled={saving}
              >
                {saving ? (
                  <>
                    <span className="opacity-0">순서변경</span>
                    <div className="absolute inset-0 flex items-center justify-center gap-2">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-r-transparent border-white" />
                      <span className="text-white">저장 중...</span>
                    </div>
                  </>
                ) : (
                  "순서변경"
                )}
              </Button>
              <Button
                className="h-8 px-4 bg-gray-500 hover:bg-gray-600 text-white"
                variant="ghost"
                onClick={handleCancelOrder}
                disabled={saving}
              >
                취소
              </Button>
            </>
          )}
        </div>

        {saving && (
          <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-4 flex items-center gap-3">
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-r-transparent border-blue-600" />
              <span>순서 저장 중...</span>
            </div>
          </div>
        )}

        <Dialog open={manageOpen} onOpenChange={setManageOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>문서 수정</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-content" className="text-right">내용</Label>
                <Input
                  id="edit-content"
                  className="col-span-3"
                  value={selectedDoc?.content || ""}
                  onChange={(e) => setSelectedDoc(handleSetSelectedDoc(selectedDoc, { content: e.target.value }))}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-manager" className="text-right">담당자</Label>
                <Input
                  id="edit-manager"
                  className="col-span-3"
                  value={selectedDoc?.manager || ""}
                  onChange={(e) => setSelectedDoc(handleSetSelectedDoc(selectedDoc, { manager: e.target.value }))}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-enddate" className="text-right">마감기한</Label>
                <div className="col-span-3 flex gap-2">
                  <div className="flex-1 relative">
                    <Input
                      type="date"
                      id="edit-enddate"
                      className="w-full"
                      value={selectedDoc?.enddate === "해당없음" ? "" : selectedDoc?.enddate || ""}
                      onChange={(e) => setSelectedDoc(handleSetSelectedDoc(selectedDoc, { enddate: e.target.value }))}
                      disabled={selectedDoc?.enddate === "해당없음"}
                      onClick={() => {
                        if (selectedDoc?.enddate === "해당없음") {
                          setSelectedDoc(handleSetSelectedDoc(selectedDoc, { enddate: "" }));
                        }
                      }}
                    />
                    {selectedDoc?.enddate === "해당없음" && (
                      <div 
                        className="absolute inset-0 cursor-pointer"
                        onClick={() => setSelectedDoc(handleSetSelectedDoc(selectedDoc, { enddate: "" }))}
                      />
                    )}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className={selectedDoc?.enddate === "해당없음" ? "bg-gray-300" : ""}
                    onClick={() => setSelectedDoc(handleSetSelectedDoc(selectedDoc, { enddate: "해당없음" }))}
                  >
                    해당없음
                  </Button>
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-link" className="text-right">링크</Label>
                <Input
                  id="edit-link"
                  className="col-span-3"
                  value={selectedDoc?.link || ""}
                  onChange={(e) => setSelectedDoc(handleSetSelectedDoc(selectedDoc, { link: e.target.value }))}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-ect" className="text-right">설명</Label>
                <Textarea
                  id="edit-ect"
                  className="col-span-3 min-h-[100px]"
                  value={selectedDoc?.ect || ""}
                  onChange={(e) => setSelectedDoc(handleSetSelectedDoc(selectedDoc, { ect: e.target.value }))}
                  placeholder="설명을 입력하세요..."
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button 
                variant="destructive" 
                onClick={() => {
                  setDocToDelete(selectedDoc?.id || null);
                  setDeleteDialogOpen(true);
                }}
              >
                삭제
              </Button>
              <Button variant="outline" onClick={() => setManageOpen(false)}>
                취소
              </Button>
              <Button onClick={handleManageUpdate}>
                저장
              </Button>
            </div>
          </DialogContent>
        </Dialog>
        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>문서 삭제</AlertDialogTitle>
              <AlertDialogDescription>
                정말로 이 문서를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => {
                setDeleteDialogOpen(false);
                setDocToDelete(null);
              }}>
                취소
              </AlertDialogCancel>
              <AlertDialogAction 
                onClick={() => docToDelete && handleDeleteDoc(docToDelete)}
                className="bg-red-600 hover:bg-red-700"
              >
                삭제
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <div>
            <div className="relative">
              <Table className="border-b">
                <TableCaption>문서 링크 목록</TableCaption>
                <TableHeader>
                  <TableRow className="bg-gray-100 [&>*]:text-black [&>*]:font-medium">
                    <TableHead className="w-[30px] border-r border-gray-300 text-center">
                      ↕
                    </TableHead>
                    <TableHead className="w-[50px] min-w-[50px] border-r border-gray-300 text-center">구분</TableHead>
                    <TableHead className="w-[100px] border-r border-gray-300 text-center">담당자</TableHead>
                    <TableHead className="w-[300px] border-r border-gray-300 text-center">내용</TableHead>
                    <TableHead className="w-[100px] border-r border-gray-300 text-center">마감기한</TableHead>
                    <TableHead className="w-[150px] border-r border-gray-300 text-center">링크</TableHead>
                    <TableHead className="w-[300px] border-r border-gray-300 text-center">설명</TableHead>
                    <TableHead className="w-[50px] text-center">수정</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <SortableContext items={tempDocs.map(doc => doc.id || 'temp-id')} strategy={verticalListSortingStrategy}>
                    {tempDocs.map((doc) => (
                      <SortableRow key={doc.id} doc={doc} />
                    ))}
                  </SortableContext>
                </TableBody>
                <TableFooter></TableFooter>
              </Table>
            </div>
          </div>
        </DndContext>
      </div>
    );
  }
  