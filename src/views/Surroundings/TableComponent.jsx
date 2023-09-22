import React, { Component } from 'react';
import PropTypes from "prop-types";
import axios from "axios";
import swal from "@sweetalert/with-react";

import log from "../../config/log";

import {
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
    Typography
} from "@material-ui/core";

import {
    FirstPage as FirstPageIcon,
    KeyboardArrowLeft,
    KeyboardArrowRight,
    LastPage as LastPageIcon,
} from '@material-ui/icons';

import Form from "./middleware/Form";

import styles from "./style";
import { isPermission } from 'validation/Ispermission';

class TableComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            surroundingsUrl: "",
            searchString: "",
            surroundings: [],
            isLoading: true,
            formFields: [
                {
                    name: "name",
                    label: "Name",
                    type: 1,
                },
                {
                    name: "iconName",
                    label: "Icon Name",
                    type: 2,
                },
                {
                    name: "typeKey",
                    label: "Type Key",
                    type: 3,
                }
            ],
            pageSize: null,
            skip: 0,
            page: 1,
            lastPage: null,
            total: 0,
        };
        this.populateTable = this.populateTable.bind(this);
        this.renderPagination = this.renderPagination.bind(this);
        this.onClickFirstBtn = this.onClickFirstBtn.bind(this);
        this.onClickLastBtn = this.onClickLastBtn.bind(this);
        this.onClickPrevBtn = this.onClickPrevBtn.bind(this);
        this.onClickNextBtn = this.onClickNextBtn.bind(this);
        this.getLastPage = this.getLastPage.bind(this);

    }

    componentDidMount() {
        if (this.props) {
            this.setState({
                surroundingsUrl: this.props.surroundingsUrl,
                pageSize: this.props.rowsPerPage,
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
        const { surroundingsUrl, formFields, searchString, pageSize, skip } = this.state;
        let mainUrl = surroundingsUrl
        mainUrl += `?pageSize=${pageSize}&skip=${skip}`;
        if (searchString.length > 2) {
            mainUrl += `&name=${searchString}`
        }
        axios
            .get(mainUrl)
            .then(resp1 => {
                log(`GET ${mainUrl}`, "info", resp1.data);
                this.setState({
                    skip: resp1.data.meta.skip,
                    total: resp1.data.meta.total,
                    lastPage: this.getLastPage(pageSize, resp1.data.meta.total),
                    surroundings: resp1.data.data,
                    isLoading: false
                }, () => {
                    log("Setting State", "success", this.state);
                });
            })
            .catch(error => {
                log("Error ===>", "error", error?.response?.data);
                swal(error?.response?.data.error?.message ? error?.response?.data.error?.message : "Something wrong", {
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

    handleSubmit = (data) => {
        const { surroundingsUrl } = this.state;
        let temp = {
            name: data.name,
            iconName: data.iconName,
            typeKey: data.typeKey
        }
        data = temp
        axios
            .post(surroundingsUrl, data)
            .then(response => {
                this.refreshTable();
                log(`POST ${surroundingsUrl}`, "info", data);
                swal(response.data.data.message, {
                    icon: "success"
                });
            })
            .catch(error => {
                log("Error ===>", "error", error?.response?.data);
                swal(error?.response?.data.error?.message ? error?.response?.data.error?.message : "Something wrong", {
                    icon: "error"
                });
            });
    }

    handleUpdate = (data, id) => {
        let { surroundingsUrl } = this.state;
        let endpoint = `${surroundingsUrl}/${id}/update`;
        let temp = {
            name: data.name,
            iconName: data.iconName,
            typeKey: data.typeKey
        }
        data = temp
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
                swal(error?.response?.data.error?.message ? error?.response?.data.error?.message : "Something wrong", {
                    icon: "error"
                });
            });
    }

    handleRecount = () => {
        const { url } = this.state;
        axios
            .get(`${url}/recount`)
            .then(response => {
                log(`GET ${url}/recount`, "info", response.data.data);
                this.refreshTable();
                swal("Trip recount done", {
                    icon: "success"
                });
            })
            .catch(error => {
                log("Error ===>", "error", error?.response?.data);
                swal(error?.response?.data.error?.message ? error?.response?.data.error?.message : "Something wrong", {
                    icon: "error"
                });
            })
    }

    handleDelete = (id) => {
        let { surroundingsUrl } = this.state;
        let endpoint = `${surroundingsUrl}/${id}/delete`;
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
                        swal(error?.response?.data.error?.message ? error?.response?.data.error?.message : "Something wrong", {
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

    renderPagination = () => {
        let currentPage, lastPage, totalCount, skip, rowsPerPage;
        if (this.state.surroundings.length > 0) {
            rowsPerPage = this.state.pageSize;
            skip = this.state.skip;
            currentPage = this.state.page
            totalCount = +this.state.total;
            lastPage = Math.ceil(totalCount / rowsPerPage);
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
                style={{ margin: '20px', width: 'auto' }}>
                <Grid item style={{ marginBottom: '15px' }}>
                    <Typography variant="caption" gutterBottom>
                        Showing {`${skip + 1} - ${(skip + this.state.surroundings.length)} of ${totalCount} `}
                    </Typography>
                    <ButtonGroup size="small" style={{ verticalAlign: 'middle' }}>
                        <IconButton style={{ margin: 5 }} onClick={this.onClickFirstBtn} disabled={firstBtn}><FirstPageIcon /></IconButton>
                        <IconButton style={{ margin: 5 }} onClick={this.onClickPrevBtn} disabled={prevBtn}><KeyboardArrowLeft /></IconButton>
                        <IconButton style={{ margin: 5 }} onClick={this.onClickNextBtn} disabled={nextBtn}><KeyboardArrowRight /></IconButton>
                        <IconButton style={{ margin: 5 }} onClick={this.onClickLastBtn} disabled={lastBtn}><LastPageIcon /></IconButton>
                    </ButtonGroup>
                    <Typography variant="caption" display="inline" gutterBottom>
                        Page {`${(currentPage)} of ${lastPage}`}
                    </Typography>
                </Grid>
            </Grid >
        )
    }

    onClickFirstBtn = () => {
        let rowsPerPage = +this.props.rowsPerPage;
        this.setState({
            skip: 0,
            page: 1,
            isLoading: true
        }, () => {
            this.populateTable(rowsPerPage);
        })
    }

    onClickNextBtn = () => {
        let rowsPerPage = +this.props.rowsPerPage;
        let currentPage = +this.state.page;
        currentPage = currentPage + 1;
        this.setState({
            page: currentPage, skip: this.state.skip + this.state.pageSize, isLoading: true
        }, () => {
            this.populateTable(rowsPerPage);
        })
    }

    onClickPrevBtn = () => {
        let rowsPerPage = +this.props.rowsPerPage;
        let currentPage = +this.state.page;
        currentPage = currentPage - 1;
        this.setState({
            page: currentPage, skip: this.state.skip - this.state.pageSize, isLoading: true
        }, () => {
            this.populateTable(rowsPerPage);
        })
    }

    onClickLastBtn = () => {
        this.setState({
            page: this.state.lastPage, skip: (this.state.lastPage - 1) * this.state.pageSize
        }, () => {
            this.populateTable(this.props.rowsPerPage);
        })
    }

    getLastPage = (rowsPerPage, totalCountOfRows) => {
        return Math.ceil(totalCountOfRows / rowsPerPage)
    }

    render() {
        const { surroundings, isLoading, formFields } = this.state;
        const { classes, userType, userPermissions } = this.props;
        return (
            <div className={classes.tableRoot}>
                <Paper className={classes.paperRoot}>
                    <Grid container direction="row" spacing={2}>

                        <Grid item xs={6} sm={6} md={6}>
                            {!isLoading && userPermissions?.surroundings?.post && (
                                <>
                                    <Form
                                        title="Surrounding"
                                        create="surrounding"
                                        fields={formFields}
                                        submit={this.handleSubmit}
                                    />
                                </>
                            )}
                        </Grid>
                        <Grid item xs={12} sm={12} md={4}>
                            {isLoading && (
                                <CircularProgress size={34} />
                            )}
                        </Grid>
                    </Grid>
                </Paper>
                <Paper>
                    <TableContainer>
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
                                            Icon Name
                                </TableSortLabel>
                                    </TableCell>
                                    <TableCell className={classes.givePointer} /* onClick={e => this.onSort(e, 'companyName', '', 'vendor')}*/>
                                        <TableSortLabel className={classes.tableSortLabel} /* active={sortColumn === 'vendor' ? true : false} direction={sortOrder ? sortOrder : "asc"}*/>
                                            Type Key
                                </TableSortLabel>
                                    </TableCell>
                                    {userPermissions?.surroundings?.update || userPermissions?.surroundings?.delete ? <TableCell className={classes.givePointer} >
                                        <TableSortLabel className={classes.tableSortLabel}>
                                            Actions
                                </TableSortLabel>
                                    </TableCell> : ""}
                                </TableRow>
                            </TableHead>
                            <TableBody className={classes.tableHeader}>
                                {surroundings.map((row, index) => (
                                    <TableRow key={index} hover>
                                        <TableCell>{row.name}</TableCell>
                                        <TableCell>{row.iconName}</TableCell>
                                        <TableCell>{row.typeKey}</TableCell>
                                        {userPermissions?.surroundings?.update || userPermissions?.surroundings?.delete ? <TableCell>
                                            <Form
                                                key={index}
                                                title="Surrounding"
                                                edit="surrounding"
                                                data={row}
                                                fields={formFields}
                                                update={userPermissions?.surroundings?.update ? this.handleUpdate : false}
                                                delete={userPermissions?.surroundings?.delete ? this.handleDelete : false}
                                            />
                                        </TableCell> : ""}
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    {this.renderPagination()}
                </Paper>
            </div >
        );
    }

}

TableComponent.propTypes = {
    className: PropTypes.string,
    classes: PropTypes.object.isRequired,
}

export default withStyles(styles)(TableComponent);
