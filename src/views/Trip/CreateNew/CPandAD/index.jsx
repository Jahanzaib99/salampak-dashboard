// Cancellation Policy and Additional Details

import React, { Component } from "react";
import { connect } from "react-redux";
import axios from "axios";

// import moment from "moment";
import swal from "@sweetalert/with-react";

// Externals
import PropTypes from "prop-types";

// Material helpers
import { withStyles } from "@material-ui/core";

// Material components
import {
    Button,
    FormLabel,
    InputAdornment,
    TextField
} from "@material-ui/core";

// Custom Select Component
import Select from "../subComponents/select"

// Component styles
import styles from "./style";

import { events } from "../../../../config/routes";
import environment from "../../../../config/config";

// Trip Data 
import {
    equipment,
    whatsIncluded
} from "../../../../config/trip";

class CPandAD extends Component {
    constructor(props) {
        super(props);
        this.state = {
            eventId: "",
            bookingDeadline: "",
            childrenDiscount: "",
            discount: "",
            cancellationPolicy: "",
            equipments: [],
            whatsIncluded: [],
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        if (!localStorage.getItem("userToken")) {
            this.props.history.push(process.env.NODE_ENV === "development" ? "/" : environment.production.prefix);
        }
        let cancellationPolicy = `- 50% of the total amount will be deducted if **cancellation** notified 7 days prior to the trip.
- 75% of the total amount will be deducted if **cancellation** notified 4 days prior to the trip.
- 100% of the total amount will be deducted if **cancellation** notified in the last 4 days prior to the trip unless the trip is cancelled by the management.`;
        if (this.props.data && this.props.data.equipments !== undefined) {
            let equipments = [];
            this.props.data.equipments.map(item =>
                equipments.push({
                    value: item,
                    label: item
                })
            );
            let whatsIncluded = [];
            this.props.data.whatsIncluded.map(item =>
                whatsIncluded.push({
                    value: item,
                    label: item
                })
            );
            this.setState({
                bookingDeadline: +this.props.data.bookingDeadline,
                childrenDiscount: this.props.data.childrenDiscount,
                discount: this.props.data.discount,
                equipments: equipments,
                whatsIncluded: whatsIncluded,
                cancellationPolicy: cancellationPolicy,
                eventId: this.props.event,
            });
        }
        else {
            this.setState({
                cancellationPolicy: cancellationPolicy,
                eventId: this.props.event,
            });
        }
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        let res = nextProps.data;
        if (res.length > 0) {
            let equipments = [];
            res.equipments.map(item =>
                equipments.push({
                    value: item,
                    label: item
                })
            );
            let whatsIncluded = [];
            res.whatsIncluded.map(item =>
                whatsIncluded.push({
                    value: item,
                    label: item
                })
            );
            this.setState({
                tripVendor: nextProps.vendor,
                bookingDeadline: +nextProps.bookingDeadline,
                childrenDiscount: nextProps.childrenDiscount,
                discount: nextProps.discount,
                equipments: equipments,
                whatsIncluded: whatsIncluded,
                eventId: nextProps.event,
            });
        }
        else if (nextProps.event) {
            this.setState({
                tripVendor: nextProps.vendor,
                eventId: nextProps.event,
            })
        }
    }

    handleChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });
    }

    getValuesFromMS = (id, values) => {
        // Equipments
        if (+id === 1) {
            if (values === null) {
                this.setState({
                    equipments: []
                });
            }
            else {
                let equipmentArray = [];
                values.map(item => {
                    equipmentArray.push(item);
                    return equipmentArray;
                })
                this.setState({ equipments: equipmentArray });
            }
        }
        else if (+id === 2) {
            if (values === null) {
                this.setState({
                    whatsIncluded: []
                });
            }
            else {
                let whatsIncludedArray = [];
                values.map(item => {
                    whatsIncludedArray.push(item);
                    return whatsIncludedArray;
                })
                this.setState({ whatsIncluded: whatsIncludedArray });
            }
        }
    }

    handleSubmit = () => {
        let equipmentArray = [];
        let iteree1 = this.state.equipments.length;
        for (let i = 0; i < iteree1; i++) {
            equipmentArray[i] = this.state.equipments[i].value;
        }
        let whatsIncArray = [];
        let iteree2 = this.state.whatsIncluded.length;
        for (let i = 0; i < iteree2; i++) {
            whatsIncArray[i] = this.state.whatsIncluded[i].value;
        }
        let formData = {
            bookingDeadline: +this.state.bookingDeadline,
            childrenDiscount: +parseFloat(this.state.childrenDiscount).toFixed(3),
            discount: +parseFloat(this.state.discount).toFixed(3),
            cancellationPolicy: this.state.cancellationPolicy,
            equipments: equipmentArray,
            whatsIncluded: whatsIncArray
        };
        axios
            .put(`${events}/${this.state.eventId}/cancelpolicy`, formData)
            .then(response => {
                swal(response.data.data.message, {
                    icon: 'success'
                });
                this.props.enableTabs(6);
                this.props.retainData({
                    dataDtl: formData
                });
            })
            .catch(error => {
                swal(error.response.data.error.message, {
                    icon: 'error'
                });
            });
    }


    render() {
        const { classes } = this.props;
        return (
            <div>
                <form className={classes.form}>
                    <TextField
                        className={classes.textField}
                        name="bookingDeadline"
                        placeholder="Booking Deadline"
                        type="number"
                        margin="dense"
                        variant="outlined"
                        value={this.state.bookingDeadline}
                        onChange={this.handleChange}
                        InputProps={{
                            endAdornment: <InputAdornment style={{ fontSize: 22 }} position="end">days</InputAdornment>
                        }}
                    />

                    <TextField
                        className={classes.textField}
                        name="childrenDiscount"
                        placeholder="Children Discount"
                        type="text"
                        margin="dense"
                        variant="outlined"
                        value={this.state.childrenDiscount}
                        onChange={this.handleChange}
                        InputProps={{
                            endAdornment: <InputAdornment style={{ fontSize: 22 }} position="end">%&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</InputAdornment>
                        }}
                    />

                    <TextField
                        className={classes.textField}
                        style={{ marginBottom: 20 }}
                        name="discount"
                        placeholder="Discount"
                        type="text"
                        margin="dense"
                        variant="outlined"
                        value={this.state.discount}
                        onChange={this.handleChange}
                        InputProps={{
                            endAdornment: <InputAdornment position="end">%&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</InputAdornment>
                        }}
                    />

                    <FormLabel style={{ fontSize: 16 }}>Cancellation Policy</FormLabel>
                    <textarea
                        style={{ fontSize: 15, fontFamily: "Roboto, sans-serif" }}
                        className={classes.textArea}
                        name="cancellationPolicy"
                        type="text"
                        margin="dense"
                        rows={10}
                        defaultValue={this.state.cancellationPolicy}
                        onChange={this.handleChange}
                    />
                    <Select
                        id="1"
                        label="Recommended Equipment"
                        labelWidth="105"
                        data={equipment}
                        options={this.state.equipments}
                        getValues={this.getValuesFromMS}
                    />
                    <Select
                        id="2"
                        label="Whats Included"
                        labelWidth="105"
                        data={whatsIncluded}
                        options={this.state.whatsIncluded}
                        getValues={this.getValuesFromMS}
                    />
                    <div style={{ textAlign: "right", marginTop: 20 }}>
                        <Button
                            className={classes.saveButton}
                            onClick={this.handleSubmit}
                        >Save</Button>
                    </div>
                </form>
            </div>
        );
    }
}

CPandAD.propTypes = {
    className: PropTypes.string,
    classes: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    auth: state.auth
});

export default connect(mapStateToProps)(withStyles(styles)(CPandAD));
