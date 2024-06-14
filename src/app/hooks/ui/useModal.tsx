import { Box, Button, Grid, Modal, Typography } from "@mui/material";
import { useState } from "react";

const useModal = ({
  title,
  onAccept = () => {},
  onCancel = () => {},
}: {
  title?: string;
  onAccept?: () => void;
  onCancel?: () => void;
}) => {
  const [open, setOpen] = useState<boolean>(false);

  const handleClose = () => {
    setOpen(false);
  };

  const toggle = () => {
    setOpen(!open);
  };

  return {
    Modal: ({ children, ...props }: any) => (
      <Modal open={open} onClose={handleClose} {...props}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            width: 400,
            maxWidth: "90%",
          }}
        >
          <Typography variant="h6" component="h2" textAlign="center">
            {title}
          </Typography>
          {children}
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={4}>
              <Button
                onClick={() => {
                  onCancel();
                  toggle();
                }}
                fullWidth
              >
                Cancelar
              </Button>
            </Grid>
            <Grid item xs={8}>
              <Button
                onClick={() => {
                  onAccept();
                  toggle();
                }}
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Ok
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Modal>
    ),
    toggle,
  };
};

export { useModal };
