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
            className={`btn btn-ghost btn-active btn-xs mx-1 flex h-8 w-8 items-center justify-center gap-2 text-xl  first-of-type:ml-0  ${
              hasCurrentUserReacted(users)
                ? "!bg-secondary "
                : "!bg-gray-200 !bg-opacity-20 !text-opacity-100 !opacity-100"
            }`}
            key={index}
            onClick={() => handleReactionClick(emoji)}
            disabled={!hasCurrentUserReacted(users)}
          >
            <span>{emoji}</span>
            {users.length >= 2 ? <div className="badge badge-xs">{users.length}</div> : ""}
          </button>
        ))}
    </div>
  );
};

export default ReactionsCard;
