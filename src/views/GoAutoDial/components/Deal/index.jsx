import React, { Component } from "react";
import { connect } from "react-redux";
import qs from "qs";
import axios from "axios";
import swal from "@sweetalert/with-react";
import _ from "lodash";

import environment from '../../../../config/config';

// Externals
import PropTypes from "prop-types";

// Material helpers
import { withStyles } from "@material-ui/core";

// Material components
import {
    Grid,
    Button,
    TextField,
    MenuItem,
    Typography,
} from "@material-ui/core";

import { deal, users, typeOfProduct, domesticOrInternational } from "../../config/pipedrive";
import { addPdDeal } from "../../../../config/routes";

// Shared layouts
import { Dashboard as DashboardLayout } from "layouts";

// Component styles
import styles from "./style";
import log from "config/log";

class Deal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tripDestination: "",
            tripDate: "",
            tripDuration: "",
            noOfAdults: "",
            noOfChildren: "",
            tripType: "",
            tripStartLocation: "",
            typeOfProduct: "",
            domesticOrInternational: "",
            value: "",
            owner: "",
            person: {},
            processing: false
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
        let query = this.props.history.location.search;
        if (query && query.length > 0) {
            let queryString = qs.parse(query.split("?")[1]);
            this.setState({
                person: {
                    id: +queryString.personId,
                    name: queryString.personName
                }
            });
        }
    }

    // setting state for change in input 
    handleOnChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });
    }

    // post data to the backend
    handleOnSubmit = () => {
        let formData = {
            tripDestination: this.state.tripDestination,
            tripDate: this.state.tripDate,
            tripDuration: +this.state.tripDuration,
            noOfAdults: +this.state.noOfAdults,
            noOfChildren: +this.state.noOfChildren,
            tripType: this.state.tripType,
            tripStartLocation: this.state.tripStartLocation,
            typeOfProduct: +this.state.typeOfProduct,
            domesticOrInternational: +this.state.domesticOrInternational,
            value: +this.state.value,
            person: this.state.person,
            owner: this.state.owner
        }
        log("FormData Add Deal", "info", formData);
        this.setState({
            processing: true
        }, () => {
            axios
                .post(addPdDeal, formData)
                .then(response => {
                    log(`POST ${addPdDeal} ==> GoAutoDial/components/Deal/index`, "success", response.data.data);
                    if (response.data.data.success) {
                        swal("New deal has been successfully created...", {
                            icon: "success"
                        });
                    }
                    this.setState({
                        processing: false,
                    })
                })
                .catch(error => {
                    this.setState({
                        processing: false,
                    }, () => {
                        log(`Error POST ${addPdDeal} ==> GoAutoDial/components/Deal/index`,
                            "error",
                            error.response.data);
                        swal(error.response.data.error.message, {
                            icon: "error"
                        });
                    })
                });
        });
    }

    render() {
        const { classes } = this.props;
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
                                        Create a new deal
                                    </Typography>

                                    {/* Input Group - Text & Date */}
                                    <div className={classes.field}>
                                        <TextField
                                            className={classes.textField}
                                            name="tripDestination"
                                            label="Trip Destination"
                                            type="text"
                                            margin="dense"
                                            value={this.state.tripDestination}
                                            variant="outlined"
                                            onChange={this.handleOnChange}
                                        />
                                    </div>
                                    <div className={classes.field}>
                                        <TextField
                                            className={classes.textField}
                                            name="tripDate"
                                            label="Trip Date"
                                            type="date"
                                            margin="dense"
                                            value={this.state.tripDate}
                                            variant="outlined"
                                            onChange={this.handleOnChange}
                                            InputLabelProps={{
                                                shrink: true
                                            }}
                                        />
                                    </div>
                                    <div className={classes.field}>
                                        <TextField
                                            className={classes.textField}
                                            name="tripDuration"
                                            label="Trip Duration"
                                            type="number"
                                            margin="dense"
                                            value={this.state.tripDuration}
                                            variant="outlined"
                                            onChange={this.handleOnChange}
                                        />
                                    </div>
                                    <div className={classes.field}>
                                        <TextField
                                            className={classes.textField}
                                            name="noOfAdults"
                                            label="Number of Adults"
                                            type="number"
                                            margin="dense"
                                            value={this.state.noOfAdults}
                                            variant="outlined"
                                            onChange={this.handleOnChange}
                                        />
                                    </div>
                                    <div className={classes.field}>
                                        <TextField
                                            className={classes.textField}
                                            name="noOfChildren"
                                            label="Number of Children"
                                            type="number"
                                            margin="dense"
                                            value={this.state.noOfChildren}
                                            variant="outlined"
                                            onChange={this.handleOnChange}
                                        />
                                    </div>
                                    <div className={classes.field}>
                                        <TextField
                                            className={classes.textField}
                                            name="tripStartLocation"
                                            label="Trip Start Location"
                                            type="text"
                                            margin="dense"
                                            value={this.state.tripStartLocation}
                                            variant="outlined"
                                            onChange={this.handleOnChange}
                                        />
                                    </div>
                                    {/* Input Group - Text & Date */}

                                    <div className={classes.field}>
                                        <TextField
                                            className={classes.textField}
                                            name="value"
                                            label="Amount"
                                            type="number"
                                            margin="dense"
                                            value={this.state.value}
                                            variant="outlined"
                                            onChange={this.handleOnChange}
                                        />
                                    </div>

                                    <div className={classes.field}>
                                        <TextField
                                            style={{ textAlign: "left" }}
                                            className={classes.textField}
                                            name="tripType"
                                            label="Trip Type"
                                            select
                                            margin="dense"
                                            value={this.state.tripType}
                                            variant="outlined"
                                            onChange={this.handleOnChange}>
                                            {deal.tripType.map((type, uniq) => (
                                                <MenuItem key={uniq} value={type.key}>
                                                    {type.value}
                                                </MenuItem>
                                            ))}
                                        </TextField>
                                    </div>
                                    <div className={classes.field}>
                                        <TextField
                                            style={{ textAlign: "left" }}
                                            className={classes.textField}
                                            name="typeOfProduct"
                                            label="Type of Product"
                                            select
                                            margin="dense"
                                            value={this.state.typeOfProduct}
                                            variant="outlined"
                                            onChange={this.handleOnChange}>
                                            {typeOfProduct.map((type, uniq) => (
                                                <MenuItem key={uniq} value={type.id}>
                                                    {_.startCase(type.label)}
                                                </MenuItem>
                                            ))}
                                        </TextField>
                                    </div>
                                    <div className={classes.field}>
                                        <TextField
                                            style={{ textAlign: "left" }}
                                            className={classes.textField}
                                            name="domesticOrInternational"
                                            label="Domestic or International"
                                            select
                                            margin="dense"
                                            value={this.state.domesticOrInternational}
                                            variant="outlined"
                                            onChange={this.handleOnChange}>
                                            {domesticOrInternational.map((type, uniq) => (
                                                <MenuItem key={uniq} value={type.id}>
                                                    {_.startCase(type.label)}
                                                </MenuItem>
                                            ))}
                                        </TextField>
                                    </div>

                                    <div className={classes.field}>
                                        <TextField
                                            style={{ textAlign: "left" }}
                                            className={classes.textField}
                                            name="owner"
                                            label="Owner"
                                            select
                                            margin="dense"
                                            value={this.state.owner}
                                            variant="outlined"
                                            onChange={this.handleOnChange}
                                        >
                                            {users.map(user => (
                                                <MenuItem key={user._id} value={user._id}>
                                                    {user.name}
                                                </MenuItem>
                                            ))}
                                        </TextField>
                                    </div>

                                    <div className={classes.field}>
                                        <Button
                                            variant="contained"
                                            className={classes.promoBtn}
                                            onClick={this.handleOnSubmit}
                                        >
                                            {this.state.processing
                                                ? "Creating..." : "Create Deal"}
                                        </Button>

                                    </div>
                                </form>

                            </Grid>
                        </Grid>
                    </div>
                </div>
            </DashboardLayout >
        );
    }
}

Deal.propTypes = {
    auth: PropTypes.object.isRequired,
    className: PropTypes.string,
    classes: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    auth: state.auth
});

export default connect(mapStateToProps)(withStyles(styles)(Deal));