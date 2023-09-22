import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import swal from "@sweetalert/with-react";

import log from "../../../../config/log";

import {
  Grid,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableSortLabel,
  withStyles,
  Paper,
  ButtonGroup,
  IconButton,
  TableContainer,
  Typography,
  Tooltip,
  TextField,
  CircularProgress
} from "@material-ui/core";
import {
  FirstPage as FirstPageIcon,
  KeyboardArrowLeft,
  KeyboardArrowRight,
  LastPage as LastPageIcon,
} from "@material-ui/icons";
import { SingleSelect } from "components/Select/index";

import Form from "../../middleware/Form";

import styles from "./style";
import { isPermission } from "validation/Ispermission";
import { debounce } from "lodash";
import environment from "config/config";
import { Link } from 'react-router-dom'

const TableComponent = (props) => {
  const [OpenModal, setOpenModal] = useState(false)
  const [state, setState] = useState({
    url: "",
    searchString: "",
    usersList: [],
    isLoading: true,
    formFields: [
      {
        name: "firstName",
        label: "First Name",
        type: 14,
      },
      {
        name: "lastName",
        label: "Last Name",
        type: 15,
      },

      {
        name: "email",
        label: "Email address",
        type: 16,
      },
      {
        name: "mobile",
        label: "Mobile Number",
        type: 17,
      },
      {
        name: "password",
        label: "Password",
        type: 18,
      },
      {
        name: "type",
        label: "Type",
        type: 19,
        options: isPermission(props.userType) ? props.userType === 'admin' || props.userType === 'employee' ? ["vendor", "employee"] : [] : ["admin"],
      },
      {
        name: "nic",
        label: "Nic",
        type: 20,
      },

      // {
      //   name: "dob",
      //   label: "Date of Birth",
      //   type: 21,
      // },
      {
        name: "gender",
        label: "Gender",
        type: 22,
        options: ["male", "female"],
      },
    ],
    pageSize: null,
    skip: 0,
    page: 1,
    lastPage: null,
    total: 0,
    _objectId: "",
    verifiedList: [{
      name: "True",
      value: "true"
    }, {
      name: "False",
      value: "false"
    }]

  });

  var { isLoading, page, skip, url, pageSize, searchString, usersList, formFields, permissions } = state;
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
    const { url, searchString, pageSize, skip } = state;
    let mainUrl = url;
    mainUrl += `?pageSize=${pageSize}&skip=${skip}${!isPermission(props.userType) ? '&type=["admin"]' : props.userType === 'admin' || props.userType === 'employee' ? '&type=["vendor","employee"]' : ''}`;
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
            usersList: resp1.data.data,
            isLoading: false,
          }
        );
      })
      .catch((error) => {
        swal(error?.response?.data?.error?.message, {
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
        isLoading: true,
      }
    );
  }, 1000);


  const formatDate = (date) => {
    var d = new Date(date),
      month = "" + (d.getMonth() + 1),
      day = "" + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;

    return [year, month, day].join("-");
  };

  const handleSubmit = (data) => {
    const { url } = state;
    let payload = {
      firstName: data.firstName ? data.firstName : "",
      lastName: data.lastName ? data.lastName : "",
      email: data.email ? data.email : "",
      password: data.password ? data.password : "",
      mobile: data.mobile ? data.mobile : "",
      gender: data.gender ? data.gender : "",
      nic: data.nic ? data.nic : "",
      // dob: formatDate(data.dob),
      type: data.type ? data.type : "",
    };
    payload = data.type === 'vendor' ?
      { ...payload, ...{ vendorType: data.vendorType, companyName: data.name } }
      :
      { ...payload }
    let isError = data.type === 'vendor' ? data.name ? data.vendorType ? "" : "vendorType" : "companyName" : ""
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
          swal(error?.response?.data?.error?.message, {
            icon: "error",
          });
        })
      :
      swal(`${isError} is required`, {
        icon: "error",
      });
  };

  const handleUpdate = (data, id) => {
    let { url } = state;
    let payload = {
      firstName: data.firstName,
      lastName: data.lastName,
      mobile: data.mobile,
      gender: data.gender,
      nic: data.nic,
      // dob: formatDate(data.dob),
    };
    payload = data.type === 'vendor' ?
      { ...payload, ...{ vendorType: data.vendorType, companyName: data.name } }
      :
      { ...payload }
    let isError = data.type === 'vendor' ? data.name ? data.vendorType ? "" : "vendorType" : "companyName" : ""
    return !isError ?
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
          swal(error?.response?.data.error?.message ? error?.response?.data.error?.message : "Something wrong", {
            icon: "error",
          });
        })
      :
      swal(`${isError} is required`, {
        icon: "error",
      });
  };

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
              swal(error?.response?.data.error?.message ? error?.response?.data.error?.message : "Something wrong", {
                icon: "error",
              });
            }) : ""
      })
  };

  const renderPagination = () => {
    let currentPage, lastPage, totalCount, skip, rowsPerPage;
    if (state.usersList.length > 0) {
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
            {`${skip + 1} - ${skip + state.usersList.length} of ${totalCount} `}
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

  const updateFormAttr = (vendorType, isEdit) => {
    let { formFields } = state;
    if (vendorType === 'vendor' && formFields?.length !== 10) {
      formFields.splice(6, 0, {
        name: "name",
        label: "Company Name",
        type: 1,
      }, {
        name: "vendorType",
        label: "Vendor Type",
        type: 24,
        options: ["tripAndEvent", "hotel"],
        disabled: isEdit ? true : false
      })

      setState({
        ...state,
        formFields,
      })
    }
    else {
      if (vendorType === 'employee' && formFields.length === 10) {
        formFields.splice(6, 2)
        setState({
          ...state,
          formFields,
        })
      }
    }

    if (isEdit) {
      formFields = formFields.map((form) => form.type === 16 || form.type === 19 ? { ...form, disabled: true } : form
      )
      setState({
        ...state,
        formFields,
      })
    }
    else {
      formFields = formFields.map((form) => form.type === 16 || form.type === 19 ? { ...form, disabled: false } : form
      )
      setState({
        ...state,
        formFields,
      })
    }

  }
  const onVerify = (id, value) => {
    let { url } = state;
    axios.put(`${url}/${id}/updateStatus`, { status: value })
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

  const { classes, userType, userPermissions } = props;
  const { verifiedList } = state;
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
                onChange={(e) => onSearch(e.target.value)}
              />
            </Grid>
            {isLoading && (
              <Grid item xs={12} sm={12} md={4}>
                <CircularProgress size={34} />
              </Grid>
            )}
          </Grid>
          <Grid item xs={6} sm={6} md={6}>
            {!isLoading && (
              <>
                <Form
                  title="User"
                  create={userPermissions?.users?.post ? "User" : ""}
                  fields={formFields}
                  submit={handleSubmit}
                  apiUrl={" "}
                  getUserType={(e) => updateFormAttr(e)}
                  setObjectId={() => updateFormAttr('employee')}
                />
              </>
            )}
          </Grid>
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
                  } /* onClick={e => onSort(e, 'status', '', 'status')}*/
                >
                  <TableSortLabel
                    className={
                      classes.tableSortLabel
                    } /* active={sortColumn === 'status' ? true : false} direction={sortOrder ? sortOrder : "asc"}*/
                  >
                    Name
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
                    Email
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
                    Type
                  </TableSortLabel>
                </TableCell>
                <TableCell className={classes.givePointer}>
                  <TableSortLabel className={classes.tableSortLabel}>
                    Verified
                  </TableSortLabel>
                </TableCell>
                <TableCell className={classes.givePointer}>
                  <TableSortLabel className={classes.tableSortLabel}>
                    Action
                  </TableSortLabel>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody className={classes.tableHeader}>
              {usersList.map((row, index) => (
                <TableRow key={index} hover>

                  <TableCell
                  >
                    <Tooltip title="Update user permission" style={{ cursor: "pointer" }}>
                      <Link
                        className={classes.link}
                        to={process.env.NODE_ENV === "development"
                          ? `/users/${row._id}`
                          : `${environment.production.prefix}/users/${row._id}`}
                      >
                        <strong>{`${row.profile.firstName} ${row.profile.lastName}`}</strong>
                      </Link>
                    </Tooltip>
                  </TableCell>

                  <TableCell>{row.profile.email}</TableCell>
                  <TableCell>{row.type}</TableCell>
                  {/* <TableCell>
                    {row.verify.verified ? "true" : "false"}
                  </TableCell> */}
                  <TableCell>
                    <SingleSelect
                      options={verifiedList}
                      handleChangeOpt={(e) => row.verified !== e.target.value ? onVerify(row._id, e.target.value) : ""}
                      name="status"
                      value={row.verify.verified ? "true" : "false"}
                      disabled={!userPermissions?.users?.update}
                    />
                  </TableCell>
                  <TableCell>
                    <Form
                      title="Users"
                      data={{ ...row, ...{ name: row.profile.companyName } }}
                      fields={formFields}
                      edit={userPermissions?.users?.update ? "Users" : ""}
                      update={userPermissions?.users?.update ? handleUpdate : false}
                      delete={userPermissions?.users?.delete ? handleDelete : false}
                      setObjectId={() => row.type === 'vendor' ? updateFormAttr('vendor', 'edit') : updateFormAttr('employee', 'edit')}

                    />
                  </TableCell>
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
