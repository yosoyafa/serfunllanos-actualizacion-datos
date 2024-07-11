import { Autocomplete, IconButton, TextField, Tooltip } from "@mui/material";
import { Refresh as RefreshIcon } from "@mui/icons-material";
import { useCiudades } from "../data/useCiudades";
import { useBarrios } from "../data/useBarrios";

const useRenderFields = ({
  cliente,
  dataAlreadyUpdated,
}: {
  cliente?: Client;
  dataAlreadyUpdated: boolean;
}) => {
  const {
    ciudades,
    error: ciudadesError,
    isLoading: ciudadesIsLoading,
  } = useCiudades();
  const {
    barrios,
    error: barriosError,
    isLoading: barriosIsLoading,
  } = useBarrios();

  const isDisabled = !cliente || dataAlreadyUpdated;

  const renderField = (field: Field) => {
    const { type, id, name, title, editable } = field;
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
          disabled={isDisabled}
          InputProps={{
            readOnly: !editable,
            endAdornment: cliente && (
              <Tooltip title="Recuperar valor original">
                <IconButton
                  disabled={isDisabled}
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
        (option) =>
          option.id === (isBarrio ? cliente?.idbarrio : cliente?.idciudad),
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
          disabled={isDisabled}
          noOptionsText="No hay opciones"
        />
      );
    }
  };

  return {
    renderField,
    error: ciudadesError || barriosError,
    isLoading: ciudadesIsLoading || barriosIsLoading,
  };
};

export { useRenderFields };
