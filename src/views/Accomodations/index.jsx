import React, { Component } from "react";
import { connect } from "react-redux";

// Externals
import PropTypes from "prop-types";

// Material helpers
import {
    withStyles,
    Grid,
} from "@material-ui/core";

// Default Layout
import { Dashboard as DashboardLayout } from "layouts";

// Stylesheet
import styles from "./style";

import {accommodations, locationTag, categoryTag } from "../../config/routes";


// Environment related handling
import environment from "../../config/config";

// Custom Table Component
import TableComponent from "./TableComponent";

class Categories extends Component {
    constructor(props) {
        super(props);
        this.state = {};
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
    }

    render() {
        const { classes ,auth} = this.props;
        return (
            <DashboardLayout title="Accomodations">
                <div className={classes.root}>
                    <Grid container spacing={3}>
                        <Grid item xs={12} className={classes.gridForTable}>
                            <TableComponent 
                                accommodationsUrl={accommodations} 
                                categoriesUrl={categoryTag} 
                                locationsUrl = {locationTag} 
                                rowsPerPage={10}
                                userType={auth.profile.type}
                                vendorType={auth.profile.vendorType}
                                userId={auth.user}
                                userPermissions={auth.userPermissions}
                                />
                        </Grid>
                    </Grid>
                </div>
            </DashboardLayout>
        );
    }
}

Categories.propTypes = {
    auth: PropTypes.object.isRequired,
    className: PropTypes.string,
    classes: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    auth: state.auth
});

export default connect(mapStateToProps)(withStyles(styles)(Categories));