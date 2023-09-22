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
  InputAdornment
} from "@material-ui/core";

// Custom Select Component
import { SingleSelect } from '../subComponents/singleSelect';
import SelectElement from '../subComponents/select/index';

// Component styles
import styles from "./style";

import {
  categoryTag,
  locationTag,
  accommodations,
  easyAdd
} from "../../../../config/routes";
import ImageUpload from "./../ImageUpload";

import log from "../../../../config/log";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
  KeyboardTimePicker,
} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";

// Accomodation Data

class UploadAccomodation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: {},
      hotelName: "",
      description: "",
      city: "",
      category: "",
      location: "",
      activities: "",
      facilities: "",
      eventId: "",
      status: "",
      addressInfo: "",
      isEdit: false,
      isLoading: false,
      date: +new Date(),
      imageUrl: "",
      checkin: +new Date().getTime(),
      checkout: +new Date().getTime(),
      overview: "",
      hotelSource: "",
      zipcode: null,
      hotelAmenities: "",
      email: "",
      mobile: "",
      hotelOptions: [
        { value: 'Newspaper', label: 'Newspaper' },
        { value: 'Room Service', label: 'Room Service' },
        { value: 'Cleaning Services', label: 'Cleaning Services' },
        { value: 'Security', label: 'Security' },
        { value: 'WiFi', label: 'WiFi' },
        { value: '24 Hour Reception', label: '24 Hour Reception' },

      ]
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
      hotelName: dataGen?.hotelName,
      addressInfo: dataGen?.addressInfo,
      city: dataGen?.city,
      hotelAmenities: dataGen?.hotelAmenities?.length ? dataGen?.hotelAmenities.map(hotel => {
        return {
          value: hotel,
          label: hotel
        }
      }) : [],
      overview: dataGen?.overview,
      description: dataGen?.description,
      email: dataGen?.email,
      mobile: dataGen?.mobile,
      zipcode: dataGen?.zipcode,
      location: dataGen?.location,
      category: dataGen?.category,
      hotelSource: dataGen?.hotelSource,
      checkin: +dataGen?.checkin,
      checkout: +dataGen?.checkout,
      cancellationPolicyType: dataGen?.cancellationPolicyType,
      isFeatured: dataGen?.isFeatured,
      rate: dataGen?.rate,
      isEdit: this.props.formType === "Copy" ? false : true,
    });
  };

  fetchTags = async () => {
    let filters = {
      location: [],
      category: [],
      city: []
    };

    await axios
      .get(categoryTag + "?pageSize=0" + "&categoryType=accomodation")
      .then((resp1) => {
        log(`GET ${categoryTag}`, "info", resp1.data.data);
        axios.get(locationTag + "?pageSize=0").then((resp2) => {
          log(`GET ${locationTag}`, "info", resp2.data.data);
          axios
            .get(`${locationTag}?pageSize=0&skip=0&locationType=city`).then((resp3) => {
              axios.get(easyAdd + "?pageSize=0").then((resp4) => {
                axios
                  .get(`${easyAdd}?pageSize=0&skip=0&locationType=city`).then((resp5) => {


                    resp1.data.data.forEach((each) => {
                      filters.category.push({
                        name: each.alias,
                        value: each._id,
                      });
                    });
                    resp2.data.data.forEach((each) => {
                      filters.location.push({
                        name: each.alias,
                        value: each._id,
                      });
                    });
                    resp4.data.data.forEach((each) => {
                      filters.location.push({
                        name: each.name,
                        value: each._id,
                      });
                    });
                    resp3.data.data.forEach((each) => {
                      filters.city.push({
                        name: each.name,
                        value: each._id,
                      });
                    });
                    resp5.data.data.forEach((each) => {
                      filters.city.push({
                        name: each.name,
                        value: each._id,
                      });
                    });

                    this.setState({
                      ...this.state,
                      categoriesList: filters.category,
                      locationsList: filters.location,
                      cityList: filters.city,

                    });
                  })
              })
            })
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


  handleSubmit = () => {
    const {
      hotelName,
      addressInfo,
      city,
      hotelAmenities,
      overview,
      description,
      email,
      mobile,
      zipcode,
      location,
      category,
      hotelSource,
      checkin,
      checkout,
      cancellationPolicyType,
      imageUrl,
      accommodationsId,
      imageUploadStatus,
      rate,
    } = this.state;
    this.setState({
      isLoading: true
    })
    const { vendor, auth } = this.props;
    let hotelAmen = hotelAmenities?.length ? hotelAmenities.map(hotel => hotel.value) : []
    let payload = {
      hotelName,
      addressInfo,
      city,
      hotelAmenities: hotelAmen,
      overview,
      description,
      email,
      mobile,
      zipcode,
      location,
      category,
      hotelSource,
      checkin: +new Date(checkin),
      checkout: +new Date(checkout),
      cancellationPolicyType,
      vendor,
      isFeatured: false,
      rate: +rate,
      status: "draft"
    };

    // if ((auth.type === 'vendor' && auth?.profile?.bankTitle !== ""
    //   && auth?.profile?.accountName !== ""
    //   && auth?.profile?.accountNumber !== "")
    //   || ((auth.type === 'admin' || auth.type === 'employee')
    //     // && getSelectedVendor?.bankDetails?.bankTitle
    //     //   && getSelectedVendor?.bankDetails?.accountName
    //     //   && getSelectedVendor?.bankDetails?.accountNumber
    //   )) {

    if (!accommodationsId && imageUploadStatus !== 'pending') {

      if (vendor && hotelName && description && city && email && rate && imageUrl?.length) {
        axios
          .post(accommodations, payload)
          .then((response) => {
            this.setState({
              accommodationsId: response.data.data.id,
              imageUploadStatus: 'pending',
            },
              async () => {
                await this.state.imageUrl.forEach(async (item) => {
                  // let data = {
                  //   photo: item,
                  // };
                  await axios
                    .post(`${accommodations}/${response.data.data.id}/photos`, item)
                    .then((res) => {
                      this.setState({
                        isLoading: false
                      },
                        () => {
                          this.props.enableTabs(2, response.data.data.id);
                          swal(res.data.data.message, {
                            icon: "success",
                          });
                        }
                      )
                      // this.props.enableTabs(2, response.data.data.id);
                      // swal(res.data.data.message, {
                      //   icon: "success",
                      // });
                    })
                    .catch((error) => {
                      this.setState({
                        isLoading: false
                      })
                      log("Error ===>", "error", error?.response?.data);
                      swal(error?.response?.data?.error?.message, {
                        icon: "error",
                      })
                    });
                });
              }
            )
            // let data = {
            //   photo: imageUrl,
            // };
            // axios
            //   .post(`${accommodations}/${response.data.data.id}/photos`, data)
            //   .then(() => {
            //     this.setState({
            //       isLoading: false
            //     })
            //     this.props.enableTabs(2, response.data.data.id);
            //     swal(response.data.data.message, {
            //       icon: "success",
            //     });
            //   })
            //   .catch((error) => {
            //     this.setState({
            //       isLoading: false
            //     })
            //     log("Error ===>", "error", error?.response?.data);
            //     swal(error?.response?.data?.error?.message, {
            //       icon: "error",
            //     })
            //   })
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
      }
      else {
        this.setState({
          isLoading: false
        })
        let error = vendor ? hotelName ? description ? city ? imageUrl.length ? email ? rate ? "" : "rate" : "email" : "imageUrl" : "city" : "description" : "hotelName" : "vendor"
        swal(`${error} is required`, {
          icon: "error",
        });
      }
    }
    else {
      if (this?.state?.imageUrl?.length) {
        this.state.imageUrl.forEach(async (item) => {
          // let data = {
          //   photo: item,
          // };
          await axios
            .post(`${accommodations}/${accommodationsId}/photos`, item)
            .then((res) => {
              this.setState({
                isLoading: false
              }, () => {
                this.props.enableTabs(2, accommodationsId);
                swal(res.data.data.message, {
                  icon: "success",
                });
              })
            })
            .catch((error) => {
              this.setState({
                isLoading: false
              })
              log("Error ===>", "error", error?.response?.data);
              swal(error?.response?.data?.error?.message, {
                icon: "error",
              })
            });
        })
      }
      else {
        this.setState({
          isLoading: false
        })
        swal('imageUrl is required', {
          icon: "error",
        })

      }
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


  };

  // this function for update Accomodation
  handleUpdate = () => {
    const {
      hotelName,
      addressInfo,
      city,
      hotelAmenities,
      overview,
      description,
      email,
      mobile,
      zipcode,
      location,
      category,
      hotelSource,
      checkin,
      checkout,
      cancellationPolicyType,
      isFeatured,
      rate
    } = this.state;
    this.setState({
      isLoading: true
    })
    const { vendor, accomodationId } = this.props;
    let hotelAmen = hotelAmenities?.length ? hotelAmenities.map(hotel => hotel.value) : []
    let payload = {
      hotelName,
      addressInfo,
      city,
      hotelAmenities: hotelAmen,
      overview,
      description,
      email,
      mobile,
      zipcode,
      location,
      category,
      hotelSource,
      checkin: +new Date(checkin),
      checkout: +new Date(checkout),
      cancellationPolicyType,
      vendor,
      isFeatured,
      rate: +rate

    };
    axios
      .put(`${accommodations}/${accomodationId}`, payload)
      .then((response) => {
        this.props.enableTabs(3, accomodationId);
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
      hotelAmenitiesList,
      categoriesList,
      locationsList,
      location,
      category,
      checkin,
      checkout,
      hotelAmenities,
      hotelOptions,
      isLoading,
      imageUrl,
      cityList,
      city
    } = this.state;
    const { classes, accomodationId } = this.props;
    return (
      <div>
        <form className={classes.form}>
          <Grid container spacing={2}>
            <Grid item xl={6} md={6} sm={12} xs={12}>
              <TextField
                className={classes.textField}
                name="hotelName"
                label="Hotel Name"
                type="text"
                margin="dense"
                value={this.state.hotelName}
                variant="outlined"
                onChange={this.handleChange}
                InputLabelProps={{ shrink: this.state.hotelName ? true : false }}

              />
            </Grid>
            <Grid item xl={6} md={6} sm={12} xs={12}>
              <TextField
                className={classes.textField}
                name="addressInfo"
                label="Address Info"
                type="text"
                margin="dense"
                value={this.state.addressInfo}
                variant="outlined"
                onChange={this.handleChange}
                InputLabelProps={{ shrink: this.state.addressInfo ? true : false }}

              />
            </Grid>
            <Grid item xl={6} md={6} sm={12} xs={12}>
              <SingleSelect
                options={cityList}
                label="City"
                handleChangeOpt={this.handleChangeOpt}
                name="city"
                value={city}
              />
            </Grid>
            <Grid item xl={6} md={6} sm={12} xs={12} >
              <SingleSelect
                handleChangeOpt={this.handleChangeOpt}
                label="Locations"
                options={locationsList}
                name="location"
                value={location}
              />
            </Grid>
            <Grid item xl={6} md={6} sm={12} xs={12}>
              <TextField
                className={classes.textField}
                name="email"
                label="Email"
                type="email"
                margin="dense"
                value={this.state.email}
                variant="outlined"
                onChange={this.handleChange}
                InputLabelProps={{ shrink: this.state.email ? true : false }}

              />
            </Grid>
            <Grid item xl={6} md={6} sm={12} xs={12}>
              <TextField
                className={classes.textField}
                name="mobile"
                label="Mobile"
                type="text"
                margin="dense"
                value={this.state.mobile}
                variant="outlined"
                onChange={this.handleChange}
                InputLabelProps={{ shrink: this.state.mobile ? true : false }}

              />
            </Grid>
            <Grid item xl={6} md={6} sm={12} xs={12}>
              <TextField
                className={classes.textField}
                name="zipcode"
                label="Zip Code"
                type="number"
                margin="dense"
                value={this.state.zipcode}
                variant="outlined"
                onChange={this.handleChange}
                InputLabelProps={{ shrink: this.state.zipcode ? true : false }}

              />
            </Grid>
            <Grid item xl={6} md={6} sm={12} xs={12} style={{ marginTop: "16px" }}>
              <SingleSelect
                options={categoriesList}
                label="Categories"
                handleChangeOpt={this.handleChangeOpt}
                name="category"
                value={category}
              />
            </Grid>
            <Grid item xl={6} md={6} sm={12} xs={12}>
              <TextField
                className={classes.textField}
                name="rate"
                label="Price"
                type="number"
                margin="dense"
                value={this.state.rate}
                variant="outlined"
                onChange={this.handleChange}
                InputLabelProps={{ shrink: this.state.rate ? true : false }}
                InputProps={{
                  endAdornment:
                    <InputAdornment position='end'>PKR</InputAdornment>
                }}

              />
            </Grid>
            <Grid item xl={6} md={6} sm={12} xs={12}>
              <SelectElement
                data={hotelOptions}
                options={hotelAmenities}
                label="Hotel Amenities"
                getValues={(e) => this.setState({
                  hotelAmenities: e
                })}
                name="hotelAmenities"
                value={hotelAmenities}
              />
            </Grid>
            <Grid item xl={6} md={6} sm={12} xs={12}>
              <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <KeyboardTimePicker
                  margin="normal"
                  fullWidth
                  id="time-picker"
                  label="Check In"
                  value={checkin}
                  onChange={(e) => this.handleChange(e, "checkin")}
                  KeyboardButtonProps={{
                    'aria-label': 'change time',
                  }}
                />
              </MuiPickersUtilsProvider>
            </Grid>
            <Grid item xl={6} md={6} sm={12} xs={12}>
              <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <KeyboardTimePicker
                  margin="normal"
                  fullWidth
                  id="time-picker"
                  label="Check Out"
                  value={checkout}
                  onChange={(e) => this.handleChange(e, "checkout")}
                  KeyboardButtonProps={{
                    'aria-label': 'change time',
                  }}
                />
              </MuiPickersUtilsProvider>
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
                InputLabelProps={{ shrink: this.state.description ? true : false }}
              />
            </Grid>

            <Grid item xl={6} md={6} sm={12} xs={12}>
              <TextField
                className={classes.textField}
                name="overview"
                label="Overview"
                type="text"
                margin="dense"
                variant="outlined"
                value={this.state.overview}
                rows={6}
                multiline
                onChange={this.handleChange}
                InputLabelProps={{ shrink: this.state.overview ? true : false }}
              />
            </Grid>
            <Grid item xl={6} md={6} sm={12} xs={12}>
              <TextField
                className={classes.textField}
                name="cancellationPolicyType"
                label="Cancellation Policy"
                type="text"
                margin="dense"
                variant="outlined"
                value={this.state.cancellationPolicyType}
                rows={6}
                multiline
                onChange={this.handleChange}
                InputLabelProps={{ shrink: this.state.cancellationPolicyType ? true : false }}
              />
            </Grid>
            <Grid item xl={6} md={6} sm={12} xs={12}></Grid>
            {
              !accomodationId ?
                <ImageUpload
                  getImageUrl={(e) => this.setState({ imageUrl: e })}
                  isSaveButtonHide={true}
                />
                : ""
            }
          </Grid>
          <div style={{ textAlign: "right", marginTop: 20 }}>
            <Button
              className={classes.saveButton}
              disabled={isLoading}
              onClick={
                this.state.isEdit ? this.handleUpdate : this.handleSubmit
              }
            >
              {isLoading ? <CircularProgress color="#fff" size={25} /> : "Save"}
            </Button>
          </div>
        </form>
      </div>
    );
  }
}

UploadAccomodation.propTypes = {
  className: PropTypes.string,
  classes: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps)(withStyles(styles)(UploadAccomodation));
