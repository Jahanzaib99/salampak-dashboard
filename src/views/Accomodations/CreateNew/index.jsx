import React, { Component } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import SwipeableViews from "react-swipeable-views";
import { withTheme } from "@material-ui/core/styles";
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

} from "@material-ui/core";

import { CheckCircle } from "@material-ui/icons";
import { connect } from "react-redux";

import { users, accommodations } from "../../../config/routes";
import log from "../../../config/log";

import { SingleSelect } from "./subComponents/singleSelect";

import styles from "./style";

// Default Layout
import { Dashboard as DashboardLayout } from "layouts";
import UploadAccommodation from "./UploadAccomodation";
// import accommodationsItinerary from "./accommodationsItinerary";
import ImageUpload from "./ImageUpload";
import Capitalize from "../../../helpers/Capitalize";
import { Link } from 'react-router-dom';
import environment from 'config/config';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import UploadRoom from "./../CreateNew/rooms/index"

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
      accommodationsStatus: "draft",
      accomodationId: "",
      dataGen: {},
      dataItn: [],
      dataImg: "",
      tab2: true,
      success1: false,
      success2: false,
      success3: false,
      formType: "Upload",
      dataRoom: [],
    };
    this.handleChange = this.handleChange.bind(this);
    this.enableTabs = this.enableTabs.bind(this);
  }

  componentDidMount() {
    let accomodationId = this.props?.match?.params?.id;
    this.getVendor();
    return accomodationId ? this.getAccomodationDataById(accomodationId) : "";
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
        vendor: auth.user
      });
    }
    else {
      vendorList = [{
        name: "PTDC",
        value: '604cde7be3c632a29ee40365',
      }]
      this.setState({
        vendorList,
        vendor: '604cde7be3c632a29ee40365'
      });
      // axios.get(`${users}?type="vendor" &pageSize=0`).then((resp) => {
      //   log(`GET ${users}`, "info", resp.data.data);
      //   resp.data.data.forEach((each) => {
      //     vendorList.push({
      //       name: Capitalize(each?.profile?.companyName ? each.profile.companyName : " "),
      //       value: each._id,
      //     });
      //   });
      //   this.setState({
      //     vendorList,
      //   });
      // });
    }
  };

  getAccomodationDataById = (accomodationId, isCopy) => {
    let dataImg = "";
    let dataGen = {};
    let dataRoom = [];
    let success2 = false;
    let success3 = false;
    let vendor = "";
    let isFeatured = false;
    this.setState({
      formType: isCopy ? "Copy" : "Edit"
    })
    axios.get(`${accommodations}/${accomodationId}`).then((resp) => {
      log(`GET ${accommodations}`, "info", resp.data.data);
      dataGen = resp.data.data;
      vendor = resp.data.data?.vendor;
      isFeatured = resp.data.data?.isFeatured
      if (resp.data.data?.photos?.length > 0) {
        dataImg = resp.data.data.photos;
        success2 = true;
      }
      if (resp.data.data?.rooms?.length > 0) {
        dataRoom = resp.data.data.rooms;
        success3 = true;
      }
      this.setState({
        dataGen,
        dataImg,
        success1: true,
        success2,
        accomodationId,
        vendor,
        isFeatured,
        dataRoom,
        success3
      });
    });
  };
  handleChange = (event, newValue) => {
    this.setState({ tabValue: newValue });
  };

  enableTabs = (tab, Id , payload,index) => {
    if (tab === 2) {
      this.setState({
        tab2: false,
        success1: true,
        accomodationId: Id,
      });
      this.getAccomodationDataById(Id)
    }
    if (tab === 3) {
      this.setState({
        tab3: false,
        success2: true,
      });
      this.getAccomodationDataById(Id)

    }
    if (tab === 4) {
      this.setState({
        success3: true,
      });
      this.getAccomodationDataById(Id)
    }
    this.setState({ formType: "Edit" })
  };

  retainData = (data) => {
    return this.setState(data);
  };
  handleChangeOpt = (e, name) => {
    this.setState({ [name]: name === "isFeatured" ? e : e.target.value });
  };
  render() {
    const {
      vendorList,
      vendor,
      accomodationId,
      isFeatured,
      success1,
      success2,
      success3,
      dataGen,
      dataImg,
      dataItn,
      formType,
      dataRoom
    } = this.state;
    const { classes, theme, auth } = this.props;

    return (
      <DashboardLayout title={`${formType} Accomodation`}>
        <div className={classes.root}>
          <Card className={classes.card}>
            <CardContent>
              <Link
                to={process.env.NODE_ENV === "development"
                  ? `/accomodations`
                  : `${environment.production.prefix}/accomodations`}
              >
                <div className={classes.back}><ChevronLeftIcon /><strong>Back</strong></div>
              </Link>
              {/* <Grid
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
                    handleChangeOpt={(e) => this.handleChangeOpt(e, "vendor")}
                    name="vendor"
                    value={vendor}
                    disabled={auth?.type === 'vendor'}
                  />
                </Grid>

              </Grid> */}
              <AppBar position="static" color="default" style={{ zIndex: 1 }}>
                <Tabs
                  value={this.state.tabValue}
                  onChange={this.handleChange}
                  indicatorColor="primary"
                  textColor="primary"
                  scrollButtons="auto"
                  variant="scrollable"
                  aria-label="full width tabs on progressive accommodations form"
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
                    disabled={!accomodationId || formType === "Copy"}
                  />
                  <Tab
                    className={classes.tabStyle}
                    label={
                      <>
                        <div className={classes.inline}>
                           ROOMS
                          {success3 ? (
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
                    {...a11yProps(2)}
                    disabled={!accomodationId || formType === "Copy"}
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
                  <UploadAccommodation
                    vendor={vendor ? vendor : null}
                    removeVendor={() => this.setState({ vendor: "" })}
                    enableTabs={this.enableTabs}
                    isFeatured={isFeatured}
                    dataGen={dataGen}
                    accomodationId={accomodationId}
                    formType={formType}
                  />
                </TabPanel>

                <TabPanel
                  value={this.state.tabValue}
                  index={1}
                  dir={theme.direction}
                >
                  <ImageUpload
                    accomodationId={accomodationId ? accomodationId : ""}
                    data={dataImg ? dataImg : null}
                    enableTabs={this.enableTabs}
                  />
                </TabPanel>
                <TabPanel
                  value={this.state.tabValue}
                  index={2}
                  dir={theme.direction}
                >
                  <UploadRoom
                    accomodationId={accomodationId ? accomodationId : ""}
                    data={dataRoom ? dataRoom : null}
                    enableTabs={this.enableTabs}
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
