import React, { Component } from 'react';

// Externals
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { Line } from 'react-chartjs-2';

// Material helpers
import { withStyles } from '@material-ui/core';

// Material components
import { Button, Select, MenuItem } from '@material-ui/core';

// Material icons
import {
  ArrowDropDown as ArrowDropDownIcon,
  ArrowRight as ArrowRightIcon
} from '@material-ui/icons';

// Shared components
import {
  Portlet,
  PortletHeader,
  PortletLabel,
  PortletContent,
  PortletFooter
} from 'components';

// Chart configuration
import { options } from './chart';

// Component styles
import styles from './styles';

// Api Url
import axios from 'axios';
import { trip, events, accommodations } from './../../../../config/routes'
import palette from 'theme/palette';
import Capitalize from "../../../../helpers/Capitalize";
import swal from "@sweetalert/with-react";


class LineChart extends Component {
  constructor(props) {
    super(props)
    this.state = {
      TripList: [],
      data: {},
      apiValue: '',
      fields: [],
      lastDayList: [7, 15, 30],
      lastDay: 7

    }
  }

  componentDidMount = () => {
    const { lastDay } = this.state;
    const { userPermissions } = this.props

    let apiValue = userPermissions?.dashboardPermission?.lineCharts?.trips?
      'trips' :
      userPermissions?.dashboardPermission?.lineCharts?.events?
        'events' :
        userPermissions?.dashboardPermission?.lineCharts?.accomodations? 'accomodations' : '';
        apiValue !== "" && this.fetchApi(apiValue, lastDay)
        this.setState({
          apiValue
        })
  }
  componentDidUpdate = (prevProps) => {
    const { apiValue, lastDay } = this.state;
    const { userPermissions } = this.props

    if (JSON.stringify(prevProps.userPermissions) !== JSON.stringify(userPermissions)) {
      let apiValue = userPermissions?.dashboardPermission?.lineCharts?.trips?
        'trips' :
        userPermissions?.dashboardPermission?.lineCharts?.events?
          'events' :
          userPermissions?.dashboardPermission?.lineCharts?.accomodations? 'accomodations' : '';
      apiValue !== "" && this.fetchApi(apiValue, lastDay)
      this.setState({
        apiValue
      })
    }
  }


  //  **** this function set data according to last days and choose someone Api using dropdown ****
  fetchApi = (api, day) => {
    const { vendorType, userType, userId } = this.props
    let labels = [];
    var data = new Array(day).join('0').split('').map(parseFloat);
    var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const fromNow = new Date();
    var in_a_week = new Date().setDate(fromNow.getDate() - (day - 1));
    if (api === 'accomodations') {
      axios.get(`${accommodations}?pageSize=0${userType == 'vendor' ? `&vendorId=${userId}` : ""}`)
        .then((res) => {
          let response = res?.data?.data ? res?.data?.data : [];
          for (let i = 0; i < day; i++) {
            let month = months[new Date(in_a_week).getMonth()];
            let date = new Date(in_a_week).getDate();
            let year = new Date(in_a_week).getFullYear();
            var dateMonth = `${date} ${month}`
            labels.push(dateMonth)
            in_a_week = new Date().setDate(fromNow.getDate() - ((day - 1) - (i + 1)));
            for (let j = 0; j < response.length; j++) {
              let newDate = response[j].createdAt;
              let date = new Date(newDate).getDate();
              let month = months[new Date(newDate).getMonth()];
              let yearNew = new Date(newDate).getFullYear();
              if (`${date} ${month}` === dateMonth && year === yearNew) {
                data[i] ? data[i]++ : data[i] = 1
              }
            }
          }
          this.setState({
            apiValue: "accomodations",
            data: {
              labels: labels,
              datasets: [
                {
                  label: 'Last day',
                  backgroundColor: palette.primary.main,
                  data: data
                },
              ]
            }
          })
        })
        .catch((error) => {
          swal(error?.response?.data?.error?.message, {
            icon: "error",
            showCloseButton: true,
          });
        })
    }
    else {
      return axios.get(`${api === 'trips' ? trip : events}?pageSize=0${userType == 'vendor' ? `&${api === 'trips' ? "vendor" : "vendorId"}=${userId}` : ""}`).then((res) => {
        let response = res?.data?.data ? res?.data?.data : [];
        for (let i = 0; i < day; i++) {
          let month = months[new Date(in_a_week).getMonth()];
          let date = new Date(in_a_week).getDate();
          let year = new Date(in_a_week).getFullYear();
          var dateMonth = `${date} ${month}`
          labels.push(dateMonth)
          in_a_week = new Date().setDate(fromNow.getDate() - ((day - 1) - (i + 1)));
          for (let j = 0; j < response.length; j++) {
            let newDate = api === 'trips' ? response[j].date : response[j].startDate;
            let date = new Date(newDate).getDate();
            let month = months[new Date(newDate).getMonth()];
            let yearNew = new Date(newDate).getFullYear();
            if (`${date} ${month}` === dateMonth && year === yearNew) {
              data[i] ? data[i]++ : data[i] = 1
            }
          }
        }
        this.setState({
          data: {
            labels: labels,
            datasets: [
              {
                label: 'Last day',
                backgroundColor: palette.primary.main,
                data: data
              },
            ]
          }
        })
      })
        .catch((error) => swal(error?.response?.data?.error?.message, {
          icon: "error",
          showCloseButton: true,
        }))

    }


  }
  render() {
    const { classes, className, vendorType, userType, fields, ...rest } = this.props;
    const { apiValue, lastDayList, lastDay } = this.state;
    const rootClassName = classNames(classes.root, className);
    return (
      <Portlet
        {...rest}
        className={rootClassName}
      >
        <PortletHeader noDivider>
          <PortletLabel title={`Latest ${apiValue === 'accomodations' ? "Accomodations" : apiValue === 'trips' ? "Trips" : "Events"}`} />

          {
            fields.filter(field => field !== "").length ?
              <div>
                <Select
                  className={classes.dropdownButton}
                  labelId="demo-simple-select-outlined-label"
                  id="demo-simple-select-outlined"
                  value={apiValue}
                  onChange={(e) => {
                    this.setState({
                      apiValue: e.target.value
                    }); this.fetchApi(e.target.value, lastDay)
                  }}

                >
                  {
                    fields.filter(field => field !== "").map(field => <MenuItem key={field} value={field}>
                      {Capitalize(field)}
                    </MenuItem>)
                  }
                </Select>
                <Select
                  className={classes.dropdownButton}
                  labelId="demo-simple-select-outlined-label"
                  id="demo-simple-select-outlined"
                  value={lastDay}
                  onChange={(e) => {
                    this.setState({
                      lastDay: e.target.value
                    }); this.fetchApi(apiValue, e.target.value)
                  }}

                >
                  {
                    lastDayList.map(day => <MenuItem key={day} value={day}>
                      Last {day} days
                </MenuItem>)
                  }
                </Select>
              </div>
              : ""
          }

        </PortletHeader>
        <PortletContent>
          <div className={classes.chartWrapper}>
            <Line
              data={this.state.data}
              options={options}
            />
          </div>
        </PortletContent>
      </Portlet>
    );
  }
}

LineChart.propTypes = {
  className: PropTypes.string,
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(LineChart);
