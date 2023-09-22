import React, { useState, useEffect, useRef } from "react";
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
} from "@material-ui/core";

import {
  FirstPage as FirstPageIcon,
  KeyboardArrowLeft,
  KeyboardArrowRight,
  LastPage as LastPageIcon,
} from "@material-ui/icons";

import Form from "../../middleware/Form";

import styles from "./style";
import Capitalize from "../../../../helpers/Capitalize";
import { isPermission } from "validation/Ispermission";
import { debounce } from "lodash";

const TableComponent = (props) => {
  const [state, setState] = useState({
    url: "",
    searchString: "",
    facilitiesList: [],
    isLoading: true,
    formFields: [
      {
        name: "name",
        label: "Name",
        type: 1,
      },
      {
        name: "alias",
        label: "Alias",
        type: 2,
      },
      {
        name: "type",
        label: "Type",
        type: 5,
        options: ["trip", 'event'],
      }
    ],
    pageSize: null,
    skip: 0,
    page: 1,
    lastPage: null,
    total: 0,
    _objectId: "",
  });

  var { isLoading, page, skip, url, facilitiesList, pageSize, searchString } = state;

  function usePrevious(value) {
    const ref = useRef();
    useEffect(() => {
      ref.current = value;
    });
    return ref.current;
  }

  const prevState = usePrevious({ page, skip, pageSize, isLoading, searchString });

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
        setState({
          ...state,
          isLoading: false
        })
      }
    }
  }, [page, url, isLoading, skip, searchString]);


  const populateTable = () => {
    const { url, searchString, pageSize, skip } = state;
    let mainUrl = url;
    mainUrl += `?pageSize=${pageSize}&skip=${
      skip
      }`;
    if (searchString.length > 2) {
      mainUrl += `&search=${searchString}`;
    }

    axios
      .get(`${mainUrl}`)
      .then((resp1) => {
        log(`GET ${url}`, "info", resp1.data.data);
        setState(
          {
            ...state,
            skip: resp1?.data?.meta?.skip ? resp1.data.meta.skip : 0,
            total: resp1?.data?.meta?.total ? resp1.data.meta.total : 0,
            lastPage: getLastPage(
              pageSize,
              resp1?.data?.meta?.total ? resp1.data.meta.total : 0
            ),
            facilitiesList: resp1.data.data,
            isLoading: false,
          }
        );
      })
      .catch((error) => {
        log("Error ===>", "error", error);
        swal(
          error?.response?.data?.error?.message
            ? error?.response?.data.error?.message?error?.response?.data.error?.message:"Something wrong"
            : "Something went wrong",
          {
            icon: "error",
            showCloseButton: true,
          }
        );
      });
  };


  const onSearch = debounce((value) => {
    setState(
      {
        ...state,
        searchString: value,
        isLoading: true,
      }
    );
  }, 1000);

  const handleSubmit = (data) => {
    const { url } = state;
    let isError = data?.name ? data?.alias ? data?.type ? "" : "type" : 'alias' : "name"
    let payload = {
      name: data.name,
      alias: data.alias,
      type: data.type
    };
    return !isError ?
      axios
        .post(url, payload)
        .then((response) => {
          log(`POST ${url}`, "info", payload);
          setState({
            ...state,
            isLoading: true,
          });
          populateTable();
          swal(response.data.data.message, {
            icon: "success",
          });
        })
        .catch((error) => {
          log("Error ===>", "error", error?.response?.data);
          swal(error?.response?.data.error?.message?error?.response?.data.error?.message:"Something wrong", {
            icon: "error",
          });
        }) :
      swal(`${isError} is required`, {
        icon: "error",
      });
  };

  const handleUpdate = (data, id) => {
    let { url } = state;
    let payload = {
      name: data.name,
      alias: data.alias,
      type: data.type
    };
    axios
      .put(`${url}/${id}/update`, payload)
      .then((response) => {
        log(`UPDATE ${url}/${id}/update`, "info", payload);
        setState({
          ...state,
          isLoading: true,
        });
        populateTable();
        swal(response.data.data.message, {
          icon: "success",
        });
      })
      .catch((error) => {
        log("Error ===>", "error", error?.response?.data);
        swal(error?.response?.data.error?.message?error?.response?.data.error?.message:"Something wrong", {
          icon: "error",
        });
      });
  };
  const handleDelete = (id) => {
    let { url } = state;
    swal('Are you sure you want to deleted?')
      .then((isDeleted) => {
        return isDeleted ?
          axios
            .delete(`${url}/${id}/delete`)
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
  }

  const renderPagination = () => {
    let currentPage, lastPage, totalCount, skip, rowsPerPage;
    if (state.facilitiesList.length > 0) {
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
            {`${skip + 1} - ${skip +
              state.facilitiesList.length} of ${totalCount} `}
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
  const { formFields, _objectId } = state;
  const { classes, userType ,userPermissions} = props;
  // const { sortOrder, sortColumn } = state;
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
          {!isLoading && (
            <>
              <Grid item xs={6} sm={6} md={1}>
                <Form
                  title="Facilities"
                  create={userPermissions?.facilities?.post ? "Facilities" : ""}
                  fields={formFields}
                  submit={handleSubmit}
                  apiUrl={" "}
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
                <TableCell
                  className={
                    classes.givePointer
                  } /* sortDirection={sortColumn ? sortOrder : false} onClick={e => this.onSort(e, 'title', '', 'title')} */
                >
                  <TableSortLabel
                    className={
                      classes.tableSortLabel
                    } /* active={sortColumn === 'title' ? true : false} direction={sortOrder ? sortOrder : "asc"} */
                  >
                    Name
                  </TableSortLabel>
                </TableCell>
                <TableCell
                  className={
                    classes.givePointer
                  } /* onClick={e => this.onSort(e, 'status', '', 'status')}*/
                >
                  <TableSortLabel
                    className={
                      classes.tableSortLabel
                    } /* active={sortColumn === 'status' ? true : false} direction={sortOrder ? sortOrder : "asc"}*/
                  >
                    Alias
                  </TableSortLabel>
                </TableCell>
                <TableCell
                  className={
                    classes.givePointer
                  } /* onClick={e => this.onSort(e, 'status', '', 'status')}*/
                >
                  <TableSortLabel
                    className={
                      classes.tableSortLabel
                    } /* active={sortColumn === 'status' ? true : false} direction={sortOrder ? sortOrder : "asc"}*/
                  >
                    Type
                  </TableSortLabel>
                </TableCell>
                {userPermissions?.facilities?.update || userPermissions?.facilities?.delete ? <TableCell className={classes.givePointer}>
                  <TableSortLabel className={classes.tableSortLabel}>
                    Actions
                  </TableSortLabel>
                </TableCell> : ""}
              </TableRow>
            </TableHead>
            <TableBody className={classes.tableHeader}>
              {facilitiesList.map((row, index) => (
                <TableRow key={index} hover>
                  <TableCell>{row.name}</TableCell>
                  <TableCell>{row.alias}</TableCell>
                  <TableCell>{row.type ? Capitalize(row.type) : ""}</TableCell>
                  {userPermissions?.facilities?.update || userPermissions?.facilities?.delete ? <TableCell>
                    <Form
                      title="Facilities"
                      edit={userPermissions?.facilities?.update ? "Facilities" : ""}
                      data={row}
                      fields={formFields}
                      update={handleUpdate}
                      delete={userPermissions?.facilities?.delete ? handleDelete : false}
                      userType={userType}

                    />
                  </TableCell> : ""}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
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
