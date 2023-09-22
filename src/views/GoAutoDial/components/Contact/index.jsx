import React, { Component } from "react";
import { connect } from "react-redux";
import axios from "axios";
import swal from "@sweetalert/with-react";
import qs from "qs";

import environment from '../../../../config/config';

// Externals
import PropTypes from "prop-types";

// Material helpers
import { withStyles } from "@material-ui/core";

// Material components
import {
    Grid,
    Button,
    FormControl,
    FormControlLabel,
    FormLabel,
    MenuItem,
    Radio,
    RadioGroup,
    TextField,
    Typography,
} from "@material-ui/core";

import { users } from "../../config/pipedrive";
import { addPDContact } from "../../../../config/routes";

// Shared layouts
import { Dashboard as DashboardLayout } from "layouts";

// Component styles
import styles from "./style";
import log from "config/log";

class NewContact extends Component {
    constructor(props) {
        super(props);
        this.state = {
            fullName: "",
            email: "",
            mobile: "",
            gender: "male",
            dob: "",
            city: "",
            country: "",
            owner: "",
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
        this.getQueryString();
    }

    getQueryString = () => {
        let query = this.props.history.location.search;
        if (query && query.length > 0) {
            let queryString = qs.parse(query.split("?")[1]);
            this.setState({
                mobile: queryString.contact
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
            fullName: this.state.fullName,
            email: this.state.email,
            mobile: this.state.mobile,
            gender: this.state.gender,
            dob: this.state.dob,
            city: this.state.city,
            country: this.state.country,
            owner: this.state.owner
        };
        this.setState({
            processing: true
        }, () => {
            axios
                .post(addPDContact, formData)
                .then(response => {
                    log(addPDContact + " ===> GoAutoDial/components/Contact",
                        "success", response.data.data);
                    this.setState({
                        processing: false,
                    });
                    if (response.data.data.success) {
                        swal("Contact has been successfully created", {
                            icon: "success"
                        });
                        let data = {
                            id: response.data.data.person.id,
                            name: response.data.data.person.name
                        }
                        this.pushToNewDeal(data);
                    }
                })
                .catch(error => {
                    log("Error ==> Submitting new Contact", "error", error.response.data);
                    swal(error.response.data.error.message, {
                        icon: "error"
                    });
                })
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
                                        New Contact Creation
                                    </Typography>

                                    {/* Input Group - Text & Date */}
                                    <div className={classes.field}>
                                        <TextField
                                            className={classes.textField}
                                            name="fullName"
                                            label="Full Name"
                                            type="text"
                                            margin="dense"
                                            value={this.state.fullName}
                                            variant="outlined"
                                            onChange={this.handleOnChange}
                                        />
                                    </div>
                                    <div className={classes.field}>
                                        <TextField
                                            className={classes.textField}
                                            name="mobile"
                                            label="Mobile Number"
                                            type="text"
                                            margin="dense"
                                            value={this.state.mobile}
                                            variant="outlined"
                                            onChange={this.handleOnChange}
                                        />
                                    </div>
                                    <div className={classes.field}>
                                        <TextField
                                            className={classes.textField}
                                            name="email"
                                            label="Email Address"
                                            type="email"
                                            margin="dense"
                                            value={this.state.email}
                                            variant="outlined"
                                            onChange={this.handleOnChange}
                                        />
                                    </div>
                                    {/* Input Group - Text & Date */}

                                    {/* Radio Group - Including Text Input Groups */}
                                    <div className={classes.radioField}>
                                        <FormControl component="fieldset" className={classes.alignLeft}>
                                            <FormLabel
                                                component="legend"
                                                className={classes.formLabel}>
                                                Gender:
                                            </FormLabel>
                                            <RadioGroup
                                                aria-label="gender"
                                                name="gender"
                                                value={this.state.gender}
                                                onChange={this.handleOnChange}
                                                row
                                            >
                                                <FormControlLabel
                                                    value="male"
                                                    control={<Radio color="primary" />}
                                                    label="Male"
                                                    labelPlacement="bottom"
                                                />
                                                <FormControlLabel
                                                    value="female"
                                                    control={<Radio color="primary" />}
                                                    label="Female"
                                                    labelPlacement="bottom"
                                                />
                                                {/* <FormControlLabel
                                                    value="events"
                                                    control={<Radio color="primary" />}
                                                    label="Events"
                                                    labelPlacement="bottom"
                                                /> */}
                                            </RadioGroup>
                                        </FormControl>
                                    </div>
                                    {/* Radio Group - Including Text Input Groups */}

                                    <div className={classes.field}>
                                        <TextField
                                            className={classes.textField}
                                            name="dob"
                                            label="Date of Birth"
                                            type="date"
                                            margin="dense"
                                            value={this.state.dob}
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
                                            name="city"
                                            label="City"
                                            type="text"
                                            margin="dense"
                                            value={this.state.city}
                                            variant="outlined"
                                            onChange={this.handleOnChange}
                                        />
                                    </div>
                                    <div className={classes.field}>
                                        <TextField
                                            className={classes.textField}
                                            name="country"
                                            label="Country"
                                            type="text"
                                            margin="dense"
                                            value={this.state.country}
                                            variant="outlined"
                                            onChange={this.handleOnChange}
                                        />
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
                                            disabled={this.state.processing}
                                        >
                                            {this.state.processing
                                                ? "Generating..." : "Create Profile"}
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

NewContact.propTypes = {
    auth: PropTypes.object.isRequired,
    className: PropTypes.string,
    classes: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    auth: state.auth
});

export default connect(mapStateToProps)(withStyles(styles)(NewContact));