import React, { Component } from "react";
import { connect } from "react-redux";
import { signUpUser } from "../../actions/authActions";
import { compose } from "recompose";
import log from "../../config/log";

// Externals
import PropTypes from "prop-types";

// Material helpers
import { withStyles } from "@material-ui/core";

// Component styles
import styles from "./styles";
import swal from "@sweetalert/with-react";
import { SignUpForm } from "./SignUpForm";
import environment from './../../config/config';

class SignUpNew extends Component {
  constructor(props) {
    super(props);
    this.state = {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      userType: "",
      mobileNumber: null,
      // DOB: +new Date(),
      gender: "",
      vendorType: "tripAndEvent",
      companyName: "",
      isAuthenticating: false,
      errors: null,
      loading: false,
    };
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.auth.signUpIsCompleted) {
      swal("SuccessFully Sign Up", {
        icon: "success",
        showCloseButton: true,
      }).then(() => this.props.history.push(
        process.env.NODE_ENV === "development"
          ? "/"
          : environment.production.prefix
      ));
    }

    if (nextProps.errors) {
      this.setState({
        loading: false,
      });
      swal(nextProps.errors.message, {
        icon: "error",
        showCloseButton: true,
      });
    }
  }

  onChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  // handleDOBChange = (e) =>
  //   this.setState({
  //     DOB: e,
  //   });

  formatDate = (date) => {
    var d = new Date(date),
      month = "" + (d.getMonth() + 1),
      day = "" + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;

    return [year, month, day].join("-");
  };

  onSubmit = (e) => {
    e.preventDefault();
    this.setState({
      loading: true,
    });

    const {
      email,
      password,
      firstName,
      lastName,
      // DOB,
      gender,
      mobileNumber,
      vendorType,
      companyName
    } = this.state;
    let payload = {
      firstName: firstName,
      lastName: lastName,
      mobile: mobileNumber,
      email: email,
      password: password,
      vendorType,
      companyName,
      gender: gender,
      // dob: this.formatDate(DOB),
      type: "vendor",
    };
    if (companyName && vendorType) {
      this.props.signUpUser(payload);
    }
    else {
      this.setState({
        loading: false,
      });
      swal(`${companyName ? "Type" : "companyName"} is required`, {
        icon: "error",
        showCloseButton: true,
      })
    }
  };

  render() {
    const { classes } = this.props;
    const { loading } = this.state;
    return (
      <div className={classes.root}>
        <SignUpForm
          classes={classes}
          onSubmit={this.onSubmit}
          onChange={this.onChange}
          // handleDOBChange={this.handleDOBChange}
          state={this.state}
          goToSignIn={() => this.props.history.push(
            process.env.NODE_ENV === "development"
              ? "/"
              : environment.production.prefix
          )}
          loading={loading}
        />
      </div>
    );
  }
}

SignUpNew.propTypes = {
  signUpUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  className: PropTypes.string,
  classes: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  errors: state.errors,
});

export default compose(
  withStyles(styles),
  connect(mapStateToProps, { signUpUser })
)(SignUpNew);
