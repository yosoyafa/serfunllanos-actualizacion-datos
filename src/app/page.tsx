"use client";

import {
  Button,
  TextField,
  Box,
  Container,
  Skeleton,
  Tooltip,
  Grid,
} from "@mui/material";
import { useFields } from "./hooks/data/useFields";
import { useFetchCliente } from "./hooks/client/useFetchCliente";
import { useUpdateCliente } from "./hooks/client/useUpdateCliente";
import { useAuth } from "./hooks/auth/useAuth";
import { useSnackbar } from "./hooks/ui/useSnackbar";
import { useModal } from "./hooks/ui/useModal";
import { useEffect, useRef } from "react";
import { AppBar } from "./components/AppBar";
import { useRenderFields } from "./hooks/ui/useRenderFields";
import { useFieldsValidation } from "./hooks/ui/useFieldsValidation";
import { useCheckbox } from "./hooks/ui/useCheckbox";

export default function Home() {
  const {
    fields,
    isLoading: fieldsIsLoading,
    error: fieldsError,
  } = useFields();

  const {
    cliente,
    fetchCliente,
    error: fetchError,
    isLoading: clientIsLoading,
  } = useFetchCliente();

  const {
    updateCliente,
    isLoading: updateIsLoading,
    error: updateError,
    isSuccess: isSuccessUpdating,
  } = useUpdateCliente(fields);

  useEffect(() => {
    if (isSuccessUpdating && cliente) {
      fetchCliente(cliente?.numero_documento);
    }
  }, [isSuccessUpdating]);

  const { Modal: ConfirmationModal, toggle: toggleModal } = useModal();

  const { Checkbox, isChecked: dataAlreadyUpdated } = useCheckbox({
    label: "Datos ya están actualizados",
    disabled: !cliente,
    onChecked: () => {
      if (cliente) {
        fetchCliente(cliente?.numero_documento);
      }
    },
  });

  const {
    renderField,
    error: renderFieldError,
    isLoading: renderFieldIsLoading,
  } = useRenderFields({ cliente, dataAlreadyUpdated });

  const { logout } = useAuth();

  const error = fieldsError || renderFieldError || updateError || fetchError;
  const isLoading = fieldsIsLoading || clientIsLoading || renderFieldIsLoading;

  const { Snackbar: ErrorSnackbar } = useSnackbar({
    open: !!error,
    severity: "error",
    message: error,
  });

  const { Snackbar: SuccessSnackbar } = useSnackbar({
    open: isSuccessUpdating,
    severity: "success",
    message: "Cliente actualizado correctamente",
  });

  const formRef = useRef<HTMLFormElement>(null);

  const { FieldsValidationContent } = useFieldsValidation({
    fields,
    cliente,
    form: formRef.current,
  });

  const handleSearch = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const cedula = new FormData(event.currentTarget).get("cedula")?.toString();
    if (!!cedula) {
      await fetchCliente(cedula);
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    toggleModal();
  };

  const requestUpdate = () => {
    if (cliente) {
      updateCliente({
        data: new FormData(formRef.current || undefined),
        cliente,
        dataAlreadyUpdated,
      }).then(() => {
        toggleModal();
      });
    }
  };

  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar
          disabled={updateIsLoading}
          onLogout={() => {
            logout();
          }}
          onSubmitSearch={handleSearch}
        />
      </Box>
      <Container component="main" maxWidth="xs">
        <Box
          sx={{
            marginY: "auto",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Tooltip title={!cliente ? "Busca un cliente para iniciar." : null}>
            <Box
              component="form"
              onSubmit={handleSubmit}
              noValidate
              sx={{ mt: 1, width: "100%" }}
              ref={formRef}
            >
              <Checkbox />
              {isLoading
                ? new Array(8).fill(0).map((_, index) => (
                    <Skeleton width="100%" key={index.toString()}>
                      <TextField margin="normal" />
                    </Skeleton>
                  ))
                : fields.map((field) => renderField(field))}
              <Grid container spacing={2} alignItems="center">
                {cliente && (
                  <Grid item xs={4}>
                    <Button
                      onClick={() => fetchCliente(cliente?.numero_documento)}
                      fullWidth
                      variant="outlined"
                      sx={{ mt: 3, mb: 2 }}
                      disabled={!cliente}
                    >
                      Restaurar
                    </Button>
                  </Grid>
                )}
                <Grid item xs={cliente ? 8 : 12}>
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }}
                    disabled={!cliente}
                  >
                    Guardar
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </Tooltip>
        </Box>
      </Container>
      <ConfirmationModal>
        <FieldsValidationContent
          onAccept={requestUpdate}
          onCancel={() => {
            toggleModal();
          }}
        />
      </ConfirmationModal>
      {ErrorSnackbar()}
      {SuccessSnackbar()}
    </>
  );
}
