import React, { Component } from "react";
import axios from "axios";
import swal from "@sweetalert/with-react";

// Externals
import PropTypes from "prop-types";

// Material helpers
import { withStyles } from "@material-ui/core";

import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
// Material components
import {
    Button,
} from "@material-ui/core";

import ItineraryComponent from "./Itinerary";
import EditItinerary from "./EditItinerary";
import TimeLine from "../subComponents/timeline";

// Component styles
import styles from "./style";

import { events } from "../../../../config/routes";
import log from "../../../../config/log";

class UploadTrip extends Component {
    constructor(props) {
        super(props);
        this.state = {
            eventId: "",
            itinerary: [],
            itineraryCount: [],
            toEdit: "",
            openEdit: false
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.addItinerary = this.addItinerary.bind(this);
        this.toEditItinerary = this.toEditItinerary.bind(this);
        this.editItinerary = this.editItinerary.bind(this)
        this.removeItinerary = this.removeItinerary.bind(this);
        this.insertIntoObject = this.insertIntoObject.bind(this);
    }

    componentDidMount() {
        if (this.props.event && this.props.event.length > 0) {
            log("Itinerary Event ID", "info", this.props.event);
            this.setState({
                eventId: this.props.event
            });
        }
        if (this.props.data && this.props.data.length > 0) {
            log("Itinerary Event ID", "info", this.props.event);
            log("Itinerary Dynamic Data", "info", this.props.data);
            this.setState({
                itinerary: this.props.data,
                eventId: this.props.event
            });
        }
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        if (nextProps.data && nextProps.data.length > 0) {
            log("UNSAFE -> Itinerary Event ID", "info", this.props.event);
            log("UNSAFE -> Itinerary Dynamic Data", "info", this.props.data);
            this.setState({
                eventId: nextProps.event,
                itinerary: nextProps.data
            });
        }
        else {
            log("UNSAFE -> Itinerary Event ID", "info", this.props.event);
            this.setState({
                eventId: nextProps.event,
            });
        }
    }

    handleChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });
    }
    
    handelToggleButton = (e) => {
      swal("It can only change from Generate Tab", {
        icon: "info"
    });
    }

    addItinerary = (e) => {
        e.preventDefault();
        log("Trigger", "info", "Add a new itinery");
        let itinerary = this.state.itineraryCount.concat(['']);
        this.setState({ itineraryCount: itinerary });
    }

    toEditItinerary = i => {
        log("Trigger", "info", "Edit an itinerary");
        this.setState({ toEdit: i, openEdit: true });
    }

    removeItinerary = i => {
        log("Trigger", "warning", "Remove an itinerary");
        swal({
            title: "Are you sure?",
            text: "Once deleted, you will not be able to recover this record!",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        }).then(willDelete => {
            if (willDelete) {
                let itinerary = [
                    ...this.state.itinerary.slice(0, i),
                    ...this.state.itinerary.slice(i + 1),
                ];
                log("Removed the itinerary", "success", this.state.itinerary[i]);
                this.setState({ itinerary: itinerary });
            }
            else {
                swal("Itinerary has not been deleted!", {
                    icon: "info"
                });
            }
        });
    }

    insertIntoObject = obj => {
        if (obj) {
            let itin = [];
            this.state.itinerary.map(item => itin.push(item));
            itin.push(obj);
            log("Add new itinerary", "success", itin);
            this.setState({ itinerary: itin });
        }
    }

    editItinerary = (i, obj) => {
        let itinerary = this.state.itinerary;
        itinerary[i] = obj;
        log("Edit the existing itinerary", "success", itinerary[i]);
        this.setState({ itinerary: itinerary, openEdit: false })
    }

    handleSubmit = () => {
        let formData = {
            itinerary: this.state.itinerary
        };
        axios
            .put(`${events}/${this.state.eventId}/itinerary`, formData)
            .then(response => {
                log(`PUT ${events}/${this.state.eventId}/itinerary}`, "info", formData);
                this.props.enableTabs(3);
                this.props.retainData({
                    dataItn: formData.itinerary
                });
                swal(response.data.data.message, {
                    icon: 'success'
                });
            })
            .catch(error => {
                log("Error", "error", error?.response?.data.error);
                swal(error?.response?.data.error.message, {
                    icon: 'error'
                });
            });
    }


    render() {
        const { classes, alignment } = this.props;
        return (
            <div>
                {this.state.itineraryCount.map((item, index) => (
                    <ItineraryComponent
                        key={index}
                        handleOpen={true}
                        getData={this.insertIntoObject}
                    />
                ))}
                {this.state.openEdit && (
                    <EditItinerary
                        handleOpen={true}
                        index={this.state.toEdit}
                        data={this.state.itinerary}
                        getData={this.editItinerary}
                    />
                )}
                <TimeLine
                    data={this.state.itinerary}
                    removeItinerary={this.removeItinerary}
                    editItinerary={this.toEditItinerary}
                />
                <Button
                    className={classes.button}
                    onClick={this.addItinerary}>
                    + Add Itinerary
                </Button>
                {this.state.itinerary.length > 0 && (
                    <div style={{ textAlign: "right", marginTop: 20 }}>
                        <Button
                            className={classes.saveButton}
                            onClick={this.handleSubmit}>
                            Save
                        </Button>
                    </div>
                )}
            </div>
        );
    }
}

UploadTrip.propTypes = {
    className: PropTypes.string,
    classes: PropTypes.object.isRequired
};


export default withStyles(styles)(UploadTrip);
