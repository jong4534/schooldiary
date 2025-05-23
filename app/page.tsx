"use client";

import { AppSidebar } from "@/components/app-sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { useSupabaseSession } from "@/hooks/useSupabaseSession";
import Link from "next/link";

export default function Page() {
  const { session, loading } = useSupabaseSession();

  if (loading) return <div>로딩 중...</div>;
  if (!session) return <Link href="/login">로그인</Link>;

  return <div>안녕하세요, {session.user.email}님!</div>;
}
