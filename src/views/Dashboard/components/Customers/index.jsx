import React, { useEffect, useState } from 'react';

// Externals
import classNames from 'classnames';
import PropTypes from 'prop-types';

// Material helpers
import { withStyles } from '@material-ui/core';

// Material components
import { Typography } from '@material-ui/core';

// Material icons
import {
    MyLocationOutlined as LocationIcon,
} from '@material-ui/icons';

import CountUp from 'react-countup';

// Shared components
import { Paper } from 'components';

// Component styles
import styles from './styles';
import axios from "axios";
import { users } from '../../../../config/routes'
import swal from "@sweetalert/with-react";
import PeopleIcon from '@material-ui/icons/People';

const Customers = (props) => {
    const [totalCustomers, setTotalCustomers] = useState(0)
    const { classes, className, ...rest } = props;

    const rootClassName = classNames(classes.root, className);

    useEffect(() => {
        axios.get(`${users}?pageSize=0&type=["customer"]`).then((res) => {
            let totalCustomers = res?.data?.meta ? res?.data?.meta?.total : ""
            setTotalCustomers(totalCustomers)
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
                        TOTAL CUSTOMERS
            </Typography>
                    <Typography
                        className={classes.value}
                        variant="h3"
                    >
                        <CountUp end={totalCustomers} />
                    </Typography>
                </div>
                <div className={classes.iconWrapper}>
                    {/* <MoneyIcon className={classes.icon} /> */}
                    <PeopleIcon className={classes.icon} />
                </div>
            </div>
        </Paper>
    );
}

Customers.propTypes = {
    className: PropTypes.string,
    classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Customers);
