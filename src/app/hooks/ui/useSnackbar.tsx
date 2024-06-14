import { Alert, AlertColor, Snackbar } from "@mui/material";
import { useEffect, useState } from "react";

const useSnackbar = ({
  message,
  severity,
  open,
}: {
  message?: string | null;
  severity: AlertColor;
  open: boolean;
}) => {
  const [_open, setOpen] = useState<boolean>(open);

  const handleClose = (_: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  useEffect(() => {
    setOpen(open);
  }, [open]);

  return {
    Snackbar: () => (
      <Snackbar
        open={_open}
        autoHideDuration={6000}
        message={message}
        onClose={handleClose}
      >
        <Alert severity={severity} variant="standard">
          {message}
        </Alert>
      </Snackbar>
    ),
  };
};

export { useSnackbar };
