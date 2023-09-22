import React, { Component } from 'react';
import PropTypes from "prop-types";
import axios from "axios";
import swal from "@sweetalert/with-react";
import log from "../../../../../config/log";
import {
    ButtonGroup,
    CircularProgress,
    FormGroup,
    FormControlLabel,
    Grid,
    IconButton,
    Switch,
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
// import Form from "../../../../../../src/views/Tags/middleware/Form";
import Form from "../MMAPackages/Form";
import styles from "./style";
import {mmaPackageAddUrl, events} from "./../../../../../config/routes";

const formFields = [
    { name: "name", label: "Name", type: 1},
    { name: "description", label: "Description", type: 3 } 
];

class MMAPackageTableComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            url: "",
            tags: [],
            filterInternational: true,
            isLoading: true,
            mmaPackages : [],
            eventId: this.props.eventId
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
       if (true) {
            this.setState({
                url: this.props.url,
            }, () => {
                this.populateTable();
            });
        }
       
       
       /* if (this.props.url) {
            this.setState({
                url: this.props.url,
            }, () => {
                this.populateTable();
            });
        }*/
    }

    refreshTable = () => {
        this.setState({
            isLoading: true,
        }, () => this.populateTable());
    }

    populateTable = () => {

        const { eventId } = this.state;
        //  let endpoint = `${url}/${id}/update`;
        let endpoint = `${events}/${eventId}`;
        console.log('popuet endpoint', endpoint);


        axios
            .get(endpoint)
            .then(response => {
                console.log('response khd', response);
               // let mma
                log(`GET ${endpoint}`, "info", response.data.data);
                this.setState({
                    mmaPackages: response.data.data.packages,
                    isLoading: false
                }, () => {
                    log("Setting State after khd", "success", this.state);
                });
            })
            .catch(error => {
                log("Error ===>", "error", error.response.data);
                swal(error.response.data.error.message, {
                    icon: "error",
                    showCloseButton: true,
                });
            });
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
        let { eventId } = this.state;
        let endpoint = `${mmaPackageAddUrl}/${eventId}/packages`;
        console.log('production log', 'mmaPackageAddUrl endpoint', mmaPackageAddUrl, endpoint);

        let newMMAPackages = {name: data.name, description: data.description}
        let mmaPackagesList = this.state.mmaPackages;
        mmaPackagesList.push(newMMAPackages);
        let packagesFormData = {packages: mmaPackagesList};

        axios
            .put(endpoint, packagesFormData)
            .then(response => {
                this.refreshTable();
                log(`PUT ${endpoint}`, "info", data);
                swal(`Package has been added`, {//response.data.data.message, {
                    icon: "success"
                });
            })
            .catch(error => {
                log("Error ===>", "error", error.response.data);
                swal(error.response.data.error.message, {
                    icons: "error"
                });
            });
    }

    handleUpdate = (data, id) => {
        let { eventId } = this.state;
        let endpoint = `${mmaPackageAddUrl}/${eventId}/packages`;
        
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
                log("Error ===>", "error", error.response.data);
                swal(error.response.data.error.message, {
                    icon: "error"
                });
            });
    }

    handleDeleteWithoutId = (data) => {
        let mmaPackagesList = this.state.mmaPackages;
        mmaPackagesList = mmaPackagesList.filter(pack => pack.name != data.name && pack.description != data.description);
        let packagesFormData = {packages: mmaPackagesList};
        let { eventId } = this.state;
        let endpoint = `${mmaPackageAddUrl}/${eventId}/packages`;

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
                .put(endpoint, packagesFormData)
                .then(response => {
                    this.refreshTable();
                    log(`PUT ${endpoint}`, "info", data);
                    swal(`Package has been deleted`,{// response.data.data.message, {
                        icon: "success"
                    });
                })
                .catch(error => {
                    log("Error ===>", "error", error.response.data);
                    swal(error.response.data.error.message, {
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

    handleSwitch = name => event => {
        this.setState({
            [name]: event.target.checked
        }, () => {
            log("Trigger", "info", name);
            log("Handle Switch", "info", this.state.filterInternational);
            this.populateTable();
        });
    }

    render() {
        const { isLoading, mmaPackages } = this.state;
        const { classes } = this.props;
        console.log('mmaPackagesmmaPackages ::', mmaPackages);
        console.log('Rect i on - > index -> MMAPackagetable Com: this.props', this.props);

        return (
            <div className={classes.tableRoot}>
                <Paper className={classes.paperRoot}>
                    <Grid container direction="row" spacing={2}>
                       
                        {/*isLoading && (
                            <Grid item xs={12} sm={12} md={4}>
                                <CircularProgress size={34} />
                            </Grid>
                        )*/}
                        {!isLoading && (
                            <>
                                <Grid item xs={12} sm={12} md={3}>
                                    <Form
                                        title="add package"
                                        create="package"
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
                                    Description
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
                        {mmaPackages.map((row, index) => (
                            <TableRow key={index} hover>
                                <TableCell>{row.name}</TableCell>
                                <TableCell>{row.description}</TableCell>
                                
                                <TableCell>
                                    <Form
                                        title="MMA Packages"
                                        edit="MMA Packages"
                                        fields={formFields}
                                        data={row}
                                        update={this.handleUpdate}
                                        delete={this.handleDeleteWithoutId}
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

MMAPackageTableComponent.propTypes = {
    className: PropTypes.string,
    classes: PropTypes.object.isRequired,
}

export default withStyles(styles)(MMAPackageTableComponent);
