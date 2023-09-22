import React, { Component } from 'react';
import PropTypes from "prop-types";
import axios from "axios";
import swal from "@sweetalert/with-react";

import log from "../../config/log";
import AddIcon from "@material-ui/icons/Add";
import { SingleSelect } from "./CreateNew/subComponents/singleSelect";
import { debounce } from "lodash";

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
    Fab,
    Tooltip,

} from "@material-ui/core";

import {
    FirstPage as FirstPageIcon,
    KeyboardArrowLeft,
    KeyboardArrowRight,
    LastPage as LastPageIcon,
} from '@material-ui/icons';
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import { Link } from 'react-router-dom';
import styles from "./style";
import environment from './../../config/config';

class TableComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            accommodationsUrl: "",
            categoriesUrl: "",
            locationsUrl: "",
            searchString: "",
            accommodations: [],
            isLoading: true,
            formFields: [
                {
                    name: "hotelName",
                    label: "Hotel Name",
                    type: 4,
                },
                {
                    name: "description",
                    label: "Description",
                    type: 5,
                }
            ],
            pageSize: null,
            skip: 0,
            page: 1,
            lastPage: null,
            total: 0,
            isFeaturedList: [{
                name: "True",
                value: true
            }, {
                name: "False",
                value: false
            }],
            statusList: [{
                name: "Draft",
                value: "draft"
            }, {
                name: "Closed",
                value: "closed"
            }, {
                name: "Published",
                value: "published",
                disabled: props?.userType === 'vendor'
            }],
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
                accommodationsUrl: this.props.accommodationsUrl,
                pageSize: this.props.rowsPerPage,
                categoriesUrl: this.props.categoriesUrl,
                locationsUrl: this.props.locationsUrl
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
        const { userType, userId } = this.props;
        const { accommodationsUrl, categoriesUrl, locationsUrl, formFields, searchString, pageSize, skip } = this.state;
        let mainUrl = accommodationsUrl
        this.setState({
            isLoading: true
        })
        mainUrl += `?pageSize=${pageSize}&skip=${skip}${userType == 'vendor' ? `&vendorId=${userId}` : ""}`;
        // mainUrl += '/search?pageSize=0'
        if (searchString.length > 2) {
            mainUrl += `&keywords=${searchString}`
        }
        axios
            .get(mainUrl)
            .then(resp1 => {
                axios
                    .get(categoriesUrl)
                    .then(resp2 => {
                        axios
                            .get(locationsUrl)
                            .then(resp3 => {
                                let fields = formFields;
                                let dynamicField = {
                                    name: "Category",
                                    label: "Category",
                                    type: 1,
                                    options: resp2.data.data
                                };
                                fields.push(dynamicField);
                                dynamicField = {
                                    name: "Location",
                                    label: "Location",
                                    type: 2,
                                    options: resp3.data.data
                                };
                                fields.push(dynamicField);
                                dynamicField = {
                                    name: "isFeatured",
                                    label: "Is Featured",
                                    type: 3,
                                    options: ['true', 'false']
                                };
                                fields.push(dynamicField);
                                this.setState({
                                    skip: resp1.data.meta.skip,
                                    total: resp1.data.meta.total,
                                    lastPage: this.getLastPage(pageSize, resp1.data.meta.total),
                                    accommodations: resp1.data.data,
                                    formFields: fields,
                                    isLoading: false
                                }, () => {
                                    log("Setting State", "success", this.state);
                                });
                            })
                    })
            })
            .catch(error => {
                this.setState({
                    isLoading: false
                })
                log("Error ===>", "error", error?.response?.data);
                swal(error?.response?.data.error?.message ? error?.response?.data.error?.message : "Something wrong", {
                    icon: "error",
                    showCloseButton: true,
                });
            });
    }


    renderPagination = () => {
        let currentPage, lastPage, totalCount, skip, rowsPerPage;
        if (this.state.accommodations.length > 0) {
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
                        Showing {`${skip + 1} - ${(skip + this.state.accommodations.length)} of ${totalCount} `}
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


    updateAccomodationIsFeatured = (accomodation, value) => {
        const { accommodationsUrl } = this.state
        let hotelAmen = accomodation?.hotelAmenities?.length ? accomodation?.hotelAmenities.map(hotel => hotel.value ? hotel.value : hotel) : []

        let payload = {
            hotelName: accomodation?.hotelName,
            addressInfo: accomodation?.addressInfo,
            city: accomodation?.city,
            overview: accomodation?.overview,
            description: accomodation?.description,
            email: accomodation?.email,
            mobile: accomodation?.mobile,
            zipcode: accomodation?.zipcode,
            location: accomodation?.location,
            category: accomodation?.category,
            hotelSource: accomodation?.hotelSource,
            cancellationPolicy: accomodation?.cancellationPolicy,
            vendorId: accomodation?.vendorId,
            isFeatured: value,
            checkin: +new Date(accomodation?.checkin),
            checkout: +new Date(accomodation?.checkout),
            hotelAmenities: hotelAmen,
        };
        axios
            .put(`${accommodationsUrl}/${accomodation._id}`, payload)
            .then((response) => {
                this.populateTable()
                swal(response.data.data.message, {
                    icon: "success",
                });
            })
            .catch((error) => {
                swal(error?.response?.data.error?.message ? error?.response?.data.error?.message : "Something wrong", {
                    icon: "error",
                });
            });


    }

    handleDelete = (id) => {
        let { accommodationsUrl } = this.state;
        swal('Are you sure you want to deleted?')
            .then((isDeleted) => {
                return isDeleted ?
                    axios
                        .delete(`${accommodationsUrl}/${id}/remove`)
                        .then((response) => {
                            this.populateTable();
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
    };

    updateAccommodationStatus = (accommodationId, value) => {
        let { accommodationsUrl } = this.state;
        axios.put(`${accommodationsUrl}/${accommodationId}/updateStatus`, { status: value })
            .then((res) => {
                this.populateTable()
                swal(res.data.data.message, {
                    icon: "success",
                })
            })
            .catch((error) => swal(error.message, {
                icon: "error",
                showCloseButton: true,
            }))
    }
    onSearch = debounce((value) => {
        this.setState(
            {
                searchString: value,
                // isLoading: true,
            }, () => this.populateTable()
        );
    }, 1000);

    render() {
        const { accommodations, isLoading, statusList, isFeaturedList } = this.state;
        const { classes, userType, vendorType, userPermissions } = this.props;
        return (
            <div className={classes.tableRoot}>
                <Paper className={classes.paperRoot}>
                    <Grid container direction="row" spacing={2}>
                        <Grid container direction="row" spacing={2}>
                            <Grid item xs={12} sm={12} md={isLoading ? 8 : 12}>
                                <TextField
                                    label="Search"
                                    className={classes.textfield}
                                    variant="outlined"
                                    margin="dense"
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    onChange={(e) => this.onSearch(e.target.value)}
                                />
                            </Grid>
                            {isLoading && (
                                <Grid item xs={12} sm={12} md={4}>
                                    <CircularProgress size={34} />
                                </Grid>
                            )}
                        </Grid>
                        <Grid item xs={6} sm={6} md={6} className={classes.addBtn}>
                            {
                                userPermissions?.accomodations?.post
                                    ? <Link
                                        to={process.env.NODE_ENV === "development"
                                            ? `/upload-accomodation`
                                            : `${environment.production.prefix}/upload-accomodation`}
                                    >

                                        <Fab
                                            color="primary"
                                            variant="extended"
                                        >
                                            <AddIcon style={{ marginRight: 5 }} />
                                ADD
                            </Fab>
                                    </Link> : ""}
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
                                            Hotel Name
                                </TableSortLabel>
                                    </TableCell>
                                    <TableCell className={classes.givePointer} /* sortDirection={sortColumn ? sortOrder : false} onClick={e => this.onSort(e, 'title', '', 'title')} */>
                                        <TableSortLabel className={classes.tableSortLabel} /* active={sortColumn === 'title' ? true : false} direction={sortOrder ? sortOrder : "asc"} */>
                                            Status
                                </TableSortLabel>
                                    </TableCell>
                                    <TableCell className={classes.givePointer} /* onClick={e => this.onSort(e, 'status', '', 'status')}*/ >
                                        <TableSortLabel className={classes.tableSortLabel} /* active={sortColumn === 'status' ? true : false} direction={sortOrder ? sortOrder : "asc"}*/>
                                            City
                                </TableSortLabel>
                                    </TableCell>
                                    <TableCell className={classes.givePointer} /* onClick={e => this.onSort(e, 'companyName', '', 'vendor')}*/>
                                        <TableSortLabel className={classes.tableSortLabel} /* active={sortColumn === 'vendor' ? true : false} direction={sortOrder ? sortOrder : "asc"}*/>
                                            Category
                                </TableSortLabel>
                                    </TableCell>
                                    <TableCell className={classes.givePointer} >
                                        <TableSortLabel className={classes.tableSortLabel}>
                                            Description
                                </TableSortLabel>
                                    </TableCell>
                                    <TableCell className={classes.givePointer} >
                                        <TableSortLabel className={classes.tableSortLabel}>
                                            Is Featured
                                </TableSortLabel>
                                    </TableCell>
                                    {
                                        userPermissions?.accomodations?.update || userPermissions?.accomodations?.delete ?
                                            <TableCell className={classes.givePointer} >
                                                <TableSortLabel className={classes.tableSortLabel}>
                                                    Actions
                                </TableSortLabel>
                                            </TableCell>

                                            : ""
                                    }
                                </TableRow>
                            </TableHead>
                            <TableBody className={classes.tableHeader}>
                                {accommodations.map((row, index) => (
                                    <TableRow key={index} hover>
                                        <TableCell>{row.hotelName}</TableCell>
                                        <TableCell>
                                            <SingleSelect
                                                options={statusList}
                                                handleChangeOpt={(e) => row.status !== e.target.value ? this.updateAccommodationStatus(row._id, e.target.value) : ""}
                                                name="status"
                                                value={row.status}
                                                disabled={!userPermissions?.accomodations?.update}
                                            />
                                        </TableCell>
                                        <TableCell>{row.city}</TableCell>
                                        <TableCell>{(row.category && row.category.name) ? row.category.name : ''}</TableCell>
                                        <TableCell>{(row.description && row.description.length > 60) ? row.description.substr(0, 60) + '....' : row.description}</TableCell>
                                        <TableCell>
                                            {/* {row.isFeatured ? row.isFeatured + '' : 'false'} */}
                                            <SingleSelect
                                                options={isFeaturedList}
                                                handleChangeOpt={(e) => row?.isFeatured !== e.target.value ? this.updateAccomodationIsFeatured(row, e.target.value) : ""}
                                                name="status"
                                                value={row.isFeatured}
                                                disabled={!userPermissions?.accomodations?.update}
                                            />
                                        </TableCell>
                                        <TableCell className={classes.flexColumn}>

                                            {
                                                userPermissions?.accomodations?.update
                                                    ?
                                                    <Tooltip title="edit" aria-label="edit">
                                                        <Link
                                                            to={process.env.NODE_ENV === "development"
                                                                ? `/edit-accomodation/${row._id}`
                                                                : `${environment.production.prefix}/edit-accomodation/${row._id}`}
                                                        >
                                                            <IconButton aria-label="edit">
                                                                <EditIcon fontSize="small" />
                                                            </IconButton>
                                                        </Link>
                                                    </Tooltip> : ""
                                            }
                                            {
                                                userPermissions?.accomodations?.delete ?
                                                    <Tooltip title="delete" aria-label="delete">
                                                        <IconButton onClick={() => this.handleDelete(row._id)} aria-label="delete">
                                                            <DeleteIcon fontSize="small" />
                                                        </IconButton>
                                                    </Tooltip>
                                                    : ""
                                            }
                                        </TableCell>
                                        {/* {
                                            isPermission(userType, 'trip') ?
                                                <TableCell className={classes.flexColumn}>
                                                    <Tooltip title="edit" aria-label="edit">
                                                        <Link
                                                            to={process.env.NODE_ENV === "development"
                                                                ? `/edit-accomodation/${row._id}`
                                                                : `${environment.production.prefix}/edit-accomodation/${row._id}`}
                                                        >
                                                            <IconButton aria-label="edit">
                                                                <EditIcon fontSize="small" />
                                                            </IconButton>
                                                        </Link>
                                                    </Tooltip>
                                                    <Tooltip title="delete" aria-label="delete">
                                                        <IconButton onClick={() => this.handleDelete(row._id)} aria-label="delete">
                                                            <DeleteIcon fontSize="small" />
                                                        </IconButton>
                                                    </Tooltip>
                                                </TableCell>

                                                : ""
                                        } */}
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
