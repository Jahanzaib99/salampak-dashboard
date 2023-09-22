import React, { Component } from 'react';
import PropTypes from 'prop-types';
import axios from "axios";
import SwipeableViews from 'react-swipeable-views';
import { withTheme } from '@material-ui/core/styles';
import swal from "@sweetalert/with-react";
import {
    AppBar,
    Box,
    Card,
    CardContent,
    Grid,
    MenuItem,
    Tab,
    Tabs,
    TextField,
    Typography,
    withStyles,
    Button,
} from "@material-ui/core";

import {
    CheckCircle
} from "@material-ui/icons";

import {
    booking_status
} from "../../../config/trip";
import {
    events,
    users,
    // events_v1 
} from '../../../config/routes';
import environment from "../../../config/config";
import log from "../../../config/log";

import Select from "./subComponents/select";

import styles from './style';

// Default Layout
import { Dashboard as DashboardLayout } from "layouts";
import UploadTrip from "./UploadTrip";
import TripItinerary from "./TripItinerary";
import AddOns from './AddOns';
import AvailibityPricesAndPackages from './AvailibilityPricesandPackages';
import CancellationPolicyAndAdditionalDetails from './CPandAD';
import ImageUpload from './ImageUpload';

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
        'aria-controls': `scrollable-auto-tabpanel-${index}`,
    };
}

class FullWidthTabs extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tabValue: 0,
            khoj: "",
            renderNewList: false,
            vendors: [],
            vendorsWoKhoj: [],
            tripVendor: "",
            vendorS: "",
            tripVendor1: "",
            vendorS1: "",
            tripStatus: "draft",
            tripId: "",
            dataGen: {},
            dataItn: [],
            dataAdd: [],
            dataPkg: [],
            dataDtl: {},
            dataImg: [],
            tab2: true,
            tab3: true,
            tab4: true,
            tab5: true,
            tab6: true,
            success1: false,
            success2: false,
            success3: false,
            success4: false,
            success5: false,
            success6: false,
            formType: 'fma-trip', // fma-trip or mma-public
            formMode: 'createTrip' // createTrip or editTrip
        }
        this.getVendors = this.getVendors.bind(this);
        this.getEventDetails = this.getEventDetails.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.getValuesFromMS = this.getValuesFromMS.bind(this);
        this.handleChangeStatus = this.handleChangeStatus.bind(this);
        this.getEventId = this.getEventId.bind(this);
        this.enableTabs = this.enableTabs.bind(this);
    }

    handleAlignment = (event, newAlignment) => {
        console.log("debug", newAlignment);
        if(newAlignment != null){
            this.setState({ formType: newAlignment });
        }
    }

    componentDidMount() {
        let getURL = this.props.history.location.pathname.split('/');
        let trip = getURL.indexOf("trip");
        if (getURL[trip] === "trip") {
            let trip_id = getURL[trip + 1];
            this.setState({
                formMode: 'editTrip',
                tripId: trip_id
            }, () => {
                log("Dynamic URL of an Event ===> Trip/CreateNew/index.jsx",
                    "info",
                    this.props.history.location.pathname);
                this.getVendors().then(() => this.getEventDetails(trip_id));
            })
        }
        else {
            this.getVendors().then(() => true);
        }
    }

    getVendors = () => {
        return axios
            .get(users + '/vendors?pageSize=0')
            .then(response => {
                log(`GET ${users}/vendor?pageSize=0 ===> Trip/CreateNew/index.jsx`, "info", response.data.data);
                let list = [];
                let list1 = [];
                response.data.data.map(item => {
                    if (item.profile.companyName === "Khoj") {
                        this.setState({
                            khoj: item._id
                        });
                    }
                    else {
                        list1.push({
                            value: item._id,
                            label: item.profile.companyName + ' - ' + item.profile.fullName
                        });
                    }
                    list.push({
                        value: item._id,
                        label: item.profile.companyName + ' - ' + item.profile.fullName
                    });
                    return list;
                });
                this.setState({
                    vendors: list,
                    vendorsWoKhoj: list1
                }, () => {
                    log("Setting State", "success", this.state);
                });
            })
            .catch(error => {
                log("Error at getVendors", "error", error?.response?.data);
                swal(error?.response?.data.error.message, {
                    icon: "warning"
                });
            })
    };

    getEventDetails = (id) => {
        axios
            .get(`${events}/${id}`)
            .then(response => {
                log(`GET ${events}/${id} ==> Trip/CreateNew/index.jsx`,
                    "info",
                    response.data.data);
                let res = response.data.data;
                let thisVendor = {};
                this.state.vendors.forEach(item => {
                    if (item.value === res.vendor._id) {
                        thisVendor = {
                            label: item.label,
                            value: item.value
                        };
                    }
                });
                let vendorAssigned = {}, renderNewList = false;
                if (res.assignedVendor !== null) {
                    this.state.vendorsWoKhoj.forEach(item => {
                        if (item.value === res.assignedVendor) {
                            vendorAssigned = {
                                label: item.label,
                                value: item.value
                            };
                        }
                    });
                    renderNewList = true;
                }
                console.log('Siddiqui 303-1 ', res);

              //  servicesIncluded: res.services.included,
               // servicesExcluded: res.services.available,
 

                let data = {
                    vendorS: thisVendor,
                    tripStatus: res.status,
                    dataGen: {
                        title: res.title,
                        categories: res.categories,
                        description: res.description,
                        duration: res.duration,
                        primaryLocation: res.primaryLocation,
                        primaryCategory: res.primaryCategory,
                        primaryActivity: res.primaryActivity,
                        priceBracket: res.priceBracket,
                        locations: res.locations,
                        subLocations: res.subLocations,
                        activities: res.activities,
                        subActivities: res.subActivities,
                        startingLocation: res.startingLocation,
                        tags: res.tags,
                        servicesIncluded: res.services && res.services.included,
                        servicesExcluded: res.services && res.services.available,
                        priceRangeTo: res.priceRange && res.priceRange.to,
                        priceRangeFrom: res.priceRange && res.priceRange.from,
                        passengerLimit: res.passengerLimit,
                        isMMA: res.isMMA,
                        forForeigners: res.forForeigners,
                        isPerPersonPrice: res.isPerPersonPrice,
                        minPassengersAllowed: res.minPassengersAllowed,
                      //  allowedPassengerLimitLower :  res.allowedPassengerLimit.lower,
                      //  allowedPassengerLimitUpper : res.allowedPassengerLimit.upper,
    
                        status: res.status
                   
                    },
                    success1: true,
                    tab2: false,
                    tab3: false,
                    tab4: false,
                    tab5: false,
                    tab6: false,
                }
//                console.log('Siddiqui 303 2 ', res);

                // In edit mode 
                // first check from event details if the event is mma or fma
                // if it is mma then
                // set it to 'mma-trip'

                if( data.dataGen.isMMA === true){
                    this.setState({ formType: 'mma-trip' });
                    
                }


            
                if(res.allowedPassengerLimit) {
                     data.dataGen.allowedPassengerLimitLower =  res.allowedPassengerLimit.lower;
                     data.dataGen.allowedPassengerLimitUpper = res.allowedPassengerLimit.upper;

                }


                if (res.assignedVendor !== null) {
                    data.vendorS1 = vendorAssigned;
                    data.renderNewList = renderNewList;
                }
                if (res.ageLimit !== null) {
                    data.dataGen.minAgeLimit = +res.ageLimit.min;
                    data.dataGen.maxAgeLimit = +res.ageLimit.max;
                }

                if (res.priceRange){
                    data.priceRangeFrom = res.priceRange.from;
                    data.priceRangeTo = res.priceRange.to;
                    console.log('siddiqui small',data.priceRangeFrom);
                }

               
                if (res.bestTime && res.bestTime !== null) {
                    data.dataGen.bestTimeFrom = res.bestTime.from;
                    data.dataGen.bestTimeTo = res.bestTime.to;
                }
                if (res.isDomestic && res.isDomestic !== null) {
                    data.dataGen.isDomestic = res.isDomestic;
                }
                else {
                    data.dataGen.isDomestic = true;
                }
                if (res.photoIds.length > 0) {
                    data.dataImg = res.photoIds;
                    data.success6 = true;
                }
                if (res.itinerary && res.itinerary.length > 0) {
                    data.dataItn = res.itinerary;
                    data.success2 = true;
                }
                if (res.addons && res.addons.length > 0) {
                    data.dataAdd = res.addons;
                    data.success3 = true;
                }
                if (res.availability && res.availability.length > 0) {
                    data.dataPkg = res.availability;
                    data.success4 = true;
                }
                if (res.bookingDeadline) {
                    data.dataDtl = {
                        bookingDeadline: res.bookingDeadline,
                        childrenDiscount: res.childrenDiscount,
                        discount: res.discount,
                        equipments: res.equipments,
                        whatsIncluded: res.whatsIncluded
                    }
                    data.success5 = true;
                }
                this.setState(data, () => {
                    log("Setting State", "success", this.state);
                });
            })
            .catch(error => {
                log("Error at getEventDetails", "error", error);
                swal('error?.response?.data.error.message', {
                    icon: "warning"
                });
            })
    };

    handleChange = (event, newValue) => {
        this.setState({ tabValue: newValue });
    };

    getValuesFromMS = (id, values) => {
        // Trip Vendor Primary
        if (id === 71) {
            this.setState({ tripVendor: values.value, vendorS: values }, () => {
                if (this.state.tripVendor === this.state.khoj) {
                    this.setState({
                        renderNewList: true
                    });
                }
                else {
                    this.setState({
                        renderNewList: false
                    });
                }
            });
        }
        // Trip Vendor Secondary
        if (id === 72) {
            this.setState({ tripVendor1: values.value, vendorS1: values });
        }
    };

    handleChangeStatus = (e) => {
        let tripStatus = this.state.tripStatus;
        this.setState({
            tripStatus: e.target.value
        }, () => {
            if (this.state.tripStatus !== tripStatus) {
                swal({
                    title: "Are you sure?",
                    text: "You are about to change the status of this trip",
                    icon: "warning",
                    buttons: true,
                    dangerMode: true,
                })
                    .then((willChange) => {
                        if (willChange) {
                            let data = {
                                status: this.state.tripStatus
                            }
                            axios
                                .put(`${events}/${this.state.tripId}/status`, data)
                                .then(response => {
                                    if (response.data.data) {
                                        swal(
                                            "Changed",
                                            "The status has been updated",
                                            "success"
                                        )
                                    }
                                })
                                .catch(error => {
                                    swal(error?.response?.data.error.message, {
                                        icon: "error"
                                    });
                                });
                        }
                        else {
                            this.setState({
                                tripStatus: tripStatus
                            })
                        }
                    })
            }
        })
    };

    getEventId = (id) => {
        this.setState({ tripId: id }, () => {
            this.props.history.push(process.env.NODE_ENV === "development"
                ? `/trip/${id}` : `${environment.production.prefix}/trip/${id}`);
        });
    };

    enableTabs = (tab) => {
        if (tab === 2) {
            this.setState({
                tab2: false,
                success1: true,
            })
        }
        if (tab === 3) {
            this.setState({
                tab3: false,
                success2: true,
            })
        }
        if (tab === 4) {
            this.setState({
                tab4: false,
                success3: true
            })
        }
        if (tab === 5) {
            this.setState({
                tab5: false,
                success4: true,
            })
        }
        if (tab === 6) {
            this.setState({
                tab6: false,
                success5: true,
            })
        }
        if (tab === true) {
            this.setState({
                success6: true
            })
        }
    }

    retainData = (data) => {
        return this.setState(data);
    }

    render() {
        const { classes, theme } = this.props;
        return (
            <DashboardLayout title="Upload trip">
                <div className={classes.root}>
                    <Card className={classes.card}>
                        <CardContent>

                       
                            <Grid
                                className={classes.grid}
                                container
                                direction="row"
                                justify="flex-start"
                                alignItems="center"
                                spacing={1}>
                                <Grid item xs={12} sm={this.state.renderNewList ? 4 : 8}>
                                    <Select
                                        id={71}
                                        data={this.state.vendors}
                                        options={this.state.vendorS}
                                        getValues={this.getValuesFromMS}
                                        isMulti={false}
                                    />
                                </Grid>
                                {this.state.renderNewList
                                    ? (
                                        <Grid item xs={12} sm={4}>
                                            <Select
                                                id={72}
                                                data={this.state.vendorsWoKhoj}
                                                options={this.state.vendorS1}
                                                getValues={this.getValuesFromMS}
                                                isMulti={false}
                                            />
                                        </Grid>
                                    ) : null}
                                <Grid item xs={12} sm={4}>
                                    <TextField
                                        select
                                        className={classes.customTextField}
                                        style={{ marginTop: 20 }}
                                        name="tripStatus"
                                        label="Trip Status"
                                        margin="dense"
                                        variant="outlined"
                                        value={this.state.tripStatus}
                                        onChange={this.handleChangeStatus}
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                        disabled={this.state.success1 === false ? true : false}
                                    >
                                        {booking_status.map((item, index) => (
                                            <MenuItem
                                                key={index}
                                                value={item.value}>
                                                {item.label}
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                </Grid>
                            </Grid>
                            <AppBar position="static" color="default" style={{ zIndex: 1 }}>
                                <Tabs
                                    value={this.state.tabValue}
                                    onChange={this.handleChange}
                                    indicatorColor="primary"
                                    textColor="primary"
                                    scrollButtons="auto"
                                    variant="scrollable"
                                    aria-label="full width tabs on progressive trip form">
                                    <Tab
                                        className={classes.tabStyle}
                                        label={
                                            <>
                                                <div className={classes.inline}>GENERATE
                                                    {this.state.success1
                                                        ? (
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
                                                <div className={classes.inline}>ITINERARY
                                                    {this.state.success2
                                                        ? (
                                                            <CheckCircle
                                                                style={{
                                                                    padding: 5,
                                                                    color: "#0ca064"
                                                                }}
                                                            />
                                                        ) : null}
                                                </div>
                                            </>
                                        }
                                        {...a11yProps(1)}
                                        disabled={this.state.tab2}
                                    />
                                    <Tab
                                        className={classes.tabStyle}
                                        label={
                                            <>
                                                <div className={classes.inline}>ADD-ONS
                                                    {this.state.success3
                                                        ? (
                                                            <CheckCircle
                                                                style={{
                                                                    padding: 5,
                                                                    color: "#0ca064"
                                                                }}
                                                            />
                                                        ) : null}
                                                </div>
                                            </>
                                        }
                                        {...a11yProps(2)}
                                        disabled={this.state.tab3}
                                    />
                                    <Tab
                                        className={classes.tabStyle}
                                        label={
                                            <>
                                                <div className={classes.inline}>PACKAGES
                                                    {this.state.success4
                                                        ? (
                                                            <CheckCircle
                                                                style={{
                                                                    padding: 5,
                                                                    color: "#0ca064"
                                                                }}
                                                            />
                                                        ) : null}
                                                </div>
                                            </>
                                        }
                                        {...a11yProps(3)}
                                        disabled={this.state.tab4}
                                    />
                                    <Tab
                                        className={classes.tabStyle}
                                        label={
                                            <>
                                                <div className={classes.inline}>DETAILS
                                                    {this.state.success5
                                                        ? (
                                                            <CheckCircle
                                                                style={{
                                                                    padding: 5,
                                                                    color: "#0ca064"
                                                                }}
                                                            />
                                                        ) : null}
                                                </div>
                                            </>
                                        }
                                        {...a11yProps(4)}
                                        disabled={this.state.tab5}
                                    />
                                    <Tab
                                        className={classes.tabStyle}
                                        label={
                                            <>
                                                <div className={classes.inline}>IMAGES
                                                    {this.state.success6
                                                        ? (
                                                            <CheckCircle
                                                                style={{
                                                                    padding: 5,
                                                                    color: "#0ca064"
                                                                }}
                                                            />
                                                        ) : null}
                                                </div>
                                            </>
                                        }
                                        {...a11yProps(5)}
                                        disabled={this.state.tab6}
                                    />
                                </Tabs>
                            </AppBar>
                            <SwipeableViews
                                className={classes.greyBg}
                                axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
                                index={this.state.tabValue}
                                onChangeIndex={this.handleChange}>
                                <TabPanel value={this.state.tabValue} index={0} dir={theme.direction}>
                                    <UploadTrip
                                        vendor={this.state.tripVendor ? this.state.tripVendor : null}
                                        vendorAssigned={this.state.tripVendor1 ? this.state.tripVendor1 : null}
                                        status={this.state.tripStatus ? this.state.tripStatus : null}
                                        data={this.state.dataGen}
                                        getEventId={this.getEventId}
                                        enableTabs={this.enableTabs}
                                        retainData={this.retainData}
                                        event={this.state.tripId ? this.state.tripId : null}
                                        tripVendor={this.state.vendorS}
                                        handleAlignment={this.handleAlignment}
                                        formType={this.state.formType}
                                        formMode={this.state.formMode}
                                    />
                                </TabPanel>
                                <TabPanel value={this.state.tabValue} index={1} dir={theme.direction}>
                                    <TripItinerary
                                        event={this.state.tripId ? this.state.tripId : null}
                                        data={this.state.dataItn}
                                        enableTabs={this.enableTabs}
                                        retainData={this.retainData}
                                        formType={this.state.formType}
                                    />
                                </TabPanel>
                                <TabPanel value={this.state.tabValue} index={2} dir={theme.direction}>
                                    <AddOns
                                        event={this.state.tripId ? this.state.tripId : null}
                                        data={this.state.dataAdd}
                                        enableTabs={this.enableTabs}
                                        retainData={this.retainData}
                                        formType={this.state.formType}
                                    />
                                </TabPanel>
                                <TabPanel value={this.state.tabValue} index={3} dir={theme.direction}>
                                    <AvailibityPricesAndPackages
                                        event={this.state.tripId ? this.state.tripId : null}
                                        data={this.state.dataPkg}
                                        enableTabs={this.enableTabs}
                                        retainData={this.retainData}
                                        formType={this.state.formType}
                                    />
                                </TabPanel>
                                <TabPanel value={this.state.tabValue} index={4} dir={theme.direction}>
                                    <CancellationPolicyAndAdditionalDetails
                                        event={this.state.tripId ? this.state.tripId : null}
                                        data={this.state.dataDtl}
                                        enableTabs={this.enableTabs}
                                        retainData={this.retainData}
                                        formType={this.state.formType}
                                    />
                                </TabPanel>
                                <TabPanel value={this.state.tabValue} index={5} dir={theme.direction}>
                                    <ImageUpload
                                        event={this.state.tripId ? this.state.tripId : null}
                                        data={this.state.dataImg.length > 0 ? this.state.dataImg : null}
                                        enableTabs={this.enableTabs}
                                        retainData={this.retainData}
                                        formType={this.state.formType}
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
    className: PropTypes.string,
    classes: PropTypes.object.isRequired,
    theme: PropTypes.object.isRequired,
};

export default withTheme(withStyles(styles)(FullWidthTabs));