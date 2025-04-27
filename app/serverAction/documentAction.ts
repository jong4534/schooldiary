'use server'

import { createClient } from "@/utils/supabase/server";
import type { Document } from "@/model/document/documentSchema";

export type { Document };

export async function getDocuments(): Promise<Document[]> {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from("documents")
    .select("*");

  if (error) {
    throw error;
  }

  // type을 숫자로 변환하여 정렬
  return (data as Document[]).sort((a, b) => {
    const aNum = a.type ? parseInt(a.type, 10) : 0;
    const bNum = b.type ? parseInt(b.type, 10) : 0;
    return aNum - bNum;
  });
}

export async function createDocument(document: Partial<Document>): Promise<Document> {
  const supabase = await createClient();
  
  // 기존 문서들 가져오기
  const { data: existingDocs } = await supabase
    .from("documents")
    .select("*")
    .order("type", { ascending: true });

  // 새 문서의 type을 001로 설정하고 나머지는 뒤로 밀기
  const updatedDocs = (existingDocs || []).map(doc => ({
    ...doc,
    type: String(parseInt(doc.type || '0', 10) + 1).padStart(3, '0')
  }));

  // 기존 문서들 업데이트
  if (updatedDocs.length > 0) {
    const { error: updateError } = await supabase
      .from('documents')
      .upsert(updatedDocs, { onConflict: 'id' });

    if (updateError) {
      throw updateError;
    }
  }

  // 새 문서 추가
  const newDocument = {
    ...document,
    type: "001",
    created_at: new Date().toISOString()
  };
  
  const { data, error } = await supabase
    .from("documents")
    .insert([newDocument])
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data as Document;
}

export async function updateDocument(document: Partial<Document>): Promise<Document> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("documents")
    .update(document)
    .eq("id", document.id)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data as Document;
}

export async function deleteDocument(id: string): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("documents")
    .delete()
    .eq("id", id);

  if (error) {
    throw error;
  }
}

export async function updateDocumentsOrder(documents: Document[]): Promise<void> {
  const supabase = await createClient();
  
  // 모든 문서의 type을 한 번의 쿼리로 업데이트
  const updates = documents.map(doc => ({
    id: doc.id,
    type: doc.type
  }));

  const { error } = await supabase
    .from("documents")
    .upsert(updates, { onConflict: 'id' });

  if (error) {
    console.error("문서 순서 업데이트 중 오류 발생:", error);
    throw error;
  }
} 