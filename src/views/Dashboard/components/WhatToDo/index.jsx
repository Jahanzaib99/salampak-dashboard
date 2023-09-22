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
import { activityTag } from '../../../../config/routes'
import {
    ArtTrackOutlined as ActivitiesIcon,
} from '@material-ui/icons';

import CountUp from 'react-countup';
import swal from "@sweetalert/with-react";

const WhatToDo = (props) => {
    const [totalWhatToDo, setTotalWhatToDo] = useState(0)
    const { classes, className, ...rest } = props;

    const rootClassName = classNames(classes.root, className);

    useEffect(() => {
         axios.get(`${activityTag}?pageSize=0`).then((res) => {
            let totalWhatToDo = res?.data?.meta ? res?.data?.meta?.total : ""
            setTotalWhatToDo(totalWhatToDo)
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
                        TOTAL ACTIVITY
            </Typography>
                    <Typography
                        className={classes.value}
                        variant="h3"
                    >
                       <CountUp end={totalWhatToDo} />
                    </Typography>
                </div>
                <div className={classes.iconWrapper}>
                    <ActivitiesIcon className={classes.icon}  />

                </div>
            </div>
        </Paper>
    );
}

WhatToDo.propTypes = {
    className: PropTypes.string,
    classes: PropTypes.object.isRequired
};

export default withStyles(styles)(WhatToDo);
