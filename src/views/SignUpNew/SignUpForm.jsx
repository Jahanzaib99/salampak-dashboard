import React from "react";
// Material components
import {
  Grid,
  Button,
  CircularProgress,
  TextField,
  Typography,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Select,
  InputLabel,
  MenuItem,
} from "@material-ui/core";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";
// Component styles,

// import styles from "./styles";

import fma_logo from "../../assets/images/logo.png";
import DateFnsUtils from "@date-io/date-fns";

export const SignUpForm = ({
  classes,
  state,
  onSubmit,
  onChange,
  // handleDOBChange,
  goToSignIn,
  loading
}) => {
  const {
    email,
    password,
    firstName,
    lastName,
    vendorType,
    // DOB,
    gender,
    mobileNumber,
    companyName
  } = state;
  return (
    <div className={classes.root}>
      <Grid className={classes.grid} container>
        {/* Grid with email and password fields */}
        <Grid className={classes.mainWrapper} item lg={12} xs={12}>
          <div className={classes.content}>
            <div className={classes.contentBody}>
              <form className={classes.form} onSubmit={onSubmit}>
                <div style={{ textAlign: "center" }}>
                  <img
                    alt="FindMyAdventure.pk"
                    src={fma_logo}
                    style={{ marginBottom: "10px" }}
                  />
                  <h4>Vendor Sign Up </h4>

                </div>
                <div className={classes.fields}>
                  <TextField
                    className={classes.textField}
                    label="First Name"
                    name="firstName"
                    onChange={onChange}
                    type="text"
                    value={firstName}
                    variant="outlined"
                  />
                  <TextField
                    className={classes.textField}
                    label="Last Name"
                    name="lastName"
                    onChange={onChange}
                    type="text"
                    value={lastName}
                    variant="outlined"
                  />
                  <TextField
                    className={classes.textField}
                    label="Email address"
                    name="email"
                    onChange={onChange}
                    type="text"
                    value={email}
                    variant="outlined"
                  />
                  <TextField
                    className={classes.textField}
                    label="Mobile Number"
                    name="mobileNumber"
                    onChange={onChange}
                    type="number"
                    value={mobileNumber}
                    variant="outlined"
                  />
                  <TextField
                    className={classes.textField}
                    label="Password"
                    name="password"
                    onChange={onChange}
                    type="password"
                    value={password}
                    variant="outlined"
                  />
                  <TextField
                    className={classes.textField}
                    label="Company Name"
                    name="companyName"
                    onChange={onChange}
                    type="text"
                    value={companyName}
                    variant="outlined"
                  />
                  <Grid
                    item
                    xs={12}
                    sm={12}
                    md={12}
                    className={classes.textField}
                  >
                    <FormControl
                      variant="outlined"
                      className={classes.formControl}
                      fullWidth
                    >
                      <InputLabel id="demo-simple-select-outlined-label">
                        Type
                      </InputLabel>
                      <Select
                        labelId="demo-simple-select-outlined-label"
                        id="demo-simple-select-outlined"
                        value={vendorType}
                        onChange={onChange}
                        label="Age"
                        name="vendorType"
                      >
                        <MenuItem value={"tripAndEvent"}>Trip and Event</MenuItem>
                        <MenuItem value={"hotel"}>Hotel</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>

                  {/* <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <KeyboardDatePicker
                      margin="normal"
                      id="DOB"
                      fullWidth
                      label="Date of Birth"
                      format="MM/dd/yyyy"
                      value={DOB}
                      onChange={handleDOBChange}
                      KeyboardButtonProps={{
                        "aria-label": "change date",
                      }}
                    />
                  </MuiPickersUtilsProvider> */}
                  <FormControl className={classes.textField}>
                    <FormLabel component="legend">Gender</FormLabel>
                    <RadioGroup
                      row
                      aria-label="gender"
                      name="gender"
                      value={gender}
                      onChange={onChange}
                    >
                      <FormControlLabel
                        value="male"
                        control={<Radio color="primary" />}
                        label="Male"
                        labelPlacement="Male"
                      />
                      <FormControlLabel
                        value="female"
                        control={<Radio color="primary" />}
                        label="Female"
                        labelPlacement="Female"
                      />
                    </RadioGroup>
                  </FormControl>
                </div>
                {loading ? (
                  <CircularProgress className={classes.progress} />
                ) : (
                    <Button
                      className={classes.signInButton}
                      color="primary"
                      onClick={onSubmit}
                      size="large"
                      type='submit'
                      variant="contained"
                    >
                      Sign Up
                    </Button>
                  )}
                <div className={`${classes.fields} ${classes.accountTxt}`}>
                  You have an already account?
                  <span className={classes.policyUrl} onClick={goToSignIn}>
                    Sign In
                  </span>
                </div>
              </form>
            </div>
          </div>
        </Grid>
      </Grid>
    </div>
  );
};
