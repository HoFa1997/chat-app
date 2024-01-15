import React, { useCallback } from "react";
import { useAuthStore } from "@stores/index";
import { removeReaction } from "@/api";

interface ReactionsCardProps {
  reactions: { [emoji: string]: Array<{ user_id: string }> };
  message: any;
}

const ReactionsCard: React.FC<ReactionsCardProps> = ({ reactions, message }) => {
  // Fetching the current user's profile
  const currentUser = useAuthStore((state) => state.profile);

  // Checks if the current user has reacted with a specific emoji
  const hasCurrentUserReacted = useCallback(
    (reactionUsers: Array<{ user_id: string }>) => reactionUsers.some(({ user_id }) => user_id === currentUser?.id),
    [currentUser],
  );

  // Handles the reaction click event
  const handleReactionClick = useCallback(
    (emoji: string) => {
      const isUserReaction = hasCurrentUserReacted(reactions[emoji]);
      if (isUserReaction) {
        removeReaction(message, emoji).catch(console.error);
      }
    },
    [reactions, currentUser, message, hasCurrentUserReacted],
  );

  return (
    <div className="mr-auto flex min-w-16 flex-row justify-start overflow-hidden overflow-x-auto">
      {reactions &&
        Object.entries(reactions).map(([emoji, users]: any, index) => (
          <button
            className={`btn btn-ghost btn-xs mx-1 flex items-center p-0 px-1 ${
              hasCurrentUserReacted(users)
                ? "bg-primary "
                : "!border-secondary !bg-secondary !text-opacity-100 !opacity-100"
            }`}
            key={index}
            onClick={() => handleReactionClick(emoji)}
            disabled={!hasCurrentUserReacted(users)}
          >
            <div className="flex h-4 min-w-4 items-center justify-center gap-2">
              <div className="text-xl">{emoji}</div>
              {users.length >= 2 ? <div className="badge badge-xs">{users.length}</div> : ""}
            </div>
          </button>
        ))}
    </div>
  );
};

export default ReactionsCard;
