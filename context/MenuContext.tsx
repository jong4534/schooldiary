"use client";

import { createContext, useContext, useState } from "react";

// MenuContext를 정의하여 상태 관리
const MenuContext = createContext({
  selectedMenu: "기본 제목",  // 기본값 설정
  setSelectedMenu: (title: string) => {},
});

export const MenuProvider = ({ children }: { children: React.ReactNode }) => {
  const [selectedMenu, setSelectedMenu] = useState("기본 제목");  // 초기값 설정

  return (
    <MenuContext.Provider value={{ selectedMenu, setSelectedMenu }}>
      {children}
    </MenuContext.Provider>
  );
};

export const useMenu = () => useContext(MenuContext);  // Context에서 값을 가져오는 커스텀 훅
