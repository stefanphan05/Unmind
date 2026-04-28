import { useCallback, useEffect, useRef, useState } from "react";

// Only the roles that influence follow/scroll behavior.
type MessageRole = "user" | "assistant";

interface UseChatAutoScrollParams {
  // Current number of messages rendered in the conversation list.
  messageCount: number;
  // Role of the latest message so we can force-follow for new user sends.
  latestMessageRole?: MessageRole;
  // Prevent auto-scroll while initial history is still loading.
  isInitialLoading: boolean;
  // True while assistant is "typing"/loading a response.
  isTherapistResponseLoading: boolean;
}

interface UseChatAutoScrollReturn {
  // Scrollable chat container ref (used to detect manual scroll position).
  scrollContainerRef: React.RefObject<HTMLDivElement | null>;
  // Bottom sentinel ref (single target for all "scroll to latest" actions).
  bottomAnchorRef: React.RefObject<HTMLDivElement | null>;
  // Scroll listener to toggle follow mode when user scrolls away from bottom.
  handleScroll: () => void;
  // Called by latest animated assistant message to keep view pinned as text grows.
  handleLatestAssistantRender: () => void;
}

// "Near bottom" tolerance in pixels before we stop considering the user as following.
const FOLLOW_BOTTOM_THRESHOLD = 100;

export function useChatAutoScroll({
  messageCount,
  latestMessageRole,
  isInitialLoading,
  isTherapistResponseLoading,
}: UseChatAutoScrollParams): UseChatAutoScrollReturn {
  // DOM references used for position detection and targeted scrolling.
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const bottomAnchorRef = useRef<HTMLDivElement>(null);
  // Follow mode means "auto-keep me at the latest message."
  const [isFollowMode, setIsFollowMode] = useState(true);

  // Shared primitive for moving the viewport to the newest content.
  const scrollToBottom = useCallback((behavior: ScrollBehavior = "smooth") => {
    bottomAnchorRef.current?.scrollIntoView({ behavior, block: "end" });
  }, []);

  // Determines whether the current scroll position is close enough to bottom
  // to keep automatic follow mode enabled.
  const isNearBottom = useCallback(() => {
    const container = scrollContainerRef.current;
    if (!container) {
      return true;
    }

    const distanceToBottom =
      container.scrollHeight - container.scrollTop - container.clientHeight;
    return distanceToBottom <= FOLLOW_BOTTOM_THRESHOLD;
  }, []);

  // When user scrolls manually, update follow mode accordingly.
  const handleScroll = useCallback(() => {
    setIsFollowMode(isNearBottom());
  }, [isNearBottom]);

  // React to conversation updates:
  // - Force follow when user sends a new message or assistant is loading.
  // - Otherwise follow only if user has not intentionally scrolled up.
  useEffect(() => {
    if (isInitialLoading || messageCount === 0) {
      return;
    }

    const shouldForceFollow =
      latestMessageRole === "user" || isTherapistResponseLoading;

    if (shouldForceFollow || isFollowMode) {
      scrollToBottom("smooth");
    }

    if (shouldForceFollow && !isFollowMode) {
      setIsFollowMode(true);
    }
  }, [
    isFollowMode,
    isInitialLoading,
    isTherapistResponseLoading,
    latestMessageRole,
    messageCount,
    scrollToBottom,
  ]);

  // Called during assistant typing animation to keep long responses visible
  // while content height increases over time.
  const handleLatestAssistantRender = useCallback(() => {
    if (!isFollowMode) {
      return;
    }

    scrollToBottom("auto");
  }, [isFollowMode, scrollToBottom]);

  return {
    scrollContainerRef,
    bottomAnchorRef,
    handleScroll,
    handleLatestAssistantRender,
  };
}
