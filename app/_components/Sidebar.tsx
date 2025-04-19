"use client"; // Next.js에서 클라이언트 컴포넌트로 사용하도록 선언

import { useMenu } from "@/context/MenuContext"; // 메뉴 선택 상태를 관리하는 Context 가져오기

// 사이드바(Sidebar) 컴포넌트 정의
const Sidebar = () => {
  const { setSelectedMenu } = useMenu(); // Context에서 메뉴 선택 상태를 업데이트하는 함수 가져오기

  return (
    // 사이드바 네비게이션 컨테이너
    <nav className="flex flex-col gap-2 p-4 bg-gray-100 h-screen w-60">
      {/* '월중1계획' 버튼 클릭 시 해당 메뉴로 변경 */}
      <button
        onClick={() => setSelectedMenu("월중1계획")}
        className="p-2 hover:bg-gray-200"
      >
        월중1계획
      </button>

      {/* '주간계획' 버튼 클릭 시 해당 메뉴로 변경 */}
      <button
        onClick={() => setSelectedMenu("주간계획")}
        className="p-2 hover:bg-gray-200"
      >
        주간계획
      </button>

      {/* '연간계획' 버튼 클릭 시 해당 메뉴로 변경 */}
      <button
        onClick={() => setSelectedMenu("연간계획")}
        className="p-2 hover:bg-gray-200"
      >
        연간계획
      </button>
    </nav>
  );
};

export default Sidebar; // Sidebar 컴포넌트 내보내기
