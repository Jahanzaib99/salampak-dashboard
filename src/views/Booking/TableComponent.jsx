import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import swal from "@sweetalert/with-react";
import { trip } from './../../config/routes'
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
import { debounce } from "lodash";
import { SingleSelect } from './../../components/Select/index'
import styles from "./style";
import capitalizeFirstLetter from "helpers/Capitalize";

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
    bookingType: 'tripBooking',
    status: "all",
    bookingTypeList: [
      {
        name: "All",
        value: "all"
      },
      {
        name: "Trip",
        value: "tripBooking"
      },
      {
        name: "Event",
        value: "eventsBooking"
      },
      {
        name: "Bus",
        value: "busBooking",
      },
      {
        name: "Airline",
        value: "airlineBooking",
      },
      {
        name: "Hotel",
        value: "hotelBooking",
      }
    ],
    statusList: [
      {
        name: "All",
        value: "all"
      },
      {
        name: "New",
        value: "new"
      },
      {
        name: "Initiated",
        value: "initiated"
      },
      {
        name: "Pending",
        value: "pending",
      },
      {
        name: "Expired",
        value: "expired",
      },
      {
        name: "Failed",
        value: "failed",
      },
      {
        name: "Dropped",
        value: "dropped",
      },
      {
        name: "Cancelled",
        value: "cancelled",
      },
      {
        name: "Paid",
        value: "paid",
      },
      {
        name: "Captured",
        value: "captured",
      },
      {
        name: "Reversed",
        value: "reversed",
      },
      {
        name: "Awaiting Review",
        value: "awaiting-review",
      },
      {
        name: "Closed",
        value: "closed",
      },
    ]

  });

  var { isLoading, page, skip, pageSize, url, searchString, bookingType, status } = state;
  function usePrevious(value) {
    const ref = useRef();
    useEffect(() => {
      ref.current = value;
    });
    return ref.current;
  }

  const prevState = usePrevious({ page, skip, pageSize, searchString, bookingType, status });

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
        prevState.pageSize !== pageSize ||
        prevState?.bookingType !== bookingType ||
        prevState?.status !== status
      )
    ) {
      return pageSize !== null && populateTable();
    }

  }, [page, url, isLoading, skip, searchString, bookingType, status]);


  const populateTable = () => {
    setState({
      ...state,
      isLoading: true
    })
    const { url, searchString, pageSize, skip, bookingType, status } = state;
    let mainUrl = url;
    mainUrl += `?pageSize=${pageSize}&skip=${skip
      }${props.userType == 'vendor' ? `&vendorId=${props.userId}` : ""}${bookingType !== 'all' ? `&type=${bookingType}` : ""}${status !== 'all' ? `&status=${status}` : ""}`;
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
        swal(error?.response?.data?.error?.message, {
          icon: "error",
          showCloseButton: true,
        });
      });
  };



  const getByTypeListing = (type) => {
    setState({
      ...state,
      bookingType: type
    })
  }
  const getByStatusListing = (status) => {
    setState({
      ...state,
      status: status
    })
  }

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
  const formatDate = (date) => {
    var d = new Date(date),
      month = "" + (d.getMonth() + 1),
      day = "" + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;

    return [year, month, day].join("-");
  };


  const { tripList, bookingTypeList, statusList } = state;
  const { classes } = props;
  return (
    <div className={classes.tableRoot}>
      <Paper className={classes.paperRoot}>
        <Grid container direction="row" spacing={2}>
          {/* <Grid item xs={12} sm={12} md={5}>

            <SingleSelect
              options={statusList}
              handleChangeOpt={(e) => getByStatusListing(e.target.value)}
              name="Type"
              value={status}
              label="Status"

            />
          </Grid> */}
          <Grid item xs={12} sm={12} md={5}>
            <SingleSelect
              options={bookingTypeList}
              handleChangeOpt={(e) => getByTypeListing(e.target.value)}
              name="Type"
              value={bookingType}
              label="Booking Type"
            />
          </Grid>
          {isLoading && (
            <Grid item xs={12} sm={12} md={2}>
              <CircularProgress size={34} />
            </Grid>
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
                  } /* onClick={e => onSort(e, 'status', '', 'status')}*/
                >
                  <TableSortLabel
                    className={
                      classes.tableSortLabel
                    } /* active={sortColumn === 'status' ? true : false} direction={sortOrder ? sortOrder : "asc"}*/
                  >
                    Customer
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
                    Customer Mobile
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
                    Type
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
                    Created At
                  </TableSortLabel>
                </TableCell>
                <TableCell className={classes.givePointer}>
                  <TableSortLabel className={classes.tableSortLabel}>
                    Amount
                  </TableSortLabel>
                </TableCell>
                {/* <TableCell className={classes.givePointer}>
                  <TableSortLabel className={classes.tableSortLabel}>
                    Status
                  </TableSortLabel>
                </TableCell> */}
              </TableRow>
            </TableHead>
            <TableBody className={classes.tableHeader}>
              {tripList && tripList.map((row, index) => (
                <TableRow key={index} hover>
                  <TableCell>{`${row?.usersProfile?.firstName ? row?.usersProfile?.firstName : ""} ${row?.usersProfile?.lastName ? row?.usersProfile?.lastName : ""}`}</TableCell>
                  <TableCell>
                    {row?.usersProfile?.mobile ? row?.usersProfile?.mobile : "N/A"}
                  </TableCell>
                  <TableCell>{
                    row.type === "tripBooking" ? row.tripName :
                      row.type === "eventsBooking" ? row.eventName :
                        row.type === "busBooking" ? row.arrival_city :
                          row.type === "airlineBooking" ? row.airline :
                            row.type === "hotelBooking" ?row?.accomodation?.hotelName : ""
                  }</TableCell>
                  <TableCell>{capitalizeFirstLetter(row.type.replace(/([A-Z])/g, ' $1').trim())}</TableCell>
                  <TableCell>{row?.createdAt ? formatDate(row.createdAt) : "N/A"}</TableCell>
                  <TableCell>{row.type === "busBooking"?row?.total_amount:row.type === "hotelBooking" ?row?.accomodation?.rate : row.amount}</TableCell>
                  {/* <TableCell>{row.status}</TableCell> */}

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
