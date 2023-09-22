import React, { useState, useEffect, useRef } from "react";
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
    fetch("https://blog.salampakistan.gov.pk/wp-json/mo/v1/all_user")
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
                    user_login
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
                    display_name
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
                    user_nicename
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
                    user_email

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
                    user_status
                  </TableSortLabel>
                </TableCell>

              </TableRow>
            </TableHead>
            <TableBody className={classes.tableHeader}>
              {blogUserList?.length ? blogUserList.map((row, index) => (
                <TableRow key={index} hover>
                  <TableCell>{row?.user_login}</TableCell>
                  <TableCell>{row?.display_name}</TableCell>
                  <TableCell>{row?.user_nicename}</TableCell>
                  <TableCell>{row?.user_email}</TableCell>
                  <TableCell>{row?.user_status}</TableCell>
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
