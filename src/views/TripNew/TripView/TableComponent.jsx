import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import swal from "@sweetalert/with-react";
import AddIcon from "@material-ui/icons/Add";
import FileCopyIcon from '@material-ui/icons/FileCopy';
import { SingleSelect } from "./../CreateNew/subComponents/singleSelect";
import { trip } from './../../../config/routes'
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
} from "@material-ui/icons";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import { debounce } from "lodash";

import styles from "./style";
import { isPermission } from "validation/Ispermission";
import { Link } from 'react-router-dom';
import environment from './../../../config/config'

const TableComponent = (props) => {
  const [state, setState] = useState({
    url: "",
    searchString: "",
    tripList: [],
    isLoading: true,
    pageSize: null,
    skip: 0,
    page: 1,
    lastPage: null,
    total: 0,
    _objectId: "",
    statusList: [{
      name: "Draft",
      value: "draft"
    }, {
      name: "Closed",
      value: "closed"
    }, {
      name: "Published",
      value: "published",
      // disabled: props?.userType === 'vendor'
    }],
    isFeaturedList: [{
      name: "True",
      value: true
    }, {
      name: "False",
      value: false
    }],
    isFeaturedList: [{
      name: "True",
      value: true
    }, {
      name: "False",
      value: false
    }]
  });

  var { isLoading, page, skip, pageSize, url, searchString } = state;
  function usePrevious(value) {
    const ref = useRef();
    useEffect(() => {
      ref.current = value;
    });
    return ref.current;
  }

  const prevState = usePrevious({ page, skip, pageSize, searchString });

  useEffect(() => {

    if (props.url) {
      setState({
        ...state,
        url: props.url,
        pageSize: props.rowsPerPage,
      });
    }
    if (
      url &&
      (prevState.page !== page ||
        prevState.skip !== skip ||
        prevState.pageSize !== pageSize)
    ) {
      return pageSize !== null && populateTable();
    }
    if (prevState?.searchString !== searchString) {
      if (searchString.length > 2) {
        return populateTable();
      }
      else if (prevState?.searchString.length && searchString?.length === 0) {
        return populateTable();
      }
      else {
        // setState({
        //   ...state,
        //   isLoading: false
        // })
      }
    }
  }, [page, url, isLoading, skip, searchString]);

  const populateTable = () => {
    setState(
      {
        ...state,
        isLoading: true,
      }
    );
    const { url, searchString, pageSize, skip } = state;
    let mainUrl = url;
    mainUrl += `?pageSize=${pageSize}&skip=${
      skip
      }${userType == 'vendor' ? `&vendor=${props.userId}` : ""}`;
    if (searchString.length > 2) {
      mainUrl += `&keywords=${searchString}`;
    }

    axios
      .get(`${mainUrl}`)
      .then((resp1) => {
        setState(
          {
            ...state,
            skip: resp1.data.meta.skip,
            total: resp1.data.meta.total,
            lastPage: getLastPage(pageSize, resp1.data.meta.total),
            tripList: resp1.data.data,
            isLoading: false,
          }
        );
      })
      .catch((error) => {
        swal(error?.response?.data.error?.message?error?.response?.data.error?.message:"Something wrong", {
          icon: "error",
          showCloseButton: true,
        });
      });
  };

  const onSearch = debounce((value) => {
    setState(
      {
        ...state,
        searchString: value,
        // isLoading: true,
      }
    );
  }, 1000);


  const handleDelete = (id) => {
    let { url } = state;
    swal('Are you sure you want to deleted?')
      .then((isDeleted) => {
        return isDeleted ?
          axios
            .delete(`${url}/${id}/remove`)
            .then((response) => {
              populateTable();
              swal(response.data.data.message, {
                icon: "success",
              });
            })
            .catch((error) => {
              swal(error?.response?.data.error?.message?error?.response?.data.error?.message:"Something wrong", {
                icon: "error",
              });
            }) : ""
      })
  };


  const renderPagination = () => {
    let currentPage, lastPage, totalCount, skip, rowsPerPage;
    if (state?.tripList?.length > 0) {
      rowsPerPage = state.pageSize;
      skip = state.skip;
      currentPage = state.page;
      totalCount = +state.total;
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
    } else if (lastPage === currentPage) {
      nextBtn = true;
      lastBtn = true;
    }
    return (
      <Grid
        container
        direction="column"
        justify="center"
        alignItems="center"
        style={{ margin: "20px", width: "auto" }}
      >
        <Grid item style={{ marginBottom: "15px" }}>
          <Typography variant="caption" gutterBottom>
            Showing{" "}
            {`${skip + 1} - ${skip + state?.tripList?.length} of ${totalCount} `}
          </Typography>
          <ButtonGroup size="small" style={{ verticalAlign: "middle" }}>
            <IconButton
              style={{ margin: 5 }}
              onClick={onClickFirstBtn}
              disabled={firstBtn}
            >
              <FirstPageIcon />
            </IconButton>
            <IconButton
              style={{ margin: 5 }}
              onClick={onClickPrevBtn}
              disabled={prevBtn}
            >
              <KeyboardArrowLeft />
            </IconButton>
            <IconButton
              style={{ margin: 5 }}
              onClick={onClickNextBtn}
              disabled={nextBtn}
            >
              <KeyboardArrowRight />
            </IconButton>
            <IconButton
              style={{ margin: 5 }}
              onClick={onClickLastBtn}
              disabled={lastBtn}
            >
              <LastPageIcon />
            </IconButton>
          </ButtonGroup>
          <Typography variant="caption" display="inline" gutterBottom>
            Page {`${currentPage} of ${lastPage}`}
          </Typography>
        </Grid>
      </Grid>
    );
  };

  const onClickFirstBtn = () => {
    let rowsPerPage = +props.rowsPerPage;
    setState({
      ...state,
      skip: 0,
      page: 1,
      isLoading: true,
    });
  };

  const onClickNextBtn = () => {
    let rowsPerPage = +props.rowsPerPage;
    let currentPage = +state.page;
    currentPage = currentPage + 1;
    setState({
      ...state,
      page: currentPage,
      skip: state.skip + state.pageSize,
      isLoading: true,
    });
  };

  const onClickPrevBtn = () => {
    let rowsPerPage = +props.rowsPerPage;
    let currentPage = +state.page;
    currentPage = currentPage - 1;
    setState({
      ...state,
      page: currentPage,
      skip: state.skip - state.pageSize,
      isLoading: true,
    });
  };

  const onClickLastBtn = () => {
    setState({
      ...state,
      page: state.lastPage,
      skip: (state.lastPage - 1) * state.pageSize,
    });
  };

  const getLastPage = (rowsPerPage, totalCountOfRows) => {
    return Math.ceil(totalCountOfRows / rowsPerPage);
  };

  const updateTripStatus = (tripId, value) => {
    axios.put(`${trip}/${tripId}/status`, { status: value })
      .then((res) => {
        populateTable()
        swal(res.data.data.message, {
          icon: "success",
        })
      })
      .catch((error) => swal(error.message, {
        icon: "error",
        showCloseButton: true,
      }))
  }

  const updateTripIsFeatured = (tripId, value) => {

    axios.get(`${trip}/${tripId}`).then((resp) => {
      let dataGen = resp.data.data;
      let payload = {
        title: dataGen?.title,
        description: dataGen?.description,
        duration: dataGen?.duration,
        categories: dataGen?.categories ? dataGen?.categories.map(tag => tag._id) : [],
        startLocation: dataGen?.startLocation?._id,
        Locations: dataGen?.Locations ? dataGen?.Locations.map(tag => tag._id) : [],
        activities: dataGen?.activities ? dataGen?.activities.map(tag => tag._id) : [],
        facilities: dataGen?.facilities ? dataGen?.facilities.map(tag => tag._id) : [],
        price: dataGen?.price,
        date: new Date(dataGen?.date),
        cancellationPolicy: dataGen?.cancellationPolicy,
        slug: dataGen?.slug,
        vendorId: dataGen?.vendor?._id,
        isFeatured: value,
        contact: dataGen?.contact,
      }
      axios
        .put(`${trip}/${tripId}`, payload)
        .then((response) => {
          populateTable()
          swal(response.data.data.message, {
            icon: "success",
          });
        })
        .catch((error) => {
          swal(error?.response?.data.error?.message?error?.response?.data.error?.message:"Something wrong", {
            icon: "error",
          });
        });
    })
      .catch((error) => {
        swal(error?.response?.data.error?.message?error?.response?.data.error?.message:"Something wrong", {
          icon: "error",
        });
      });

  }


  const { tripList, statusList, isFeaturedList } = state;
  const { classes, userType, userPermissions } = props;
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
                shrink: true,
              }}
              onChange={(e) => onSearch(e.target.value)}
            />
          </Grid>
          {isLoading && (
            <Grid item xs={12} sm={12} md={4}>
              <CircularProgress size={34} />
            </Grid>
          )}
        </Grid>
        {userPermissions?.trips?.post ?
          <Grid item xs={6} sm={6} md={1} className={classes.addBtn}>
            <Link
              to={process.env.NODE_ENV === "development"
                ? `/upload-trip`
                : `${environment.production.prefix}/upload-trip`}
            >

              <Fab
                color="primary"
                variant="extended"
              >
                <AddIcon style={{ marginRight: 5 }} />
            ADD
          </Fab>
            </Link>
          </Grid> : ""}
      </Paper>
      <Paper>
        {/* {
          userPermissions?.trips?.get ? */}
        <TableContainer>
          <Table className={classes.table}>
            <TableHead className={classes.tableHeader}>
              <TableRow>
                <TableCell
                  className={
                    classes.givePointer
                  } /* onClick={e => onSort(e, 'status', '', 'status')}*/
                >
                  <TableSortLabel
                    className={
                      classes.tableSortLabel
                    } /* active={sortColumn === 'status' ? true : false} direction={sortOrder ? sortOrder : "asc"}*/
                  >
                    Title
                  </TableSortLabel>
                </TableCell>

                <TableCell className={classes.givePointer}>
                  <TableSortLabel className={classes.tableSortLabel}>
                    Description
                  </TableSortLabel>
                </TableCell>
                <TableCell
                  className={
                    classes.givePointer
                  } /* onClick={e => onSort(e, 'companyName', '', 'vendor')}*/
                >
                  <TableSortLabel
                    className={
                      classes.tableSortLabel
                    } /* active={sortColumn === 'vendor' ? true : false} direction={sortOrder ? sortOrder : "asc"}*/
                  >
                    Status
                  </TableSortLabel>
                </TableCell>
                <TableCell
                  className={
                    classes.givePointer
                  } /* onClick={e => onSort(e, 'companyName', '', 'vendor')}*/
                >
                  <TableSortLabel
                    className={
                      classes.tableSortLabel
                    } /* active={sortColumn === 'vendor' ? true : false} direction={sortOrder ? sortOrder : "asc"}*/
                  >
                    Duration
                  </TableSortLabel>
                </TableCell>
                <TableCell className={classes.givePointer}>
                  <TableSortLabel className={classes.tableSortLabel}>
                    Location
                  </TableSortLabel>
                </TableCell>
                <TableCell className={classes.givePointer}>
                  <TableSortLabel className={classes.tableSortLabel}>
                    Price
                  </TableSortLabel>
                </TableCell>
                <TableCell className={classes.givePointer}>
                  <TableSortLabel className={classes.tableSortLabel}>
                    Is Featured
                  </TableSortLabel>
                </TableCell>
                {userPermissions?.trips?.update || userPermissions?.trips?.delete ?
                  <TableCell className={classes.givePointer}>
                    <TableSortLabel className={classes.tableSortLabel}>
                      Action
                    </TableSortLabel>
                  </TableCell>

                  : ""}
              </TableRow>
            </TableHead>
            <TableBody className={classes.tableHeader}>
              {tripList && tripList.map((row, index) => (
                <TableRow key={index} hover>
                  <TableCell>{row.title}</TableCell>
                  <TableCell>{row.description}</TableCell>

                  <TableCell>
                    <SingleSelect
                      options={statusList}
                      handleChangeOpt={(e) => row.status !== e.target.value ? updateTripStatus(row._id, e.target.value) : ""}
                      name="status"
                      value={row.status}
                      disabled={!userPermissions?.trips?.update}
                    />
                  </TableCell>
                  <TableCell>{row.duration}</TableCell>
                  <TableCell>{row?.startLocation?.name}</TableCell>
                  <TableCell>{row.price}</TableCell>
                  <TableCell>
                    <SingleSelect
                      options={isFeaturedList}
                      handleChangeOpt={(e) => row.isFeatured !== e.target.value ? updateTripIsFeatured(row._id, e.target.value) : ""}
                      name="status"
                      value={row.isFeatured}
                      // disabled={!isPermission(userType)}
                      disabled={!userPermissions?.trips?.update}

                    />
                  </TableCell>

                  <TableCell >
                    {
                      userPermissions?.trips?.update
                        ?
                        <Tooltip title="edit" aria-label="edit">
                          <Link
                            to={process.env.NODE_ENV === "development"
                              ? `/edit-trip/${row._id}`
                              : `${environment.production.prefix}/edit-trip/${row._id}`}
                          >
                            <IconButton aria-label="edit">
                              <EditIcon fontSize="small" />
                            </IconButton>
                          </Link>
                        </Tooltip>
                        : ""}
                    {
                      userPermissions?.trips?.post
                        ?
                        <Tooltip title="copy" aria-label="copy">
                          <Link
                            to={{
                              pathname: process.env.NODE_ENV === "development"
                                ? `/copy-trip/${row._id}`
                                : `${environment.production.prefix}/copy-trip/${row._id}`,
                              state: "Copy"
                            }}
                          >
                            <IconButton aria-label="copy">
                              <FileCopyIcon fontSize="small" />
                            </IconButton>
                          </Link>
                        </Tooltip>
                        : ""}
                    {
                      userPermissions?.trips?.delete
                        ?
                        <Tooltip title="delete" aria-label="delete">
                          <IconButton onClick={() => handleDelete(row._id)} aria-label="delete">
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip> : ""}
                  </TableCell>

                </TableRow>
              ))}
            </TableBody>


          </Table>
        </TableContainer>
        {/* : <div style={{ width: "100%", textAlign: "center" ,padding:"50px"}}><h4>Don't have an permission</h4></div>
        } */}
        {renderPagination()}
      </Paper>
    </div>
  );
};

TableComponent.propTypes = {
  className: PropTypes.string,
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(TableComponent);
