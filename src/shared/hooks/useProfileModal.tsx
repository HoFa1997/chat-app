import { TUser } from "@/api";
import { Modal, Box, Typography, Button, Avatar, Grid, styled, Divider } from "@mui/material";
import { useState } from "react";
import NotificationsOffIcon from "@mui/icons-material/NotificationsOffRounded";

type ProfileModalProps = {
  user: TUser | null;
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

export const useProfileModal = ({ user }: ProfileModalProps) => {
  const [profileModal, setProfileModal] = useState(false);

  const handelSendMessage = () => {
    // TODO: send message to user
  };

  const handelMuteUser = () => {
    // TODO: mute user
  };

  const handelMoreOption = () => {
    // TODO: show more option
  };

  const ModalComponent = () =>
    user && (
      <Modal open={profileModal} onClose={() => setProfileModal(false)}>
        <ModalContainer>
          {user.avatar_url && <Avatar sx={{ width: 80, height: 80 }} alt="Avatar" src={user.avatar_url} />}
          <Typography mt={2} variant="h6" component="h2" gutterBottom>
            {user?.full_name}
          </Typography>
          <Typography variant="body1" gutterBottom>
            {user?.email}
          </Typography>
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
              <Typography variant="body1">He/Him/His, Developer, Software Engineer</Typography>
            </Box>

            <Divider variant="middle" />

            {/* Section 1 */}
            <Box sx={{ my: 1 }}>
              <Typography variant="caption" component="h2">
                Phone
              </Typography>
              {/*  // TODO:  */}
              <Typography variant="body1">This is the content for section 1...</Typography>
            </Box>

            <Divider variant="middle" />

            {/* Section 2 */}
            <Box sx={{ my: 1 }}>
              <Typography variant="caption" component="h2">
                Username
              </Typography>
              {/*  // TODO:  */}
              <Typography variant="body1">This is the content for section 2...</Typography>
            </Box>
          </Box>
          <Button onClick={() => setProfileModal(false)}>Close</Button>
        </ModalContainer>
      </Modal>
    );

  return {
    ModalComponent,
    setProfileModal,
    profileModal,
  };
};
