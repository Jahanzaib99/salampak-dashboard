import React, { Component, Fragment } from 'react';
import {
    Avatar,
    Divider,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    CircularProgress,
    Grid,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    TableSortLabel,
    TextField,
    withStyles,
    Paper,
    ButtonGroup,
    IconButton,
    TableContainer,
    Typography,
    Fab,
    Tooltip,

} from '@material-ui/core';

import {
    Delete as DeleteIcon,
    Edit as EditIcon
} from "@material-ui/icons";
import axios from "axios";
import swal from '@sweetalert/with-react';

import {
    accommodations,
} from "../../../../config/routes";
// Externals
import PropTypes from "prop-types";

// Custom Styles
import styles from "./style";
import { Link } from 'react-router-dom';
import environment from './../../../../config/config';


class RoomList extends Component {
    editItem = i => () => {
        this.props.editItinerary(i);
    }
    removeItem = i => () => {
        const { accomodationId } = this.props;
        swal('Are you sure you want to deleted?')
            .then((isDeleted) => {
                return isDeleted ?
                    axios
                        .put(`${accommodations}/${accomodationId}/rooms/${i}/remove-rooms`)
                        .then((response) => {
                            this.props.enableTabs(4, accomodationId);
                            swal(response.data.data.message, {
                                icon: "success",
                            });
                        })
                        .catch((error) => {
                            swal(error?.response?.data.error?.message ? error?.response?.data.error?.message : "Something wrong", {
                                icon: "error",
                            });
                        }) : ""
            })

    }
    render() {
        const { classes } = this.props;
        return (
            // <List className={classes.root}>
            //     {this.props.data && this.props.data.map((item, index) => (
            //         <Fragment key={index}>
            //             <ListItem style={{
            //                 display: 'flex',
            //                 justifyContent: 'space-between'
            //             }}>
            //                 <div>
            //                     <strong style={{ marginRight: "5px" }}>Room Name :</strong>{item.RoomName}
            //                     <strong style={{ marginLeft: "20px", marginRight: "5px" }}>Room Price :</strong>{item.Rate}
            //                     <strong style={{ marginLeft: "20px", marginRight: "5px" }}>Room Description :</strong>{item?.RoomDescription ? item.RoomDescription.length > 68 ? item.RoomDescription.slice(0, 68) + "..." : item.RoomDescription : ""}

            //                 </div>
            //                 <div>
            //                     <IconButton
            //                         className={classes.buttonEdit}
            //                         onClick={this.editItem(index)}
            //                         aria-label="edit"
            //                     >
            //                         <EditIcon />
            //                     </IconButton>
            //                     <IconButton
            //                         className={classes.buttonDel}
            //                         onClick={this.removeItem(item?._id)}
            //                         aria-label="delete"
            //                     >
            //                         <DeleteIcon />
            //                     </IconButton>
            //                 </div>
            //             </ListItem>
            //             <Divider variant="inset" component="li" />
            //         </Fragment>
            //     ))}
            // </List>
            <Paper>
                <TableContainer>
                    <Table className={classes.table}>
                        {this?.props?.data?.length ? <TableHead className={classes.tableHeader}>
                            <TableRow>
                                <TableCell className={classes.givePointer} /* sortDirection={sortColumn ? sortOrder : false} onClick={e => this.onSort(e, 'title', '', 'title')} */>
                                    <TableSortLabel className={classes.tableSortLabel} /* active={sortColumn === 'title' ? true : false} direction={sortOrder ? sortOrder : "asc"} */>
                                        Room Name
                                </TableSortLabel>
                                </TableCell>
                                <TableCell className={classes.givePointer} /* sortDirection={sortColumn ? sortOrder : false} onClick={e => this.onSort(e, 'title', '', 'title')} */>
                                    <TableSortLabel className={classes.tableSortLabel} /* active={sortColumn === 'title' ? true : false} direction={sortOrder ? sortOrder : "asc"} */>
                                        Bed Size
                                </TableSortLabel>
                                </TableCell>
                                <TableCell className={classes.givePointer} /* onClick={e => this.onSort(e, 'status', '', 'status')}*/ >
                                    <TableSortLabel className={classes.tableSortLabel} /* active={sortColumn === 'status' ? true : false} direction={sortOrder ? sortOrder : "asc"}*/>
                                        No of Room availability
                                </TableSortLabel>
                                </TableCell>
                                <TableCell className={classes.givePointer} /* onClick={e => this.onSort(e, 'companyName', '', 'vendor')}*/>
                                    <TableSortLabel className={classes.tableSortLabel} /* active={sortColumn === 'vendor' ? true : false} direction={sortOrder ? sortOrder : "asc"}*/>
                                        Price
                                </TableSortLabel>
                                </TableCell>
                                <TableCell className={classes.givePointer} >
                                    <TableSortLabel className={classes.tableSortLabel}>
                                        Discounted Price
                                </TableSortLabel>
                                </TableCell>
                                <TableCell className={classes.givePointer} >
                                    <TableSortLabel className={classes.tableSortLabel}>
                                        Actions
                                </TableSortLabel>
                                </TableCell>


                            </TableRow>
                        </TableHead>:""}
                        <TableBody className={classes.tableHeader}>
                            {this.props.data && this.props.data.map((row, index) => (
                                <TableRow key={index} hover>
                                    <TableCell>{row?.RoomName}</TableCell>
                                    <TableCell>{row?.BedSize}</TableCell>
                                    <TableCell>{row?.NoOfRoomsAvailable}</TableCell>
                                    <TableCell>
                                        {row?.Rate}
                                    </TableCell>
                                    <TableCell>
                                        {row?.discountedRate}
                                    </TableCell>
                                    <TableCell className={classes.flexColumn}>
                                        <Tooltip title="edit" aria-label="edit">
                                            <IconButton aria-label="edit" onClick={this.editItem(index)}>
                                                <EditIcon fontSize="small" />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="delete" aria-label="delete">
                                            <IconButton onClick={this.removeItem(row?._id)} aria-label="delete">
                                                <DeleteIcon fontSize="small" />
                                            </IconButton>
                                        </Tooltip>

                                    </TableCell>

                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>
        );
    }
}

RoomList.propTypes = {
    className: PropTypes.string,
    classes: PropTypes.object.isRequired
};


export default withStyles(styles)(RoomList);