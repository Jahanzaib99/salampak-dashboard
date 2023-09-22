import React, { Component } from "react";
import { connect } from "react-redux";
// import moment from "moment";

// Externals
import PropTypes from "prop-types";

// Material helpers
import { withStyles } from "@material-ui/core";

// Material components
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle as MuiDialogTitle,
  Grid,
  IconButton,
  TextField,
  Typography
} from "@material-ui/core";

import CloseIcon from '@material-ui/icons/Close';
import swal from '@sweetalert/with-react';
import moment from "moment";

// Component styles
import styles from "./style";

import environment from "../../../../config/config";
import DateFnsUtils from "@date-io/date-fns";
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
} from "@material-ui/pickers";
const dialogStyles = theme => ({
  root: {
    margin: 0,
    padding: theme.spacing(2),
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
});

const DialogTitle = withStyles(dialogStyles)(props => {
  const { children, classes, onClose, ...other } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      <Typography variant="h6">{children}</Typography>
      {onClose ? (
        <IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});
class EditItinerary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false, // Boolean
      day: "1", // Number
      timeFrom: +new Date(), // Date
      timeTo: +new Date(), // Date,
      description: "" // String
    };
    this.handleOpen = this.handleOpen.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }


  componentDidMount() {
    const { handleOpen, data, index } = this.props;
    if (!localStorage.getItem("userToken")) {
      this.props.history.push(
        process.env.NODE_ENV === "development"
          ? "/"
          : environment.production.prefix
      );
    }
    this.setState({
      open: handleOpen,
      day: data[index]?.day,
      timeFrom: new Date(data[index]?.timeFrom),
      timeTo: new Date(data[index]?.timeTo),
      description: data[index]?.description,
    });
  }
  formatAMPM(date) {
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0' + minutes : minutes;
    var strTime = hours + ':' + minutes + '' + ampm;
    return strTime;
  }

  isValidTime = (timeFrom, timeTo) => {
    let startTime = this.formatAMPM(new Date(timeFrom));
    let endTime = this.formatAMPM(new Date(timeTo));
    var beginningTime = moment(startTime, 'h:mma');
    var endingTime = moment(endTime, 'h:mma');
    return beginningTime.isBefore(endingTime);
  }

  handleOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.props.getData();
    this.setState({ open: false });
  };

  handleChange = (e, name) => {
    if (name) {
      this.setState({ [name]: e }, () => {
        return !this.isValidTime(this.state.timeFrom, this.state.timeTo) ?
          swal('Start date must be less than End date.', {
            icon: "error",
          })
          : ""
      })
    }
    else {
      this.setState({ [e.target.name]: e.target.value });
    }
  };

  handleSubmit = () => {
    const { description, day, timeTo,
      timeFrom, } = this.state;
    if (this.isValidTime(timeFrom, timeTo) && description.length >= 20 && description.length <= 800) {

      let formData = {
        day: +day,
        timeTo,
        timeFrom,
        description,
      };
      this.props.getData(this.props.index, formData);
      this.handleClose();
    }
    else {
      !this.isValidTime(timeFrom, timeTo) ?
        swal('Start date must be less than End date.', {
          icon: "error",
        })
        :
        swal('itinerary description should be 20 to 8,00 characters long', {
          icon: "error",
        })
    }
  };

  render() {
    const { classes } = this.props;
    const { description, day, timeTo, timeFrom } = this.state;

    return (
      <div>
        <Dialog
          open={this.state.open}
          aria-labelledby="customized-dialog-title"
          onClose={this.handleClose}>
          <DialogTitle id="customized-dialog-title"
            onClose={this.handleClose}>
            <span style={{ fontSize: 17 }}>Edit Itinerary</span>
          </DialogTitle>
          <DialogContent dividers>
            <form className={classes.form} noValidate>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={12}>
                  <TextField
                    className={classes.textField}
                    name="day"
                    label="Day"
                    type="number"
                    margin="dense"
                    value={day}
                    onChange={this.handleChange}
                    InputLabelProps={{
                      shrink: true,
                      style: { fontSize: 18 },
                    }}
                  />
                </Grid>
                <Grid item xl={12} md={12}>
                  {/* <TextField
                    id="datetime-local"
                    label="Time"
                    type="datetime-local"
                    defaultValue={+new Date()}
                    className={classes.textField}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    onChange={(e) => this.handleChange(e, "time")}
                    value={time}
                  /> */}
                  <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <KeyboardTimePicker
                      margin="normal"
                      fullWidth
                      id="time-picker"
                      label="Time From"
                      value={timeFrom}
                      onChange={(e) => this.handleChange(e, "timeFrom")}
                      KeyboardButtonProps={{
                        'aria-label': 'change time',
                      }}
                    />
                  </MuiPickersUtilsProvider>

                </Grid>
                <Grid item xs={12} sm={12}>
                  {/* <TextField
                    className={classes.textField}
                    name="duration"
                    label="Duration"
                    type="number"
                    margin="dense"
                    variant="outlined"
                    value={duration}
                    onChange={this.handleChange}
                    InputLabelProps={{
                      shrink: true,
                      style: { fontSize: 18 },
                    }}
                  /> */}
                  <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <KeyboardTimePicker
                      margin="normal"
                      fullWidth
                      id="time-picker"
                      label="Time To"
                      value={timeTo}
                      onChange={(e) => this.handleChange(e, "timeTo")}
                      KeyboardButtonProps={{
                        'aria-label': 'change time',
                      }}
                    />
                  </MuiPickersUtilsProvider>
                </Grid>
                <Grid item xs={12} sm={12}>
                  <textarea
                    className={classes.textField}
                    style={{
                      padding: 5,
                      fontSize: 15,
                      fontFamily: "Roboto, sans-serif",
                      borderRadius: 4,
                      borderColor: 'rgb(0, 0, 0, 0.23)',
                      borderWidth: '1px'
                    }}
                    name="description"
                    placeholder="Description"
                    type="text"
                    margin="dense"
                    rows={6}
                    value={description}
                    onChange={this.handleChange}
                  />
                </Grid>
              </Grid>
            </form>
          </DialogContent>
          <DialogActions>
            <Button
              className={classes.button}
              onClick={this.handleSubmit}>
              Save
                        </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

EditItinerary.propTypes = {
  className: PropTypes.string,
  classes: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(mapStateToProps)(withStyles(styles)(EditItinerary));
