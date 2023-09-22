import React, { Component } from "react";
import { connect } from "react-redux";
import axios from "axios";
import swal from "@sweetalert/with-react";
import _ from "lodash";

// Externals
import PropTypes from "prop-types";

// Material helpers
import { withStyles ,CircularProgress } from "@material-ui/core";

// Material components
import {
  Button,
  Grid,
  TextField,
  InputAdornment,
} from "@material-ui/core";
import Capitalize from "../../../../helpers/Capitalize";

// Custom Select Component
import { SingleSelect } from "../subComponents/singleSelect";
import MultiSelect from "../subComponents/select/index";

// Component styles
import styles from "./style";

import {
  categoryTag,
  activityTag,
  facility,
  locationTag,
  trip,
  easyAdd
} from "../../../../config/routes";
import ImageUpload from "./../ImageUpload";
import TripItinerary from "./../TripItinerary";

import log from "../../../../config/log";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";

// Trip Data

class UploadTrip extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: {},
      title: "",
      description: "",
      duration: "",
      categories: "",
      locations: "",
      activities: "",
      facilities: "",
      eventId: "",
      status: "",
      price: "",
      contact: "",
      isEdit: false,
      isLoading: false,
      date: +new Date(),
      imageUrl: ""
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange = (e, name) => {
    return name
      ? this.setState({ [name]: e })
      : this.setState({ [e.target.name]: e.target.value });
  };

  componentDidMount = async () => {
    this.fetchTags();
    return this.props.dataGen?._id ? this.updateState(this.props.dataGen) : "";
  };

  componentDidUpdate = (prevProps) => {
    return JSON.stringify(prevProps.dataGen) !==
      JSON.stringify(this.props.dataGen)
      ? this.updateState(this.props.dataGen)
      : "";
  };
  updateState = (dataGen) => {
    this.setState({
      title: dataGen?.title,
      description: dataGen?.description,
      duration: dataGen?.duration,
      categories: dataGen?.categories ? dataGen?.categories.map(tag => {
        return {
          label: tag.alias,
          value: tag._id,
        }
      }) : [],
      startLocation: dataGen?.startLocation?._id,
      endLocation: dataGen?.Locations ? dataGen?.Locations.map(tag => {
        return {
          label: tag.alias,
          value: tag._id,
        }
      }) : [],
      activities: dataGen?.activities ? dataGen?.activities.map(tag => {
        return {
          label: tag.alias,
          value: tag._id,
        }
      }) : [],
      facilities: dataGen?.facilities ? dataGen?.facilities.map(tag => {
        return {
          label: tag.alias,
          value: tag._id,
        }
      }) : [],
      price: dataGen?.price,
      date: new Date(dataGen?.date),
      cancellationPolicy: dataGen?.cancellationPolicy,
      isEdit: this.props.formType === "Copy" ? false : true,
      slug: dataGen?.slug,
      contact: dataGen?.contact,

    });
  };

  fetchTags = async () => {
    let filters = {
      locations: [],
      categories: [],
      activities: [],
      facilities: [],
      locations: [],
    };
    await axios
      .get(categoryTag + "?pageSize=0&categoryType=trip")
      .then((resp1) => {
        log(`GET ${categoryTag}`, "info", resp1.data.data);
        axios.get(activityTag + "?pageSize=0").then((resp2) => {
          log(`GET ${activityTag}`, "info", resp2.data.data);
          axios.get(facility + "?pageSize=0&type=trip").then((resp3) => {
            log(`GET ${facility}?pageSize=0&type=trip`, "info", resp3.data.data);
            axios.get(locationTag + "?pageSize=0").then((resp4) => {
              log(`GET ${locationTag}`, "info", resp4.data.data);
              axios.get(easyAdd + "?pageSize=0").then((resp5) => {
                log(`GET ${easyAdd}`, "info", resp5.data.data);
                console.log(resp5.data.data);
                resp1.data.data.forEach((each) => {
                  filters.categories.push({
                    label: each.alias,
                    value: each._id,
                  });
                });
                resp2.data.data.forEach((each) => {
                  filters.activities.push({
                    label: each.alias,
                    value: each._id,
                  });
                });
                resp3.data.data.forEach((each) => {
                  filters.facilities.push({
                    label: each.alias,
                    value: each._id,
                  });
                });
                resp4.data.data.forEach((each) => {
                  filters.locations.push({
                    label: each.alias,
                    value: each._id,
                  });
                });
                resp5.data.data.forEach((each) => {
                  filters.locations.push({
                    label: each.name,
                    value: each._id,
                  });
                });
                this.setState({
                  ...this.state,
                  activitiesList: filters.activities,
                  categoriesList: filters.categories,
                  facilitiesList: filters.facilities,
                  locationsList: filters.locations,
                });
              })

            });
          });
        });
      })
      .catch((error) => {
        log("Error ===>", "error", error?.response?.data);
        swal(error?.response?.data?.error?.message, {
          icon: "error",
          showCloseButton: true,
        });
      });
  };
  handleChangeOpt = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };
  updateDependentChanges = (data) => { };

  handleSubmit = () => {
    const {
      title,
      description,
      cancellationPolicy,
      duration,
      date,
      startLocation,
      endLocation,
      facilities,
      categories,
      activities,
      price,
      imageUrl,
      ItnList,
      contact
    } = this.state;
    this.setState({
      isLoading: true
    })
    let facilitiesArray = facilities?.length ? facilities.map(val => val.value) : []
    let categoriesArray = categories?.length ? categories.map(val => val.value) : []
    let activitiesArray = activities?.length ? activities.map(val => val.value) : []
    let endLocationArray = endLocation?.length ? endLocation.map(val => val.value) : []

    const { vendorId, auth, allvendorInfo } = this.props;
    let getSelectedVendor = allvendorInfo?.length ? allvendorInfo.filter(vendor => vendor._id === vendorId)[0] : []

    let payload = {
      title,
      description,
      cancellationPolicy,
      duration: Number(duration),
      date: new Date(date),
      price: Number(price),
      vendorId,
      startLocation,
      Locations: endLocationArray,
      facilities: facilitiesArray,
      categories: categoriesArray,
      activities: activitiesArray,
      isFeatured: false,
      contact
    };
    if (vendorId) {

      // if ((auth.type === 'vendor'
      //   && auth?.profile?.bankTitle !== ""
      //   && auth?.profile?.accountName !== ""
      //   && auth?.profile?.accountNumber !== "")
      //   || ((auth.type === 'admin' || auth.type === 'employee')
      //     // && getSelectedVendor?.bankDetails?.bankTitle
      //     //   && getSelectedVendor?.bankDetails?.accountName
      //     //   && getSelectedVendor?.bankDetails?.accountNumber
      //   )) {
      if (imageUrl?.length) {
        if (ItnList?.length) {
          axios
            .post(trip, payload)
            .then((response) => {
              // let data = {
              //   photo: imageUrl,
              // };
              axios
                .post(`${trip}/${response.data.data.id}/tripItinerary`, { itinerary: ItnList })
                .then((response) => {

                })
                .catch((error) => {
                  swal(error?.response?.data.error?.message ? error?.response?.data.error?.message : "Something wrong", {
                    icon: "error",
                  });
                });
              axios
                .post(`${trip}/${response.data.data.id}/tripPhoto`, imageUrl[0])
                .then(() => {
                  this.props.enableTabs(2, response.data.data.id);
                  this.setState({
                    isLoading: false
                  })
                  swal(response.data.data.message, {
                    icon: "success",
                  });
                })
                .catch((error) => {
                  this.setState({
                    isLoading: false
                  })
                  log("Error ===>", "error", error?.response?.data);
                  swal(error?.response?.data?.error?.message, {
                    icon: "error",
                  })
                })
            })
            .catch((error) => {
              this.setState({
                isLoading: false
              })
              log("Error ===>", "error", error?.response?.data);
              swal(error?.response?.data.error?.message ? error?.response?.data.error?.message : "Something wrong", {
                icon: "error",
              });
            })
        }
        else {
          this.setState({
            isLoading: false
          })
          swal(`Itnerary is required`, {
            icon: "error",
          })
        }
      }
      else {
        this.setState({
          isLoading: false
        })
        swal('Image is Required', {
          icon: "error",
        })
      }
      // }
      // else {
      //   this.setState({
      //     isLoading: false
      //   })
      //   swal(`Vendor Bank detail is required`, {
      //     icon: "error",
      //   })
      // }
    }
    else {
      this.setState({
        isLoading: false
      })
      swal(`Vendor is required`, {
        icon: "error",
      })
    }
  };

  // this function for update trip
  handleUpdate = () => {
    const {
      title,
      description,
      cancellationPolicy,
      duration,
      date,
      startLocation,
      endLocation,
      facilities,
      categories,
      activities,
      price,
      slug,
      contact
    } = this.state;
    const {
      vendorId,
      isFeatured,
      tripId
    } = this.props;
    this.setState({
      isLoading: true
    })

    let facilitiesArray = facilities?.length ? facilities.map(val => val.value) : []
    let categoriesArray = categories?.length ? categories.map(val => val.value) : []
    let activitiesArray = activities?.length ? activities.map(val => val.value) : []
    let endLocationArray = endLocation?.length ? endLocation.map(val => val.value) : []

    let payload = {
      title,
      description,
      cancellationPolicy,
      duration: Number(duration),
      date,
      price: Number(price),
      vendorId,
      startLocation,
      Locations: endLocationArray,
      facilities: facilitiesArray,
      categories: categoriesArray,
      activities: activitiesArray,
      slug,
      isFeatured: isFeatured ? true : false,
      contact
    };

    axios
      .put(`${trip}/${tripId}`, payload)
      .then((response) => {
        this.props.retainData(payload);
        this.setState({
          isLoading: false
        })
        swal(response.data.data.message, {
          icon: "success",
        });
      })
      .catch((error) => {
        this.setState({
          isLoading: false
        })
        log("Error ===>", "error", error?.response?.data);
        swal(error?.response?.data.error?.message ? error?.response?.data.error?.message : "Something wrong", {
          icon: "error",
        });
      });
  };

  render() {
    const {
      activitiesList,
      categoriesList,
      facilitiesList,
      locationsList,
      startLocation,
      endLocation,
      facilities,
      categories,
      activities,
      date,
      imageUrl,
      isLoading
    } = this.state;
    const { classes, tripId } = this.props;

    return (
      <div>
        <form className={classes.form}>
          <Grid container spacing={2}>
            <Grid item xl={6} md={6} sm={12} xs={12}>
              <TextField
                className={classes.textField}
                name="title"
                label="Trip Title"
                type="text"
                margin="dense"
                value={this.state.title}
                variant="outlined"
                onChange={this.handleChange}

              />
            </Grid>
            <Grid item xl={6} md={6} sm={12} xs={12}>
              <TextField
                className={classes.textField}
                name="price"
                label="Price"
                type="number"
                margin="dense"
                value={this.state.price}
                variant="outlined"
                onChange={this.handleChange}
                InputProps={{
                  endAdornment:
                    <InputAdornment position='end'>PKR</InputAdornment>
                }}
              />
            </Grid>
            <Grid item xl={6} md={6} sm={12} xs={12}>
              <TextField
                className={classes.textField}
                name="duration"
                label="Duration"
                type="number"
                margin="dense"
                value={this.state.duration}
                variant="outlined"
                onChange={this.handleChange}
                InputProps={{
                  endAdornment:
                    <InputAdornment position='end'>Days</InputAdornment>
                }}
              />
            </Grid>
            <Grid item xl={6} md={6} sm={12} xs={12}>
              <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <KeyboardDatePicker
                  margin="normal"
                  id="date"
                  fullWidth
                  label="Start Date"
                  format="MM/dd/yyyy"
                  value={date}
                  onChange={(e) => this.handleChange(e, "date")}
                  KeyboardButtonProps={{
                    "aria-label": "change date",
                  }}
                  minDate={new Date()}
                />
              </MuiPickersUtilsProvider>
            </Grid>
            <Grid item xl={6} md={6} sm={12} xs={12}>
              <TextField
                className={classes.textField}
                name="contact"
                label="Contact"
                type="number"
                margin="dense"
                value={this.state.contact}
                variant="outlined"
                onChange={this.handleChange}
              />
            </Grid>

            <Grid item xl={6} md={6} sm={12} xs={12} style={{ marginTop: '16px' }}>
              <SingleSelect
                handleChangeOpt={this.handleChangeOpt}
                label="Starting Location"
                options={locationsList}
                name="startLocation"
                value={startLocation}
                type="location"
              />
            </Grid>
            <Grid item xl={6} md={6} sm={12} xs={12}>
              <MultiSelect
                data={locationsList}
                label="Locations Included"
                options={endLocation}
                getValues={(e) => this.setState({
                  endLocation: e
                })}
                name="endLocation"
                value={endLocation}
              />
            </Grid>


            <Grid item xl={6} md={6} sm={12} xs={12}>

              <MultiSelect
                data={categoriesList}
                options={categories}
                label="Categories"
                getValues={(e) => this.setState({
                  categories: e
                })}
                name="categories"
                value={categories}
              />
            </Grid>
            <Grid item xl={6} md={6} sm={12} xs={12}>
              <MultiSelect
                data={facilitiesList}
                options={facilities}
                label="Facilities"
                getValues={(e) => this.setState({
                  facilities: e
                })}
                name="facilities"
                value={facilities}
              />
            </Grid>
            <Grid item xl={6} md={6} sm={12} xs={12}>
              <MultiSelect
                data={activitiesList}
                options={activities}
                label="Activities"
                getValues={(e) => this.setState({
                  activities: e
                })}
                name="activities"
                value={activities}
              />
            </Grid>

            <Grid item xl={6} md={6} sm={12} xs={12}>
              <TextField
                className={classes.textField}
                name="description"
                label="Description"
                type="text"
                margin="dense"
                variant="outlined"
                value={this.state.description}
                rows={6}
                multiline
                onChange={this.handleChange}
              />
            </Grid>
            <Grid item xl={6} md={6} sm={12} xs={12}>
              <TextField
                className={classes.textField}
                name="cancellationPolicy"
                label="Cancellation Policy"
                type="text"
                margin="dense"
                variant="outlined"
                value={this.state.cancellationPolicy}
                rows={6}
                multiline
                onChange={this.handleChange}
                InputLabelProps={{ shrink: this.state.cancellationPolicy ? true : false }}

              />
            </Grid>
            {
              !tripId ?
                <ImageUpload
                  getImageUrl={(e) => this.setState({ imageUrl: e?.length ? e : "" })}
                  isSaveButtonHide={true}
                />
                : ""
            }
            <Grid item xl={12} md={12} sm={12} xs={12}>

              {!tripId ?
                <TripItinerary
                  duration={this.state.duration}
                  data={[]}
                  isSaveButtonHide={true}
                  getItnList={(list) => this.setState({
                    ItnList: list
                  })}
                />
                : ""
              }
            </Grid>
          </Grid>
          <div style={{ textAlign: "right", marginTop: 20 }}>
            <Button
              className={classes.saveButton}
              disabled={isLoading}
              onClick={
                this.state.isEdit ? this.handleUpdate : this.handleSubmit
              }
            >
              {isLoading ? <CircularProgress color="#fffff" size={25} /> : "Save"}
            </Button>
          </div>
        </form>
      </div>
    );
  }
}

UploadTrip.propTypes = {
  className: PropTypes.string,
  classes: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps)(withStyles(styles)(UploadTrip));
