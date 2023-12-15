/* eslint-disable */
// @ts-nocheck
"use client";

import { useState } from "react";
import { Box, Typography, Card, CardContent, IconButton, MobileStepper } from "@mui/material";
import PushPinIcon from "@mui/icons-material/PushPin";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";

export default function PinnedMessagesSlider({ pinnedMessagesMap }) {
  const [activeStep, setActiveStep] = useState(0);
  const pinnedMessages = Array.from(pinnedMessagesMap.values());
  const maxSteps = pinnedMessages.length;

  const handleNext = () => {
    setActiveStep((prevActiveStep) => (prevActiveStep + 1) % maxSteps);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => (prevActiveStep - 1 + maxSteps) % maxSteps);
  };

  return (
    <Box sx={{ width: "100%" }} display="flex" flexDirection="row">
      <Box sx={{}}>
        <MobileStepper
          sx={{ height: "100%" }}
          variant="dots"
          steps={maxSteps}
          position="static"
          activeStep={activeStep}
        />
      </Box>
      <Box sx={{ width: "100%" }}>
        <Box sx={{ display: "flex", alignItems: "center", p: 1, bgcolor: "background.default" }}>
          <PushPinIcon sx={{ mr: 1 }} />
          <Typography>Pinned Messages</Typography>
        </Box>
        <Card
          raised
          sx={{
            display: "flex",
            overflow: "hidden",
            width: "100%",
            justifyContent: "space-between",
            alignItems: "center",
            p: 0,
          }}
        >
          <IconButton onClick={handleBack} disabled={maxSteps === 0}>
            <KeyboardArrowLeft />
          </IconButton>
          <CardContent sx={{ flex: "1 0 auto", padding: "4px 8px 2px", width: "200px" }}>
            <Typography variant="p" fontSize="12px" color="text.secondary">
              {pinnedMessages[activeStep]?.pinner_full_name || pinnedMessages[activeStep]?.pinner_username}
            </Typography>
            <Typography noWrap>{pinnedMessages[activeStep]?.content}</Typography>
          </CardContent>
          <IconButton onClick={handleNext} disabled={maxSteps === 0}>
            <KeyboardArrowRight />
          </IconButton>
        </Card>
      </Box>
    </Box>
  );
}
