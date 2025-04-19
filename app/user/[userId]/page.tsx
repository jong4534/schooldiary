import Link from "next/link";

interface userDetalPageProps{
    params: Promise<{userId: string}>
}

export default async function UserDetailPage({ params }: userDetalPageProps) {
    const { userId } = await params;
    return (
        <div>
            <p>유저 detail 페이지입니다.</p>
            <p>{userId}</p>
            <Link href="/">메인페이지</Link>
        </div>
    )
}
