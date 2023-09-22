// Cancellation Policy and Additional Details

import React, { Component } from "react";
import { connect } from "react-redux";
import axios from "axios";
import swal from "@sweetalert/with-react";

// Externals
import PropTypes from "prop-types";

// Material components
import {
    Button,
    withStyles
} from "@material-ui/core";

// Component styles
import styles from "./style";

import { events } from "../../../../config/routes";
import log from "../../../../config/log";

import NewDateComponent from "./NewDate";
import AvailibilityListing from "./Availibility";
import EditAvailibilityListing from "./EditDate";
import NewPackageDialog from "./Package/NewPackage";
import EditPackageDialog from "./Package/EditPackage";
import MMAPackagesTable from "./MMAPackages/index";

class APandP extends Component {
    constructor(props) {
        super(props);
        this.state = {
            eventId: "",
            availibility: [],
            newDateCount: [],
            packages: {},
            newPackageCount: [],
            dateIndex: 0,
            toEdit: null,
            openEdit: false,
            toEditPackage: {
                packageIndex: null,
                availibilityIndex: null
            },
            openEditPackage: false
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.addNewDate = this.addNewDate.bind(this);
        this.addNewPackage = this.addNewPackage.bind(this);
        this.addNewPackageToDate = this.addNewPackageToDate.bind(this);
        this.getPackageData = this.getPackageData.bind(this);
        this.getData = this.getData.bind(this);
        this.toEditAvailibility = this.toEditAvailibility.bind(this);
        this.editAvailibility = this.editAvailibility.bind(this);
        this.removeAvailibility = this.removeAvailibility.bind(this);
    }

    componentDidMount() {
        if (this.props.data && this.props.data.length > 0) {
            log("Availability Event ID", "info", this.props.event);
            log("Availability Dynamic Data", "info", this.props.data);
            this.setState({
                availibility: this.props.data,
                eventId: this.props.event
            });
        }
        log("Availability Event ID", "info", this.props.event);
        this.setState({
            eventId: this.props.event,
        });
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        if (nextProps.data && nextProps.data.length > 0) {
            log("UNSAFE -> Availability Event ID", "info", this.props.event);
            log("UNSAFE -> Availability Dynamic Data", "info", this.props.data);
            this.setState({
                eventId: nextProps.event,
                availibility: nextProps.data
            });
        }
        else {
            log("UNSAFE -> Availability Event ID", "info", this.props.event);
            this.setState({
                eventId: nextProps.event,
            });
        }
    }

    addNewDate = (e) => {
        e.preventDefault();
        log("Trigger", "info", "Add a new date");
        let newDate = this.state.newDateCount.concat(['']);
        this.setState({ newDateCount: newDate });
    }

    addNewPackage = (e) => {
        e.preventDefault();
        log("Trigger", "info", "Add a new package");
        let newPackage = this.state.packages.concat(['']);
        this.setState({ packages: newPackage });
    }

    addNewPackageToDate = (data, index) => {
        if (data) {
            log("Trigger", "info", "Add a new package to date");
            let newPackageArray = this.state.newPackageCount.concat(['']);
            this.setState({
                newPackageCount: newPackageArray,
                dateIndex: index
            }, () => {
                this.setState(this.state);
            });
        }
    }

    getPackageData = (data) => {
        let currentDate = this.state.availibility[this.state.dateIndex];
        currentDate.packages.push(data);
        log("Add a new package", "success", data);
        this.setState(this.state);
    }

    handleChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });
    }

    getData = (data) => {
        if (data) {
            let avail = [];
            this.state.availibility.map(item => avail.push(item));
            avail.push(data);
            log("Add a new data", "info", avail);
            this.setState({ availibility: avail });
        }
    }

    toEditAvailibility = i => {
        log("Trigger", "info", "Edit a date");
        this.setState({ toEdit: i, openEdit: true });
    }

    editAvailibility = (i, obj) => {
        let availibility = this.state.availibility;
        availibility[i] = obj;
        log("Ediited date", "info", obj);
        this.setState({
            availibility: availibility,
            openEdit: false
        });
    }

    toEditPackage = (i, dt) => {
        log("Trigger", "info", "Edit a package");
        this.setState({
            openEditPackage: true,
            toEditPackage: {
                packageIndex: i,
                availibilityIndex: dt
            }
        })
    }

    editPackage = (i, dt, obj) => {
        let currentDate = this.state.availibility[dt];
        currentDate.packages[i] = obj;
        log("Edited package", "info", obj);
        this.setState({
            openEditPackage: false
        });
    }

    removePackage = (i, di) => {
        log("Trigger", "warning", "Remove a package");
        swal({
            title: "Are you sure?",
            text: "Once deleted, you will not be able to recover this record!",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        }).then(willDelete => {
            if (willDelete) {
                let currentDate = this.state.availibility[di];
                currentDate.packages.pop(i);
                log("Removed package", "success", currentDate.packages[i]);
                this.setState(this.state);
            }
            else {
                swal("Package has not been deleted!", {
                    icon: "info"
                });
            }
        });
    }

    removeAvailibility = i => {
        log("Trigger", "warning", "Remove a availability");
        swal({
            title: "Are you sure?",
            text: "Once deleted, you will not be able to recover this record!",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        }).then(willDelete => {
            if (willDelete) {
                let item = [
                    ...this.state.availibility.slice(0, i),
                    ...this.state.availibility.slice(i + 1),
                ];
                log("Removed availability", "success", this.state.availibility[i]);
                this.setState({ availibility: item });
            }
            else {
                swal("Date has not been deleted!", {
                    icon: "info"
                });
            }
        });
    }

    handleSubmit = () => {
        let formData = {
            availability: this.state.availibility
        };
        axios
            .put(`${events}/${this.props.event}/availability`, formData)
            .then(response => {
                log(`PUT ${events}/${this.props.event}/availability`, "info", formData);
                this.props.enableTabs(5);
                this.props.retainData({
                    dataPkg: formData.availability
                });
                swal(response.data.data.message, {
                    icon: 'success'
                });
            })
            .catch(error => {
                log("Error", "error", error.response.data.error);
                swal(error.response.data.error.message, {
                    icon: 'error'
                });
            });
    }


    render() {
        const { classes, formType} = this.props;
        console.log('Rect i on', this.props);
        return (
            <div>

                {(formType === 'mma-trip')&&
                <div>
                    <MMAPackagesTable
                        eventId={this.props.event}
                    />
                </div>
                }
                 {(formType === 'fma-trip')&& <div>
                <form className={classes.form}>
                    {this.state.availibility && (
                        <AvailibilityListing
                            data={this.state.availibility}
                            getData={this.setIntoAvailibility}
                            removeListItem={this.removeAvailibility}
                            editListItem={this.toEditAvailibility}
                            addPackage={this.addNewPackageToDate}
                            editPackage={this.toEditPackage}
                            removePackage={this.removePackage}
                       
                        />
                    )}

                    {this.state.newPackageCount.map((item, index) => (
                        <NewPackageDialog
                            key={index}
                            handleOpen={true}
                            dateIndex={this.state.dateIndex}
                            data={this.state.availibility}
                            getData={this.getPackageData}
                            formType={this.props.formType}
                        />
                    ))}

                    {this.state.openEdit && (
                        <EditAvailibilityListing
                            handleOpen={true}
                            index={this.state.toEdit}
                            data={this.state.availibility}
                            getData={this.editAvailibility}
                        />
                    )}

                    {this.state.openEditPackage && (
                        <EditPackageDialog
                            handleOpen={true}
                            index={this.state.toEditPackage.packageIndex}
                            dateIndex={this.state.toEditPackage.availibilityIndex}
                            data={this.state.availibility}
                            getData={this.editPackage}
                        />
                    )}

                    <Button
                        variant="contained"
                        className={classes.buttonWoMargin}
                        onClick={this.addNewDate}>
                        Add Date
                    </Button>
                    {this.state.availibility.length > 0
                        ? (
                            <div style={{ textAlign: "right", marginTop: 20 }}>
                                <Button
                                    className={classes.saveButton}
                                    onClick={this.handleSubmit}
                                >Save</Button>
                            </div>
                        ) : null}

                </form>
                {this.state.newDateCount.map((item, index) => (
                    <NewDateComponent
                        key={index}
                        handleOpen={true}
                        getData={this.getData}
                    />
                ))}
            </div>}
            </div>
        );
    }
}

APandP.propTypes = {
    className: PropTypes.string,
    classes: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    auth: state.auth
});

export default connect(mapStateToProps)(withStyles(styles)(APandP));
