"use client";

import { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import {
  Alert,
  AppBar,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Skeleton,
  Snackbar,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import {
  Logout as LogoutIcon,
  Search as SearchIcon,
} from "@mui/icons-material";
import { Search, SearchIconWrapper, StyledInputBase } from "./components";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  const [fields, setFields] = useState<Field[]>([]);
  const [client, setClient] = useState<Client | null>();

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [error, setError] = useState<string | null>();
  const [success, setSuccess] = useState<boolean>();

  const fetchFields = async () => {
    setIsLoading(true);

    try {
      const res = await fetch("/api/fields");
      if (!res.ok) {
        setError(res.statusText);
        if (res.status === 401) {
          handleLogout();
        }
      }

      const fetchedFields = await res.json();

      setFields(fetchedFields);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCC = async (cedula: string) => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/clients/fetch?cc=${cedula}`);

      if (!res.ok) {
        setError(res.statusText);
        if (res.status === 401) {
          handleLogout();
        }
      }

      const data = await res.json();

      return data[0] as Client;
    } catch (error) {
      console.error(error);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFields();
  }, [fetchFields]);

  const handleSearch = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    const cedula = data.get("cedula")?.toString();

    if (!!cedula) {
      const clientData = await fetchCC(cedula);
      setClient(clientData);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const formData = fields.map(({ name }) => ({
      field: name,
      newValue: data.get(name)?.toString(),
      // @ts-ignore
      oldValue: client?.[name],
    }));

    const updateData = await fetch("/api/client/update", {
      method: "POST",
      body: JSON.stringify({ updateData: formData }),
    });
  };

  const handleLogout = async () => {
    try {
      const res = await fetch("/api/auth/logout", {
        method: "POST",
      });
      if (!res.ok) {
        throw new Error("Network response was not ok");
      } else {
        router.push("/login");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const renderField = (field: Field) => {
    const { type, id, name, title, opciones } = field;
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
          defaultValue={client?.[name]}
          disabled={!client}
        />
      );
    } else {
      // @ts-ignore
      const parsedOptions: Field["opciones"] = JSON.parse(opciones);
      const defaultValue =
        parsedOptions?.list.find((item) => item.name === client?.[name])?.id ??
        2;
      return (
        <FormControl variant="outlined" fullWidth margin="normal">
          <InputLabel id={name} sx={{ textTransform: "capitalize" }}>
            {name}
          </InputLabel>
          <Select
            labelId={name}
            label={name}
            disabled={!client}
            defaultValue={defaultValue}
          >
            {parsedOptions?.list?.map(({ name, id }) => (
              <MenuItem key={name} value={id}>
                {name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      );
    }
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
                />
              </Search>
            </Tooltip>
            <Tooltip title="Cerrar Sesión">
              <IconButton
                size="large"
                aria-label="logout"
                color="inherit"
                onClick={() => handleLogout()}
              >
                <LogoutIcon />
              </IconButton>
            </Tooltip>
          </Toolbar>
        </AppBar>
      </Box>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginY: "auto",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Tooltip title={!client ? "Busca un cliente para iniciar." : null}>
            <Box
              component="form"
              onSubmit={handleSubmit}
              noValidate
              sx={{ mt: 1, width: "100%" }}
            >
              {isLoading
                ? new Array(8).fill(0).map((_, index) => (
                    <Skeleton width="100%" key={index.toString()}>
                      <TextField margin="normal" />
                    </Skeleton>
                  ))
                : fields.map((field) => renderField(field))}
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                disabled={!client}
              >
                Guardar
              </Button>
            </Box>
          </Tooltip>
        </Box>
      </Container>
      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        message={error}
        onClose={() => {
          setError(null);
        }}
      >
        <Alert
          onClose={() => {
            setError(null);
          }}
          severity="error"
          variant="standard"
        >
          {error}
        </Alert>
      </Snackbar>
      <Snackbar
        open={success}
        autoHideDuration={6000}
        message={error}
        onClose={() => {
          setSuccess(false);
        }}
      >
        <Alert
          onClose={() => {
            setSuccess(false);
          }}
          severity="success"
          variant="standard"
        >
          Usuario actulizado exitosamente.
        </Alert>
      </Snackbar>
    </>
  );
}
