import { Modal, Box, Typography, Button, Grid, styled, Divider, IconButton, Avatar, Skeleton } from "@mui/material";
import { useState } from "react";
import NotificationsOffIcon from "@mui/icons-material/NotificationsOffRounded";
import { useGetUserSession } from ".";
import CloseIcon from "@mui/icons-material/CloseRounded";

type ProfileModalProps = {
  userId: string | null | undefined;
};

const ModalContainer = styled(Box)(({ theme }) => ({
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 500,
  background: theme.palette.background.paper,
  boxShadow: theme.shadows[24],
  padding: 32,
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  borderRadius: theme.shape.borderRadius,
}));

export const useProfileModal = ({ userId }: ProfileModalProps) => {
  const [profileModal, setProfileModal] = useState(false);
  const { user, isLoading } = useGetUserSession({ userId, enabled: profileModal && !!userId });

  const handelSendMessage = () => {
    // TODO: send message to user
  };

  const handelMuteUser = () => {
    // TODO: mute user
  };

  const handelMoreOption = () => {
    // TODO: show more option
  };

  const ModalComponent = () => (
    <Modal open={profileModal} onClose={() => setProfileModal(false)}>
      <ModalContainer>
        <IconButton sx={{ position: "absolute", top: 16, right: 16 }} onClick={() => setProfileModal(false)}>
          <CloseIcon />
        </IconButton>

        {isLoading && !user ? (
          <Skeleton variant="circular" width={80} height={80} />
        ) : (
          <Avatar src={user?.avatar_url ?? ""} sx={{ width: 80, height: 80 }}>
            {user?.email![0]?.toUpperCase()}
          </Avatar>
        )}

        {isLoading && !user ? (
          <Skeleton sx={{ mt: 2 }} variant="text" width={150} />
        ) : (
          <Typography mt={2} variant="h6" component="h2" gutterBottom>
            {user?.full_name}
          </Typography>
        )}

        <Grid container textAlign={"center"} columnSpacing={2} my={2}>
          <Grid item xs={4}>
            <Button onClick={handelSendMessage} fullWidth variant="contained">
              Message
            </Button>
          </Grid>
          <Grid item xs={4}>
            <Button onClick={handelMuteUser} fullWidth variant="contained" endIcon={<NotificationsOffIcon />}>
              Mute
            </Button>
          </Grid>
          <Grid item xs={4}>
            <Button onClick={handelMoreOption} fullWidth variant="contained">
              More ...
            </Button>
          </Grid>
        </Grid>
        <Box
          sx={{
            bgcolor: (t) => t.palette.background.default,
            width: "100%",
            px: 2,
            borderRadius: (t) => t.shape.borderRadius,
          }}
        >
          {/* Bio Section */}
          <Box sx={{ my: 1 }}>
            <Typography variant="caption" component="h2">
              Bio
            </Typography>

            {/*  // TODO:  */}
            <Typography variant="body1">{user?.description ?? "---"}</Typography>
          </Box>

          <Divider variant="middle" />

          {/* Section 1 */}
          <Box sx={{ my: 1 }}>
            <Typography variant="caption" component="h2">
              Email
            </Typography>
            {/*  // TODO:  */}
            <Typography variant="body1">{user?.email}</Typography>
          </Box>

          <Divider variant="middle" />

          {/* Section 2 */}
          <Box sx={{ my: 1 }}>
            <Typography variant="caption" component="h2">
              Username
            </Typography>
            {/*  // TODO:  */}
            <Typography variant="body1">{user?.username}</Typography>
          </Box>
        </Box>
      </ModalContainer>
    </Modal>
  );

  return {
    ModalComponent,
    setProfileModal,
    profileModal,
  };
};
