import React from "react";
import {
  Grid,
  Select,
  FormControl,
  InputLabel,
  MenuItem,
} from "@material-ui/core";
import Capitalize from "../../../../../helpers/Capitalize";

export const SingleSelect = ({
  label,
  options,
  handleChangeOpt,
  name,
  value,
  disabled,
  type
}) => {
  return (
    <Grid item xs={12} sm={12} md={12}>
      <FormControl variant="outlined" size="small" fullWidth>
        <InputLabel id="demo-simple-select-outlined-label">{label}</InputLabel>
        <Select
          //   key={index}
          labelId="demo-simple-select-outlined-label"
          id="demo-simple-select-outlined"
          value={value || value === false ? value : ""}
          name={name ? name : ""}
          label={label}
          onChange={(e) => handleChangeOpt(e)}
          disabled={disabled}
        >
          <MenuItem value="" disabled>
            <em>None</em>
          </MenuItem>
          {options &&
            options.map((each, key) => (
              <MenuItem key={each.value} value={each.value} disabled={each.disabled}>
                {type === "location" ? Capitalize(each.label) : Capitalize(each.name)}
              </MenuItem>
            ))}
        </Select>
      </FormControl>
    </Grid>
  );
};
