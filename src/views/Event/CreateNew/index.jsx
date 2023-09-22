import React, { Component } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import SwipeableViews from "react-swipeable-views";
import { withTheme } from "@material-ui/core/styles";
import { connect } from "react-redux";
import {
  AppBar,
  Box,
  Card,
  CardContent,
  Grid,
  Tab,
  Tabs,
  Typography,
  withStyles,
  FormControlLabel,
  Checkbox,
} from "@material-ui/core";

import { CheckCircle } from "@material-ui/icons";

import { users, events } from "../../../config/routes";
import log from "../../../config/log";

import { SingleSelect } from "./subComponents/singleSelect";

import styles from "./style";

// Default Layout
import { Dashboard as DashboardLayout } from "layouts";
import UploadEvent from "./UploadEvent";
import ImageUpload from "./ImageUpload";
import Capitalize from "../../../helpers/Capitalize";
import swal from 'sweetalert'
import { Link } from 'react-router-dom';
import environment from 'config/config';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <Typography
      component="div"
      role="tabpanel"
      hidden={value !== index}
      id={`scrollable-prevent-tabpanel-${index}`}
      aria-labelledby={`scrollable-prevent-tab-${index}`}
      {...other}
    >
      {value === index && <Box p={3}>{children}</Box>}
    </Typography>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `scrollable-auto-tab-${index}`,
    "aria-controls": `scrollable-auto-tabpanel-${index}`,
  };
}

class FullWidthTabs extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tabValue: 0,
      isFeatured: false,
      tripStatus: "draft",
      EventId: "",
      dataGen: {},
      dataImg: "",
      tab2: true,
      success1: false,
      success2: false,
      success3: false,
      formType: "Upload"
    };
    this.handleChange = this.handleChange.bind(this);
    this.enableTabs = this.enableTabs.bind(this);
  }

  componentDidMount() {
    let EventId = this.props?.match?.params?.id;
    let eventIdForCopy = this.props?.match?.params?.c_id;
    this.getVendor();
    return EventId ? this.getEventDataById(EventId) : eventIdForCopy ? this.getEventDataById(eventIdForCopy, "copy") : "";
  }

  getVendor = () => {
    const { auth } = this.props;

    // get Vendor List
    let vendorList = [];
    if (auth?.type === 'vendor') {
      vendorList = [{
        name: Capitalize(auth?.profile?.companyName ? auth?.profile?.companyName : " "),
        value: auth.user,
      }]
      this.setState({
        vendorList,
        vendorId: auth.user
      });
    }
    else {
      vendorList = [{
        name: "PTDC",
        value: '604cde7be3c632a29ee40365',
      }]
      this.setState({
        vendorList,
        vendorId: '604cde7be3c632a29ee40365'
      });
      // axios.get(`${users}?type="vendor"&pageSize=0`).then((resp) => {
      //   log(`GET ${users}`, "info", resp.data.data);
      //   resp.data.data.forEach((each) => {
      //     vendorList.push({
      //       name: Capitalize(each.profile.companyName ? each.profile.companyName : " "),
      //       value: each._id,
      //     });
      //   });
      //   this.setState({
      //     vendorList,
      //     allvendorInfo:resp.data.data
      //   });
      // });
    }
  };

  getEventDataById = (EventId, isCopy) => {
    let dataImg = "";
    let dataGen = {};
    let success2 = false;
    let vendorId = "";
    this.setState({
      formType: isCopy ? "Copy" : "Edit"
    })

    axios.get(`${events}/${EventId}`).then((resp) => {
      log(`GET ${events}`, "info", resp.data.data);
      dataGen = resp.data.data;
      vendorId = resp.data.data?.vendorId;
      if (resp.data.data?.photos?.length > 0) {
        dataImg = resp.data.data.photos;
        success2 = isCopy ? false : true;
      }
      this.setState({
        dataGen,
        dataImg: isCopy ? "" : dataImg,
        success1: true,
        success2,
        EventId: isCopy ? "" : EventId,
        vendorId,

      });
    }).catch((error) => {
      swal(error?.response?.data?.error?.message, {
        icon: "error"
      })
    })
  };
  handleChange = (event, newValue) => {
    this.setState({ tabValue: newValue });
  };

  enableTabs = (tab, Id) => {
    if (tab === 2) {
      this.setState({
        tab2: false,
        success1: true,
        EventId: Id,
      });
      this.getEventDataById(Id)
    }
    if (tab === 3) {
      this.setState({
        tab3: false,
        success2: true,
      });
      this.getEventDataById(Id)

    }
    if (tab === 4) {
      this.setState({
        success3: true,
      });
    }
    this.setState({ formType: "Edit" })
  };

  handleChangeOpt = (e, name) => {
    this.setState({ [name]: e.target.value });
  };
  render() {
    const {
      vendorList,
      vendorId,
      EventId,
      success1,
      success2,
      dataGen,
      dataImg,
      formType,
      allvendorInfo
    } = this.state;
    const { classes, theme, auth } = this.props;

    return (
      <DashboardLayout title={`${formType} Event`}>
        <div className={classes.root}>
          <Card className={classes.card}>
            <CardContent>
            <Link
                to={process.env.NODE_ENV === "development"
                  ? `/events`
                  : `${environment.production.prefix}/events`}
              >
                <div className={classes.back}><ChevronLeftIcon /><strong>Back</strong></div>
              </Link>
            {/* {auth?.type !== 'vendor' ?
              <Grid
                className={classes.grid}
                container
                direction="row"
                justify="flex-start"
                alignItems="center"
                spacing={1}
                xs={12}
                sm={12}
                xl={12}
                md={12}
              >
                <Grid item md={6} xs={12} sm={this.state.renderNewList ? 4 : 8}>
                  <SingleSelect
                    options={vendorList}
                    label="Select Vendor"
                    handleChangeOpt={(e) => this.handleChangeOpt(e, "vendorId")}
                    name="vendorId"
                    value={vendorId}
                    disabled={auth?.type === 'vendor'}
                  />
                </Grid>
              </Grid>:null} */}
              <AppBar position="static" color="default" style={{ zIndex: 1 }}>
                <Tabs
                  value={this.state.tabValue}
                  onChange={this.handleChange}
                  indicatorColor="primary"
                  textColor="primary"
                  scrollButtons="auto"
                  variant="scrollable"
                  aria-label="full width tabs on progressive trip form"
                >
                  <Tab
                    className={classes.tabStyle}
                    label={
                      <>
                        <div className={classes.inline}>
                          GENERATE
                          {success1 ? (
                            <CheckCircle
                              style={{
                                padding: 5,
                                color: "#0ca064",
                              }}
                            />
                          ) : null}
                        </div>
                      </>
                    }
                    {...a11yProps(0)}
                  />
                  <Tab
                    className={classes.tabStyle}
                    label={
                      <>
                        <div className={classes.inline}>
                          IMAGES
                          {success2 ? (
                            <CheckCircle
                              style={{
                                padding: 5,
                                color: "#0ca064",
                              }}
                            />
                          ) : null}
                        </div>
                      </>
                    }
                    {...a11yProps(1)}
                    disabled={!EventId || formType === "Copy"}
                  />

                </Tabs>
              </AppBar>
              <SwipeableViews
                className={classes.greyBg}
                axis={theme.direction === "rtl" ? "x-reverse" : "x"}
                index={this.state.tabValue}
                onChangeIndex={this.handleChange}
              >
                <TabPanel
                  value={this.state.tabValue}
                  index={0}
                  dir={theme.direction}
                >
                  <UploadEvent
                    vendorId={vendorId ? vendorId : null}
                    removeVendorId={() => this.setState({ vendorId: "" })}
                    enableTabs={this.enableTabs}
                    dataGen={dataGen}
                    eventId={EventId}
                    eventsUrl={events}
                    formType={formType}
                    allvendorInfo={allvendorInfo}
                  />
                </TabPanel>
                <TabPanel
                  value={this.state.tabValue}
                  index={1}
                  dir={theme.direction}
                >
                  <ImageUpload
                    EventId={EventId ? EventId : ""}
                    data={dataImg ? dataImg : null}
                    enableTabs={this.enableTabs}
                    eventsUrl={events}
                  />
                </TabPanel>

              </SwipeableViews>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    );
  }
}



FullWidthTabs.propTypes = {
  auth: PropTypes.object.isRequired,
  className: PropTypes.string,
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});


export default connect(mapStateToProps)(withTheme(withStyles(styles)(FullWidthTabs)));