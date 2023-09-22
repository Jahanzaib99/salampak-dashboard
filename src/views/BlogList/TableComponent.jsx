import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import swal from "@sweetalert/with-react";
import {
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableSortLabel,
  withStyles,
  Paper,
  TableContainer,
  Grid
} from "@material-ui/core";
import styles from "./style";

const TableComponent = (props) => {
  const [state, setState] = useState({
    url: "",
    searchString: "",
    blogUserList: [],
    isLoading: true,
  });

  var { isLoading } = state;

  useEffect(() => {
    populateTable()
  }, [])

  const populateTable = () => {
    setState({
      ...state,
      isLoading: true
    })
    fetch("https://blog.salampakistan.gov.pk/wp-json/mo/v1/all_post")
      .then((resp1) => {
        return resp1.json().then((res) => {
          setState(
            {
              ...state,
              blogUserList: res,
              isLoading: false,
            }
          );
        })
      })
      .catch((error) => {
        swal(error?.response?.data?.error?.message, {
          icon: "error",
          showCloseButton: true,
        });
      });
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

  const { blogUserList } = state;
  const { classes } = props;
  return (
    <div className={classes.tableRoot}>
      <Paper className={classes.paperRoot}>

        {isLoading && (
          <Grid item xs={12} sm={12} md={12} className={classes.flexCenter}>
            <CircularProgress size={34} />
          </Grid>
        )}
      </Paper>
      <Paper>
        <TableContainer>
          <Table className={classes.table}>
            <TableHead className={classes.tableHeader}>
              <TableRow>
                <TableCell
                  className={
                    classes.givePointer
                  }
                >
                  <TableSortLabel
                    className={
                      classes.tableSortLabel
                    }                      >
                    post_title
                  </TableSortLabel>
                </TableCell>
                <TableCell
                  className={
                    classes.givePointer
                  }
                >
                  <TableSortLabel
                    className={
                      classes.tableSortLabel
                    }                      >
                    post_status
                  </TableSortLabel>
                </TableCell>

                <TableCell
                  className={
                    classes.givePointer
                  }
                >
                  <TableSortLabel
                    className={
                      classes.tableSortLabel
                    }                      >
                    post_date
                  </TableSortLabel>
                </TableCell>


              </TableRow>
            </TableHead>
            <TableBody className={classes.tableHeader}>
              {blogUserList?.length ? blogUserList.map((row, index) => (
                <TableRow key={index} hover>
                  <TableCell>{row?.post_title}</TableCell>
                  <TableCell>{row?.post_status}</TableCell>
                  <TableCell>{row?.post_date ? formatDate(row.post_date) : "N/A"}</TableCell>
                </TableRow>
              )) : ""}
            </TableBody>
          </Table>
        </TableContainer>

      </Paper>
    </div>
  );
};

TableComponent.propTypes = {
  className: PropTypes.string,
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(TableComponent);
