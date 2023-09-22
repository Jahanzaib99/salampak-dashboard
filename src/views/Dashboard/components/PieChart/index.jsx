import React, { Component } from 'react';

// Externals
import { Doughnut } from 'react-chartjs-2';
import classNames from 'classnames';
import PropTypes from 'prop-types';

// Material helpers
import { withStyles } from '@material-ui/core';

// Material components
import { Typography } from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';



// Shared components
import {
  Portlet,
  PortletHeader,
  PortletLabel,
  PortletToolbar,
  PortletContent
} from 'components';

// Palette
import palette from 'theme/palette';

// Chart configuration
import { options } from './chart';

// Component styles
import styles from './styles';
import axios from 'axios';
import { trip, events, users, activityTag, locationTag, accommodations } from './../../../../config/routes'
import swal from "@sweetalert/with-react";
import { async } from 'validate.js';
import capitalizeFirstLetter from 'helpers/Capitalize';

class PieChart extends Component {
  constructor() {
    super()
    this.state = {
      data: {},
      isLoading: true,
    }

  }


  componentDidMount = () => {
    this.getApisResponse();
  }
  componentDidUpdate = (prevProps) => {
    const { userPermissions } = this.props

    if (JSON.stringify(prevProps.userPermissions) !== JSON.stringify(userPermissions)) {
      this.getApisResponse();
    }
  }
  getApisResponse = () => {

    const { userType, userId, fields } = this.props
    let APIs = [];
    for (let i = 0; i < fields.length; i++) {
      const element = fields[i];
      let url = `${
        element === "trips" ? `${trip}?pageSize=0${userType == 'vendor' ? `&${"vendor"}=${userId}` : ""}` :
          element === "events" ? `${events}?pageSize=0${userType == 'vendor' ? `&${"vendorId"}=${userId}` : ""}` :
            element === "activities" ? `${activityTag}?pageSize=0` :
              element === "locations" ? `${locationTag}?pageSize=0` :
                element === "accomodations" ? `${accommodations}?pageSize=0${userType == 'vendor' ? `&${"vendorId"}=${userId}` : ""}` :
                  element === "vendors" ? `${users}?pageSize=0&type=["vendor"]` :
                    element === "customers" ? `${users}?pageSize=0&type=["customer"]` :
                      ""}`
      APIs.push(axios.get(url))
    }
    axios.all(APIs).then(
      axios.spread((...allData) => {
        let totalArray = [];
        let total = 0
        for (let j = 0; j < allData.length; j++) {
          totalArray[j] = allData[j]?.data?.meta?.total
          total = total + allData[j]?.data?.meta?.total;
        }

        let totalAvg = [];
        let totalCount = 0
        for (let j = 0; j < totalArray.length; j++) {
         
          totalAvg[j] = !isNaN(+((totalArray[j] / total) * 100).toFixed(2)) ? +((totalArray[j] / total) * 100).toFixed(2) : 0;
          totalCount = totalCount + +((totalArray[j] / total) * 100).toFixed(2);
        }
        let data = {
          datasets: [
            {
              data: totalAvg,
              backgroundColor: [
                palette.primary.main,
                palette.danger.main,
                palette.warning.main,
                palette.common.main,
                palette.info.main,
                palette.secondary.main,
                palette.color1.primary,
              ],
              borderWidth: 8,
              borderColor: palette.common.white,
              hoverBorderActivitiesColor: palette.common.white
            }
          ],
          labels: fields.map(filed => capitalizeFirstLetter(filed ? filed : ""))

        }
        this.setState({
          isLoading: false,
          data
        })

      })
    )
  }

  fetchApis = () => {
    const { vendorType, userType, userId, fields } = this.props
    let response = this.getApisResponse()
    // if (vendorType == 'hotel' && userType == 'vendor') {
    //   axios.get(`${accommodations}?pageSize=0${`&vendorId=${userId}`}`)
    //     .then((res) => {
    //       let totalAccommodations = res?.data?.meta ? res?.data?.meta?.total : ""
    //       let total = totalAccommodations;
    //       let accommodationsAverage = +((totalAccommodations / total) * 100).toFixed(2);
    //       accommodationsAverage = isNaN(accommodationsAverage) ? 0 : accommodationsAverage;
    //       let data = {
    //         datasets: [
    //           {
    //             data: [accommodationsAverage],
    //             backgroundColor: [
    //               palette.primary.main,
    //             ],
    //             borderWidth: 8,
    //             borderColor: palette.common.white,
    //             hoverBorderActivitiesColor: palette.common.white
    //           }
    //         ],
    //         labels: ['Accommodations']

    //       }
    //       this.setState({
    //         isLoading: false,
    //         data
    //       })
    //     })
    //     .catch((error) => {
    //       this.setState({
    //         isLoading: false
    //       })
    //       swal(error?.response?.data?.error?.message, {
    //         icon: "error",
    //         showCloseButton: true,
    //       });
    //     })
    // }
    // else {
    //   axios.get(`${trip}?pageSize=0 ${this?.props?.userType == 'vendor' ? `&${"vendor"}=${this?.props?.userId}` : ""}`)
    //     .then((tripData) => {
    //       axios.get(`${events}?pageSize=0 ${this?.props?.userType == 'vendor' ? `&${"vendorId"}=${this?.props?.userId}` : ""}`)
    //         .then((eventData) => {
    //           if (this?.props?.userType == 'admin' || this?.props?.userType == 'employee' || this?.props?.userType == 'superAdmin') {
    //             axios.get(`${activityTag}?pageSize=0`).then((Activities) => {
    //               axios.get(`${locationTag}?pageSize=0`).then((Location) => {
    //                 axios.get(`${users}?pageSize=0&type=["vendor"]`).then((vendor) => {
    //                   axios.get(`${users}?pageSize=0&type=["customer"]`).then((customer) => {
    //                     axios.get(`${accommodations}?pageSize=0`)
    //                       .then((res) => {
    //                         let totalCustomers = customer?.data?.meta ? customer?.data?.meta?.total : ""
    //                         let totalVendors = vendor?.data?.meta ? vendor?.data?.meta?.total : ""
    //                         let totalLocation = Location?.data?.meta ? Location?.data?.meta?.total : ""
    //                         let totalActivities = Activities?.data?.meta ? Activities?.data?.meta?.total : ""
    //                         let totalAccommodations = res?.data?.meta ? res?.data?.meta?.total : ""
    //                         let totalEvents = eventData.data.meta.total;
    //                         let totalTrips = tripData.data.meta.total;
    //                         let total = totalAccommodations + totalEvents + totalTrips + totalActivities + totalLocation + totalVendors + totalCustomers;
    //                         let eventAverage = +((totalEvents / total) * 100).toFixed(2);
    //                         let tripAverage = +((totalTrips / total) * 100).toFixed(2);
    //                         let ActivitiesAverage = +((totalActivities / total) * 100).toFixed(2);
    //                         let LocationAverage = +((totalLocation / total) * 100).toFixed(2);
    //                         let vendorAverage = +((totalVendors / total) * 100).toFixed(2);
    //                         let customerAverage = +((totalCustomers / total) * 100).toFixed(2);
    //                         let accommodationsAverage = +((totalAccommodations / total) * 100).toFixed(2);

    //                         tripAverage = isNaN(tripAverage) ? 0 : tripAverage;
    //                         eventAverage = isNaN(eventAverage) ? 0 : eventAverage;
    //                         ActivitiesAverage = isNaN(ActivitiesAverage) ? 0 : ActivitiesAverage;
    //                         LocationAverage = isNaN(LocationAverage) ? 0 : LocationAverage;
    //                         vendorAverage = isNaN(vendorAverage) ? 0 : vendorAverage;
    //                         customerAverage = isNaN(customerAverage) ? 0 : customerAverage;
    //                         accommodationsAverage = isNaN(accommodationsAverage) ? 0 : accommodationsAverage;

    //                         let data = {
    //                           datasets: [
    //                             {
    //                               data: [tripAverage, eventAverage, ActivitiesAverage, LocationAverage, vendorAverage, customerAverage, accommodationsAverage],
    //                               backgroundColor: [
    //                                 palette.primary.main,
    //                                 palette.danger.main,
    //                                 palette.warning.main,
    //                                 palette.common.main,
    //                                 palette.info.main,
    //                                 palette.secondary.main,
    //                                 palette.color1.primary,




    //                               ],
    //                               borderWidth: 8,
    //                               borderColor: palette.common.white,
    //                               hoverBorderActivitiesColor: palette.common.white
    //                             }
    //                           ],
    //                           labels: ['Trips', 'Events', 'Activities', 'Location', 'Vendor', 'Customer', 'Accomodation']

    //                         }
    //                         this.setState({
    //                           isLoading: false,
    //                           data
    //                         })
    //                       })
    //                       .catch((error) => {
    //                         this.setState({
    //                           isLoading: false
    //                         })
    //                         swal(error?.response?.data?.error?.message, {
    //                           icon: "error",
    //                           showCloseButton: true,
    //                         });
    //                       })
    //                   })
    //                     .catch((error) => {
    //                       this.setState({
    //                         isLoading: false
    //                       })
    //                       swal(error?.response?.data?.error?.message, {
    //                         icon: "error",
    //                         showCloseButton: true,
    //                       });
    //                     })
    //                 })
    //                   .catch((error) => {
    //                     this.setState({
    //                       isLoading: false
    //                     })
    //                     swal(error?.response?.data?.error?.message, {
    //                       icon: "error",
    //                       showCloseButton: true,
    //                     });
    //                   })

    //               })
    //                 .catch((error) => {
    //                   this.setState({
    //                     isLoading: false
    //                   })
    //                   swal(error?.response?.data?.error?.message, {
    //                     icon: "error",
    //                     showCloseButton: true,
    //                   });
    //                 })
    //             })
    //               .catch((error) => {
    //                 this.setState({
    //                   isLoading: false
    //                 })
    //                 swal(error?.response?.data?.error?.message, {
    //                   icon: "error",
    //                   showCloseButton: true,
    //                 });
    //               })
    //           }
    //           else {
    //             let totalEvents = eventData.data.meta.total;
    //             let totalTrips = tripData.data.meta.total;
    //             let total = totalEvents + totalTrips;
    //             let eventAverage = +((totalEvents / total) * 100).toFixed(2);
    //             let tripAverage = +((totalTrips / total) * 100).toFixed(2);
    //             eventAverage = isNaN(eventAverage) ? 0 : eventAverage;
    //             tripAverage = isNaN(tripAverage) ? 0 : tripAverage;

    //             let data = {
    //               datasets: [
    //                 {
    //                   data: [tripAverage, eventAverage],
    //                   backgroundColor: [
    //                     palette.primary.main,
    //                     palette.danger.main,
    //                     palette.warning.main
    //                   ],
    //                   borderWidth: 8,
    //                   borderColor: palette.common.white,
    //                   hoverBorderColor: palette.common.white
    //                 }
    //               ],
    //               labels: ['Trips', 'Events']

    //             }
    //             this.setState({
    //               isLoading: false,
    //               data
    //             })
    //           }
    //         })
    //         .catch((error) => {
    //           this.setState({
    //             isLoading: false
    //           })
    //           swal(error?.response?.data?.error?.message, {
    //             icon: "error",
    //             showCloseButton: true,
    //           });
    //         })
    //     })
    //     .catch((error) => {
    //       this.setState({
    //         isLoading: false
    //       })
    //       swal(error?.response?.data?.error?.message, {
    //         icon: "error",
    //         showCloseButton: true,
    //       });
    //     })
    // }
  }

  render() {
    const { classes, className, ...rest } = this.props;
    const { data, isLoading } = this.state;
    const rootClassName = classNames(classes.root, className);

    return (
      <Portlet
        {...rest}
        className={rootClassName}
      >
        <PortletHeader noDivider>
          <PortletLabel title="Modules" />
        </PortletHeader>
        <PortletContent>
          <div className={classes.chartWrapper}>
            {
              isLoading ?
                <div className={classes.flexCenter}>
                  <CircularProgress size={60} />
                </div>
                :
                <Doughnut
                  data={data}
                  options={options}
                />
            }
          </div>
          <div className={classes.stats}>
            {
              data?.labels?.length ?
                data?.labels.map((lab, i) => {
                  return (
                    <div className={classes.device}>
                      <Typography variant="body1">{lab}</Typography>
                      <Typography
                        style={{
                          color: i === 0 ?
                            palette.primary.main : i === 1 ?
                              palette.danger.main : i === 2 ?
                                palette.warning.main : i === 3 ?
                                  palette.common.main : i === 4 ?
                                    palette.info.main : i === 5 ?
                                      palette.secondary.main : palette.color1.primary,
                        }}
                        variant="h4"
                      >
                        {data.datasets[0].data[i]}%
                      </Typography>
                    </div>
                  )
                })
                : ""
            }

          </div>
        </PortletContent>
      </Portlet>
    );
  }
}

PieChart.propTypes = {
  className: PropTypes.string,
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(PieChart);
