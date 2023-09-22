import React, { Component } from "react";
import axios from "axios";
// import moment from "moment";
import swal from "@sweetalert/with-react";

// Externals
import PropTypes from "prop-types";

// Material helpers
import { withStyles } from "@material-ui/core";

// Material components
import {
    Button,
    Grid,
} from "@material-ui/core";

// New Addon
import NewAddon from "./NewAddon";
import CardGrid from "./CardGrid";
import EditAddon from "./EditAddon";

// Component styles
import styles from "./style";

// Routes
import { events } from "../../../../config/routes";
import log from "../../../../config/log";

class AddOns extends Component {
    constructor(props) {
        super(props);
        this.state = {
            eventId: "",
            addons: [],
            addonsCount: [],
            openAddon: false,
            toEdit: null,
            openEdit: false,
            servicesCount: []
        };
        this.getValuesFromMS = this.getValuesFromMS.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.addOption = this.addOption.bind(this);
        this.addAddonsToState = this.addAddonsToState.bind(this);
        this.removeAddon = this.removeAddon.bind(this);
        this.toEditAddon = this.toEditAddon.bind(this);
        this.editAddon = this.editAddon.bind(this);
    }

    componentDidMount() {
        if (this.props.data && this.props.data.length > 0) {
            log("Add-ons Event ID", "info", this.props.event);
            log("Add-ons Dynamic Data", "info", this.props.data);
            this.setState({
                addons: this.props.data,
                eventId: this.props.event
            });
        }
        log("Add-ons Event ID", "info", this.props.event);
        this.setState({
            eventId: this.props.event,
        });
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        if (nextProps.data && nextProps.data.length > 0) {
            log("UNSAFE -> Add-ons Event ID", "info", this.props.event);
            log("UNSAFE -> Add-ons Dynamic Data", "info", this.props.data);
            this.setState({
                eventId: nextProps.event,
                addons: nextProps.data
            });
        }
        else if (nextProps.event) {
            log("UNSAFE -> Add-ons Event ID", "info", this.props.event);
            this.setState({
                eventId: nextProps.event
            })
        }
    }

    getValuesFromMS = (id, values) => {
        // Package Title Price
        if (id === "packageTitle") {
            this.setState({ priceBracket: values.value });
        }
    }

    handleChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });
    }

    addOption = () => {
        log("Trigger", "info", "Add a new add-on i hit");
        let addons = this.state.addonsCount.concat(['']);
        this.setState({ addonsCount: addons });
    }

    addAddonsToState = (addons) => {
        let newAddon = this.state.addons;
        newAddon.push(addons);
        log("New Add-on added", "info", newAddon);
        this.setState({ addons: newAddon });
    }

    toEditAddon = (i) => {
        log("Trigger", "info", "Edit an add-on");
        this.setState({
            toEdit: i,
            openEdit: true
        });
    }

    editAddon = (i, data) => {
        let updatedAddon = this.state.addons;
        updatedAddon[i] = data;
        log("Add-on edited", "info", updatedAddon[i]);
        this.setState({
            addons: updatedAddon,
            openEdit: false
        });
    }

    removeAddon = (i) => {
        log("Trigger", "warning", "Remove an add-on");
        swal({
            title: "Are you sure?",
            text: "Once deleted, you will not be able to recover this record!",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        }).then(willDelete => {
            if (willDelete) {
                log("Removed add-on", "info", this.state.addons[i]);
                let updateAddons = [
                    ...this.state.addons.slice(0, i),
                    ...this.state.addons.slice(i + 1),
                ]
                this.setState({ addons: updateAddons });
            }
            else {
                swal("Add-on has not been deleted!", {
                    icon: "info"
                });
            }
        });
    }

    handleSubmit = () => {
        let formData = {
            addons: this.state.addons,
        };
        axios
            .put(`${events}/${this.state.eventId}/addons`, formData)
            .then(response => {
                log(`PUT ${events}/${this.state.eventId}/addons`, "info", formData);
                this.props.enableTabs(4);
                this.props.retainData({
                    dataAdd: formData.addons
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
        const { classes } = this.props;
        return (
            <div>
                <form className={classes.form} noValidate>
                    <Grid container spacing={2}>
                        {this.state.addonsCount.map((item, index) => (
                            <NewAddon
                                key={index}
                                handleOpen={true}
                                getData={this.addAddonsToState}
                            />
                        ))}
                        {this.state.openEdit && (
                            <EditAddon
                                data={this.state.addons}
                                index={this.state.toEdit}
                                handleOpen={true}
                                getData={this.editAddon}
                            />
                        )}
                        <Grid item xs={12} sm={12}>
                            <CardGrid
                                data={this.state.addons}
                                removeItem={this.removeAddon}
                                editItem={this.toEditAddon}
                            />
                        </Grid>
                        <Grid item xs={12} sm={12}>
                            <Button
                                style={{ marginTop: -40 }}
                                className={classes.button}
                                onClick={this.addOption}>
                                + Add Add-on
                            </Button>
                        </Grid>
                    </Grid>
                    {this.state.addons.length > 0 ? (
                        <div style={{ textAlign: "right", marginTop: 20 }}>
                            <Button
                                className={classes.saveButton}
                                onClick={this.handleSubmit}>
                                Save
                            </Button>
                        </div>
                    ) : null}
                </form>
            </div>
        );
    }
}

AddOns.propTypes = {
    className: PropTypes.string,
    classes: PropTypes.object.isRequired
};


export default withStyles(styles)(AddOns);