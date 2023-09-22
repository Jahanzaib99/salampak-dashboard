import React, { useEffect, useState } from 'react';

// Externals
import classNames from 'classnames';
import PropTypes from 'prop-types';

// Material helpers
import { withStyles } from '@material-ui/core';

// Material components
import { Typography } from '@material-ui/core';

// Material icons
import EventIcon from '@material-ui/icons/Event';


// Shared components
import { Paper } from 'components';

// Component styles
import styles from './styles';
import axios from "axios";
import { events } from '../../../../config/routes'
import CountUp from 'react-countup';
import swal from "@sweetalert/with-react";

const Events = (props) => {
    const [totalEvent, setTotalEvent] = useState(0)
    const [totalDraftData, setTotalDraftData] = useState(0);
    const [totalpublishedData, setTotalpublishedData] = useState(0);

    const { classes, className, ...rest } = props;

    const rootClassName = classNames(classes.root, className);

    useEffect(() => {
        axios.get(`${events}?pageSize=0${props.userType == 'vendor' ? `&vendorId=${props.userId}` : ""}`).then((res) => {
            let totalEvent = res?.data?.meta ? res?.data?.meta?.total : ""
            setTotalEvent(totalEvent)
           
                axios.get(`${events}?pageSize=0${props.userType == 'vendor' ? `&vendorId=${props.userId}` : ""}&status=published`)
                    .then(publishedData => {
                        axios.get(`${events}?pageSize=0${props.userType == 'vendor' ? `&vendorId=${props.userId}` : ""}&status=draft`)
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
        >
            <div
                className={classes.title}
                variant="body2"
            >
                EVENTS
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
                            <CountUp end={totalEvent} />
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
                    <EventIcon className={classes.icon} />
                </div>
            </div>
        </Paper>
    );
}

Events.propTypes = {
    className: PropTypes.string,
    classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Events);
