import { useCallback, useEffect, useRef, useState } from "react";

export const useResizeChannelList = ({ panelRef }: any) => {
  const [isDragging, setIsDragging] = useState(false);
  const startXRef = useRef<any>(null);

  const onMouseDown = (e: any) => {
    startXRef.current = e.clientX;
    setIsDragging(true);
  };

  const updatePanelWidth = (currentX: any) => {
    const deltaX = currentX - startXRef.current;
    const newWidth = panelRef.current.offsetWidth + deltaX;
    if (newWidth <= 180) {
      panelRef.current.style.width = `180px`;
      return;
    } else if (newWidth >= 600) {
      panelRef.current.style.width = `600px`;
      return;
    }
    panelRef.current.style.width = `${newWidth}px`;
    startXRef.current = currentX;
  };

  const onMouseMove = useCallback(
    (e: any) => {
      if (!isDragging || !panelRef.current) return;
      updatePanelWidth(e.clientX);
    },
    [isDragging],
  );

  useEffect(() => {
    const onMouseUp = () => setIsDragging(false);

    if (isDragging) {
      window.addEventListener("mousemove", onMouseMove);
      window.addEventListener("mouseup", onMouseUp);
    }

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, [onMouseMove, isDragging]);

  return { onMouseDown };
};
