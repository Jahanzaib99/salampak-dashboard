import React, { Component } from 'react';

// Externals
import PropTypes from 'prop-types';

// Material helpers
import { withStyles } from '@material-ui/core';

// Material components
import { Grid } from '@material-ui/core';

// Shared layouts
import { Dashboard as DashboardLayout } from 'layouts';

import environment from "../../config/config";

import { compose } from "recompose";
import { connect } from "react-redux";

// Import Charts
import LineChart from './components/LineChart/index';
import PieChart from './components/PieChart/index';


// Male and Female Avatars & FMA Logo
// import female_av from "../../assets/images/female_av.png";
// import male_av from "../../assets/images/male_av.png";

// Custoviews/Dashboard/components/PieChart/node_modules/m components
import { Trips, Events, WhereToGo, WhatToDo, Accomodations, Vendors, Customers, Bookings } from './components';

// Component styles
const styles = theme => ({
  root: {
    padding: theme.spacing(4)
  },
  item: {
    height: '100%'
  }
});

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {
        name: "",
        type: "",
        imageUrl: "",
        gender: "",
      },
    };
  }
  componentDidMount() {
    const { auth } = this.props;
    this.setState({
      user: {
        name: `${auth?.profile?.firstName} ${auth?.profile?.lastName}`,
        type: auth?.profile?.type,
        imageUrl: auth?.profile?.imageUrl,
        gender: auth?.profile?.gender,
      }
    })
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
  componentDidUpdate = (prevProps) => {
    const { auth } = this.props;
    if (JSON.stringify(auth) !== JSON.stringify(prevProps.auth)) {
      this.setState({
        user: {
          name: `${auth?.profile?.firstName} ${auth?.profile?.lastName}`,
          type: auth?.profile?.type,
          imageUrl: auth?.profile?.imageUrl,
          gender: auth?.profile?.gender,
        }
      })
    }
  }
  render() {
    const { classes, auth } = this.props;
    return (
      <DashboardLayout title="Dashboard">
        <div className={classes.root}>

          {/* <h1 style={{
            textAlign: 'center',
            fontWeight: 400,
            letterSpacing: 2,
            marginTop: "12%",
            marginBottom: "10%",
            // fontSize: 50,
            textTransform: 'uppercase'
          }}>Welcome to the Dashboard</h1> */}
          <Grid
            container
            spacing={4}
          >


            {
              auth?.userPermissions?.dashboardPermission?.cards?.trips ?
                <Grid
                  item
                  xl={6}
                  lg={6}
                  sm={12}
                  xs={12}
                >
                  <Trips
                    className={classes.item}
                    userType={auth?.profile?.type}
                    userId={this.props.auth.user}
                  />
                </Grid>
                : ""
            }
            {
              auth?.userPermissions?.dashboardPermission?.cards?.events ?
                <Grid
                  item
                  xl={6}
                  lg={6}
                  sm={12}
                  xs={12}
                >
                  <Events
                    className={classes.item}
                    userType={auth?.profile?.type}
                    userId={this.props.auth.user}
                  />
                </Grid>
                : ""}
            {auth?.userPermissions?.dashboardPermission?.cards?.locations ?
              <Grid
                item
                xl={6}
                lg={6}
                sm={12}
                xs={12}
              >
                <WhereToGo className={classes.item} />
              </Grid>
              : ""}
            {auth?.userPermissions?.dashboardPermission?.cards?.activities ?
              <Grid
                item
                xl={6}
                lg={6}
                sm={12}
                xs={12}
              >
                <WhatToDo className={classes.item} />
              </Grid>
              : ""}
            {
              auth?.userPermissions?.dashboardPermission?.cards?.accomodations ?
                <Grid
                  item
                  xl={6}
                  lg={6}
                  sm={12}
                  xs={12}
                >
                  <Accomodations
                    className={classes.item}
                    userType={auth?.profile?.type}
                    userId={this.props.auth.user}
                  />

                </Grid>
                : ""
            }
            {auth?.userPermissions?.dashboardPermission?.cards?.vendors ?
              <Grid
                item
                xl={6}
                lg={6}
                sm={12}
                xs={12}
              >

                <Vendors className={classes.item} userType={auth?.profile?.type} />
              </Grid>
              : ""}
            {auth?.userPermissions?.dashboardPermission?.cards?.customers ?
              <Grid
                item
                xl={6}
                lg={6}
                sm={12}
                xs={12}
              >
                <Customers className={classes.item} userType={auth?.profile?.type} />
              </Grid>
              : ""}
            {auth?.userPermissions?.dashboardPermission?.cards?.bookings ?
              <Grid
                item
                xl={6}
                lg={6}
                sm={12}
                xs={12}
              >
                <Bookings className={classes.item} userType={auth?.profile?.type} userId={this.props.auth.user}/>
              </Grid>
              : ""}

            <Grid
              item
              lg={8}
              md={12}
              xl={9}
              xs={12}
            >
              <LineChart
                className={classes.item}
                userType={auth?.profile?.type}
                userId={this.props.auth.user}
                vendorType={this.props.auth.profile.vendorType}
                fields={[ auth?.userPermissions?.dashboardPermission?.lineCharts?.trips ? "trips" : "", auth?.userPermissions?.dashboardPermission?.lineCharts?.events ? "events" : "", auth?.userPermissions?.dashboardPermission?.lineCharts?.accomodations ? "accomodations" : ""]}
                userPermissions={this.props.auth.userPermissions}

              />
            </Grid>
            <Grid
              item
              lg={4}
              md={6}
              xl={3}
              xs={12}
            >
              <PieChart
                className={classes.item}
                userType={auth?.profile?.type}
                userId={this.props.auth.user}
                vendorType={this.props.auth.profile.vendorType}
                fields={
                  [
                    auth?.userPermissions?.dashboardPermission?.pieCharts?.trips ? "trips" : "",
                    auth?.userPermissions?.dashboardPermission?.pieCharts?.events ? "events" : "",
                    auth?.userPermissions?.dashboardPermission?.pieCharts?.activities ? "activities" : "",
                    auth?.userPermissions?.dashboardPermission?.pieCharts?.locations ? "locations" : "",
                    auth?.userPermissions?.dashboardPermission?.pieCharts?.vendors ? "vendors" : "",
                    auth?.userPermissions?.dashboardPermission?.pieCharts?.customers ? "customers" : "",
                    auth?.userPermissions?.dashboardPermission?.pieCharts?.accomodations ? "accomodations" : ""
                  ].filter(item => item)}
                userPermissions={this?.props?.auth?.userPermissions}
              />
            </Grid>
            <Grid
              item
              lg={4}
              md={6}
              xl={3}
              xs={12}
            >
              {/* <ProductList className={classes.item} /> */}
            </Grid>
            <Grid
              item
              lg={8}
              md={12}
              xl={9}
              xs={12}
            >
              {/* <OrdersTable className={classes.item} /> */}
            </Grid>
          </Grid>
        </div>
      </DashboardLayout>
    );
  }
}

Dashboard.propTypes = {
  classes: PropTypes.object.isRequired
};
const mapStateToProps = state => ({
  auth: state.auth
});
export default compose(withStyles(styles), connect(mapStateToProps))(Dashboard);
