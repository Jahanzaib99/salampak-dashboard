import React, { useEffect, useState } from 'react';

// Externals
import classNames from 'classnames';
import PropTypes from 'prop-types';

// Material helpers
import { withStyles } from '@material-ui/core';

// Material components
import { Typography } from '@material-ui/core';

// Material icons
import CardTravelIcon from '@material-ui/icons/CardTravel';


// Shared components
import { Paper } from 'components';

// Component styles
import styles from './styles';
import axios from "axios";
import { trip } from './../../../../config/routes'
import CountUp from 'react-countup';
import swal from "@sweetalert/with-react";

const Trips = (props) => {
    const [totalTrip, setTotalTrip] = useState(0);
    const [totalDraftData, setTotalDraftData] = useState(0);
    const [totalpublishedData, setTotalpublishedData] = useState(0);

    const { classes, className, ...rest } = props;

    const rootClassName = classNames(classes.root, className);

    useEffect(() => {
        axios.get(`${trip}?pageSize=0 ${props.userType == 'vendor' ? `&vendor=${props.userId}` : ""}`).then((res) => {
            let totalTrips = res?.data?.meta ? res?.data?.meta?.total : ""
            setTotalTrip(totalTrips)
           
                axios.get(`${trip}?pageSize=0${props.userType == 'vendor' ? `&vendor=${props.userId}` : ""}&status=published`)
                    .then(publishedData => {
                        axios.get(`${trip}?pageSize=0${props.userType == 'vendor' ? `&vendor=${props.userId}` : ""}&status=draft`)
                            .then(draftData => {
                                let totalDraftData = draftData?.data?.meta ? draftData?.data?.meta?.total : ""
                                let totalpublishedData = publishedData?.data?.meta ? publishedData?.data?.meta?.total : ""
                                setTotalDraftData(totalDraftData);
                                setTotalpublishedData(totalpublishedData)
                            })
                            .catch((error) => {
                                swal(error?.response?.data?.error?.message, {
                                    icon: "error",
                                    showCloseButton: true,
                                });
                            })
                    })
                    .catch((error) => {
                        swal(error?.response?.data?.error?.message, {
                            icon: "error",
                            showCloseButton: true,
                        });
                    })

            

        })
            .catch((error) => {
                swal(error?.response?.data?.error?.message, {
                    icon: "error",
                    showCloseButton: true,
                });
            })
    }, [])

    return (
        <Paper
            {...rest}
            className={rootClassName}
        > <div
            className={classes.title}
            variant="body2"
        >
                TRIPS
            </div>

            <div className={classes.content}>
                <div className={classes.content2}>

                    <div className={classes.details}>
                        <Typography
                            className={classes.title}
                            variant="body2"
                        >
                            TOTAL
                        </Typography>
                        <Typography
                            className={classes.value}
                            variant="h3"
                        >
                            <CountUp end={totalTrip} />
                        </Typography>
                    </div>
                   
                            <>
                                <div className={classes.details}>
                                    <Typography
                                        className={classes.title}
                                        variant="body2"
                                    >
                                        DRAFT
            </Typography>
                                    <Typography
                                        className={classes.value}
                                        variant="h3"
                                    >
                                        <CountUp end={totalDraftData} />
                                    </Typography>
                                </div>
                                <div className={classes.details}>
                                    <Typography
                                        className={classes.title}
                                        variant="body2"
                                    >
                                        PUBLISHED
            </Typography>
                                    <Typography
                                        className={classes.value}
                                        variant="h3"
                                    >
                                        <CountUp end={totalpublishedData} />
                                    </Typography>
                                </div>
                            </>

                          
                </div>
                <div className={classes.iconWrapper}>
                    {/* <MoneyIcon className={classes.icon} /> */}
                    <CardTravelIcon className={classes.icon} />
                </div>
            </div>
        </Paper>
    );
}

Trips.propTypes = {
    className: PropTypes.string,
    classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Trips);
