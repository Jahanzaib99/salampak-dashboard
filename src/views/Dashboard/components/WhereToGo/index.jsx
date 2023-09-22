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
import { locationTag } from '../../../../config/routes'
import swal from "@sweetalert/with-react";

const WhereToGo = (props) => {
    const [totalWhereToGo, setTotalWhereToGo] = useState(0)
    const { classes, className, ...rest } = props;

    const rootClassName = classNames(classes.root, className);

    useEffect(() => {
        axios.get(`${locationTag}?pageSize=0`).then((res) => {
            let totalWhereToGo = res?.data?.meta ? res?.data?.meta?.total : ""
            setTotalWhereToGo(totalWhereToGo)
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
                        TOTAL DESTINATION
            </Typography>
                    <Typography
                        className={classes.value}
                        variant="h3"
                    >
                        <CountUp end={totalWhereToGo} />
                    </Typography>
                </div>
                <div className={classes.iconWrapper}>
                    {/* <MoneyIcon className={classes.icon} /> */}
                    <LocationIcon className={classes.icon} />
                </div>
            </div>
        </Paper>
    );
}

WhereToGo.propTypes = {
    className: PropTypes.string,
    classes: PropTypes.object.isRequired
};

export default withStyles(styles)(WhereToGo);
