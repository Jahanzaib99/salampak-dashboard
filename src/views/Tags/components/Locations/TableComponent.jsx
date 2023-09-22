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
    Typography,
    RadioGroup,
    Radio,
    FormControlLabel
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
    locationPhotoImage
} from "config/routes";
import { isPermission } from 'validation/Ispermission';

class TableComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            url: "",
            activityUrl: "",
            categoryUrl: "",
            tagTypesUrl: "",
            surroundingsUrl: "",
            searchString: "",
            parentCategories: [],
            parentActivities: [],
            locations: [],
            easyLocations: [],
            surroundings: [],
            isLoading: true,
            _objectId: "",
            destinationType: 'detail',
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
                    name: "weatherId",
                    label: "Weather Id",
                    type: 11
                },
                {
                    name: "desc",
                    label: "Short Description",
                    type: 8
                },
                {
                    name: "longDescription",
                    label: "Long Description",
                    type: 28
                }
            ],
            easyDestinationformFields: [
                {
                    name: "name",
                    label: "Name",
                    type: 1
                },
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
                categoryUrl: this.props.categoryUrl,
                activityUrl: this.props.activityUrl,
                surroundingsUrl: this.props.surroundingsUrl,
                tagTypesUrl: this.props.tagTypes,
                pageSize: this.props.rowsPerPage,
                easyAddUrl: this.props.easyAddUrl,

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
        const { url,
            activityUrl,
            tagTypesUrl,
            surroundingsUrl,
            categoryUrl,
            formFields,
            searchString,
            pageSize,
            skip,
            easyDestinationformFields } = this.state;
        let mainUrl = url;
        let provinceUrl = url;
        mainUrl += `?pageSize=${pageSize}&skip=${skip}`;
        if (searchString.length > 1) {
            mainUrl += `&search=${searchString}`
        }
        axios
            .get(mainUrl)
            .then(resp1 => {
                log(`GET ${mainUrl}`, "info", resp1.data.data);
                axios
                    .get(categoryUrl + '?pageSize=0')
                    .then(resp2 => {
                        log(`GET ${categoryUrl}`, "info", resp2.data.data);
                        axios
                            .get(activityUrl + "?pageSize=0")
                            .then(resp3 => {
                                log(`GET ${activityUrl}`, "info", resp3.data.data);
                                axios
                                    .get(tagTypesUrl)
                                    .then(resp4 => {
                                        log(`GET ${tagTypesUrl}`, "info", resp4.data.data);
                                        axios
                                            .get(provinceUrl += `?pageSize=0&skip=0&locationType=province`)
                                            .then(resp5 => {
                                                log(`GET ${url}?locationType=province`, "info", resp5.data.data);
                                                axios
                                                    .get(surroundingsUrl + '?pageSize=0')
                                                    .then(resp6 => {
                                                        log(`GET ${surroundingsUrl}`, "info", resp4.data.data);
                                                        let fields = formFields;
                                                        let easyDesticationfields = easyDestinationformFields;

                                                        let dynamicField = {
                                                            name: "locationTypes",
                                                            label: "Destination Types",
                                                            type: 5,
                                                            options: resp4.data.data.locationTypes
                                                        };
                                                        fields.push(dynamicField);
                                                        easyDesticationfields.push(dynamicField)

                                                        dynamicField = {
                                                            name: "category",
                                                            label: "Category",
                                                            type: 6,
                                                            options: resp2.data.data
                                                        };
                                                        fields.push(dynamicField);
                                                        dynamicField = {
                                                            name: "activity",
                                                            label: "What To do",
                                                            type: 7,
                                                            options: resp3.data.data
                                                        };
                                                        fields.push(dynamicField);
                                                        dynamicField = {
                                                            name: "parentProvince",
                                                            label: "Province",
                                                            type: 9,
                                                            options: resp5.data.data
                                                        };
                                                        fields.push(dynamicField);
                                                        easyDesticationfields.push(dynamicField)
                                                        dynamicField = {
                                                            name: 'surroundings',
                                                            label: "Surroundings",
                                                            type: 13,
                                                            options: resp6.data.data
                                                        }
                                                        fields.push(dynamicField);
                                                        dynamicField = {
                                                            name: 'isFeatured',
                                                            label: "Is Featured",
                                                            type: 12
                                                        };
                                                        fields.push(dynamicField);
                                                        this.setState({
                                                            skip: resp1.data.meta.skip,
                                                            total: resp1.data.meta.total,
                                                            lastPage: this.getLastPage(pageSize, resp1.data.meta.total),
                                                            surroundings: resp6.data.data,
                                                            parentCategories: resp2.data.data,
                                                            parentActivities: resp3.data.data,
                                                            locations: resp1.data.data,
                                                            formFields: fields,
                                                            isLoading: false,
                                                            easyDestinationformFields: easyDesticationfields
                                                        }, () => {
                                                            log("Setting State", "success", this.state);
                                                        });
                                                    })
                                            })
                                    })
                            })
                    })
            })
            .catch(error => {
                log("Error ===>", "error", error?.response?.data);
                swal(error?.response?.data.error?.message ? error?.response?.data.error?.message : "Something wrong", {
                    icon: "error",
                    showCloseButton: true,
                    isLoading: false,
                });
            });
    }

    getEasyDestinationTable = () => {
        const { easyAddUrl,
            searchString,
            pageSize,
            skip,
        } = this.state;
        this.setState({
            isLoading: true,
        })
        let mainUrl = easyAddUrl;
        mainUrl += `?pageSize=${pageSize}&skip=${skip}`;
        if (searchString.length > 1) {
            mainUrl += `&search=${searchString}`
        }
        axios
            .get(mainUrl)
            .then(resp => {
                this.setState({
                    easyLocations: resp.data.data,
                    skip: resp.data.meta.skip,
                    total: resp.data.meta.total,
                    lastPage: this.getLastPage(pageSize, resp.data.meta.total),
                    isLoading: false,
                })
            })
            .catch(error => {
                log("Error ===>", "error", error?.response?.data);
                swal(error?.response?.data.error?.message ? error?.response?.data.error?.message : "Something wrong", {
                    icon: "error",
                    showCloseButton: true,
                    isLoading: false,
                });
            });
    }

    onSearch = (event) => {
        const { searchString, destinationType } = this.state;
        log("Search Requested", "info", searchString);
        this.setState({
            searchString: event.target.value,
        }, () => {
            if (this.state.searchString.length > 1) {
                this.setState({
                    isLoading: true,
                    skip: 0,
                }, () => {
                    destinationType === "detail" ? this.populateTable() : this.getEasyDestinationTable();
                })
            }
            else if (this.state.searchString.length === 0) {
                this.setState({
                    isLoading: true,
                    skip: 0,
                }, () => destinationType === "detail" ? this.populateTable() : this.getEasyDestinationTable());
            }
        })
    }

    handleSubmit = (data) => {
        const { url } = this.state;
        let temp = {
            name: data.name,
            alias: data.alias,
            coordinates: data.coordinates,
            description: data.description,
            longDescription: data.longDescription,
            parentCategories: data.parentCategories,
            parentActivities: data.parentActivities,
            surroundings: data.surroundings,
            locationType: data.type,
            parentProvince: data.parentProvince,
            weatherId: data.weatherId,
            isFeatured: data.isFeatured
        }
        data = temp
        axios
            .post(url, data)
            .then(resp => {
                this.refreshTable();
                this.setState({
                    _objectId: resp.data.data.data._id,
                });
                log(`POST ${url}`, "info", data);
                swal(resp.data.data.message, {
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
        let { url } = this.state;
        let endpoint = `${url}/${id}/update`;
        let temp = {
            name: data.name,
            alias: data.alias,
            coordinates: data.coordinates,
            description: data.description,
            longDescription: data.longDescription,
            parentCategories: data.parentCategories,
            parentActivities: data.parentActivities,
            surroundings: data.surroundings,
            locationType: data.type,
            parentProvince: data.parentProvince,
            weatherId: data.weatherId,
            isFeatured: data.isFeatured
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

    handleDelete = (id) => {
        let { url, easyAddUrl, destinationType } = this.state;
        const isDetail = destinationType === 'detail';
        let endpoint = `${isDetail ? url : easyAddUrl}/${id}/delete`;
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
                        if (isDetail)
                            this.refreshTable();
                        else {
                            this.getEasyDestinationTable();
                        }
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
        if (this.state.locations.length > 0) {
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
                        Showing {`${skip + 1} - ${(skip + this.state.locations.length)} of ${totalCount} `}
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
        const { destinationType } = this.state;
        this.setState({
            skip: 0,
            page: 1,
            isLoading: true
        }, () => {
            destinationType === "detail" ? this.populateTable(rowsPerPage) : this.getEasyDestinationTable();
        })
    }

    onClickNextBtn = () => {
        let rowsPerPage = +this.props.rowsPerPage;
        let currentPage = +this.state.page;
        const { destinationType } = this.state;
        currentPage = currentPage + 1;
        this.setState({
            page: currentPage, skip: this.state.skip + this.state.pageSize, isLoading: true
        }, () => {
            destinationType === "detail" ? this.populateTable(rowsPerPage) : this.getEasyDestinationTable();
        })
    }

    onClickPrevBtn = () => {
        let rowsPerPage = +this.props.rowsPerPage;
        let currentPage = +this.state.page;
        const { destinationType } = this.state;
        currentPage = currentPage - 1;
        this.setState({
            page: currentPage, skip: this.state.skip - this.state.pageSize, isLoading: true
        }, () => {
            destinationType === "detail" ? this.populateTable(rowsPerPage) : this.getEasyDestinationTable();
        })
    }

    onClickLastBtn = () => {
        const { destinationType } = this.state;
        this.setState({
            page: this.state.lastPage, skip: (this.state.lastPage - 1) * this.state.pageSize
        }, () => {
            destinationType === "detail" ? this.populateTable(this.props.rowsPerPage) : this.getEasyDestinationTable();
        })
    }

    getLastPage = (rowsPerPage, totalCountOfRows) => {
        return Math.ceil(totalCountOfRows / rowsPerPage)
    }

    handleEasyDestinationSubmit = (data) => {
        const { easyAddUrl } = this.state;
        let temp = {
            name: data.name,
            type: data.type,
            province: data.parentProvince,

        }
        data = temp
        axios
            .post(easyAddUrl, data)
            .then(resp => {
                log(`POST ${easyAddUrl}`, "info", data);
                this.getEasyDestinationTable();
                swal(resp.data.data.message, {
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

    handleEasyDestinationUpdate = (data, id) => {
        const { easyAddUrl } = this.state;
        let temp = {
            name: data.name,
            type: data.type,
            province: data.parentProvince,

        }
        console.log(data, 'data', id);
        data = temp
        axios
            .put(`${easyAddUrl}/${id}/update`, data)
            .then(resp => {
                log(`UPDATE ${easyAddUrl}/${id}`, "info", data);
                this.getEasyDestinationTable();
                swal("Destination has been updated.", {
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

    switchDestinationType = (type) => {
        this.setState({
            destinationType: type,
            skip: 0,
            page: 1,
            total: 0,
            searchString: ""
        }, () => {
            type === "detail" ? this.populateTable() : this.getEasyDestinationTable();
        })
    }

    render() {
        const { locations, formFields, isLoading, _objectId, easyDestinationformFields, destinationType, easyLocations, searchString } = this.state;
        const { classes, userType, userPermissions } = this.props;
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
                                value={searchString}
                            />
                        </Grid>
                        {isLoading && (
                            <Grid item xs={12} sm={12} md={4}>
                                <CircularProgress size={34} />
                            </Grid>
                        )}
                        {!isLoading && (
                            <>
                                <Grid item xs={12} sm={12} md={1}>
                                    <Form
                                        title="Destination"
                                        create={userPermissions?.locations?.post ? "location" : ""}
                                        fields={formFields}
                                        submit={this.handleSubmit}
                                        apiUrl={locationPhotoImage}
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
                                <Grid item xs={12} sm={12} md={1}>
                                    <Form
                                        title="Easy Destination"
                                        create={userPermissions?.locations?.post ? "location" : ""}
                                        fields={easyDestinationformFields}
                                        submit={this.handleEasyDestinationSubmit}
                                        _objectId={_objectId}
                                        userType={userType}
                                        addbuttonText="Easy add"

                                    />
                                </Grid>
                            </>
                        )}
                    </Grid>
                    <Grid lg={24} className="flex-center-center">
                        <RadioGroup
                            row
                            aria-labelledby="demo-row-radio-buttons-group-label"
                            name="row-radio-buttons-group"
                        >
                            <FormControlLabel value="destination"
                                onClick={() => this.switchDestinationType('detail')}
                                control={<Radio checked={destinationType === "detail"}
                                    classes={{ root: classes.radio, checked: classes.checked }} />}
                                label="Detail Destination" />
                            <FormControlLabel value="easyDestination"
                                onClick={() => this.switchDestinationType('easy')}
                                control={<Radio checked={destinationType === "easy"}
                                    classes={{ root: classes.radio, checked: classes.checked }}
                                />}
                                label="Easy Destination" />
                        </RadioGroup>
                    </Grid>
                </Paper>
                <Paper>{
                    destinationType === 'detail' ?

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
                                        <TableCell className={classes.givePointer} /* onClick={e => this.onSort(e, 'companyName', '', 'vendor')}*/>
                                            <TableSortLabel className={classes.tableSortLabel} /* active={sortColumn === 'vendor' ? true : false} direction={sortOrder ? sortOrder : "asc"}*/>
                                                Destination Type
                                            </TableSortLabel>
                                        </TableCell>
                                        <TableCell className={classes.givePointer} /* onClick={e => this.onSort(e, 'companyName', '', 'vendor')}*/>
                                            <TableSortLabel className={classes.tableSortLabel} /* active={sortColumn === 'vendor' ? true : false} direction={sortOrder ? sortOrder : "asc"}*/>
                                                Province
                                            </TableSortLabel>
                                        </TableCell>
                                        {userPermissions?.locations?.update || userPermissions?.locations?.delete ? <TableCell className={classes.givePointer}>
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
                                    {locations.map((row, index) => (
                                        <TableRow key={index} hover>
                                            <TableCell>{row.name}</TableCell>
                                            <TableCell>{row.alias}</TableCell>
                                            <TableCell>{row.description}</TableCell>
                                            <TableCell>{row.locationType}</TableCell>
                                            <TableCell>{row.parentProvince}</TableCell>
                                            {userPermissions?.locations?.update || userPermissions?.locations?.delete ? <TableCell>
                                                <Form
                                                    title="Destination"
                                                    edit={userPermissions?.locations?.update ? "location" : ""}
                                                    fields={formFields}
                                                    data={row}
                                                    update={this.handleUpdate}
                                                    apiUrl={locationPhotoImage}
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
                                                    delete={userPermissions?.locations?.delete ? this.handleDelete : false}
                                                />
                                            </TableCell> : ""}
                                            <TableCell>
                                                <ImageUpload
                                                    objectId={row._id ? row._id : null}
                                                    formType={this.state.formType}
                                                    apiUrl={locationPhotoImage}
                                                    isHideButton
                                                    disabledUploadBtn
                                                />
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                        :
                        <TableContainer>
                            <Table className={classes.table}>
                                <TableHead className={classes.tableHeader}>
                                    <TableRow>
                                        <TableCell className={classes.givePointer} /* sortDirection={sortColumn ? sortOrder : false} onClick={e => this.onSort(e, 'title', '', 'title')} */>
                                            <TableSortLabel className={classes.tableSortLabel} /* active={sortColumn === 'title' ? true : false} direction={sortOrder ? sortOrder : "asc"} */>
                                                Name
                                            </TableSortLabel>
                                        </TableCell>
                                        <TableCell className={classes.givePointer} /* onClick={e => this.onSort(e, 'companyName', '', 'vendor')}*/>
                                            <TableSortLabel className={classes.tableSortLabel} /* active={sortColumn === 'vendor' ? true : false} direction={sortOrder ? sortOrder : "asc"}*/>
                                                Destination Type
                                            </TableSortLabel>
                                        </TableCell>
                                        <TableCell className={classes.givePointer} /* onClick={e => this.onSort(e, 'companyName', '', 'vendor')}*/>
                                            <TableSortLabel className={classes.tableSortLabel} /* active={sortColumn === 'vendor' ? true : false} direction={sortOrder ? sortOrder : "asc"}*/>
                                                Province
                                            </TableSortLabel>
                                        </TableCell>
                                        {userPermissions?.locations?.update || userPermissions?.locations?.delete ? <TableCell className={classes.givePointer}>
                                            <TableSortLabel className={classes.tableSortLabel}>
                                                Actions
                                            </TableSortLabel>
                                        </TableCell> : ""}

                                    </TableRow>
                                </TableHead>
                                <TableBody className={classes.tableHeader}>
                                    {easyLocations.map((row, index) => (
                                        <TableRow key={index} hover>
                                            <TableCell>{row.name}</TableCell>
                                            <TableCell>{row.type}</TableCell>
                                            <TableCell>{row.province}</TableCell>
                                            {userPermissions?.locations?.update || userPermissions?.locations?.delete ? <TableCell>
                                                <Form
                                                    title="Easy Destination"
                                                    edit={userPermissions?.locations?.update ? "location" : ""}
                                                    fields={easyDestinationformFields}
                                                    data={{ ...row, parentProvince: row.province }}
                                                    update={this.handleEasyDestinationUpdate}
                                                    isTab={true}
                                                    userType={userType}
                                                    delete={userPermissions?.locations?.delete ? this.handleDelete : false}
                                                />
                                            </TableCell> : ""}

                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                }
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
