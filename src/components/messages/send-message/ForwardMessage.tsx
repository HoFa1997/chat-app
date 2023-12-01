import { setForwardMessage, useForwardMessageInfo } from "@/shared/hooks";
import ForwardIcon from "@mui/icons-material/ForwardRounded";
import CloseIcon from "@mui/icons-material/CloseRounded";
import { IconButton } from "@mui/material";

export const ForwardMessage = () => {
  const forwardedMessage = useForwardMessageInfo();

  const handleCloseForwardedMessage = () => {
    setForwardMessage(null);
  };

  if (!forwardedMessage) return null;

  return (
    <div>
      <ForwardIcon />
      <div>
        <p>FORWARD MESSAGE TODO : {forwardedMessage?.user_id.username}</p>
        <p>{forwardedMessage?.content}</p>
      </div>
      <IconButton onClick={handleCloseForwardedMessage}>
        <CloseIcon />
      </IconButton>
    </div>
  );
};
