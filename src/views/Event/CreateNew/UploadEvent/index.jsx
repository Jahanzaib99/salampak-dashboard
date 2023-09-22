import React, { Component } from "react";
import { connect } from "react-redux";
import axios from "axios";
import swal from "@sweetalert/with-react";
import _ from "lodash";

// Externals
import PropTypes from "prop-types";

// Material helpers
import { withStyles } from "@material-ui/core";

import ImageUpload from "./../ImageUpload";

// Material components
import {
  Button,
  Grid,
  TextField,
  FormControlLabel,
  Checkbox,
  InputAdornment
} from "@material-ui/core";

// Custom Select Component
import { SingleSelect } from "../subComponents/singleSelect";
import MultiSelect from "../subComponents/select/index";

// Component styles
import styles from "./style";

import {
  locationTag,
  surroundings,
  categoryTag
} from "../../../../config/routes";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
  KeyboardTimePicker,
} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";

class UploadEvent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: {},
      title: "",
      description: "",
      address: "",
      longitude: 0,
      latitude: 0,
      city: "",
      province: "",
      startDate: +new Date(),
      endDate: +new Date(),
      startTime: +new Date().getTime(),
      endTime: +new Date().getTime(),
      numberOfPasses: 0,
      price: 0,
      status: "",
      eventId: "",
      isEdit: false,
      isLoading: false,
      provinceList: [],
      cityList: [],
      imageUrl: "",
      freeEvent: false,
      surroundings: [],
      contact: "",
      category: "",
      categoriesList: []

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
    this.onSelectProvince(dataGen.provinceName)
    this.setState({
      title: dataGen?.title,
      description: dataGen?.description,
      address: dataGen?.address,
      longitude: dataGen?.location?.coordinates[0],
      latitude: dataGen?.location?.coordinates[1],
      city: dataGen?.cityId,
      province: dataGen?.provinceId,
      startDate: dataGen?.startDate,
      endDate: dataGen?.endDate,
      startTime: dataGen?.startTime,
      endTime: dataGen?.endTime,
      numberOfPasses: dataGen?.numberOfPasses,
      price: dataGen?.price,
      slug: dataGen?.slug,
      status: dataGen?.status,
      surroundings: dataGen?.surroundings?.length ? dataGen?.surroundings.map(item => {
        return {
          label: item.name,
          value: item._id,
        }
      }) : [],
      category: dataGen?.category,
      isEdit: this.props.formType === "Copy" ? false : true,
      freeEvent: dataGen?.price === 0 ? true : false,
      contact: dataGen?.contact,

    });
  };

  fetchTags = async () => {
    let provinceList = [];
    let cityList = [];
    let surroundingList = [];
    let categoriesList = [];

    // Get Province
    await axios
      .get(`${locationTag}?pageSize=0&skip=0&locationType=province`)
      .then((resp1) => {
        axios
          .get(`${locationTag}?pageSize=0&skip=0&locationType=city`)
          .then((resp2) => {
            axios
              .get(`${surroundings}?pageSize=0`)
              .then(resp3 => {
                axios
                  .get(categoryTag + "?pageSize=0&categoryType=event").then(resp4 => {

                    resp2.data.data.forEach(element => {
                      cityList.push({
                        name: element.name,
                        value: element._id
                      })
                    });
                    resp1.data.data.forEach(element => {
                      provinceList.push({
                        name: element.name,
                        value: element._id
                      })
                    });
                    resp3.data.data.forEach(element => {
                      surroundingList.push({
                        label: element.name,
                        value: element._id
                      })
                    });

                    resp4.data.data.forEach(element => {
                      categoriesList.push({
                        name: element.alias,
                        value: element._id
                      })
                    });
                    this.setState({
                      provinceList,
                      // cityList,
                      surroundingList,
                      categoriesList
                    })
                  })
              })
          })
      })
      .catch((error) => {
        swal(error.message, {
          icon: "error",
          showCloseButton: true,
        });
      })
  }


  handleChangeOpt = (e, province, isProvince) => {
    if (isProvince) {
      this.onSelectProvince(province)
      this.setState({
        [e.target.name]: e.target.value,
      });
    }
    else {
      this.setState({
        [e.target.name]: e.target.value,
      });
    }
  };
  updateDependentChanges = (data) => { };

  onSelectProvince = (value) => {

    let cityList = []
    return value ?
      axios
        .get(`${locationTag}?pageSize=0&skip=0&locationType=city&parentProvince=${value.replaceAll(" ", "-")}`)
        .then((res) => {
          res?.data?.data?.length ?
            res.data.data.forEach(element => {
              cityList.push({
                name: element.name,
                value: element._id
              })
              this.setState({
                cityList
              })
            }) :
            this.setState({
              cityList
            })
        })
        .catch((err) => {

        }) : ""
  }

  handleSubmit = () => {
    const {
      title,
      description,
      address,
      longitude,
      latitude,
      city,
      province,
      startDate,
      endDate,
      startTime,
      endTime,
      numberOfPasses,
      price,
      slug,
      status,
      imageUrl,
      freeEvent,
      surroundings,
      contact,
      category,
    } = this.state;
    const { vendorId, eventsUrl, auth, allvendorInfo } = this.props;
    let getSelectedVendor = allvendorInfo?.length ? allvendorInfo.filter(vendor => vendor._id === vendorId)[0] : []
    this.setState({
      isLoading: true
    })

    let payload = {
      title,
      description,
      address,
      coordinates: [+longitude,
      +latitude],
      city,
      province,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      startTime: new Date(startTime),
      endTime: new Date(endTime),
      numberOfPasses: +numberOfPasses,
      price: freeEvent ? 0 : +price,
      vendorId,
      slug,
      status,
      surroundings: surroundings.length ? surroundings.map(item => item.value) : [],
      contact,
      category
    };

    // if (vendorId) {
    //   if ((auth.type === 'vendor' && auth?.profile?.bankTitle !== ""
    //     && auth?.profile?.accountName !== ""
    //     && auth?.profile?.accountNumber !== "")
    //     || ((auth.type === 'admin' || auth.type === 'employee')
    //       // && getSelectedVendor?.bankDetails?.bankTitle
    //       //   && getSelectedVendor?.bankDetails?.accountName
    //       //   && getSelectedVendor?.bankDetails?.accountNumber
    //     )) {
    if (imageUrl) {
      axios
        .post(eventsUrl, payload)
        .then((response) => {
          // let data = {
          //   photo: imageUrl,
          //   isLoading: false
          // };
          axios
            .post(`${eventsUrl}/${response.data.data.id}/eventPhoto`, imageUrl)
            .then(() => {
              this.setState({
                isLoading: false
              })
              this.props.enableTabs(2, response.data.data.id);
              swal(response.data.data.message, {
                icon: "success",
              });
            })
            .catch((error) => {
              this.setState({
                isLoading: false
              })
              swal(error?.response?.data?.error?.message, {
                icon: "error",
              })
            })
        })
        .catch((error) => {
          this.setState({
            isLoading: false
          })
          swal(error?.response?.data.error?.message ? error?.response?.data.error?.message : "Something wrong", {
            icon: "error",
          });
        })
    }
    else {
      this.setState({
        isLoading: false
      })
      swal('Image is Required', {
        icon: "error",
      })
    }

    //   }
    //   else {
    //     this.setState({
    //       isLoading: false
    //     })
    //     swal(`Vendor Bank detail is required`, {
    //       icon: "error",
    //     })
    //   }
    // }
    // else {
    //   this.setState({
    //     isLoading: false
    //   })
    //   swal(`Vendor is required`, {
    //     icon: "error",
    //   })

    // }
  };

  // this function for update trip
  handleUpdate = () => {
    const {
      title,
      description,
      address,
      longitude,
      latitude,
      city,
      province,
      startDate,
      endDate,
      startTime,
      endTime,
      numberOfPasses,
      price,
      freeEvent,
      surroundings,
      contact,
      category
    } = this.state;
    const { vendorId, eventsUrl, eventId } = this.props;

    let payload = {
      title,
      description,
      address,
      coordinates: [+longitude,
      +latitude],
      city,
      province,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      startTime: new Date(startTime),
      endTime: new Date(endTime),
      numberOfPasses: +numberOfPasses,
      price: freeEvent ? 0 : +price,
      vendorId,
      surroundings: surroundings.length ? surroundings.map(item => item.value) : [],
      contact,
      category,
    };

    axios
      .put(`${eventsUrl}/${eventId}`, payload)
      .then((response) => {
        this.props.enableTabs(2, eventId);
        swal(response.data.data.message, {
          icon: "success",
        });
      })
      .catch((error) => {
        swal(error?.response?.data.error?.message ? error?.response?.data.error?.message : "Something wrong", {
          icon: "error",
        });
      });
  };

  render() {
    const {
      city,
      province,
      startDate,
      endDate,
      startTime,
      endTime,
      provinceList,
      cityList,
      surroundings,
      surroundingList,
      isLoading,
      categoriesList,
      category,

    } = this.state;
    const { classes, eventId } = this.props;

    return (
      <div>
        <form className={classes.form}>
          <Grid container spacing={2}>
            <Grid item xl={6} md={6} sm={12} xs={12}>
              <TextField
                className={classes.textField}
                name="title"
                label="Event Title"
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
                name="address"
                label="Address"
                type="text"
                margin="dense"
                value={this.state.address}
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
                value={this.state.freeEvent ? 0 : this.state.price}
                variant="outlined"
                onChange={this.handleChange}
                disabled={this.state.freeEvent}
                InputProps={{
                  endAdornment:
                    <InputAdornment position='end'>PKR</InputAdornment>
                }}
              />
            </Grid>
            <Grid item xl={6} md={6} sm={12} xs={12}>
              <FormControlLabel
                control={<Checkbox checked={this.state.freeEvent} onChange={(e) => this.setState({
                  [e.target.name]: e.target.checked
                })} name="freeEvent" />}
                label="Is Event free"
                value={this.state.freeEvent}
              />
            </Grid>
            <Grid item xl={6} md={6} sm={12} xs={12}>
              <TextField
                className={classes.textField}
                name="numberOfPasses"
                label="Number Of Passes"
                type="number"
                margin="dense"
                value={this.state.numberOfPasses}
                variant="outlined"
                onChange={this.handleChange}
              />
            </Grid>
            <Grid item xl={6} md={6} sm={12} xs={12}>
              <MultiSelect
                data={surroundingList}
                label="Surrounding"
                options={this.state.surroundings}
                getValues={(e) => this.setState({
                  surroundings: e
                })}
                name="endLocation"
                value={this.state.surroundings}
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
            <Grid item xl={6} md={6} sm={12} xs={12} className={classes.flexCol}>
              <Grid item xl={12} md={12} sm={12} xs={12}>
                <TextField
                  className={classes.textField}
                  name="longitude"
                  label="Longitude"
                  type="number"
                  margin="dense"
                  value={this.state.longitude}
                  variant="outlined"
                  onChange={this.handleChange}
                />
              </Grid>
              <Grid item xl={12} md={12} sm={12} xs={12}>
                <TextField
                  className={`${classes.textField} ${classes.m20}`}
                  name="latitude"
                  label="Latitude"
                  type="number"
                  margin="dense"
                  value={this.state.latitude}
                  variant="outlined"
                  onChange={this.handleChange}
                />
              </Grid>
            </Grid>
            <Grid item xl={6} md={6} sm={12} xs={12}>
              <SingleSelect
                options={provinceList}
                label="Province"
                handleChangeOpt={(e, province) => this.handleChangeOpt(e, province, true)}
                name="province"
                value={province}
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
            <Grid item xl={6} md={6} sm={12} xs={12} style={{ marginTop: '16px' }}>
              <SingleSelect
                options={categoriesList}
                label="Category"
                handleChangeOpt={this.handleChangeOpt}
                name="category"
                value={category}
              />
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
            <Grid item xl={6} md={6} sm={12} xs={12}>
              <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <KeyboardDatePicker
                  margin="normal"
                  id="date"
                  fullWidth
                  label="Start Date"
                  format="MM/dd/yyyy"
                  value={startDate}
                  onChange={(e) => this.handleChange(e, "startDate")}
                  KeyboardButtonProps={{
                    "aria-label": "change date",
                  }}
                  minDate={new Date()}
                />
              </MuiPickersUtilsProvider>
            </Grid>
            <Grid item xl={6} md={6} sm={12} xs={12}>
              <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <KeyboardTimePicker
                  margin="normal"
                  fullWidth
                  id="time-picker"
                  label="start Time"
                  value={startTime}
                  onChange={(e) => this.handleChange(e, "startTime")}
                  KeyboardButtonProps={{
                    'aria-label': 'change time',
                  }}
                />
              </MuiPickersUtilsProvider>
            </Grid>
            <Grid item xl={6} md={6} sm={12} xs={12}>
              <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <KeyboardDatePicker
                  margin="normal"
                  id="date"
                  fullWidth
                  label="End Date"
                  format="MM/dd/yyyy"
                  value={endDate}
                  onChange={(e) => this.handleChange(e, "endDate")}
                  KeyboardButtonProps={{
                    "aria-label": "change date",
                  }}
                  minDate={new Date()}
                />
              </MuiPickersUtilsProvider>
            </Grid>
            <Grid item xl={6} md={6} sm={12} xs={12}>
              <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <KeyboardTimePicker
                  margin="normal"
                  fullWidth
                  id="time-picker"
                  label="End Time"
                  value={endTime}
                  onChange={(e) => this.handleChange(e, "endTime")}
                  KeyboardButtonProps={{
                    'aria-label': 'change time',
                  }}
                />
              </MuiPickersUtilsProvider>
            </Grid>
            {
              !eventId ?
                <ImageUpload
                  getImageUrl={(e) => this.setState({ imageUrl: e[0] })}
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
              Save
            </Button>
          </div>
        </form>
      </div>
    );
  }
}

UploadEvent.propTypes = {
  className: PropTypes.string,
  classes: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps)(withStyles(styles)(UploadEvent));
