import React, { Component } from "react";
import { connect } from "react-redux";
import axios from "axios";
import swal from "@sweetalert/with-react";
import qs from "qs";

import environment from '../../../../config/config';
import { addPDActivity, getPdProfile, updatePDActivity } from "../../../../config/routes";
import ProfileCard from "./Contact/Card";

import PropTypes from "prop-types";
import {
    Grid,
    Button,
    TextField,
    Typography,
    withStyles
} from "@material-ui/core";
import { Dashboard as DashboardLayout } from "layouts";
import styles from "./style";
import log from "config/log";

class Profile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            processing: false,
            contact: "",
            person: [],
        };
        this.handleOnChange = this.handleOnChange.bind(this);
        this.handleOnSubmit = this.handleOnSubmit.bind(this);
    }

    componentDidMount() {
        // Checking the userToken
        if (!localStorage.getItem("userToken")) {
            // redirection to login page
            this.props.history.push(
                process.env.NODE_ENV === "development"
                    ? "/"
                    : environment.production.prefix
            );
        }
        this.getQueryString();
    }

    getQueryString = () => {
        let query = this.props.history.location.search;
        if (query && query.length > 0) {
            let queryString = qs.parse(query.split("?")[1]);
            this.setState({
                contact: queryString.contact
            }, () => this.handleOnSubmit());
        }
    }

    // setting state for change in input 
    handleOnChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });
    }

    // get data from the backend
    handleOnSubmit = () => {
        let { contact } = this.state;
        this.setState({
            processing: true,
        }, () => {
            axios
                .get(`${getPdProfile}?phone=${contact}`)
                .then(response => {
                    log(`${getPdProfile}?phone=${contact} ==> GoAutoDial/components/Search`,
                        "success",
                        response.data.data);
                    if (response.data.data.success) {
                        this.setState({
                            person: response.data.data.person,
                            processing: false,
                        });
                    }
                    else {
                        this.pushToNewContact(false);
                    }
                })
                .catch(error => {
                    this.setState({
                        processing: false,
                        person: [],
                    }, () => {
                        swal(error?.response?.data.error.message, {
                            icon: "error"
                        });
                    });
                });
        })
    }

    pushToNewDeal = (data) => {
        const route = `/go-auto-dial/deal?personId=${data.id}&personName=${data.name}`;
        this.props.history.push(
            process.env.NODE_ENV === "development"
                ? route
                : environment.production.prefix + route
        );
    }

    pushToNewContact = (flag) => {
        let route;
        if (flag === false) {
            route = `/go-auto-dial/contact?contact=${this.state.contact}`;
        }
        else {
            route = "/go-auto-dial/contact";
        }
        this.props.history.push(
            process.env.NODE_ENV === "development"
                ? route
                : environment.production.prefix + route
        );
    }

    pushToEditContact = (contact) => {
        const route = `/go-auto-dial/editContact?contact=${contact}`;
        this.props.history.push(
            process.env.NODE_ENV === "development"
                ? route
                : environment.production.prefix + route
        );
    }

    pushToPipeDriveAndMarkDone = (id, link) => {
        let data = {
            id: id
        };
        axios
            .put(updatePDActivity, data)
            .then(response => {
                log(`PUT ${updatePDActivity} ==> Mark Done: GoAutoDial/components/Search`, "success", response.data.data);
                if (response.data.data) {
                    this.handleOnSubmit();
                    window.open(link, "_blank");
                }
            })
            .catch(error => {
                log(`Error at update activity if planned ==> GoAutoDial/components/Search`, "success", error?.response?.data);
                swal(error?.response?.data.error.message, {
                    icon: "error"
                });
            });
    }

    pushToPipeDriveAndAddActivity = (data, link) => {
        log("add activity data", "info", data);
        axios
            .post(addPDActivity, data)
            .then(response => {
                log(`POST ${addPDActivity} ==> Default Activity: GoAutoDial/components/Search`, "success", response.data.data);
                if (response.data.data) {
                    this.handleOnSubmit();
                    window.open(link, "_blank");
                }
            })
            .catch(error => {
                log(`Error at new activity ==> GoAutoDial/components/Search`, "success", error?.response?.data);
                swal(error?.response?.data.error.message, {
                    icon: "error"
                });
            });
    }

    pushToPipeDriveAndAddPlannedActivity = (data) => {
        axios
            .post(addPDActivity, data)
            .then(response => {
                log(`POST ${addPDActivity} ==> Planned Activity: GoAutoDial/components/Search`, "success", response.data.data);
                if (response.data.data) {
                    this.handleOnSubmit();
                }
            })
            .catch(error => {
                log(`Error at new planned activity ==> GoAutoDial/components/Search`, "success", error?.response?.data);
                swal(error?.response?.data.error.message, {
                    icon: "error"
                });
            });
    }

    render() {
        const { classes } = this.props;
        const { person } = this.state;
        return (
            <DashboardLayout title="Go Auto Dial Conversion">
                <div className={classes.root}>
                    <div className={classes.content}>
                        <Grid
                            container
                            justify="center"
                            alignItems="center"
                        >
                            <Grid
                                item
                                xs={8}
                                sm={12}
                                className={classes.textCenter}>
                                <form className={classes.form}>
                                    <Typography
                                        className={classes.promoTitle}
                                        variant="h5"
                                        component="h2">
                                        Search Contacts
                                    </Typography>
                                    {/* Input Group - Text */}
                                    <div className={classes.withHelperTextField}>
                                        <TextField
                                            className={classes.textField}
                                            name="contact"
                                            label="Phone Number"
                                            type="text"
                                            margin="dense"
                                            value={this.state.contact}
                                            helperText="Search through PipeDrive contacts"
                                            variant="outlined"
                                            onChange={this.handleOnChange}
                                        />
                                    </div>
                                    {/* Input Group - Text */}
                                    <div className={classes.button}>
                                        <Button
                                            variant="contained"
                                            className={classes.promoBtn}
                                            onClick={this.handleOnSubmit}
                                            disabled={this.state.processing}
                                        >
                                            {this.state.processing
                                                ? "Searching..." : "Search"}
                                        </Button>
                                    </div>
                                </form>

                                {person && person.length > 0 && person.map((each, index) => (
                                    <ProfileCard
                                        data={each}
                                        key={index}
                                        getPersonDetails={this.pushToNewDeal}
                                        newContact={this.pushToNewContact}
                                        editContact={this.pushToEditContact}
                                        markDone={this.pushToPipeDriveAndMarkDone}
                                        addActivity={this.pushToPipeDriveAndAddActivity}
                                        addPlannedActivity={this.pushToPipeDriveAndAddPlannedActivity}
                                    />
                                ))}

                            </Grid>
                        </Grid>
                    </div>
                </div>
            </DashboardLayout >
        );
    }
}

Profile.propTypes = {
    auth: PropTypes.object.isRequired,
    className: PropTypes.string,
    classes: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    auth: state.auth
});

export default connect(mapStateToProps)(withStyles(styles)(Profile));