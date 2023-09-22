import React from "react";
import moment from "moment";
import PropTypes from "prop-types";

import {
    Grid,
    IconButton,
    withStyles
} from "@material-ui/core";

import {
    Delete as DeleteIcon,
    Edit as EditIcon
} from "@material-ui/icons";

import styles from "../style";

function DateAndActions(props) {
    const { classes, date, editItem, index, removeItem, type } = props;
    return (
        <Grid container spacing={1}>
            <Grid item xs={8} sm={9}>
                <h4 style={{ marginTop: 25, marginLeft: 20 }}>
                    {type === "fixedDate" ? "Fixed Date " : null}
                    {type === "weekly" ? "Weekly Recurring " : null}
                    {type === "daily" ? "Daily Recurring " : null}
                    | {date !== undefined ? moment(date).format("Do MMM, YYYY") : moment().format("Do MMM, YYYY")}
                </h4>
            </Grid>
            <Grid item xs={4} sm={3}>
                <IconButton
                    className={classes.inDialogButtonEdit}
                    onClick={editItem(index)}
                    aria-label="edit"
                >
                    <EditIcon />
                </IconButton>
                <IconButton
                    className={classes.inDialogButtonDel}
                    onClick={removeItem(index)}
                    aria-label="delete"
                >
                    <DeleteIcon />
                </IconButton>
            </Grid>
        </Grid>
    )
}

DateAndActions.propTypes = {
    classes: PropTypes.object,
    date: PropTypes.string,
    type: PropTypes.string.isRequired,
    editItem: PropTypes.func.isRequired,
    index: PropTypes.number.isRequired,
    removeItem: PropTypes.func.isRequired
}


export default withStyles(styles)(DateAndActions);