import React, { useState, useEffect, useCallback } from "react";
import { Fab } from "@mui/material";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";

// Debounce function to limit the rate at which a function can fire.
const debounce = (func: (...args: any[]) => void, delay: number): ((...args: any[]) => void) => {
  let timer: any;
  return function (...args: any[]) {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
};

interface ScrollToBottomButtonProps {
  messagesContainer: React.RefObject<HTMLDivElement>;
}

const ScrollToBottomButton = ({ messagesContainer }: ScrollToBottomButtonProps) => {
  const [showScrollButton, setShowScrollButton] = useState(false);

  // Handle scroll event: Determines whether to show or hide the button
  // based on the scroll position relative to the last message height.
  const handleScroll = useCallback(() => {
    if (!messagesContainer.current) return;
    const { scrollTop, scrollHeight, clientHeight } = messagesContainer.current;
    const lastChildHeight = messagesContainer.current.lastChild?.offsetHeight || 0;

    if (scrollTop + clientHeight < scrollHeight - lastChildHeight) {
      setShowScrollButton(true);
    } else {
      setShowScrollButton(false);
    }
  }, [messagesContainer]);

  // Debounced version of the scroll event handler to improve performance.
  const debouncedHandleScroll = debounce(handleScroll, 200);

  // Effect to attach and detach the scroll event listener.
  useEffect(() => {
    const currentRef = messagesContainer.current;
    if (!currentRef) return;

    currentRef.addEventListener("scroll", debouncedHandleScroll);

    return () => {
      currentRef.removeEventListener("scroll", debouncedHandleScroll);
    };
  }, [debouncedHandleScroll, messagesContainer]);

  // Handler to scroll to the bottom of the messages container.
  const scrollToBottomHandler = useCallback(() => {
    const lastChild = messagesContainer.current?.lastChild as Element;
    if (lastChild) {
      lastChild.scrollIntoView({ behavior: "smooth" });
    }
    setShowScrollButton(false);
  }, [messagesContainer]);

  if (!showScrollButton) return null;

  return (
    <Fab
      color="primary"
      size="small"
      onClick={scrollToBottomHandler}
      sx={{
        position: "fixed",
        bottom: 160,
        right: 30,
      }}
    >
      <ArrowDownwardIcon />
    </Fab>
  );
};

export default ScrollToBottomButton;
