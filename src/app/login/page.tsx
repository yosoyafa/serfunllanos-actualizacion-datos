"use client";

import Image from "next/image";
import {
  Alert,
  Container,
  Typography,
  Box,
  TextField,
  CssBaseline,
  Button,
} from "@mui/material";
import { useAuth } from "../hooks/auth/useAuth";
import logo from "../../../public/images/icon.png";

export default function SignIn() {
  const { login, error, isLoading } = useAuth();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    const username = data.get("username")?.toString();
    const password = data.get("password")?.toString();

    if (!!username && !!password) {
      await login({ username, password });
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Image
          src={logo}
          width={100}
          height={100}
          style={{ margin: 20 }}
          alt="Logo Los Olivos"
        />
        <Typography component="h1" variant="h5">
          Serfun Llanos
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="username"
            label="Usuario"
            name="username"
            autoFocus
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Contraseña"
            type="password"
            id="password"
            autoComplete="current-password"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={isLoading}
          >
            Iniciar Sesión
          </Button>
          {error && <Alert severity="error">{error}</Alert>}
        </Box>
      </Box>
    </Container>
  );
}
