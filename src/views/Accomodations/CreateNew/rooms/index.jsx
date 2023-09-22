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

import RoomComponent from "./AddRoom";
import EditItinerary from "./EditRoom";
import RoomList from "./roomList";
import { trip } from "../../../../config/routes";
// Component styles
import styles from "./style";

class UploadRoom extends Component {
  constructor(props) {
    super(props);
    this.state = {
      eventId: "",
      rooms: [],
      roomCount: [],
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
      rooms: this.props.data,
      prevStateItinerary: this.props.data,
    });
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps?.data?.length !== this.props?.data?.length || JSON.stringify(prevProps?.data)!==JSON.stringify(this.props?.data)) {
      this.setState({
        rooms: this.props.data,
      });
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
      let rooms = this.state.roomCount.concat([""]);
      this.setState({ roomCount: rooms });
    }
    else {
      swal({
        text: "Duration is requried",
        icon: "error",
      })
    }
  };

  toEditItinerary = (i) => {
    log("Trigger", "info", "Edit an rooms");
    this.setState({ toEdit: i, openEdit: true });
  };

  removeItinerary = (i) => {
    log("Trigger", "warning", "Remove an rooms");
    swal({
      title: "Are you sure?",
      text: "Once deleted, you will not be able to recover this record!",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        let rooms = [
          ...this.state.rooms.slice(0, i),
          ...this.state.rooms.slice(i + 1),
        ];
        log("Removed the rooms", "success", this.state.rooms[i]);
        this.setState({ rooms: rooms });
      } else {
        swal("Room has not been deleted!", {
          icon: "info",
        });
      }
    });
  };

  insertIntoObject = (obj) => {
    if (obj) {
      let roomArray = [];
      this.state.rooms.map((item) => roomArray.push(item));
      roomArray.push(obj);
      log("Add new rooms", "success", roomArray);
      this.setState({ rooms: roomArray });
    }
  };

  editItinerary = (i, obj) => {
    let rooms = this.state.rooms;
    rooms[i] = obj;
    log("Edit the existing rooms", "success", rooms[i]);
    this.setState({ rooms: rooms, openEdit: false });
  };

  handleSubmit = () => {
    const { rooms } = this.state;
    const { tripId } = this.props;
    axios
      .post(`${trip}/${tripId}/tripItinerary`, { rooms })
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
    const { classes, accomodationId } = this.props;
    const { prevStateItinerary } = this.state
    return (
      <div>
        {this.state.roomCount.map((item, index) => (
          <RoomComponent
            key={index}
            handleOpen={true}
            getData={this.insertIntoObject}
            data={this.state.rooms}
            removeRoomCount={() => {
              this.setState({
                rooms: this.state.rooms.filter(roomArray => roomArray?.day)
              })
            }}
            accomodationId={accomodationId}
            enableTabs={this.props.enableTabs}
          />
        ))}
        {this.state.openEdit && (
          <EditItinerary
            handleOpen={true}
            index={this.state.toEdit}
            data={this.state.rooms}
            getData={this.editItinerary}
            accomodationId={accomodationId}
            enableTabs={this.props.enableTabs}

          />
        )}
        <RoomList
          data={this.state.rooms}
          removeItinerary={this.removeItinerary}
          editItinerary={this.toEditItinerary}
          accomodationId={accomodationId}
          enableTabs={this.props.enableTabs}

        />
        <Button className={classes.button} onClick={this.addItinerary} >
          + Add Room
        </Button>
        {/* {!isSaveButtonHide && (this.state.rooms.length > 0 || prevStateItinerary?.length > 0) && (
          <div style={{ textAlign: "right", marginTop: 20 }}>
            <Button className={classes.saveButton} onClick={this.handleSubmit}>
              Save
            </Button>
          </div>
        )} */}
      </div>
    );
  }
}

UploadRoom.propTypes = {
  className: PropTypes.string,
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(UploadRoom);
