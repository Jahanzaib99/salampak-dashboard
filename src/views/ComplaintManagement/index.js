import React from "react";

// Material helpers
import {
    Grid,
    withStyles,

} from "@material-ui/core";
import PropTypes from "prop-types";
import styles from "./style";

// Default Layout
import { Dashboard as DashboardLayout } from "layouts";
const ComplaintManagement = (props) => {
    const { classes } = props;
    return (
        <DashboardLayout title="Complaint Management">
            <div className={classes.root}>
                <Grid container spacing={3}>
                    <Grid item xs={12} className={classes.gridForTable}>
                           <div style={{ height: '100vh' }}>
                                <object
                                    data="https://complaint.salampakistan.gov.pk/scp/"
                                    height="100%"
                                    width="100%"
                                    type="text/html"
                                    sandbox="allow-forms allow-modals allow-scripts allow-same-origin"
                                    class="complaint-iframe"
                                ></object>
                        </div>

                    </Grid>
                </Grid>
            </div>
        </DashboardLayout>
    );
}



ComplaintManagement.propTypes = {
    className: PropTypes.string,
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ComplaintManagement);
