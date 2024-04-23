import { useEffect, useRef, useState } from "react";
import { useStore } from "@stores/index";

export const useChatContainerResizeHandler = () => {
  const startThreadMessage = useStore((state) => state.startThreadMessage);

  const [leftWidth, setLeftWidth] = useState(100); // Initial width as a percentage of the parent container
  const panelRef = useRef<any>(null);
  const dragState = useRef({
    startX: 0,
    startWidth: 0,
  });

  useEffect(() => {
    if (startThreadMessage) {
      setLeftWidth(60);
    } else {
      setLeftWidth(100);
    }
  }, [startThreadMessage]);

  const onMouseDown = (e: any) => {
    if (panelRef.current && e.button === 0) {
      // Ensures left mouse button press
      dragState.current = {
        startX: e.clientX,
        startWidth: panelRef.current.offsetWidth * (leftWidth / 100),
      };
      document.addEventListener("mousemove", onMouseMove);
      document.addEventListener("mouseup", onMouseUp);
    }
  };

  const onMouseMove = (e: any) => {
    if (dragState.current.startX) {
      const currentX = e.clientX;
      const diffX = currentX - dragState.current.startX;
      const containerWidth = panelRef.current.offsetWidth;
      const newWidth =
        ((dragState.current.startWidth + diffX) / containerWidth) * 100;
      setLeftWidth(Math.max(20, Math.min(80, newWidth))); // Constraining the width to between 20% and 80%
    }
  };

  const onMouseUp = () => {
    document.removeEventListener("mousemove", onMouseMove);
    document.removeEventListener("mouseup", onMouseUp);
  };

  return { onMouseDown, leftWidth, panelRef };
};
