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
import { booking } from '../../../../config/routes'
import CountUp from 'react-countup';
import swal from "@sweetalert/with-react";

const Bookings = (props) => {
    const [totalBooking, setTotalBooking] = useState(0)

    const { classes, className, ...rest } = props;

    const rootClassName = classNames(classes.root, className);

    useEffect(() => {
        axios.get(`${booking}?pageSize=0${props.userType == 'vendor' ? `&vendorId=${props.userId}` : ""}`).then((res) => {
            let totalBooking = res?.data?.meta ? res?.data?.meta?.total : ""
            setTotalBooking(totalBooking)
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
        <div className={classes.content}>
            <div className={classes.details}>
                <Typography
                    className={classes.title}
                    variant="body2"
                >
                    BOOKING
        </Typography>
                <Typography
                    className={classes.value}
                    variant="h3"
                >
                   <CountUp end={totalBooking} />
                </Typography>
            </div>
            <div className={classes.iconWrapper}>
                {/* <MoneyIcon className={classes.icon} /> */}
                <CardTravelIcon className={classes.icon} />
            </div>
        </div>
    </Paper>
    );
}

Bookings.propTypes = {
    className: PropTypes.string,
    classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Bookings);
