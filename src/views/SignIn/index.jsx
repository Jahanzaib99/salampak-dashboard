import React, { Component } from "react";
import { connect } from "react-redux";
import { loginUser } from "../../actions/authActions";
import { compose } from "recompose";
import log from "../../config/log";

// Externals
import PropTypes from "prop-types";

// Material helpers
import { withStyles } from "@material-ui/core";

// Material components
import {
    Grid,
    Button,
    CircularProgress,
    TextField,
    Typography
} from "@material-ui/core";

// Component styles
import styles from "./styles";

import fma_logo from "../../assets/images/logo.png";
import environment from './../../config/config';
import { Link } from 'react-router-dom';

class SignIn extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: "",
            password: "",
            isAuthenticating: false,
            errors: null
        };
        this.onChange = this.onChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

    componentDidMount() {
        if (this.props.auth.isAuthenticated) {
            process.env.NODE_ENV === "development"
                ? this.props.history.push("/dashboard")
                : this.props.history.push("/ptdc-panel/dashboard");
            log("Redirecting...", "success", "Authentication Successful");
        }
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        if (nextProps.auth.isAuthenticated) {
            process.env.NODE_ENV === "development"
                ? this.props.history.push("/dashboard")
                : this.props.history.push("/ptdc-panel/dashboard");
        }

        if (nextProps.errors) {
            log("Error", "error", nextProps.errors);
            this.setState({
                errors: nextProps.errors,
                isAuthenticating: false
            });
        }
    }

    onChange(e) {
        this.setState({ [e.target.name]: e.target.value });
    }

    onSubmit(e) {
        e.preventDefault();

        const userData = {
            email: this.state.email,
            password: this.state.password
        };
        log("Login Requested", "info", userData);
        this.setState({ isAuthenticating: true });
        this.props.loginUser(userData);
    }

    render() {
        const { classes } = this.props;
        const { errors } = this.state;
        return (
            <div className={classes.root}>
                <Grid className={classes.grid} container>
                    {/* Grid with email and password fields */}
                    <Grid className={classes.mainWrapper} item lg={12} xs={12}>
                        <div className={classes.content}>
                            <div className={classes.contentBody}>
                                <form className={classes.form} onSubmit={this.onSubmit}>
                                    <div style={{ textAlign: 'center' }}>
                                        <img
                                            alt="FindMyAdventure.pk"
                                            src={fma_logo}
                                            style={{ marginBottom: '10px' }}
                                        />
                                    </div>
                                    {/* <Typography
                                        className={classes.title}
                                        variant="h4">
                                        Dashboard
                                    </Typography> */}
                                    <div className={classes.fields}>
                                        <TextField
                                            className={classes.textField}
                                            label="Email address"
                                            name="email"
                                            onChange={this.onChange}
                                            type="text"
                                            value={this.state.email}
                                            variant="outlined"
                                        />
                                        <TextField
                                            className={classes.textField}
                                            label="Password"
                                            name="password"
                                            onChange={this.onChange}
                                            type="password"
                                            value={this.state.password}
                                            variant="outlined"
                                        />
                                        {/* Error Handling */}
                                        {errors &&
                                            errors.message && (
                                                <Typography
                                                    className={
                                                        classes.fieldError
                                                    }
                                                    variant="body2">
                                                    {errors.message}
                                                </Typography>
                                            )}
                                        {/* Error Handling */}
                                    </div>
                                    {this.state.isAuthenticating ? (
                                        <CircularProgress
                                            className={classes.progress}
                                        />
                                    ) : (
                                            <Button
                                                className={classes.signInButton}
                                                color="primary"
                                                onClick={this.onSubmit}
                                                size="large"
                                                type="submit"
                                                variant="contained">
                                                Sign in
                                            </Button>
                                        )}
                                    <div className={`${classes.fields} ${classes.accountTxt}`}>
                                        Don't have an account?
                                            <Link to={
                                            process.env.NODE_ENV === "development"
                                                ? `/sign-up`
                                                : `${environment.production.prefix}/sign-up`
                                        }>
                                            <span
                                                className={classes.policyUrl}
                                            >
                                                Sign Up
                                            </span>
                                        </Link>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </Grid>
                </Grid>
            </div>
        );
    }
}

SignIn.propTypes = {
    loginUser: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
    errors: PropTypes.object.isRequired,
    className: PropTypes.string,
    classes: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    auth: state.auth,
    errors: state.errors
});

export default compose(
    withStyles(styles),
    connect(
        mapStateToProps,
        { loginUser }
    )
)(SignIn);
