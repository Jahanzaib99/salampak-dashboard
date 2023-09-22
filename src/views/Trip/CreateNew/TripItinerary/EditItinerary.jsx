import React, { Component } from "react";
import { connect } from "react-redux";
// import moment from "moment";

// Externals
import PropTypes from "prop-types";

// Material helpers
import { withStyles } from "@material-ui/core";

// Material components
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle as MuiDialogTitle,
    Grid,
    IconButton,
    TextField,
    Typography
} from "@material-ui/core";

import CloseIcon from '@material-ui/icons/Close';

// Component styles
import styles from "./style";

import environment from "../../../../config/config";

const dialogStyles = theme => ({
    root: {
        margin: 0,
        padding: theme.spacing(2),
    },
    closeButton: {
        position: 'absolute',
        right: theme.spacing(1),
        top: theme.spacing(1),
        color: theme.palette.grey[500],
    },
});

const DialogTitle = withStyles(dialogStyles)(props => {
    const { children, classes, onClose, ...other } = props;
    return (
        <MuiDialogTitle disableTypography className={classes.root} {...other}>
            <Typography variant="h6">{children}</Typography>
            {onClose ? (
                <IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
                    <CloseIcon />
                </IconButton>
            ) : null}
        </MuiDialogTitle>
    );
});
class EditItinerary extends Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false, // Boolean
            day: "1", // Number
            time: "1970-01-01T08:00:00.000Z", // Date
            // duration: "", // Date,
            description: "" // String
        };
        this.handleOpen = this.handleOpen.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        if (!localStorage.getItem("userToken")) {
            this.props.history.push(process.env.NODE_ENV === "development" ? "/" : environment.production.prefix);
        }
        this.setState({
            open: this.props.handleOpen,
            day: this.props.data[this.props.index].day,
            // time: (this.props.data[this.props.index].time.split('T')[1]).split(':')[0]
            //     + ':' + (this.props.data[this.props.index].time.split('T')[1]).split(':')[1],
            description: this.props.data[this.props.index].description,
            // duration: (this.props.data[this.props.index].duration.split('T')[1]).split(':')[0]
            //     + ':' + (this.props.data[this.props.index].duration.split('T')[1]).split(':')[1],
        });
    }

    handleOpen = () => {
        this.setState({ open: true });
    };

    handleClose = () => {
        this.props.getData();
        this.setState({ open: false });
    };

    handleChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });
    }

    handleSubmit = () => {
        // Working with time
        // let time = this.state.time.split(":");
        // let time_hours = +time[0];
        // let time_minutes = +time[1];

        // // Working with duration
        // let duration = this.state.duration.split(":");
        // let duration_hours = +duration[0];
        // let duration_minutes = +duration[1];

        let formData = {
            day: +this.state.day,
            time: this.state.time,
            description: this.state.description
        };
        // formData.time = new Date(formData.time).toISOString();

        this.props.getData(this.props.index, formData);
        this.handleClose();
    }


    render() {
        const { classes } = this.props;
        return (
            <div>
                <Dialog
                    open={this.state.open}
                    aria-labelledby="customized-dialog-title"
                    onClose={this.handleClose}>
                    <DialogTitle id="customized-dialog-title"
                        onClose={this.handleClose}>
                        <span style={{ fontSize: 17 }}>Edit Itinerary</span>
                    </DialogTitle>
                    <DialogContent dividers>
                        <form className={classes.form} noValidate>
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={12}>
                                    <TextField
                                        className={classes.textField}
                                        name="day"
                                        label="Day"
                                        type="number"
                                        margin="dense"
                                        value={this.state.day}
                                        onChange={this.handleChange}
                                        InputLabelProps={{
                                            shrink: true,
                                            style: { fontSize: 18 }
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={12}>
                                    <textarea
                                        className={classes.textField}
                                        style={{
                                            padding: 5,
                                            fontSize: 15,
                                            fontFamily: "Roboto, sans-serif",
                                            borderRadius: 4,
                                            borderColor: 'rgb(0, 0, 0, 0.23)',
                                            borderWidth: '1px'
                                        }}
                                        name="description"
                                        placeholder="Description"
                                        type="text"
                                        margin="dense"
                                        rows={6}
                                        value={this.state.description}
                                        onChange={this.handleChange}
                                    />
                                </Grid>
                            </Grid>
                        </form>
                    </DialogContent>
                    <DialogActions>
                        <Button
                            className={classes.button}
                            onClick={this.handleSubmit}>
                            Save
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        );
    }
}

EditItinerary.propTypes = {
    className: PropTypes.string,
    classes: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    auth: state.auth
});

export default connect(mapStateToProps)(withStyles(styles)(EditItinerary));
