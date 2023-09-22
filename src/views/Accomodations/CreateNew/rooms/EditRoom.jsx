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
  Typography,
  Checkbox,
  FormControlLabel,
  InputAdornment
} from "@material-ui/core";
import Chips from 'react-chips';
import ImageUpload from "./../ImageUpload";
import CloseIcon from '@material-ui/icons/Close';
import swal from '@sweetalert/with-react';
import axios from "axios";
import {
  accommodations,
} from "../../../../config/routes";
// Component styles
import styles from "./style";

import environment from "../../../../config/config";
import { data } from "views/Dashboard/components/DevicesChart/chart";

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
      RoomName: "", // Number,
      RoomSize: "",
      NoOfRoomsAvailable: "",
      BedSize: "",
      MaxPerson: "",
      Rate: "",
      discountedRate: "",
      RefundStatus: "",
      RoomDescription: "",
      HotelSource: "",
      RoomFacilityName: [],
      taxApplicable: "",
      taxPercentage: "",
      imageUrl: [],
      taxApplicable: false,
      isLoading: false,
    };
    this.handleOpen = this.handleOpen.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }


  componentDidMount() {
    const { handleOpen, data, index } = this.props;
    const { RoomName,
      RoomSize,
      NoOfRoomsAvailable,
      BedSize,
      MaxPerson,
      Rate,
      discountedRate,
      RefundStatus,
      RoomDescription,
      HotelSource,
      RoomFacilityName,
      taxApplicable,
      taxPercentage,
      _id } = data[index];
    if (!localStorage.getItem("userToken")) {
      this.props.history.push(
        process.env.NODE_ENV === "development"
          ? "/"
          : environment.production.prefix
      );
    }
    this.setState({
      open: handleOpen,
      RoomName,
      RoomSize,
      NoOfRoomsAvailable,
      BedSize,
      MaxPerson,
      Rate,
      discountedRate,
      RefundStatus,
      RoomDescription,
      HotelSource,
      roomId: _id,
      taxApplicable,
      taxPercentage,
      RoomFacilityName: RoomFacilityName?.length ? RoomFacilityName : [],
      links: data[index].photoIds.length ? data[index].photoIds.map(item => `https://api.salampakistan.gov.pk/${item}`) : []
    });
  }

  handleOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.props.getData();
    this.setState({ open: false });
  };

  handleChange = (e, name) => {
    return e.target.name === 'taxApplicable' ?
      this.setState({ [e.target.name]: e.target.checked })
      :
      name
        ? this.setState({ [name]: e })
        : this.setState({ [e.target.name]: e.target.value });
  };

  handleSubmit = () => {
    const { accomodationId } = this.props;
    const { RoomName,
      RoomSize,
      NoOfRoomsAvailable,
      BedSize,
      MaxPerson,
      Rate,
      discountedRate,
      RefundStatus,
      RoomDescription,
      HotelSource,
      RoomFacilityName,
      roomId,
      taxApplicable,
      taxPercentage,
      imageUrl,
      links
    } = this.state;
    this.setState({
      isLoading: true
    })
    if (RoomName &&
      RoomSize &&
      NoOfRoomsAvailable &&
      BedSize &&
      MaxPerson &&
      Rate &&
      discountedRate &&
      RefundStatus &&
      RoomDescription &&
      HotelSource &&
      RoomFacilityName &&
      taxPercentage &&
      links?.length || imageUrl?.length
    ) {
      let formData = {
        RoomName,
        RoomSize,
        NoOfRoomsAvailable,
        BedSize,
        MaxPerson,
        Rate,
        discountedRate,
        RefundStatus,
        RoomDescription,
        HotelSource,
        taxApplicable: !!taxApplicable,
        taxPercentage,
        RoomFacilityName: RoomFacilityName?.length ? RoomFacilityName : []
      };
      axios
        .put(`${accommodations}/${accomodationId}/rooms/${roomId}/update-rooms`, formData)
        .then((response) => {
          var count = 0
          if (imageUrl?.length) {
            this.state.imageUrl.forEach(async (item, i) => {
              // let data = {
              //   photo: item,
              // };
              await axios
                .put(`${accommodations}/${accomodationId}/rooms/${roomId}/update-rooms/photos`, item)
                .then((res) => {
                  if (count === this.state.imageUrl.length - 1) {
                    this.setState({
                      isLoading: false
                    })
                    this.props.enableTabs(4, accomodationId);
                    this.handleClose(true);
                    swal(response.data.data.message, {
                      icon: "success",
                    });
                  }
                  else {
                    count++;
                    return ""
                  }
                })
                .catch((error) => {
                  this.setState({
                    isLoading: false
                  })
                  swal(error?.response?.data?.error?.message ? error?.response?.data?.error?.message : "Something wrong", {
                    icon: "error",
                  })
                });
            })
          }
          else {
            this.setState({
              isLoading: false
            })
            this.props.enableTabs(4, accomodationId,);
            this.handleClose(true);
            swal(response.data.data.message, {
              icon: "success",
            });
          }
        })
        .catch((error) => {
          this.setState({
            isLoading: false
          })
          swal(error?.response?.data.error?.message ? error?.response?.data.error?.message : "Something wrong", {
            icon: "error",
          });
        });
    }
    else {
      this.setState({
        isLoading: false
      })

      let error =
        RoomName ?
          RoomSize ?
            NoOfRoomsAvailable ?
              BedSize ?
                MaxPerson ?
                  Rate ?
                    discountedRate ?
                      RefundStatus ?
                        RoomDescription ?
                          HotelSource ?
                            RoomFacilityName?.length ?
                              taxPercentage ?
                                links?.length || imageUrl?.length ?
                                  "" :
                                  "Image" :
                                "Tax Percentage" :
                              "Room Facility Name" :
                            "Hotel Source" :
                          "Room Description" :
                        "Refund Status" :
                      "discounted Price" :
                    "Price" :
                  "Max Person" :
                "Bed Size" :
              "No Of Rooms Available" :
            "Room Size" :
          "Room Name"
      swal(`${error} is required`, {
        icon: "error",
      });
    }
  };

  onChange = RoomFacilityName => {
    this.setState({ RoomFacilityName });
  }

  render() {
    const { classes, data, index, accomodationId } = this.props;

    const {
      RoomName,
      RoomSize,
      NoOfRoomsAvailable,
      BedSize,
      MaxPerson,
      Rate,
      discountedRate,
      RefundStatus,
      RoomDescription,
      HotelSource,
      RoomFacilityName,
      taxApplicable,
      taxPercentage,
      links,
      isLoading
    } = this.state;
    return (
      <div>
        <Dialog
          open={this.state.open}
          fullWidth
          maxWidth="lg"
          onClose={() => this.handleClose(false)}
          aria-labelledby="customized-dialog-title">
          <DialogTitle id="customized-dialog-title" onClose={() => this.handleClose(false)}>
            <span style={{ fontSize: 17 }}>Edit Room</span>
          </DialogTitle>
          <DialogContent dividers>
            <form className={classes.form} noValidate>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={12} md={6}>
                  <TextField
                    className={classes.textField}
                    name="RoomName"
                    label="Room Name"
                    type="text"
                    margin="dense"
                    variant="outlined"
                    value={RoomName}
                    onChange={this.handleChange}
                    InputLabelProps={{
                      shrink: true,
                      style: { fontSize: 18 },
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={12} md={6}>
                  <TextField
                    className={classes.textField}
                    name="RoomSize"
                    label="Room Size"
                    type="number"
                    margin="dense"
                    variant="outlined"
                    value={RoomSize}
                    onChange={this.handleChange}
                    InputLabelProps={{
                      shrink: true,
                      style: { fontSize: 18 },
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={12} md={6}>
                  <TextField
                    className={classes.textField}
                    name="BedSize"
                    label="Bed Size"
                    type="text"
                    margin="dense"
                    variant="outlined"
                    value={BedSize}
                    onChange={this.handleChange}
                    InputLabelProps={{
                      shrink: true,
                      style: { fontSize: 18 },
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={12} md={6}>
                  <TextField
                    className={classes.textField}
                    name="NoOfRoomsAvailable"
                    label="No Of Rooms Available"
                    type="number"
                    margin="dense"
                    variant="outlined"
                    value={NoOfRoomsAvailable}
                    onChange={this.handleChange}
                    InputLabelProps={{
                      shrink: true,
                      style: { fontSize: 18 },
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={12} md={6}>
                  <TextField
                    className={classes.textField}
                    name="MaxPerson"
                    label="Max Person"
                    type="number"
                    margin="dense"
                    variant="outlined"
                    value={MaxPerson}
                    onChange={this.handleChange}
                    InputLabelProps={{
                      shrink: true,
                      style: { fontSize: 18 },
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={12} md={6}>
                  <TextField
                    className={classes.textField}
                    name="Rate"
                    label="Price"
                    type="number"
                    margin="dense"
                    variant="outlined"
                    value={Rate}
                    onChange={this.handleChange}
                    InputLabelProps={{
                      shrink: true,
                      style: { fontSize: 18 },
                    }}
                    InputProps={{
                      endAdornment:
                        <InputAdornment position='end'>PKR</InputAdornment>
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={12} md={6}>
                  <TextField
                    className={classes.textField}
                    name="discountedRate"
                    label="Discounted Price"
                    type="number"
                    margin="dense"
                    variant="outlined"
                    value={discountedRate}
                    onChange={this.handleChange}
                    InputLabelProps={{
                      shrink: true,
                      style: { fontSize: 18 },
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={12} md={6}>
                  <TextField
                    className={classes.textField}
                    name="RefundStatus"
                    label="Refund Status"
                    type="number"
                    margin="dense"
                    variant="outlined"
                    value={RefundStatus}
                    onChange={this.handleChange}
                    InputLabelProps={{
                      shrink: true,
                      style: { fontSize: 18 },
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={12} md={6}>
                  <TextField
                    className={classes.textField}
                    name="RoomDescription"
                    label="Description"
                    type="text"
                    margin="dense"
                    variant="outlined"
                    value={RoomDescription}
                    onChange={this.handleChange}
                    rows={6}
                    multiline
                    InputLabelProps={{
                      shrink: true,
                      style: { fontSize: 18 },
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={12} md={6}>
                  <Grid item xs={12} sm={12} md={12}>
                    <TextField
                      className={classes.textField}
                      name="HotelSource"
                      label="Hotel Source"
                      type="text"
                      margin="dense"
                      variant="outlined"
                      value={HotelSource}
                      onChange={this.handleChange}
                      InputLabelProps={{
                        shrink: true,
                        style: { fontSize: 18 },
                      }}
                    />
                  </Grid>
                  <Grid item xl={12} md={12} sm={12} xs={12} style={{ marginTop: "37px" }}>
                    <Chips
                      value={RoomFacilityName}
                      onChange={this.onChange}
                      createChipKeys={[13]}
                      placeholder="Room Facility Name"
                    />
                    <span style={{fontSize:"12px"}}>Note: Press enter to create room facility</span>
                  </Grid>
                </Grid>
                <Grid item xs={12} sm={12} md={6}>
                  <TextField
                    className={classes.textField}
                    name="taxPercentage"
                    label="Tax Percentage"
                    type="number"
                    margin="dense"
                    variant="outlined"
                    value={taxPercentage}
                    onChange={this.handleChange}
                    InputLabelProps={{
                      shrink: true,
                      style: { fontSize: 18 },
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={12} md={6} style={{ marginTop: "6px" }}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        color="primary"
                        checked={taxApplicable}
                        onChange={(e) => this.handleChange(e)}
                        name="taxApplicable"
                      />
                    }
                    label="Tax Applicable"
                    labelPlacement="end"
                  />
                </Grid>
                <Grid item xl={12} md={12} sm={12} xs={12} >
                  <ImageUpload
                    getImageUrl={(e) => this.setState({ imageUrl: e })}
                    isSaveButtonHide={true}
                    data={links}
                    roomId={data[index]._id}
                    accomodationId={accomodationId}
                    enableTabs={(i) =>
                      this.props.enableTabs(4, accomodationId)}
                  />
                </Grid>
              </Grid>
            </form>
          </DialogContent>
          <DialogActions>
            <Button
              className={classes.button}
              disabled={isLoading}
              onClick={this.handleSubmit}>
              Update
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
