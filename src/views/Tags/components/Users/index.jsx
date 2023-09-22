import React, { useEffect } from "react";
import { connect } from "react-redux";

// Externals
import PropTypes from "prop-types";

// Material helpers
import { withStyles, Grid } from "@material-ui/core";

// Default Layout
import { Dashboard as DashboardLayout } from "layouts";

// Stylesheet
import styles from "./style";

// Booking URL for Data Table
import { users } from "../../../../config/routes";

// Environment related handling
import environment from "../../../../config/config";

// Custom Table Component
import TableComponent from "./TableComponent";


const Users = (props) => {
  const { classes } = props;

  useEffect(() => {
    //   Checking the userToken
    if (!localStorage.getItem("userToken")) {
      // redirection to login page
      props.history.push(
        process.env.NODE_ENV === "development"
          ? "/"
          : environment.production.prefix
      );
    }
  }, []);

  return (
    <DashboardLayout title="Users">
      <div className={classes.root}>
        <Grid container spacing={3}>
          <Grid item xs={12} className={classes.gridForTable}>
            <TableComponent
              url={users}
              rowsPerPage={5}
              userType={props.auth.type}
              userPermissions={props.auth.userPermissions}

            />
          </Grid>
        </Grid>
      </div>
    </DashboardLayout>
  );
};

Users.propTypes = {
  auth: PropTypes.object.isRequired,
  className: PropTypes.string,
  classes: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps)(withStyles(styles)(Users));
