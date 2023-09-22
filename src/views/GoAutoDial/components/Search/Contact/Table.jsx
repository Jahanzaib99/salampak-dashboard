import React from 'react';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import IconButton from "@material-ui/core/IconButton";
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import moment from "moment";

import EditIcon from "@material-ui/icons/EditOutlined";
import PDIcon from "@material-ui/icons/MonetizationOnOutlined";

import PlannedActivity from "../PlannedActivity";
import log from 'config/log';


const StyledTableCell = withStyles(theme => ({
    head: {
        backgroundColor: theme.palette.success.light,
        color: theme.palette.common.black,
    },
    body: {
        fontSize: 14,
    },
}))(TableCell);

const StyledTableRow = withStyles(theme => ({
    root: {
        '&:nth-of-type(odd)': {
            backgroundColor: theme.palette.background.default,
        },
    },
}))(TableRow);

const useStyles = makeStyles({
    table: {
        minWidth: 700,
    },
});

export default function CustomizedTables(props) {
    const classes = useStyles();
    const descision = (data) => {
        log("data", "info", data);
        if (data.next_activity_id !== null) {
            log("Marking done", "info", null);
            props.markDone(data.next_activity_id, data.redirect_url);
        }
        else {
            log("Add an activity", "info", "");
            let payload = {
                deal_id: data.id,
                person_id: data.person_id.value,
                user_id: data.user_id.id,
                done: true
            };
            props.addActivity(payload, data.redirect_url);
        }
    };
    const addPlannedActivity = (data) => {
        props.addPlannedActivity(data);
    }
    const openLink = (link) => {
        window.open(link, "_blank");
    }
    return (
        <Paper style={{ overflowX: "scroll" }}>
            <Table className={classes.table} aria-label="customized table">
                <TableHead>
                    <TableRow>
                        <StyledTableCell>Actions</StyledTableCell>
                        <StyledTableCell>Deal</StyledTableCell>
                        <StyledTableCell>Status</StyledTableCell>
                        <StyledTableCell>View PD</StyledTableCell>
                        <StyledTableCell>Deal Created</StyledTableCell>
                        <StyledTableCell>Planned Activity Note</StyledTableCell>
                        <StyledTableCell>Trip Title</StyledTableCell>
                        <StyledTableCell>Trip Destination</StyledTableCell>
                        <StyledTableCell align="right">Trip Duration</StyledTableCell>
                        <StyledTableCell>Trip Date</StyledTableCell>
                        <StyledTableCell>Activity Count</StyledTableCell>
                        <StyledTableCell>Email Count</StyledTableCell>
                        <StyledTableCell>Owner</StyledTableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {props.deals.map(row => (
                        <StyledTableRow key={row.id}>
                            <StyledTableCell component="th" scope="row">
                                <IconButton color="primary" onClick={() => descision(row)}>
                                    <EditIcon />
                                </IconButton>
                                <PlannedActivity data={row} addPlannedActivity={addPlannedActivity} />
                            </StyledTableCell>
                            <StyledTableCell>
                                {row.title}
                            </StyledTableCell>
                            <StyledTableCell>{row.status}</StyledTableCell>
                            <StyledTableCell component="th" scope="row">
                                <IconButton color="primary" onClick={() => openLink(row.redirect_url)}>
                                    <PDIcon />
                                </IconButton>
                            </StyledTableCell>
                            <StyledTableCell>{moment(row.add_time).format("DD-MM-YYYY")}</StyledTableCell>
                            <StyledTableCell>{row.next_activity_note}</StyledTableCell>
                            <StyledTableCell>{row.tripTitle}</StyledTableCell>
                            <StyledTableCell>{row.tripDestination}</StyledTableCell>
                            <StyledTableCell align="right">{row.tripDuration}</StyledTableCell>
                            <StyledTableCell>{row.tripDate}</StyledTableCell>
                            <StyledTableCell align="right">
                                {row.activities_count}
                            </StyledTableCell>
                            <StyledTableCell align="right">
                                {row.email_messages_count}
                            </StyledTableCell>
                            <StyledTableCell>{row.user_id.name}</StyledTableCell>
                        </StyledTableRow>
                    ))}
                </TableBody>
            </Table>
        </Paper>
    );
}
