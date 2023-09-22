import React, { Component } from "react";
import { connect } from "react-redux";
import axios from "axios";
import swal from "@sweetalert/with-react";
import _ from "lodash";

// Externals
import PropTypes from "prop-types";

// Material helpers
import { withStyles } from "@material-ui/core";

// Material components
import {
    Button,
    Checkbox,
    FormControlLabel,
    Switch,
    TextField,
} from "@material-ui/core";

// Custom Select Component
import Select from "../subComponents/select"

// Component styles
import styles from "./style";

import { events, tags, uploadTrip, serviceGet } from "../../../../config/routes";
import environment from "../../../../config/config";
import Capitalize from "../../../../helpers/Capitalize";
import log from "../../../../config/log";
import tagsMapper from "./tagsMapper";
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';

// Trip Data 
import {
    priceBracket,
    months
} from "../../../../config/trip";

class UploadTrip extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: {},
            dependentOnLoc: {
                subLocations: [],
            },
            dependentOnCatg: {
                activities: []
            },
            dependentOnActv: {
                subActivities: []
            },
            tripVendor: "",
            vendorAssigned: "",
            isDomestic: true,
            title: "",
            description: "",
            duration: "",
            priceBracket: "",
            categories: [],
            locations: [],
            subLocations: [],
            startingLocation: "",
            activities: [],
            subActivities: [],
            otherTags: [],
            otherS: [],
            otherServiceAva: [],
            passengerLimit: "",
            minAgeLimit: "",
            maxAgeLimit: "",
            priceRangeFrom: "",
            priceRangeTo: "",
            allowedPassengerLimitLower: "",
            allowedPassengerLimitUpper: "",
            minPassengersAllowed: "",
            primaryLocation: "",
            primaryCategory: "",
            primaryActivity: "",
            bestTimeFrom: "",
            bestTimeTo: "",
            // isMMA: false,
            forForeigners: false,
            isPerPersonPrice: false,
            eventId: "",
            status: "",
            isEdit: false,
            isLoading: true
        };
        this.handleChange = this.handleChange.bind(this);
        this.getValuesFromMS = this.getValuesFromMS.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.props.enableTabs(4);
        this.props.enableTabs(3);
        this.props.enableTabs(5);
    }

    componentDidMount() {
        if (!localStorage.getItem("userToken")) {
            this.props.history.push(process.env.NODE_ENV === "development"
                ? "/" : environment.production.prefix);
        }
        this.fetchTags().then(() => {
            let res = this.props.data;
            if (res && res.categories !== undefined) {
                let filters = tagsMapper(res, this.state.data);

                let categories = filters.categories;
                let priceBracket, primaryLocation, primaryCategory, primaryActivity;
                // Price Bracket
                if (!res.priceBracket) {
                    priceBracket = "";
                }
                else if (res.priceBracket.length > 0) {
                    priceBracket = {
                        label: _.startCase(res.priceBracket),
                        value: res.priceBracket
                    };
                }
                // Primary Location
                if (!res.primaryLocation) {
                    primaryLocation = "";
                }
                else if (res.primaryLocation.length > 0) {
                    primaryLocation = filters.primaryLocation;
                }
                // Primary Category
                if (!res.primaryCategory) {
                    primaryCategory = "";
                }
                else if (res.primaryCategory.length > 0) {
                    primaryCategory = filters.primaryCategory;
                }
                // Primary Activity
                if (!res.primaryActivity) {
                    primaryActivity = "";
                }
                else if (res.primaryLocation.length > 0) {
                    primaryActivity = filters.primaryActivity;
                }
                let activities = filters.activities,
                    locations = filters.locations,
                    subLocations = filters.subLocations,
                    subActivities = filters.subActivities,
                    tags = filters.tags,
                    servicesIncluded = filters.servicesIncluded,
                    servicesExcluded = filters.servicesExcluded,
                    startingLocation = filters.startingLocation,
                    bestTimeFrom, bestTimeTo;
                if (!res.bestTimeFrom) {
                    bestTimeFrom = "";
                }
                else if (res.bestTimeFrom.length > 0) {
                    bestTimeFrom = {
                        label: _.startCase(res.bestTimeFrom),
                        value: res.bestTimeFrom
                    };
                }
                if (!res.bestTimeTo) {
                    bestTimeTo = "";
                }
                else if (res.bestTimeTo.length > 0) {
                    bestTimeTo = {
                        label: _.startCase(res.bestTimeTo),
                        value: res.bestTimeTo
                    };
                }
                this.setState({
                    tripVendor: this.props.tripVendor.value,
                    title: res.title,
                    categories: categories,
                    description: res.description,
                    duration: +res.duration,
                    primaryLocation: primaryLocation,
                    primaryCategory: primaryCategory,
                    primaryActivity: primaryActivity,
                    priceBracket: priceBracket,
                    locations: locations,
                    subLocations: subLocations,
                    activities: activities,
                    startingLocation: startingLocation,
                    subActivities: subActivities,
                    otherTags: tags,
                    otherS: servicesIncluded,
                    otherServiceAva: servicesExcluded,
                    //servicesIncluded: servicesIncluded,
                    //servicesExcluded:servicesExcluded,
                    bestTimeFrom: bestTimeFrom,
                    bestTimeTo: bestTimeTo,
                    passengerLimit: res.passengerLimit,
                    minAgeLimit: +res.minAgeLimit,
                    priceRangeFrom: +res.priceRangeFrom,
                    allowedPassengerLimitLower: +res.allowedPassengerLimitLower,
                    allowedPassengerLimitUpper: +res.allowedPassengerLimitUpper,
                    minPassengersAllowed: +res.minPassengersAllowed,
                    maxAgeLimit: +res.maxAgeLimit,
                    priceRangeTo: +res.priceRangeTo,
                    isMMA: res.isMMA,
                    isDomestic: res.isDomestic,
                    forForeigners: res.forForeigners,
                    isPerPersonPrice: res.isPerPersonPrice,
                    status: res.status
                });
            }
        });
        if (this.props.event
            && this.props.event.length > 0) {
            log("Upload Trip Event ID", "info", this.props.event);
            this.setState({
                eventId: this.props.eventId,
                isEdit: true
            });
        }
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        let res = nextProps.data;
        this.fetchTags().then(() => {
            if (res.categories !== undefined) {
                let filters = tagsMapper(nextProps.data, this.state.data),
                    categories = filters.categories,
                    priceBracket, primaryLocation, primaryCategory, primaryActivity;
                // Price Bracket
                if (!res.priceBracket) {
                    priceBracket = "";
                }
                else if (res.priceBracket.length > 0) {
                    priceBracket = {
                        label: _.startCase(res.priceBracket),
                        value: res.priceBracket
                    };
                }
                // Primary Location
                if (!res.primaryLocation || res.primaryLocation === undefined) {
                    primaryLocation = "";
                }
                else if (res.primaryLocation.length > 0) {
                    primaryLocation = filters.primaryLocation;
                }
                // Primary Category
                if (!res.primaryCategory || res.primaryCategory === undefined) {
                    primaryCategory = "";
                }
                else if (res.primaryCategory.length > 0) {
                    primaryCategory = filters.primaryCategory;
                }
                // Primary Activity
                if (!res.primaryActivity || res.primaryActivity === undefined) {
                    primaryActivity = "";
                }
                else if (res.primaryActivity.length > 0) {
                    primaryActivity = filters.primaryActivity;
                }
                let activities = filters.activities,
                    locations = filters.locations,
                    subLocations = filters.subLocations,
                    subActivities = filters.subActivities,
                    tags = filters.tags,
                    servicesIncluded = filters.servicesIncluded,
                    servicesExcluded = filters.servicesExcluded,
                    startingLocation = filters.startingLocation,
                    bestTimeFrom, bestTimeTo;
                if (!res.bestTimeFrom) {
                    bestTimeFrom = "";
                }
                else if (res.bestTimeFrom.length > 0) {
                    bestTimeFrom = {
                        label: _.startCase(res.bestTimeFrom),
                        value: res.bestTimeFrom
                    };
                }
                if (!res.bestTimeTo) {
                    bestTimeTo = "";
                }
                else if (res.bestTimeTo.length > 0) {
                    bestTimeTo = {
                        label: _.startCase(res.bestTimeTo),
                        value: res.bestTimeTo
                    };
                }
                this.setState({
                    tripVendor: nextProps.tripVendor.value,
                    vendorAssigned: nextProps.vendorAssigned,
                    title: res.title,
                    categories: categories,
                    description: res.description,
                    duration: +res.duration,
                    primaryLocation: primaryLocation,
                    primaryCategory: primaryCategory,
                    primaryActivity: primaryActivity,
                    priceBracket: priceBracket,
                    locations: locations,
                    subLocations: subLocations,
                    activities: activities,
                    subActivities: subActivities,
                    startingLocation: startingLocation,
                    otherTags: tags,
                    otherS: servicesIncluded,
                    otherServiceAva: servicesExcluded,
                    //servicesIncluded: servicesIncluded,
                    //servicesExcluded: servicesExcluded,
                    bestTimeFrom: bestTimeFrom,
                    bestTimeTo: bestTimeTo,
                    passengerLimit: res.passengerLimit,
                    minAgeLimit: +res.minAgeLimit,
                    maxAgeLimit: +res.maxAgeLimit,
                    priceRangeFrom: +res.priceRangeFrom,
                    allowedPassengerLimitLower: +res.allowedPassengerLimitLower,
                    allowedPassengerLimitUpper: +res.allowedPassengerLimitUpper,
                    minPassengersAllowed: +res.minPassengersAllowed,
                    priceRangeTo: +res.priceRangeTo,
                    isMMA: res.isMMA,
                    isDomestic: res.isDomestic,
                    forForeigners: res.forForeigners,
                    isPerPersonPrice: res.isPerPersonPrice,
                    status: res.status
                }, () => this.updateDependentChanges(nextProps.data));
            }
        });
        if (nextProps.event
            && nextProps.event.length > 0) {
            log("UNSAFE -> Upload Trip Event ID", "info", nextProps.event);
            this.setState({
                eventId: nextProps.event,
                isEdit: true
            });
        }
        else {
            this.setState({
                tripVendor: nextProps.vendor,
                vendorAssigned: nextProps.vendorAssigned
            })
        }
    }

    handleChange = (e) => {
        if (e.target.type === "checkbox") {
            let isDomesticCheck = this.state.isDomestic;
            this.setState({ [e.target.name]: e.target.checked }, () => {
                if (this.state.isDomestic !== isDomesticCheck) {
                    this.setState({
                        startingLocation: "",
                        primaryLocation: "",
                        primaryCategory: "",
                        primaryActivity: "",
                        locations: [],
                        subLocations: [],
                        categories: [],
                        activities: [],
                        subActivities: [],
                        dependentOnLoc: {
                            subLocations: []
                        },
                        dependentOnCatg: {
                            activities: []
                        },
                        dependentOnActv: {
                            subActivities: []
                        },
                        otherTags: [],
                        otherS:[],
                        otherServiceAva:[]
                    }, () => this.fetchTags());
                }
            });
        }
        else {
            this.setState({ [e.target.name]: e.target.value });
        }
    }

    getValuesFromMS = (id, values) => {
        // Price Bracket
        if (id === 1) {
            log("Trigger", "info", "Price Bracket");
            this.setState({ priceBracket: values });
        }
        // Categories
        else if (id === 2) {
            log("Trigger", "info", "Categories");
            if (values === null) {
                this.setState({
                    categories: [],
                    activities: [],
                    subActivities: [],
                    dependentOnCatg: {
                        activities: []
                    }
                });
            } else {
                let activities = this.state.data.activities;
                let renderDependent = [];
                values.forEach(catg => {
                    activities.forEach(act => {
                        if (catg.value === act.parent) {
                            renderDependent.push(act);
                        }
                    });
                });
                this.setState({
                    categories: values,
                    dependentOnCatg: {
                        activities: renderDependent,
                    }
                });
            }
        }
        // Locations
        else if (id === 3) {
            log("Trigger", "info", "Locations");
            if (values === null) {
                this.setState({
                    locations: [],
                    subLocations: [],
                    dependentOnLoc: {
                        subLocations: [],
                    }
                });
            } else {
                let subLocations = this.state.data.subLocations;
                let renderDependent = [];
                values.forEach(loc => {
                    subLocations.forEach(subLoc => {
                        if (loc.value === subLoc.parent) {
                            renderDependent.push(subLoc);
                        }
                    });
                });
                this.setState({
                    locations: values,
                    dependentOnLoc: {
                        subLocations: renderDependent
                    }
                });
            }
        }
        // Sub Locations
        else if (id === 4) {
            log("Trigger", "info", "Sub Locations");
            if (values === null) {
                this.setState({ subLocations: [] });
            } else {
                this.setState({ subLocations: values });
            }
        }
        // Activity
        else if (id === 5) {
            log("Trigger", "info", "Activities");
            if (values === null) {
                this.setState({
                    activities: [],
                    subActivities: [],
                    dependentOnActv: {
                        subActivities: [],
                    }
                });
            } else {
                let subActivities = this.state.data.subActivities;
                let renderDependent = [];
                values.forEach(act => {
                    subActivities.forEach(subAct => {
                        if (act.value === subAct.parent) {
                            renderDependent.push(subAct);
                        }
                    });
                });
                this.setState({
                    activities: values,
                    dependentOnActv: {
                        subActivities: renderDependent,
                    }
                });
            }
        }
        // Sub Activity
        else if (id === 6) {
            log("Trigger", "info", "Sub Activities");
            if (values === null) {
                this.setState({ subActivities: [] });
            } else {
                this.setState({ subActivities: values });
            }
        }
        // Starting Location
        else if (id === 7) {
            log("Trigger", "info", "Staring Locations");
            this.setState({ startingLocation: values });
        }
        // Other Tags
        else if (id === 8) {
            log("Trigger", "info", "Other Tags");
            this.setState({ otherTags: values });
        }
        else if (id === 88) {
            log("Trigger", "info", "servicesIncluded");
            this.setState({ otherS: values });
        }
        else if (id === 89) {
            log("Trigger", "info", "servicesExcluded");
            this.setState({ otherServiceAva: values });
        }
        // Primary Location
        else if (id === 9) {
            log("Trigger", "info", "Primary Location");
            this.setState({ primaryLocation: values });
        }
        // Primary Category
        else if (id === 10) {
            log("Trigger", "info", "Primary Category");
            this.setState({ primaryCategory: values });
        }
        // Primary Activity
        else if (id === 11) {
            log("Trigger", "info", "Primary Activity");
            this.setState({ primaryActivity: values });
        }
        // Best Time From
        else if (id === 12) {
            log("Trigger", "info", "Best Time From");
            this.setState({ bestTimeFrom: values });
        }
        // Best Time To
        else if (id === 13) {
            log("Trigger", "info", "Best Time To");
            this.setState({ bestTimeTo: values });
        }
    }

    fetchTags = async () => {
        let url = tags;
        if (this.state.isDomestic === false) {
            url += "?isDomestic=false";
        }
        else {
            url += "?isDomestic=true";
        }

        let services;
       await axios.get(serviceGet).then(resService => {
         //   console.log('huda', resService);
            services = resService.data;
        });

   //     console.log('huda services', services);

        return axios
            .get(url)
            .then(response => {
                let resp = response.data.data;
                log(`GET ${url}`, "info", resp);
                let filters = {
                    locations: [],
                    subLocations: [],
                    categories: [],
                    activities: [],
                    subActivities: [],
                    startingLocations: [],
                    tags: [],
                  //  servicesIncluded: []
                    servicesIncluded: [],
                    servicesExcluded: []
                };
                resp.locations.forEach(each => {
                    filters.locations.push({
                        label: Capitalize(each.name),
                        value: each._id,
                        alias: each.alias
                    });
                });
                resp.subLocations.forEach(each => {
                    filters.subLocations.push({
                        label: Capitalize(each.name),
                        value: each._id,
                        parent: each.parent.id,
                        alias: each.alias
                    });
                });
                resp.categories.forEach(each => {
                    filters.categories.push({
                        label: Capitalize(each.name),
                        value: each._id,
                        alias: each.alias
                    });
                });
                resp.activities.forEach(each => {
                    filters.activities.push({
                        label: Capitalize(each.name),
                        value: each._id,
                        parent: each.parent.id,
                        alias: each.alias
                    });
                });
                resp.subActivities.forEach(each => {
                    filters.subActivities.push({
                        label: Capitalize(each.name),
                        value: each._id,
                        parent: each.parent.id,
                        alias: each.alias
                    });
                });
                resp.startingLocations.forEach(each => {
                    filters.startingLocations.push({
                        label: Capitalize(each.name),
                        value: each._id,
                        alias: each.alias
                    });
                });
                resp.tags.forEach(each => {
                    filters.tags.push({
                        label: Capitalize(each.name),
                        value: each._id,
                        alias: each.alias
                    });
                });

                services.data.forEach(each => {
                    filters.servicesIncluded.push({
                        label: Capitalize(each.name),
                        value: each._id,
                        alias: each.name
                    });
                });

                services.data.forEach(each => {
                    filters.servicesExcluded.push({
                        label: Capitalize(each.name),
                        value: each._id,
                        alias: each.name
                    });
                });
                
                //console.log('hudeOne', services)
                //services.data.forEach( each => console.log(each))
                
            
              /*  resp.servicesIncluded.forEach(each => {
                    filters.servicesIncluded.push({
                        label: Capitalize(each.name),
                        value: each._id,
                        alias: each.alias
                    });
                });*/
                this.setState({
                    data: filters,
                    isLoading: false,
                }, () => {
                    log("Setting Tags State", "success", this.state.data);
                });
            })
            .catch(error => {
                log("Error at fetchTags", "error", error?.response?.data);
                swal(error?.response?.data.error.message, {
                    icon: "error"
                });
            });
    }

    updateDependentChanges = (data) => {
        // DE refers to dependent element
        // Related
        let filters = tagsMapper(data, this.state.data),
            locations = filters.locations,
            subLocationsAll = this.state.data.subLocations,

            // Related
            categories = filters.categories,
            activities = filters.activities,
            activitiesAll = this.state.data.activities,
            subActivitiesAll = this.state.data.subActivities,
            dependentOnLoc = {
                subLocations: [],
            },
            dependentOnCatg = {
                activities: []
            },
            dependentOnActv = {
                subActivities: []
            };

        // Manipulations
        locations.forEach(loc => {
            subLocationsAll.forEach(subLoc => {
                if (loc.value === subLoc.parent) {
                    dependentOnLoc.subLocations.push(subLoc);
                }
            })
        });

        categories.forEach(catg => {
            activitiesAll.forEach(act => {
                if (catg.value === act.parent) {
                    dependentOnCatg.activities.push(act);
                }
            })
        });

        activities.forEach(act => {
            subActivitiesAll.forEach(subAct => {
                if (act.value === subAct.parent) {
                    dependentOnActv.subActivities.push(subAct);
                }
            })
        });

        this.setState({
            dependentOnLoc: dependentOnLoc,
            dependentOnCatg: dependentOnCatg,
            dependentOnActv: dependentOnActv
        }, () => {
            log("Dependent on Locations", "info", this.state.dependentOnLoc);
            log("Dependent on Categories", "info", this.state.dependentOnCatg);
            log("Dependent on Activities", "info", this.state.dependentOnActv);
        });
    }

    handleSubmit = () => {
        let categoryArray = [];
        let iteree1 = this.state.categories.length;
        for (let i = 0; i < iteree1; i++) {
            categoryArray[i] = this.state.categories[i].value;
        }
        let locationsArray = [];
        let iteree2 = this.state.locations.length;
        for (let i = 0; i < iteree2; i++) {
            locationsArray[i] = this.state.locations[i].value;
        }
        let subLocationsArray = [];
        let iteree3 = this.state.subLocations.length;
        for (let i = 0; i < iteree3; i++) {
            subLocationsArray[i] = this.state.subLocations[i].value;
        }
        let activitiesArray = [];
        let iteree4 = this.state.activities.length;
        for (let i = 0; i < iteree4; i++) {
            activitiesArray[i] = this.state.activities[i].value;
        }
        let subActivitiesArray = [];
        let iteree5 = this.state.subActivities.length;
        for (let i = 0; i < iteree5; i++) {
            subActivitiesArray[i] = this.state.subActivities[i].value;
        }
        let tags = [];
        let iteree6 = this.state.otherTags.length;
        for (let i = 0; i < iteree6; i++) {
            tags[i] = this.state.otherTags[i].value;
        }
        let servicesIncluded = [];
        let iteree7 = this.state.otherS.length; // && this.state.servicesIncluded.length;
        for (let i = 0; i < iteree7; i++) {
            servicesIncluded[i] = this.state.otherS[i].alias;
        }
        let servicesExcluded = [];
        let iteree8 = this.state.otherServiceAva.length;
        for (let i = 0; i < iteree8; i++) {
            servicesExcluded[i] = this.state.otherServiceAva[i].alias;  // saving alias instead of value(key)
        }
     
        let temp, isMMA;
        if(this.props.formType === 'fma-trip'){
            temp='fma';
            isMMA = false;
        }else if(this.props.formType === 'mma-trip'){
            temp='mma-public';
            isMMA = true;
        }

        let formData = {
            isDomestic: this.state.isDomestic,
            title: this.state.title,
            description: this.state.description,
            duration: +this.state.duration,
            priceBracket: this.state.priceBracket.value,
            categories: categoryArray,
            locations: locationsArray,
            subLocations: subLocationsArray,
            startingLocation: this.state.startingLocation.value,
            activities: activitiesArray,
            subActivities: subActivitiesArray,
            tags: tags,
         
            passengerLimit: +this.state.passengerLimit,
            minAgeLimit: +this.state.minAgeLimit,
            maxAgeLimit: +this.state.maxAgeLimit,
            isMMA: this.state.isMMA,
            forForeigners: this.state.forForeigners,
            isPerPersonPrice: this.state.isPerPersonPrice,
            assignedVendor: this.state.vendorAssigned,
            primaryLocation: this.state.primaryLocation.value,
            primaryCategory: this.state.primaryCategory.value,
            primaryActivity: this.state.primaryActivity.value,
            bestTimeFrom: this.state.bestTimeFrom.value,
            bestTimeTo: this.state.bestTimeTo.value,
         /*   allowedPassengerLimitLower: this.state.allowedPassengerLimitLower,
            allowedPassengerLimitUpper: this.state.allowedPassengerLimitUpper,
            priceRangeFrom: +this.state.priceRangeFrom,
            priceRangeTo: +this.state.priceRangeTo,*/
           // servicesIncluded: servicesIncluded,
           // servicesExcluded: servicesExcluded,
          /*  services: {
                included: ["abc", "ghq"],
                available: ["124", "xyz"]
            }*/
          /*  allowedPassengerLimit: {
                lower: this.state.allowedPassengerLimitLower,
                upper: this.state.allowedPassengerLimitUpper
            },
            priceRange: {
                from: +this.state.priceRangeFrom,
                to: +this.state.priceRangeTo,
            },*/
            eventType: temp, //'fma'//this.props.formType
            isMMA: isMMA,
            minPassengersAllowed: +this.state.minPassengersAllowed
        };

        if(this.props.formType === 'mma-trip') {
            formData.priceRange = {
                from: +this.state.priceRangeFrom,
                to: +this.state.priceRangeTo,
            };
            formData.allowedPassengerLimit = {
                lower: +this.state.allowedPassengerLimitLower,
                upper: +this.state.allowedPassengerLimitUpper
            };
            formData.services = {
                included: servicesIncluded,
                available: servicesExcluded
            };


        }

        console.log("----------- formData---", formData);
        axios
            .post(`${uploadTrip}/${this.state.tripVendor}/events`, formData)
            .then(response => {
                log(`POST ${uploadTrip}/${this.state.tripVendor}/events`, "info", formData);
                this.props.getEventId(response.data.data.id);
                this.props.enableTabs(2);
                this.props.retainData({
                    dataGen: formData
                });
                 

                
                swal({
                    title: "success",
                    text: response.data.data.message,
                    icon: "success",
                   // buttons: true
                  //  dangerMode: true,
                  })
                  .then((willDelete) => {
                    if (willDelete) {
                        window.location.reload();
                    } else {}
                  });
            })
            .catch(error => {
                log("Error", "error", error?.response?.data);
                swal(error?.response?.data.error.message, {
                    icon: 'error'
                });
            });
    }

    handleUpdate = () => {
        let categoryArray = [];
        let iteree1 = this.state.categories.length;
        for (let i = 0; i < iteree1; i++) {
            categoryArray[i] = this.state.categories[i].value;
        }
        let locationsArray = [];
        let iteree2 = this.state.locations.length;
        for (let i = 0; i < iteree2; i++) {
            locationsArray[i] = this.state.locations[i].value;
        }
        let subLocationsArray = [];
        let iteree3 = this.state.subLocations.length;
        for (let i = 0; i < iteree3; i++) {
            subLocationsArray[i] = this.state.subLocations[i].value;
        }
        let activitiesArray = [];
        let iteree4 = this.state.activities.length;
        for (let i = 0; i < iteree4; i++) {
            activitiesArray[i] = this.state.activities[i].value;
        }
        let subActivitiesArray = [];
        let iteree5 = this.state.subActivities.length;
        for (let i = 0; i < iteree5; i++) {
            subActivitiesArray[i] = this.state.subActivities[i].value;
        }
        let tags = [];
        let iteree6 = this.state.otherTags.length;
        for (let i = 0; i < iteree6; i++) {
            tags[i] = this.state.otherTags[i].value;
        }
        let servicesIncluded = [];
        let iteree7 = this.state.otherS.length;;
        for (let i = 0; i < iteree7; i++) {
            servicesIncluded[i] = this.state.otherS[i].alias;
        }
        let servicesExcluded = [];
        let iteree8 = this.state.otherServiceAva.length;
        for (let i = 0; i < iteree8; i++) {
            servicesExcluded[i] = this.state.otherServiceAva[i].alias;
        }

        let temp;
        if(this.props.formType === 'fma-trip'){
            temp='fma';
        }else if(this.props.formType === 'mma-trip'){
            temp='mma-public';
        }
        let formData = {
            vendorId: this.state.tripVendor,
            isDomestic: this.state.isDomestic,
            title: this.state.title,
            description: this.state.description,
            duration: +this.state.duration,
            priceBracket: this.state.priceBracket.value,
            categories: categoryArray,
            locations: locationsArray,
            subLocations: subLocationsArray,
            startingLocation: this.state.startingLocation.value,
            activities: activitiesArray,
            subActivities: subActivitiesArray,
            tags: tags,
            passengerLimit: +this.state.passengerLimit,
            minAgeLimit: +this.state.minAgeLimit,
            maxAgeLimit: +this.state.maxAgeLimit,
            priceRangeFrom: +this.state.priceRangeFrom,
            priceRangeTo: +this.state.priceRangeTo,
            isMMA: this.state.isMMA,
            forForeigners: this.state.forForeigners,
            isPerPersonPrice: this.state.isPerPersonPrice,
            assignedVendor: this.state.vendorAssigned,
            primaryLocation: this.state.primaryLocation.value,
            primaryCategory: this.state.primaryCategory.value,
            primaryActivity: this.state.primaryActivity.value,
            bestTimeFrom: this.state.bestTimeFrom.value,
            bestTimeTo: this.state.bestTimeTo.value,
          
            /*
                allowedPassengerLimitLower: +this.allowedPassengerLimitLower,
                allowedPassengerLimitUpper: +this.allowedPassengerLimitUpper,
                allowedPassengerLimit: {
                lower: this.state.allowedPassengerLimitLower,
                upper: this.state.allowedPassengerLimitUpper
            },
            priceRange: {
                from: +this.state.priceRangeFrom,
                to: +this.state.priceRangeTo,
            },
            servicesIncluded: servicesIncluded,
            servicesExcluded: servicesExcluded,
            */
            eventType: temp,
            minPassengersAllowed: +this.state.minPassengersAllowed
        };

        if(this.props.formType === 'mma-trip') {
            formData.priceRange = {
                from: +this.state.priceRangeFrom,
                to: +this.state.priceRangeTo,
            };
            formData.allowedPassengerLimit = {
                lower: +this.state.allowedPassengerLimitLower,
                upper: +this.state.allowedPassengerLimitUpper
            };
            formData.services = {
                included: servicesIncluded, // take it form state
                available: servicesExcluded
            };


        } 
       
        let tempEventId = this.state.eventId;
        if (typeof(this.state.eventId) == "undefined") {
            this.setState({eventId: this.props.event});
            tempEventId = this.props.event;
        } 
        console.log('TempEventId', tempEventId);

        if(formData.assignedVendor === "") {
            formData.assignedVendor = null;
        }

        log("Info", "info", "Handle Update formData", formData );
        axios
            .put(`${events}/${tempEventId}`, formData)
            .then(response => {
                log(`PUT ${events}/${this.state.eventId}`, "info", formData);
                this.props.enableTabs(2);
                this.props.retainData({
                    dataGen: formData
                });
                
                swal(response.data.data.message, {
                    icon: 'success'
                });

                swal({
                    title: "success",
                    text: response.data.data.message,
                    icon: "success",
                   // buttons: true
                  //  dangerMode: true,
                  })
                  .then((willDelete) => {
                    if (willDelete) {
                        window.location.reload();
                    } else {}
                  });
              
            })
            .catch(error => {
                log("Error", "error", error?.response?.data);
                swal(error?.response?.data.error.message, {
                    icon: 'error'
                });
            });
           
    }

    render() {
        const { activities, categories, locations, startingLocations } = this.state.data;
        const { classes, formType, formMode } = this.props;
        /*
       


                       console.log('bakra this.state.data.servicesIncluded', this.state.data.servicesIncluded);
                       console.log('bakra this.state.otherS', this.state.otherS);
                       console.log('bakra this.getValuesFromMS',this.getValuesFromMS);
      

                    
                        //this.state.otherServiceAva

                       console.log('bakra2 this.state.data.servicesExcluded',this.state.data.servicesExcluded);
                       console.log('bakra2 this.state.otherServiceAva', this.state.otherServiceAva);
                       console.log('bakra2 this.getValuesFromMS',this.getValuesFromMS);
      
*/
        return (
            <div>
                <form className={classes.form}>

                <div>    
                  <ToggleButtonGroup 
                            value={formType}
                            exclusive
                            size='large'
                            disabled='true'
                            onChange={this.props.handleAlignment}
                            >
                                <ToggleButton   className={classes.toggleButtonGroup} value="fma-trip"   disabled={ (formMode === 'createTrip') ? false : true}>
                                    FMA Trips
                                </ToggleButton>
                                <ToggleButton className={classes.toggleButtonGroup} value="mma-trip" disabled={ (formMode === 'createTrip') ? false : true}>
                                    MMA-public
                                </ToggleButton>
                            </ToggleButtonGroup>
                                            
                          
                           </div>
            {//<div>{formType} ::: {formMode} </div>
            }
                    <FormControlLabel
                        label="Domestic"
                        control={
                            <Switch
                                checked={this.state.isDomestic}
                                onChange={this.handleChange}
                                name="isDomestic"
                                value="isDomestic"
                                color="primary"
                                inputProps={{ 'aria-label': 'primary checkbox' }}
                            />
                        }
                    />
                    <TextField
                        className={classes.textField}
                        name="title"
                        label="Event Title"
                        type="text"
                        margin="dense"
                        value={this.state.title}
                        variant="outlined"
                        onChange={this.handleChange}
                        disabled={this.state.isEdit && this.state.status === "published"}
                    />
                      {(formType !== 'fma-trip') && <div>

                    { //<h1>asda: {this.state}</h1>
                    }
                    <Select
                        id={88}
                        label="Services Included"
                        data={this.state.data.servicesIncluded}
                        options={this.state.otherS}
                        getValues={this.getValuesFromMS}
                    />

                    <Select
                        id={89}
                        label="Services Available"
                        data={this.state.data.servicesExcluded}
                        options={this.state.otherServiceAva}
                        getValues={this.getValuesFromMS}
                    />

                    </div>}
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

              
                    <TextField
                        className={classes.textField}
                        name="duration"
                        label="Duration"
                        type="number"
                        margin="dense"
                        value={this.state.duration}
                        variant="outlined"
                        onChange={this.handleChange}
                    />
                    <Select
                        id={9}
                        label="Primary Location"
                        data={locations}
                        options={this.state.primaryLocation}
                        getValues={this.getValuesFromMS}
                        isMulti={false}
                    />
                    <Select
                        id={10}
                        label="Primary Category"
                        data={categories}
                        options={this.state.primaryCategory}
                        getValues={this.getValuesFromMS}
                        isMulti={false}
                    />
                    <Select
                        id={11}
                        label="Primary Activity"
                        data={activities}
                        options={this.state.primaryActivity}
                        getValues={this.getValuesFromMS}
                        isMulti={false}
                    />
                    
                    {(formType === 'fma-trip') && 

                    <TextField
                        className={classes.textField}
                        name="minPassengersAllowed"
                        label="Minimum Allowed Passenger for FMA"
                        type="number"
                        margin="dense"
                        value={this.state.minPassengersAllowed}
                        variant="outlined"
                        onChange={this.handleChange}
                    />
                }


                     {(formType === 'fma-trip') && 
                    <Select
                        id={1}
                        label="Price Bracket"
                        data={priceBracket}
                        options={this.state.priceBracket}
                        getValues={this.getValuesFromMS}
                        isMulti={false}
                    />
                     } 
                    <Select
                        id={3}
                        label="Locations"
                        data={locations}
                        options={this.state.locations}
                        getValues={this.getValuesFromMS}
                    />
                    <Select
                        id={4}
                        label="Sub Locations"
                        data={this.state.dependentOnLoc.subLocations}
                        options={this.state.subLocations}
                        getValues={this.getValuesFromMS}
                    />
                    <Select
                        id={2}
                        label="Categories"
                        data={categories}
                        options={this.state.categories}
                        getValues={this.getValuesFromMS}
                    />
                    <Select
                        id={5}
                        label="Activities"
                        data={this.state.dependentOnCatg.activities}
                        options={this.state.activities}
                        getValues={this.getValuesFromMS}
                    />
                    <Select
                        id={6}
                        label="Sub Activities"
                        data={this.state.dependentOnActv.subActivities}
                        options={this.state.subActivities}
                        getValues={this.getValuesFromMS}
                    />
                    <Select
                        id={7}
                        label="Starting Location"
                        data={startingLocations}
                        options={this.state.startingLocation}
                        getValues={this.getValuesFromMS}
                        isMulti={false}
                    />
                    <Select
                        id={8}
                        label="Other Tags"
                        data={this.state.data.tags}
                        options={this.state.otherTags}
                        getValues={this.getValuesFromMS}
                    />
                    

                    <div>
                    <Select
                        id={12}
                        label="Best Time From"
                        data={months}
                        options={this.state.bestTimeFrom}
                        getValues={this.getValuesFromMS}
                        isMulti={false}
                    />
                    <Select
                        id={13}
                        label="Best Time To"
                        data={months}
                        options={this.state.bestTimeTo}
                        getValues={this.getValuesFromMS}
                        isMulti={false}
                    />
                    </div>
                    <TextField
                        className={classes.textField}
                        name="passengerLimit"
                        label="Passenger Limit"
                        type="number"
                        margin="dense"
                        value={this.state.passengerLimit}
                        variant="outlined"
                        onChange={this.handleChange}
                    />
                    <div>
                    <TextField
                        className={classes.textFieldNumberLeft}
                        name="minAgeLimit"
                        label="Minimun Age Limit"
                        type="number"
                        margin="dense"
                        value={this.state.minAgeLimit}
                        variant="outlined"
                        onChange={this.handleChange}
                    />
                    <TextField
                        className={classes.textFieldNumberRight}
                        name="maxAgeLimit"
                        label="Maximum Age Limit"
                        type="number"
                        margin="dense"
                        value={this.state.maxAgeLimit}
                        variant="outlined"
                        onChange={this.handleChange}
                    />
                    </div>
                    {(formType !== 'fma-trip') && <div>
                    <div>
                    <TextField
                        className={classes.textFieldNumberLeft}
                        name="priceRangeFrom"
                        label="Minimum Price Limit"
                        type="number"
                        margin="dense"
                        value={this.state.priceRangeFrom}
                        variant="outlined"
                        onChange={this.handleChange}
                    />
                        <TextField
                        className={classes.textFieldNumberRight}
                        name="priceRangeTo"
                        label="Maximum Price Limit"
                        type="number"
                        margin="dense"
                        value={this.state.priceRangeTo}
                        variant="outlined"
                        onChange={this.handleChange}
                    />
                    </div>
                    <div>

                    <TextField
                        className={classes.textFieldNumberLeft}
                        name="allowedPassengerLimitLower"
                        label="Minimum Allowed Passenger"
                        type="number"
                        margin="dense"
                        value={this.state.allowedPassengerLimitLower}
                        variant="outlined"
                        onChange={this.handleChange}
                    />
                    <TextField
                        className={classes.textFieldNumberRight}
                        name="allowedPassengerLimitUpper"
                        label="Maximum Allowed Passenger"
                        defaultValue="Maximum Allowed Passenger"
                        type="number"
                        margin="dense"
                        value={this.state.allowedPassengerLimitUpper}
                        variant="outlined"
                       
                        onChange={this.handleChange}
                    />
                    </div>

                    </div>}
                      
                    <FormControlLabel
                        label="Recommended for Foreigners"
                        className={classes.textField}
                        control={
                            <Checkbox
                                checked={this.state.forForeigners}
                                name="forForeigners"
                                onChange={this.handleChange}
                                value={this.state.forForeigners}
                                inputProps={{
                                    'aria-label': "seconday checkbox",
                                }}
                            />
                        }
                    />
                    <FormControlLabel
                        label="Per Person"
                        className={classes.textField}
                        control={
                            <Checkbox
                                checked={this.state.isPerPersonPrice}
                                name="isPerPersonPrice"
                                onChange={this.handleChange}
                                value={this.state.isPerPersonPrice}
                                inputProps={{
                                    'aria-label': "seconday checkbox",
                                }}
                            />
                        }
                    />
                    <div style={{ textAlign: "right", marginTop: 20 }}>
                        <Button
                            className={classes.saveButton}
                            onClick={this.state.isEdit ? this.handleUpdate : this.handleSubmit}>
                            Save
                        </Button>
                    </div>
                </form>
            </div>
        );
    }
}

UploadTrip.propTypes = {
    className: PropTypes.string,
    classes: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    auth: state.auth
});

export default connect(mapStateToProps)(withStyles(styles)(UploadTrip));
