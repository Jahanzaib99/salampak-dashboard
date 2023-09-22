// Node Modules Import
import React, { Component } from 'react';
import PropTypes from "prop-types";
import axios from "axios";
import tableUtil from "./../utils/findmytable";
import moment from "moment";
import { Link } from "react-router-dom";
import Swal from "@sweetalert/with-react";
import { startCase } from "lodash";

import {
    CircularProgress,
    Fab,
    Grid,
    MenuItem,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    TableSortLabel,
    TextField,
    withStyles,
    Tooltip,
    IconButton,
} from "@material-ui/core";

import {
    EditOutlined as EditIcon,
    DeleteOutline as DeleteIcon
} from '@material-ui/icons';

// Custom Components Import
import Pagination from "./templates/Pagination";

// Configuration Improrts
import environment from "../config/config";
import { bookingStatus } from "../config/trip";
import log from "../config/log";
import styles from "./style";

class TableComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            url: "",
            data: [],
            pagination: {
                page: 1,
                total: 0,
                pageSize: null,
                lastPage: null,
                initialCount: 0,
                skip: 0,
            },
            sort: {
                active: true,
                key: "",
                order: "",
                column: ""
            },
            search: {
                isActive: false,
                param: null,
                text: ""
            },
            recount: {
                active: false,
                url: ""
            },
            finalData: [],
            headerKey: [],
            headerArray: [],
            filterArray: [],
            isLoading: true
        };
    }

    componentDidMount() {
        const { url, search, searchParam,
            pageSize, headerArray, sort, recount } = this.props;
        if (url) {
            this.setState({
                url: url,
                pagination: {
                    ...this.state.pagination,
                    pageSize,
                },
                search: {
                    ...this.state.search,
                    isActive: search !== null && search,
                    param: searchParam ? searchParam : "search"
                },
                headerArray: headerArray,
                sort: {
                    ...this.state.sort,
                    active: sort
                },
                recount: {
                    active: recount && recount.length > 0 ? true : false,
                    url: recount && recount
                }
            }, () => {
                this.populateTable();
            });
        }
    }

    populateTable = () => {
        let { url, search } = this.state;
        let { pageSize, status, params } = this.props;
        let { skip } = this.state.pagination;
        url += `?pageSize=${pageSize}&skip=${skip}`;
        if (params && params.length > 0) {
            url += params;
        }
        if (search.isActive && search.text.length > 2) {
            url += `&${search.param}=${search.text}`;
        }
        if (status && status.length > 0) {
            url += `&status=${JSON.stringify(status)}`;
        }
        axios
            .get(url)
            .then(response => {
                let resp = response.data;
                // Reference 1
                const { headerArray } = this.state;

                // Reference 2
                let filterArray = {
                    name: "request-extract",
                    type: "extract",
                    dateColumnsArray: ["id", "name"],
                    api: "fma.pk/api/bok/.php",
                    fromDate: "19-12-2020"
                },
                    tempData = resp.data,
                    dataFlatArray = [];

                Object.keys(tempData).forEach(element => {
                    dataFlatArray.push(tableUtil.flatten(tempData[element]));
                });

                if (dataFlatArray[0] === undefined) {
                    return Swal("No data found", {
                        icon: "error"
                    });
                }
                // get array of keys
                let allKeyArray = Object.keys(dataFlatArray[0]),
                    necessaryKeyArray = headerArray,
                    necessaryKeyArrayMetadata = [];

                necessaryKeyArray.forEach((row, index) => {
                    let tempObj = { [row.key]: headerArray[index] };
                    necessaryKeyArrayMetadata.push(tempObj);
                });

                let intersection = necessaryKeyArray.filter(x => allKeyArray.includes(x.key))
                    .map(each => each.key),
                    difference = allKeyArray.filter(x => !intersection.includes(x));

                // assign the results to a new variable
                let semiFinalResult = tableUtil.removeProperties(dataFlatArray, difference);

                // set that react state
                this.setState({
                    data: resp.data,
                    pagination: {
                        ...this.state.pagination,
                        total: resp.meta
                            && this.state.pagination.pageSize !== 0 ? resp.meta.total : 0
                    },
                    isLoading: false,
                    finalData: semiFinalResult,
                    headerKey: headerArray,
                    headerArray: headerArray,
                    filterArray: filterArray
                });
            });
    }

    onSort = (sortKey, parentKey, columnToSort) => {
        log("Sort Requested", "info", "");
        const { order } = this.state.sort;
        if (order === "") {
            this.setState({
                sort: {
                    ...this.state.sort,
                    order: "asc",
                    column: columnToSort
                }
            }, () => {
                if (sortKey && parentKey === "") {
                    this.setState({
                        sort: {
                            ...this.state.sort,
                            key: sortKey,
                        },
                        isLoading: true
                    }, () => {
                        this.populateTable();
                    });
                }
                else if (parentKey) {
                    this.setState({
                        sort: {
                            ...this.state.sort,
                            key: `${parentKey}.${sortKey}`
                        },
                        isLoading: true
                    }, () => {
                        this.populateTable();
                    });
                }
            });
        }
        else if (order === "asc") {
            this.setState({
                sort: {
                    ...this.state.sort,
                    order: "desc",
                    column: columnToSort
                }
            }, () => {
                if (sortKey && parentKey === "") {
                    this.setState({
                        sort: {
                            ...this.state.sort,
                            key: `-${sortKey}`
                        },
                        isLoading: true
                    }, () => {
                        this.populateTable();
                    });
                }
                else if (parentKey) {
                    this.setState({
                        sort: {
                            ...this.state.sort,
                            key: `-${parentKey}.${sortKey}`
                        },
                        isLoading: true
                    }, () => {
                        this.populateTable();
                    });
                }
            });
        }
        else if (order === "desc") {
            this.setState({
                sort: {
                    ...this.state.sort,
                    order: "asc",
                    column: columnToSort
                }
            }, () => {
                if (sortKey && parentKey === "") {
                    this.setState({
                        sort: {
                            ...this.state.sort,
                            key: sortKey,
                        },
                        isLoading: true
                    }, () => {
                        this.populateTable();
                    });
                }
                else if (parentKey) {
                    this.setState({
                        sort: {
                            ...this.state.sort,
                            key: `${parentKey}.${sortKey}`
                        },
                        isLoading: true
                    }, () => {
                        this.populateTable();
                    });
                }
            });
        }
        else {
            this.setState({
                sort: {
                    ...this.state.sort,
                    key: ""
                },
                isLoading: true
            }, () => {
                this.populateTable();
            });
        }
    }

    onSearch = (e) => {
        this.setState({
            search: {
                ...this.state.search,
                text: e.target.value
            },
            isLoading: true
        }, () => this.populateTable());
    }

    handleDelete = (route) => {
        Swal({
            title: "Are you sure?",
            text: "Once deleted, you will not be able to recover this record!",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        }).then(willDelete => {
            if (willDelete) {
                axios
                    .delete(route)
                    .then(response => {
                        Swal(response.data.data.message, {
                            icon: "success"
                        });
                        this.populateTable();
                    })
                    .catch(error => {
                        Swal(error?.response?.data.error?.message?error?.response?.data.error?.message:"Something wrong", {
                            icon: "error"
                        });
                    });
            }
            else {
                Swal("Item has not been deleted!", {
                    icon: "info"
                });
            }
        });
    }

    handleStatusChange = (id, data) => {
        const { url } = this.state;
        let requestURL = `${url}/${id}/status`;
        let payload = {
            status: data.target.value
        };
        axios
            .put(requestURL, payload)
            .then(response => {
                log(`PUT ${requestURL}`, "info", response.data.data);
                this.populateTable();
                Swal("Status Updated", {
                    icon: "success"
                });
            })
            .catch(error => {
                log("Error ===>", "error", error?.response?.data);
                Swal(error?.response?.data.error?.message?error?.response?.data.error?.message:"Something wrong", {
                    icon: "error"
                });
            })
    }

    handlePagination = (state) => {
        this.setState({
            pagination: {
                ...state
            },
            isLoading: true
        }, () => this.populateTable());
    }

    handleRecount = () => {
        const { recount } = this.state;
        axios
            .get(recount.url)
            .then(response => {
                log(`GET ${recount.url}`, "info", response.data.data);
                this.populateTable();
                Swal("Trip recount done", {
                    icon: "success"
                });
            })
            .catch(error => {
                log("Error ===>", "error", error?.response?.data);
                Swal(error?.response?.data.error?.message?error?.response?.data.error?.message:"Something wrong", {
                    icon: "error"
                });
            })
    }

    render() {
        const { classes } = this.props;
        const { column, order, active } = this.state.sort;
        const { isActive, text } = this.state.search;
        const { isLoading, finalData, headerArray, headerKey, recount } = this.state;
        /**
         * Header key after modifying and transforming
        */
        // const filterArray = this.state.filterArray;
        return (
            <div className={classes.tableRoot}>
                <Paper className={classes.paperRoot}>
                    <Grid container spacing={2}>
                        {isActive && (
                            <Grid item xs={12} sm={12} md={6}>
                                <TextField
                                    label="Search"
                                    className={classes.textfield}
                                    variant="outlined"
                                    margin="dense"
                                    InputLabelProps={{
                                        shrink: true
                                    }}
                                    value={text}
                                    onChange={this.onSearch}
                                />
                            </Grid>
                        )}
                        <Grid item xs={4} sm={4} md={2}>
                            {isLoading && <CircularProgress style={{ marginTop: 10 }} size={30} />}
                        </Grid>
                        {recount.active && (
                            <Grid item xs={6} sm={6} md={3}>
                                <Fab
                                    variant="extended"
                                    className={classes.recountButton}
                                    onClick={this.handleRecount}>
                                    Refresh Count
                                </Fab>
                            </Grid>
                        )}
                    </Grid>
                </Paper>
                <Table className={classes.table}>
                    <TableHead className={classes.tableHeader}>
                        <TableRow>
                            {headerArray && headerArray.map((row, index) => (
                                <React.Fragment key={index}>
                                    {row.isVisible && (
                                        <TableCell
                                            className={classes.givePointer}
                                            sortDirection={active && column ? order : false}
                                            onClick={active ? e => this.onSort(e, row.sortKey, row.parentKey, row.key) : null}>
                                            <TableSortLabel
                                                active={active && column === row.sortKey}
                                                direction={active && order ? order : "asc"}>
                                                {row.label}
                                            </TableSortLabel>
                                        </TableCell>
                                    )}
                                </React.Fragment>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody className={classes.tableHeader}>
                        {finalData && finalData.map((headerKeyRow, headerKeyIndex) => (
                            <TableRow key={headerKeyIndex} hover>
                                {headerKey.map((row, index) => (
                                    <React.Fragment key={index}>
                                        {row.isVisible && (
                                            <TableCell>
                                                {row.key === "action"
                                                    ? row.actions.map((action, actionIndex) => (
                                                        <Tooltip key={actionIndex} title={action.label}>
                                                            <IconButton>
                                                                {action.type === "edit" && (
                                                                    <Link
                                                                        target="__blank"
                                                                        to={process.env.NODE_ENV === "development"
                                                                            ? `/${action.actionRoute}/${headerKeyRow["_id"]}`
                                                                            : `${environment.production.prefix}/${action.actionRoute}/${headerKeyRow["_id"]}`}>
                                                                        <EditIcon fontSize="small" /></Link>
                                                                )}
                                                                {action.type === "delete" && (
                                                                    <DeleteIcon fontSize="small" onClick={() =>
                                                                        this.handleDelete(`${action.route}/${headerKeyRow["_id"]}/delete`)}
                                                                    />
                                                                )}
                                                            </IconButton>
                                                        </Tooltip>
                                                    ))
                                                    : null}
                                                {row.type === "text" && (headerKeyRow[row.key]
                                                    ? headerKeyRow[row.key] + ""
                                                    : "N/A")}
                                                {row.type === "status" && (headerKeyRow[row.key]
                                                    ? startCase(headerKeyRow[row.key]) + ""
                                                    : "N/A")}
                                                {row.type === "boolean" && headerKeyRow[row.key] + ""}
                                                {row.type === "date" && moment(headerKeyRow[row.key]).format("DD-MM-YYYY")}
                                                {row.type === "array" && (headerKeyRow[row.key]
                                                    ? headerKeyRow[row.key].join(", ") + ""
                                                    : "N/A")}
                                                {row.type === "select" && (headerKeyRow[row.key]
                                                    ? <TextField
                                                        className={classes.textfield}
                                                        variant="outlined"
                                                        margin="dense"
                                                        value={headerKeyRow[row.key] + ""}
                                                        select
                                                        onChange={(e) => this.handleStatusChange(headerKeyRow["_id"], e)}
                                                    >
                                                        {bookingStatus.map((opt, indexMenu) => (
                                                            <MenuItem key={indexMenu} value={opt.value}>
                                                                {opt.label}
                                                            </MenuItem>
                                                        ))}
                                                    </TextField>
                                                    : "N/A")}
                                            </TableCell>
                                        )}
                                    </React.Fragment>
                                ))}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                {this.state.pagination.total !== 0 && (
                    <Pagination
                        data={this.state.data.length}
                        query={this.state.pagination}
                        handlePagination={this.handlePagination}
                    />
                )}
            </div>
        );
    }

}

TableComponent.propTypes = {
    className: PropTypes.string,
    classes: PropTypes.object.isRequired,
}

export default withStyles(styles)(TableComponent);