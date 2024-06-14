"use client";

import {
  Button,
  TextField,
  Box,
  Container,
  AppBar,
  IconButton,
  Skeleton,
  Toolbar,
  Tooltip,
  Typography,
  Autocomplete,
  Grid,
  Snackbar,
  Alert,
} from "@mui/material";
import {
  Logout as LogoutIcon,
  Search as SearchIcon,
  Refresh as RefreshIcon,
} from "@mui/icons-material";
import { Search, SearchIconWrapper, StyledInputBase } from "./components";
import { useFields } from "./hooks/data/useFields";
import { useCiudades } from "./hooks/data/useCiudades";
import { useBarrios } from "./hooks/data/useBarrios";
import { useFetchCliente } from "./hooks/client/useFetchCliente";
import { useUpdateCliente } from "./hooks/client/useUpdateCliente";
import { useAuth } from "./hooks/auth/useAuth";
import { useSnackbar } from "./hooks/ui/useSnackbar";
import { useModal } from "./hooks/ui/useModal";
import { useRef } from "react";

export default function Home() {
  const {
    fields,
    isLoading: fieldsIsLoading,
    error: fieldsError,
  } = useFields();
  const { ciudades, error: ciudadesError } = useCiudades();
  const { barrios, error: barriosError } = useBarrios();

  const {
    cliente,
    fetchCliente,
    isLoading: clientIsLoading,
  } = useFetchCliente();

  const {
    updateCliente,
    isLoading: updateIsLoading,
    error: updateError,
    isSuccess: isSuccessUpdating,
  } = useUpdateCliente(fields);

  const { logout } = useAuth();

  const error = fieldsError || ciudadesError || barriosError || updateError;
  const isLoading = fieldsIsLoading || clientIsLoading;

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
      });
    }
  };

  const { Modal: ConfirmationModal, toggle: toggleModal } = useModal({
    title: "Estas seguro de que quieres guardar los siguientes datos:",
    onAccept: requestUpdate,
  });

  const renderField = (field: Field) => {
    const { type, id, name, title } = field;
    if (type === "text") {
      return (
        <TextField
          key={id.toString()}
          margin="normal"
          required
          fullWidth
          id={name}
          label={title}
          name={name}
          defaultValue={cliente?.[name]}
          disabled={!cliente}
          InputProps={{
            endAdornment: cliente && (
              <Tooltip title="Recuperar valor original">
                <IconButton
                  disabled={!cliente}
                  onClick={() => {
                    const inputElement = document.getElementById(
                      name,
                    ) as HTMLInputElement;
                    if (inputElement) {
                      const newValue = cliente ? cliente[name] : "";
                      inputElement.value = newValue as string;
                    }
                  }}
                >
                  <RefreshIcon />
                </IconButton>
              </Tooltip>
            ),
          }}
        />
      );
    } else {
      const isBarrio = name === "barrio";

      const options = isBarrio ? barrios : ciudades;
      const defaultValue = options.find(
        (option) => option.id === (isBarrio ? cliente?.idbarrio : "1"),
      );

      return (
        <Autocomplete
          key={id.toString()}
          disablePortal
          options={options}
          fullWidth
          renderInput={(params) => (
            <TextField
              {...params}
              id={name}
              name={name}
              margin="normal"
              label={title}
              placeholder={title}
            />
          )}
          defaultValue={defaultValue}
          disabled={!cliente}
          noOptionsText="No hay opciones"
        />
      );
    }
  };

  const changedFields = fields
    .map(({ title, name }) => ({
      title,
      oldValue: cliente?.[name]?.toString(),
      newValue: new FormData(formRef.current || undefined)
        .get(name)
        ?.toString(),
    }))
    .filter(({ oldValue, newValue }) => oldValue !== newValue);

  const renderFieldsValidation = () => {
    if (changedFields.length === 0) {
      return (
        <Box marginY={2}>
          <Typography variant="h6" component="h3">
            No hay cambios
          </Typography>
        </Box>
      );
    }

    return changedFields.map(({ title, oldValue, newValue }) => (
      <Box marginY={4} key={title}>
        <Typography component="h3">{title}:</Typography>
        <Box marginLeft={1}>
          <Typography>Antiguo valor: {oldValue}</Typography>
          <Typography>Nuevo valor: {newValue}</Typography>
        </Box>
      </Box>
    ));
  };

  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: 2,
            }}
            component="form"
            onSubmit={handleSearch}
          >
            <Typography
              variant="h6"
              noWrap
              component="div"
              sx={{ display: { xs: "none", sm: "block" } }}
            >
              Serfun Llanos
            </Typography>
            <Tooltip title="Buscar cliente por cédula">
              <Search sx={{ mr: "auto" }}>
                <SearchIconWrapper>
                  <SearchIcon />
                </SearchIconWrapper>
                <StyledInputBase
                  id="cedula"
                  name="cedula"
                  placeholder="Cédula"
                  inputProps={{ "aria-label": "search" }}
                  disabled={updateIsLoading}
                />
              </Search>
            </Tooltip>
            <Tooltip title="Cerrar Sesión">
              <IconButton
                size="large"
                aria-label="logout"
                color="inherit"
                onClick={async () => {
                  await logout();
                }}
              >
                <LogoutIcon />
              </IconButton>
            </Tooltip>
          </Toolbar>
        </AppBar>
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
      <ConfirmationModal>{renderFieldsValidation()}</ConfirmationModal>
      {ErrorSnackbar()}
      {SuccessSnackbar()}
    </>
  );
}
