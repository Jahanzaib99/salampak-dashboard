import React, { Component } from 'react';
import PropTypes from "prop-types";
import axios from "axios";
import swal from "@sweetalert/with-react";

import log from "../../../../config/log";

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

import ImageUpload from '../../ImageUpload';

import Form from "../../middleware/Form";

import styles from "./style";

import {
    activityPhotoImage
} from "config/routes";
import { isPermission } from 'validation/Ispermission';

class TableComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            url: "",
            childUrl: "",
            tagTypesUrl: "",
            parentCategories: [],
            activities: [],
            searchString: "",
            isLoading: true,
            _objectId: "",
            formFields: [
                {
                    name: "name",
                    label: "Name",
                    type: 1
                },
                {
                    name: "alias",
                    label: "Alias",
                    type: 2
                },
                {
                    name: "longitude",
                    label: "Longitude",
                    type: 3
                },
                {
                    name: "latitude",
                    label: "Latitude",
                    type: 4
                },
                {
                    name: "desc",
                    label: "Short Description",
                    type: 8
                },
                {
                    name: "longDesc",
                    label: "Long Description",
                    type: 10
                }

            ],
            pageSize: null,
            skip: 0,
            page: 1,
            lastPage: null,
            total: 0
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
        if (this.props.url) {
            this.setState({
                url: this.props.url,
                childUrl: this.props.childUrl,
                tagTypesUrl: this.props.tagTypes,
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
        let { url, childUrl, tagTypesUrl, formFields, searchString, pageSize, skip } = this.state;
        let mainUrl = childUrl;
        mainUrl += `?pageSize=${pageSize}&skip=${skip}`;
        if (searchString.length > 2) {
            mainUrl += `&search=${searchString}`;
        }
        axios
            .get(`${url}?pageSize=0`)
            .then(resp1 => {
                log(`GET ${url}`, "info", resp1.data.data);
                axios
                    .get(mainUrl)
                    .then(resp2 => {
                        log(`GET ${mainUrl}`, "info", resp2.data.data);
                        axios
                            .get(tagTypesUrl)
                            .then(resp3 => {
                                log(`GET ${tagTypesUrl}`, "info", resp3.data.data);
                                let fields = formFields;
                                let dynamicField = {
                                    name: "category",
                                    label: "Category",
                                    type: 6,
                                    options: resp1.data.data
                                };
                                fields.push(dynamicField);
                                dynamicField = {
                                    name: "activityTypes",
                                    label: "Activity Types",
                                    type: 5,
                                    options: resp3.data.data.activityTypes
                                };
                                fields.push(dynamicField);
                                dynamicField = {
                                    name: 'isFeatured',
                                    label: "Is Featured",
                                    type: 12
                                }
                                fields.push(dynamicField);
                                this.setState({
                                    skip: resp2.data.meta.skip,
                                    total: resp2.data.meta.total,
                                    lastPage: this.getLastPage(pageSize, resp2.data.meta.total),
                                    parentCategories: resp1.data.data,
                                    activities: resp2.data.data,
                                    formFields: fields,
                                    isLoading: false
                                }, () => {
                                    log("Setting State", "success", this.state);
                                });

                            })
                    })
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
        const { childUrl } = this.state;
        let temp = {
            name: data.name,
            alias: data.alias,
            coordinates: data.coordinates[0] && data.coordinates[1] ? [+data.coordinates[0], +data.coordinates[1]] : [],
            description: data.description,
            longDescription: data.longDescription,
            parentCategories: data.parentCategories,
            activityType: data.type,
            isFeatured: data.isFeatured
        }
        data = temp
        axios
            .post(childUrl, data)
            .then(response => {
                // this.refreshTable();
                this.setState({
                    _objectId: response.data.data.data._id,
                });
                log(`POST ${childUrl}`, "info", data);
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
        let temp = {
            name: data.name,
            alias: data.alias,
            coordinates: data.coordinates[0] && data.coordinates[1] ? [+data.coordinates[0], +data.coordinates[1]] : [],
            description: data.description,
            longDescription: data.longDescription,
            parentCategories: data.parentCategories,
            activityType: data.type,
            isFeatured: data.isFeatured
        }
        data = temp
        let { childUrl } = this.state;
        let endpoint = `${childUrl}/${id}/update`;
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

    handleDelete = (id) => {
        let { childUrl } = this.state;
        let endpoint = `${childUrl}/${id}/delete`;
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
        if (this.state.activities.length > 0) {
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
                        Showing {`${skip + 1} - ${(skip + this.state.activities.length)} of ${totalCount} `}
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
        const { activities, isLoading, formFields, _objectId } = this.state;
        const { classes, userType, userPermissions } = this.props;
        // const { sortOrder, sortColumn } = this.state;
        return (
            <div className={classes.tableRoot}>

                <Paper className={classes.paperRoot}>
                    <Grid container spacing={2}>
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
                                <Grid item xs={6} sm={6} md={1}>
                                    <Form
                                        title="Activity"
                                        create={userPermissions?.activities?.post ? "activity" : ""}
                                        fields={formFields}
                                        submit={this.handleSubmit}
                                        apiUrl={activityPhotoImage}
                                        _objectId={_objectId}
                                        isTab={true}
                                        emptyObjectId={() =>
                                            this.setState({
                                                _objectId: "",
                                            })
                                        }
                                        userType={userType}
                                    />
                                </Grid>
                            </>
                        )}
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
                                            Alias
                                </TableSortLabel>
                                    </TableCell>
                                    <TableCell className={classes.givePointer} /* onClick={e => this.onSort(e, 'companyName', '', 'vendor')}*/>
                                        <TableSortLabel className={classes.tableSortLabel} /* active={sortColumn === 'vendor' ? true : false} direction={sortOrder ? sortOrder : "asc"}*/>
                                            Description
                                </TableSortLabel>
                                    </TableCell>
                                    {/* <TableCell className={classes.givePointer}> */}
                                        {/* /* <TableSortLabel className={classes.tableSortLabel}> */}
                                            {/* Activity Type */}
                                {/* </TableSortLabel> */}
                                    {/* </TableCell> */}
                                    {userPermissions?.activities?.update ? <TableCell className={classes.givePointer} >
                                        <TableSortLabel className={classes.tableSortLabel}>
                                            Actions
                                </TableSortLabel>
                                    </TableCell> : ""}
                                    <TableCell className={classes.givePointer} >
                                        <TableSortLabel className={classes.tableSortLabel}>
                                            Images
                                </TableSortLabel>
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody className={classes.tableHeader}>
                                {activities.map((row, index) => (
                                    <TableRow key={index} hover>
                                        <TableCell>{row.name}</TableCell>
                                        <TableCell>{row.alias}</TableCell>
                                        <TableCell>{row.description}</TableCell>
                                        {/* <TableCell>{row.activityType}</TableCell> */}
                                        {userPermissions?.activities?.update ? <TableCell>
                                            <Form
                                                title="Activity"
                                                edit={userPermissions?.activities?.update ? "activity" : ""}
                                                data={row}
                                                fields={formFields}
                                                update={this.handleUpdate}
                                                apiUrl={activityPhotoImage}
                                                setObjectId={() =>
                                                    this.setState({
                                                        _objectId: row._id,
                                                    })
                                                }
                                                emptyObjectId={() =>
                                                    this.setState({
                                                        _objectId: "",
                                                    })
                                                }
                                                _objectId={_objectId}
                                                isTab={true}
                                                userType={userType}
                                                delete={userPermissions?.activities?.delete ? this.handleDelete : false}
                                            />
                                        </TableCell> : ""}
                                        <TableCell>
                                            <ImageUpload
                                                objectId={row._id ? row._id : null}
                                                formType={this.state.formType}
                                                apiUrl={activityPhotoImage}
                                                isHideButton
                                                disabledUploadBtn
                                            />
                                        </TableCell>
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
