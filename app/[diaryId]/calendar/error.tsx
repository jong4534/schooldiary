'use client' // ✅ Error boundaries는 반드시 클라이언트 컴포넌트여야 하므로 선언

import { useEffect } from 'react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string } // 에러 객체 타입 정의 (digest는 선택적 속성)
  reset: () => void // 오류를 재설정하는 함수
}) {
  useEffect(() => {
    // ✅ 에러가 발생할 때마다 콘솔에 기록 (에러 모니터링 서비스 연동 가능)
    console.error(error)
  }, [error]) // error 값이 변경될 때마다 실행

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-red-100">
      {/* 에러 메시지 표시 */}
      <h2 className="text-xl font-bold text-red-600">Something went wrong!</h2>
      
      {/* 다시 시도 버튼 (오류 복구) */}
      <button
        onClick={() => reset()} // ✅ 클릭 시 오류를 재설정하여 다시 렌더링 시도
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Try again
      </button>
    </div>
  )
}
