"use server";

import { supabase } from "@/lib/supabase";
import {
  CreateDocument,
  Document,
  UpdateDocument,
} from "@/model/document/documentSchema";
import { revalidatePath } from "next/cache";

export async function getDocuments(): Promise<Document[]> {
  const { data, error } = await supabase
    .from("documents")
    .select("*")
    .order("type", { ascending: false });

  if (error) {
    console.error("Error fetching documents:", error);
    throw new Error(error.message);
  }

  return data || [];
}

export async function createDocument(
  document: CreateDocument
): Promise<Document> {
  const { data, error } = await supabase
    .from("documents")
    .insert([document])
    .select()
    .single();

  if (error) {
    console.error("Error creating document:", error);
    throw new Error(error.message);
  }

  revalidatePath("/docslink");
  return data;
}

export async function updateDocument(
  document: UpdateDocument
): Promise<Document> {
  const { id, ...updateData } = document;

  const { data, error } = await supabase
    .from("documents")
    .update(updateData)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Error updating document:", error);
    throw new Error(error.message);
  }

  revalidatePath("/docslink");
  return data;
}

export async function deleteDocument(id: string): Promise<void> {
  const { error } = await supabase.from("documents").delete().eq("id", id);

  if (error) {
    console.error("Error deleting document:", error);
    throw new Error(error.message);
  }

  revalidatePath("/docslink");
}
