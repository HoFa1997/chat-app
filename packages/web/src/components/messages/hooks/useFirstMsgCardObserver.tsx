import { useEffect, useState, RefObject } from "react";

export const useFirstMsgCardObserver = (parentRef: RefObject<Element>, options: any) => {
  const [isFirstVisible, setIsFirstVisible] = useState(false);

  useEffect(() => {
    // Check if the parent ref is available
    const parentElement = parentRef.current;
    if (!parentElement) return;

    // Get the first child of the parent node
    const msgCards = parentElement.querySelectorAll(".msg_card");
    const firstChildElement = msgCards[0];
    if (!firstChildElement) return;

    const observer = new IntersectionObserver((entries) => {
      const [entry] = entries;
      setIsFirstVisible(entry.isIntersecting);
    }, options);

    // Observe the first child element
    observer.observe(firstChildElement);

    // Clean up
    return () => {
      observer.unobserve(firstChildElement);
    };
  }, [parentRef, options]);

  return isFirstVisible;
};
