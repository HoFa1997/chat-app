import { useState, useEffect, useRef, RefObject } from "react";

export type TUseContextMenu = {
  menuState: {
    visible: boolean;
    x: number;
    y: number;
  };
  showMenu: (event: React.MouseEvent<HTMLDivElement>) => void;
  closeMenu: () => void;
  menuRef: RefObject<HTMLDivElement>;
};

export const useContextMenu = () => {
  const [menuState, setMenuState] = useState({ visible: false, x: 0, y: 0 });
  const menuRef = useRef<HTMLDivElement>(null);

  const showMenu = (event: React.MouseEvent<HTMLDivElement>) => {
    event.preventDefault();
    setMenuState({
      visible: true,
      x: event.clientX,
      y: event.clientY,
    });
  };

  const closeMenu = () => {
    setMenuState({ ...menuState, visible: false });
  };

  useEffect(() => {
    const handleClickOutside = (event: globalThis.MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        closeMenu();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    menuState,
    showMenu,
    closeMenu,
    menuRef,
  };
};
