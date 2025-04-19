'use client'; // ✅ Error boundaries는 반드시 클라이언트 컴포넌트여야 함

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }; // ✅ Error 객체 타입 정의
  reset: () => void; // ✅ 오류를 재설정하는 함수
}) {
  return (
    <html lang="ko"> {/* ✅ 언어 설정 추가 */}
      <body className="flex flex-col items-center justify-center min-h-screen bg-red-100 p-6">
        <h2 className="text-2xl font-bold text-red-600">⚠️ Something went wrong!</h2>
        <p className="text-gray-700 mt-2">{error.message}</p>

        {/* 다시 시도 버튼 */}
        <button
          onClick={() => reset()} // ✅ 클릭 시 오류를 재설정하여 다시 렌더링 시도
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Try again
        </button>
      </body>
    </html>
  );
}
