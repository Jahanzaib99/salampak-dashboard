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

// Booking URL for Data Table
import { activityTag } from "../../config/routes";

// Environment related handling
import environment from "../../config/config";

// Custom Table Component
import TableComponent from "../../table";



class Bookings extends Component {
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
        const { classes } = this.props;
        return (
            <DashboardLayout title="Activities Test">
                <div className={classes.root}>
                    <Grid container spacing={3}>
                        <Grid item xs={12} className={classes.gridForTable}>
                            <TableComponent
                                url={activityTag}
                                pageSize={20}
                                headerArray={[
                                    {
                                        key: "_id",
                                        label: "ID",
                                        sortKey: null,  // can only be one
                                        parentKey: null, // can only be one
                                        type: "text",
                                        isAction: false,
                                        isVisible: false
                                    },
                                    {
                                        key: "name",
                                        label: "Activity",
                                        sortKey: "name",
                                        parentKey: "",
                                        type: "text",
                                        isAction: false,
                                        isVisible: true
                                    },
                                    {
                                        key: "createdAt",
                                        headerKey: "createdAt",
                                        label: "Created At",
                                        sortKey: "createdAt",
                                        parentKey: "",
                                        type: "date",
                                        isAction: false,
                                        isVisible: true
                                    },
                                    {
                                        key: "alias",
                                        headerKey: "alias",
                                        label: "Alias",
                                        sortKey: "alias",
                                        parentKey: "",
                                        type: "text",
                                        isAction: false,
                                        isVisible: true
                                    },
                                    {
                                        key: "isFilter",
                                        headerKey: "isFilter",
                                        label: "Filtered",
                                        sortKey: "isFilter",
                                        parentKey: "",
                                        type: "boolean",
                                        isAction: false,
                                        isVisible: true
                                    },
                                    {
                                        key: "description",
                                        headerKey: "description",
                                        label: "Description",
                                        sortKey: "description",
                                        parentKey: "",
                                        type: "text",
                                        isAction: false,
                                        isVisible: true
                                    },
                                    {
                                        key: "action",
                                        headerKey: "action",
                                        label: "Action",
                                        sortKey: "",
                                        parentKey: "",
                                        type: "action",
                                        isAction: true,
                                        isVisible: true,
                                        actions: [
                                            {
                                                label: "Edit",
                                                type: "edit",
                                                actionRoute: "/edit/"
                                            },
                                            {
                                                label: "Delete",
                                                type: "delete",
                                                actionRoute: "/delete/"
                                            },
                                        ]
                                    },
                                ]}
                                search={true}
                                sort={false}
                            />
                        </Grid>
                    </Grid>
                </div>
            </DashboardLayout>
        );
    }
}

Bookings.propTypes = {
    auth: PropTypes.object.isRequired,
    className: PropTypes.string,
    classes: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    auth: state.auth
});

export default connect(mapStateToProps)(withStyles(styles)(Bookings));
