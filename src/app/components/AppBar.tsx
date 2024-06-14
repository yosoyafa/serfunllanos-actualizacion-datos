import {
  AppBar as MUIAppBar,
  Box,
  IconButton,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import {
  Logout as LogoutIcon,
  Search as SearchIcon,
} from "@mui/icons-material";
import Image from "next/image";
import { Search, SearchIconWrapper, StyledInputBase } from ".";
import icon from "../../../public/images/icon-no-bg.png";

const AppBar = ({
  disabled,
  onLogout,
  onSubmitSearch,
}: {
  disabled: boolean;
  onLogout: () => void;
  onSubmitSearch: (event: React.FormEvent<HTMLFormElement>) => Promise<void>;
}) => {
  return (
    <MUIAppBar position="static">
      <Toolbar
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 2,
        }}
        component="form"
        onSubmit={onSubmitSearch}
      >
        <Box gap={2} display="flex" alignItems="center">
          <Image
            src={icon}
            width={30}
            height={30}
            style={{ margin: 7.5 }}
            alt="icon"
          />
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ display: { xs: "none", sm: "block" } }}
          >
            SerfunLlanos
          </Typography>
        </Box>
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
              disabled={disabled}
            />
          </Search>
        </Tooltip>
        <Tooltip title="Cerrar Sesión">
          <IconButton
            size="large"
            aria-label="logout"
            color="inherit"
            onClick={onLogout}
          >
            <LogoutIcon />
          </IconButton>
        </Tooltip>
      </Toolbar>
    </MUIAppBar>
  );
};

export { AppBar };
