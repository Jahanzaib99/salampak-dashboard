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

const Vendors = (props) => {
    const [totalVendors, setTotalVendors] = useState(0)
    const { classes, className, ...rest } = props;

    const rootClassName = classNames(classes.root, className);

    useEffect(() => {
        axios.get(`${users}?pageSize=0&type=["vendor"]`).then((res) => {
            let totalVendors = res?.data?.meta ? res?.data?.meta?.total : ""
            setTotalVendors(totalVendors)
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
                        TOTAL VENDORS
            </Typography>
                    <Typography
                        className={classes.value}
                        variant="h3"
                    >
                        <CountUp end={totalVendors} />
                    </Typography>
                </div>
                <div className={classes.iconWrapper}>
                    {/* <MoneyIcon className={classes.icon} /> */}
                    <PeopleIcon  className={classes.icon} />
                </div>
            </div>
        </Paper>
    );
}

Vendors.propTypes = {
    className: PropTypes.string,
    classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Vendors);
