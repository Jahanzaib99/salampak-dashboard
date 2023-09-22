import React from "react";
import PropTypes from "prop-types";

import {
    Grid,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    withStyles
} from "@material-ui/core";

import { Delete, Edit } from "@material-ui/icons";

import styles from "../style";

function PackageDetails(props) {
    const { classes, data, edit, remove, dateIndex } = props;
    return (
        <Grid container>
            <Grid item xs={12} sm={12}>
                <Paper className={classes.customPaper}>
                    <Table className={classes.borderedTable}>
                        <TableHead>
                            <TableRow>
                                <TableCell>Package Name</TableCell>
                                <TableCell>Capacity</TableCell>
                                <TableCell>Price</TableCell>
                                <TableCell>Description</TableCell>
                                <TableCell>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {data.map((pkg, index) => (
                                <TableRow key={index}>
                                    <TableCell align="center" scope="row">{pkg.packageName}</TableCell>
                                    <TableCell align="center">{pkg.capacity}</TableCell>
                                    <TableCell align="center">{pkg.packagePrice}</TableCell>
                                    <TableCell style={{ whiteSpace: "pre-line" }}>
                                        {pkg.packageDesc.length > 40 ? pkg.packageDesc.slice(0, 30) + " ..." : pkg.packageDesc}
                                    </TableCell>
                                    <TableCell>
                                        <span onClick={edit(index, dateIndex)}>
                                            <Edit style={{ color: "#3a85ef", cursor: "pointer" }} />
                                        </span>{' '}
                                        <span onClick={remove(index, dateIndex)}>
                                            <Delete style={{ color: "#DD4A41", cursor: "pointer" }} />
                                        </span>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Paper>
            </Grid>
        </Grid >
    )
}

PackageDetails.propTypes = {
    classes: PropTypes.object,
    data: PropTypes.array.isRequired,
    edit: PropTypes.func.isRequired,
    remove: PropTypes.func.isRequired
}


export default withStyles(styles)(PackageDetails);