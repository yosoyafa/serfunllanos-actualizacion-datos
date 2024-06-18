import { Checkbox, FormControlLabel } from "@mui/material";
import { useEffect, useState } from "react";

interface UseCheckboxVariables {
  label?: string;
  disabled?: boolean;
  onChecked?: () => void;
}

const useCheckbox = (options?: UseCheckboxVariables) => {
  const [isChecked, setIsChecked] = useState<boolean>(true);

  useEffect(() => {
    if (isChecked && options?.onChecked) {
      options?.onChecked();
    }
  }, [isChecked]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsChecked(event.target.checked);
  };

  return {
    isChecked: isChecked,
    Checkbox: () => (
      <FormControlLabel
        control={<Checkbox checked={isChecked} onChange={handleChange} />}
        disabled={options?.disabled}
        label={options?.label}
      />
    ),
  };
};

export { useCheckbox };
