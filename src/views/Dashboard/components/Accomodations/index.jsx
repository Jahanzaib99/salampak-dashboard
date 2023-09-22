import React, { useEffect, useState } from 'react';

// Externals
import classNames from 'classnames';
import PropTypes from 'prop-types';

// Material helpers
import { withStyles } from '@material-ui/core';

// Material components
import { Typography } from '@material-ui/core';

// Material icons
import { HomeWorkOutlined } from '@material-ui/icons';


// Shared components
import { Paper } from 'components';

// Component styles
import styles from './styles';
import axios from "axios";
import { accommodations } from '../../../../config/routes'
import CountUp from 'react-countup';
import swal from "@sweetalert/with-react";

const Accomodations = (props) => {
    const [totalAccomodations, setTotalAccomodations] = useState(0);
    const [totalDraftData, setTotalDraftData] = useState(0);
    const [totalpublishedData, setTotalpublishedData] = useState(0);


    const { classes, className, ...rest } = props;

    const rootClassName = classNames(classes.root, className);

    useEffect(() => {
        axios.get(`${accommodations}?pageSize=0${props.userType == 'vendor' ? `&vendorId=${props.userId}` : ""}`)
            .then((res) => {
                let totalDraft = [];
                let totalPublished = [];
                res.data.data.map(item => {
                    console.log(item?.status)
                    return item?.status === "draft" ? totalDraft.push(item) : item?.status === "published" ? totalPublished.push(item) : ""
                })
                let total = res?.data?.meta ? res?.data?.meta?.total : ""
                setTotalAccomodations(total);
                setTotalDraftData(totalDraft.length);
                setTotalpublishedData(totalPublished.length)
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
                ACCOMODATIONS
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
                            <CountUp end={totalAccomodations} />
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
                    <HomeWorkOutlined className={classes.icon} />
                </div>
            </div>
        </Paper>
    );
}

Accomodations.propTypes = {
    className: PropTypes.string,
    classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Accomodations);
