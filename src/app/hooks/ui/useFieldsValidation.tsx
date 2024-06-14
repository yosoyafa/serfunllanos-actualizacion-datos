import { Box, Button, Grid, Typography } from "@mui/material";
import { useRef } from "react";

const useFieldsValidation = ({
  fields,
  cliente,
  form,
}: {
  fields: Field[];
  cliente?: Client;
  form: HTMLFormElement | null;
}) => {
  const shouldUpdate = useRef<boolean>(false);

  const changedFields = fields
    .map(({ title, name }) => ({
      title,
      oldValue: cliente?.[name]?.toString(),
      newValue:
        new FormData(form || undefined).get(name)?.toString() ??
        cliente?.[name]?.toString(),
    }))
    .filter(({ oldValue, newValue }) => oldValue !== newValue);

  const FieldsValidationContent = ({
    onAccept,
    onCancel,
  }: {
    onAccept: () => void;
    onCancel: () => void;
  }) => {
    if (changedFields.length === 0) {
      shouldUpdate.current = false;

      return (
        <>
          <Typography variant="h6" component="h3">
            No hay cambios
          </Typography>
          <Button
            onClick={() => {
              onCancel();
            }}
            fullWidth
          >
            Ok
          </Button>
        </>
      );
    }

    shouldUpdate.current = true;

    return changedFields.map(({ title, oldValue, newValue }) => (
      <>
        <Typography variant="h6" component="h2">
          Datos a actualizar:
        </Typography>
        <Box marginY={1} key={title}>
          <Typography component="h3">{title}:</Typography>
          <Box marginLeft={1}>
            <Typography>Antiguo valor: {oldValue}</Typography>
            <Typography>Nuevo valor: {newValue}</Typography>
          </Box>
        </Box>
        <Grid container spacing={1} alignItems="center">
          <Grid item xs={4}>
            <Button
              onClick={() => {
                onCancel();
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
              }}
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Actualizar
            </Button>
          </Grid>
        </Grid>
      </>
    ));
  };

  return {
    shouldUpdate,
    FieldsValidationContent,
  };
};

export { useFieldsValidation };
