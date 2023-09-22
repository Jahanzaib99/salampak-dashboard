import React, { Component } from "react";

import swal from "@sweetalert/with-react";
import log from "../../../../config/log";
import axios from "axios";

// Externals
import PropTypes from "prop-types";

// Material helpers
import { withStyles } from "@material-ui/core";

// Material components
import { Button } from "@material-ui/core";

import ItineraryComponent from "./Itinerary";
import EditItinerary from "./EditItinerary";
import TimeLine from "../subComponents/timeline";
import { trip } from "../../../../config/routes";
// Component styles
import styles from "./style";

class UploadTrip extends Component {
  constructor(props) {
    super(props);
    this.state = {
      eventId: "",
      itinerary: [],
      itineraryCount: [],
      toEdit: "",
      openEdit: false,
      prevStateItinerary: []
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.addItinerary = this.addItinerary.bind(this);
    this.toEditItinerary = this.toEditItinerary.bind(this);
    this.editItinerary = this.editItinerary.bind(this);
    this.removeItinerary = this.removeItinerary.bind(this);
    this.insertIntoObject = this.insertIntoObject.bind(this);
  }

  componentDidMount() {
    this.setState({
      itinerary: this.props.data,
      prevStateItinerary: this.props.data,
    });
  }

  componentDidUpdate(prevProps, prevState) {
    const { getItnList = () => { } } = this.props;
    if (prevState?.itinerary?.length !== this.state.itinerary?.length) {
      this.setState({
        prevStateItinerary: prevState.itinerary
      })
      getItnList(this.state.itinerary)
    }


  }

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  handelToggleButton = (e) => {
    swal("It can only change from Generate Tab", {
      icon: "info",
    });
  };

  addItinerary = (e) => {
    const { duration } = this.props;
    if (duration !== "") {
      e.preventDefault()
      log("Trigger", "info", "Add a new itinery");
      let itinerary = this.state.itineraryCount.concat([""]);
      this.setState({ itineraryCount: itinerary });
    }
    else {
      swal({
        text: "Duration is requried",
        icon: "error",
      })
    }
  };

  toEditItinerary = (i) => {
    log("Trigger", "info", "Edit an itinerary");
    this.setState({ toEdit: i, openEdit: true });
  };

  removeItinerary = (i) => {
    log("Trigger", "warning", "Remove an itinerary");
    swal({
      title: "Are you sure?",
      text: "Once deleted, you will not be able to recover this record!",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        let itinerary = [
          ...this.state.itinerary.slice(0, i),
          ...this.state.itinerary.slice(i + 1),
        ];
        log("Removed the itinerary", "success", this.state.itinerary[i]);
        this.setState({ itinerary: itinerary });
      } else {
        swal("Itinerary has not been deleted!", {
          icon: "info",
        });
      }
    });
  };

  insertIntoObject = (obj) => {
    if (obj) {
      let itin = [];
      this.state.itinerary.map((item) => itin.push(item));
      itin.push(obj);
      log("Add new itinerary", "success", itin);
      this.setState({ itinerary: itin });
    }
  };

  editItinerary = (i, obj) => {
    let itinerary = this.state.itinerary;
    itinerary[i] = obj;
    log("Edit the existing itinerary", "success", itinerary[i]);
    this.setState({ itinerary: itinerary, openEdit: false });
  };

  handleSubmit = () => {
    const { itinerary } = this.state;
    const { tripId } = this.props;
    axios
      .post(`${trip}/${tripId}/tripItinerary`, { itinerary })
      .then((response) => {
        this.props.enableTabs(3, tripId);
        swal(response.data.data.message, {
          icon: "success",
        });
      })
      .catch((error) => {
        log("Error ===>", "error", error?.response?.data);
        swal(error?.response?.data.error?.message ? error?.response?.data.error?.message : "Something wrong", {
          icon: "error",
        });
      });
  };

  render() {
    const { classes, duration, isSaveButtonHide } = this.props;
    const { prevStateItinerary } = this.state
    return (
      <div>
        {this.state.itineraryCount.map((item, index) => (
          <ItineraryComponent
            key={index}
            handleOpen={true}
            getData={this.insertIntoObject}
            duration={duration}
            data={this.state.itinerary}
            removeItineraryCount={() => {
              this.setState({
                itinerary: this.state.itinerary.filter(itin => itin?.day)
              })
            }}

          />
        ))}
        {this.state.openEdit && (
          <EditItinerary
            handleOpen={true}
            index={this.state.toEdit}
            data={this.state.itinerary}
            getData={this.editItinerary}
            duration={duration}

          />
        )}
        <TimeLine
          data={this.state.itinerary}
          removeItinerary={this.removeItinerary}
          editItinerary={this.toEditItinerary}
        />
        <Button className={classes.button} onClick={this.addItinerary} disabled={this.state?.itinerary?.length||duration!=="" ? this.state?.itinerary?.length === +duration : false}>
          + Add Itinerary
        </Button>
        {!isSaveButtonHide && (this.state.itinerary.length > 0 || prevStateItinerary?.length > 0) && (
          <div style={{ textAlign: "right", marginTop: 20 }}>
            <Button className={classes.saveButton} onClick={this.handleSubmit}>
              Save
            </Button>
          </div>
        )}
      </div>
    );
  }
}

UploadTrip.propTypes = {
  className: PropTypes.string,
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(UploadTrip);
