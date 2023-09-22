import React, { Component } from 'react';
import PropTypes from "prop-types";
import axios from "axios";
import swal from "@sweetalert/with-react";

import log from "../../../../config/log";

import {
    ButtonGroup,
    CircularProgress,
    Grid,
    IconButton,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    TableSortLabel,
    TextField,
    withStyles,
    Paper
} from "@material-ui/core";

import {
    FirstPage as FirstPageIcon,
    KeyboardArrowLeft,
    KeyboardArrowRight,
    LastPage as LastPageIcon,
} from '@material-ui/icons';

import Form from "../../middleware/Form";

import styles from "./style";

const formFields = [
    {
        name: "name",
        label: "Name",
        type: 1
    },
    {
        name: "alias",
        label: "Alias",
        type: 2
    }
];


class TableComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            url: "",
            locations: [],
            searchString: "",
            isLoading: true,
        };
        this.populateTable = this.populateTable.bind(this);
        this.renderPagination = this.renderPagination.bind(this);
        this.onClickFirstBtn = this.onClickFirstBtn.bind(this);
        this.onClickLastBtn = this.onClickLastBtn.bind(this);
        this.onClickPrevBtn = this.onClickPrevBtn.bind(this);
        this.onClickNextBtn = this.onClickNextBtn.bind(this);
        this.getLastRowCount = this.getLastRowCount.bind(this);
        this.getLastPage = this.getLastPage.bind(this);
    }

    componentDidMount() {
        if (this.props.url) {
            this.setState({
                url: this.props.url,
            }, () => {
                this.populateTable();
            });
        }
    }

    refreshTable = () => {
        this.setState({
            isLoading: true,
        }, () => this.populateTable());
    }

    populateTable = () => {
        const { url, searchString } = this.state;
        let mainUrl = url;
        if (searchString.length > 2) {
            mainUrl += `?search=${searchString}`;
        }
        else if (searchString.length === 0) {
            mainUrl = url ;
        }
        axios
            .get(mainUrl)
            .then(response => {
                log(`GET ${url}`, "info", response.data.data);
                this.setState({
                    locations: response.data.data,
                    isLoading: false
                }, () => {
                    log("Setting State", "success", this.state);
                });
            })
            .catch(error => {
                log("Error ===>", "error", error?.response?.data);
                swal(error?.response?.data.error?.message?error?.response?.data.error?.message:"Something wrong", {
                    icon: "error",
                    showCloseButton: true,
                });
            });
    }

    onSearch = (event) => {
        const { searchString } = this.state;
        log("Search Requested", "info", searchString);
        this.setState({
            searchString: event.target.value,
        }, () => {
            if (searchString.length > 2) {
                this.setState({
                    isLoading: true
                }, () => {
                    this.populateTable();
                })
            }
            else if (searchString.length === 0) {
                this.setState({
                    isLoading: true
                }, () => this.populateTable());
            }
        })
    }

    onClickFirstBtn = () => {
        let rowsPerPage = +this.props.rowsPerPage;
        this.setState({
            skip: 0,
            isLoading: true
        }, () => {
            this.populateTable(rowsPerPage);
        })
    }

    onClickNextBtn = () => {
        let rowsPerPage = +this.props.rowsPerPage;
        let toSkip = +this.state.skip;
        toSkip = toSkip + rowsPerPage;
        let currentCount = this.state.initialCount;
        currentCount = currentCount + rowsPerPage;
        this.setState({
            skip: +toSkip,
            initialCount: currentCount,
            isLoading: true
        }, () => {
            this.populateTable(rowsPerPage);
        })
    }

    onClickPrevBtn = () => {
        let rowsPerPage = +this.props.rowsPerPage;
        let toSkip = +this.state.skip;
        toSkip = toSkip - rowsPerPage;
        let currentCount = this.state.initialCount;
        currentCount = currentCount - rowsPerPage;
        this.setState({
            skip: +toSkip,
            initialCount: currentCount,
            isLoading: true
        }, () => {
            this.populateTable(rowsPerPage);
        })
    }

    onClickLastBtn = () => {
        this.setState({
            skip: this.state.lastPage,
            isLoading: true
        }, () => {
            this.populateTable(this.props.rowsPerPage);
        })
    }

    getLastPage = (rowsPerPage, totalCountOfRows) => {
        let skip = parseInt(totalCountOfRows / rowsPerPage);
        return skip * rowsPerPage;
    }

    getLastRowCount = (c, l, t) => {
        if (c !== l) {
            return ((c - 1) * +this.props.rowsPerPage) + +this.props.rowsPerPage;
        }
        else {
            return t;
        }
    }

    renderPagination = () => {
        let currentPage, lastPage, totalCount, skip, rowsPerPage;
        rowsPerPage = +this.props.rowsPerPage;
        skip = +this.state.skip;
        if (this.state.data.length > 0) {
            currentPage = skip / rowsPerPage + 1;
            totalCount = +this.state.total;
            lastPage = parseInt(totalCount / rowsPerPage) + 1;
        }
        let firstBtn, nextBtn, prevBtn, lastBtn;
        if (skip === 0) {
            firstBtn = true;
            prevBtn = true;
        }
        if (totalCount < rowsPerPage) {
            nextBtn = true;
            lastBtn = true;
        }
        else if (lastPage === currentPage) {
            nextBtn = true;
            lastBtn = true;
        }
        return (
            <Grid
                container
                direction="column"
                justify="center"
                alignItems="center"
                style={{ margin: 20 }}>
                <Grid item>
                    <small>
                        Page {`${(currentPage)} of ${lastPage}`}
                    </small>
                </Grid>
                <Grid item>
                    <ButtonGroup size="small">
                        <IconButton style={{ margin: 5 }} onClick={this.onClickFirstBtn} disabled={firstBtn}><FirstPageIcon /></IconButton>
                        <IconButton style={{ margin: 5 }} onClick={this.onClickPrevBtn} disabled={prevBtn}><KeyboardArrowLeft /></IconButton>
                        <IconButton style={{ margin: 5 }} onClick={this.onClickNextBtn} disabled={nextBtn}><KeyboardArrowRight /></IconButton>
                        <IconButton style={{ margin: 5 }} onClick={this.onClickLastBtn} disabled={lastBtn}><LastPageIcon /></IconButton>
                    </ButtonGroup>
                </Grid>
            </Grid>
        )
    }

    handleSubmit = (data) => {
        const { url } = this.state;
        axios
            .post(url, data)
            .then(response => {
                this.refreshTable();
                log(`POST ${url}`, "info", data);
                swal(response.data.data.message, {
                    icon: "success"
                });
            })
            .catch(error => {
                log("Error ===>", "error", error?.response?.data);
                swal(error?.response?.data.error?.message?error?.response?.data.error?.message:"Something wrong", {
                    icon: "error"
                });
            });
    }

    handleUpdate = (data, id) => {
        let { url } = this.state;
        let endpoint = `${url}/${id}/update`;
        axios
            .put(endpoint, data)
            .then(response => {
                this.refreshTable();
                log(`PUT ${endpoint}`, "info", data);
                swal(response.data.data.message, {
                    icon: "success"
                });
            })
            .catch(error => {
                log("Error ===>", "error", error?.response?.data);
                swal(error?.response?.data.error?.message?error?.response?.data.error?.message:"Something wrong", {
                    icon: "error"
                });
            });
    }

    handleDelete = (id) => {
        let { url } = this.state;
        let endpoint = `${url}/${id}/delete`;
        swal({
            title: "Are you sure?",
            text: "Once deleted, you will not be able to recover this record!",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        }).then(willDelete => {
            if (willDelete) {
                log("Delete Initiated...", "info", willDelete);
                axios
                    .delete(endpoint)
                    .then(response => {
                        log(`DELETE ${endpoint}`, "info", "deleted ...");
                        this.refreshTable();
                        swal(response.data.data.message, {
                            icon: "success"
                        });
                    })
                    .catch(error => {
                        log("Error ===>", "error", error?.response?.data);
                        swal(error?.response?.data.error?.message?error?.response?.data.error?.message:"Something wrong", {
                            icon: "error"
                        });
                    });
            }
            else {
                log(`Info`, "info", "Cancelled delete operation");
                swal("You have cancelled the delete operation", {
                    icon: "info"
                });
            }
        });
    }

    render() {
        const { locations, isLoading } = this.state;
        const { classes } = this.props;
        // const { sortOrder, sortColumn } = this.state;
        return (
            <div className={classes.tableRoot}>
                <Paper className={classes.paperRoot}>
                    <Grid container direction="row" spacing={2}>
                        <Grid item xs={12} sm={12} md={isLoading ? 8 : 12}>
                            <TextField
                                label="Search"
                                className={classes.textfield}
                                variant="outlined"
                                margin="dense"
                                InputLabelProps={{
                                    shrink: true
                                }}
                                onChange={this.onSearch}
                            />
                        </Grid>
                        {isLoading && (
                            <Grid item xs={12} sm={12} md={4}>
                                <CircularProgress size={34} />
                            </Grid>
                        )}
                        {!isLoading && (
                            <>
                                <Grid item xs={12} sm={12} md={3}>
                                    <Form
                                        title="Starting Location"
                                        create="starting location"
                                        fields={formFields}
                                        submit={this.handleSubmit}
                                    />
                                </Grid>
                            </>
                        )}
                    </Grid>
                </Paper>
                <Table className={classes.table}>
                    <TableHead className={classes.tableHeader}>
                        <TableRow>
                            <TableCell className={classes.givePointer} /* sortDirection={sortColumn ? sortOrder : false} onClick={e => this.onSort(e, 'title', '', 'title')} */>
                                <TableSortLabel className={classes.tableSortLabel} /* active={sortColumn === 'title' ? true : false} direction={sortOrder ? sortOrder : "asc"} */>
                                    Name
                                </TableSortLabel>
                            </TableCell>
                            <TableCell className={classes.givePointer} /* onClick={e => this.onSort(e, 'status', '', 'status')}*/ >
                                <TableSortLabel className={classes.tableSortLabel} /* active={sortColumn === 'status' ? true : false} direction={sortOrder ? sortOrder : "asc"}*/>
                                    Alias
                                </TableSortLabel>
                            </TableCell>
                            <TableCell className={classes.givePointer} >
                                <TableSortLabel className={classes.tableSortLabel}>
                                    Actions
                                </TableSortLabel>
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody className={classes.tableHeader}>
                        {locations.map((row, index) => (
                            <TableRow key={index} hover>
                                <TableCell>{row.name}</TableCell>
                                <TableCell>{row.alias}</TableCell>
                                <TableCell>
                                    <Form
                                        title="Starting Location"
                                        edit="starting location"
                                        fields={formFields}
                                        data={row}
                                        update={this.handleUpdate}
                                        delete={this.handleDelete}
                                    />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div >
        );
    }

}

TableComponent.propTypes = {
    className: PropTypes.string,
    classes: PropTypes.object.isRequired,
}

export default withStyles(styles)(TableComponent);
