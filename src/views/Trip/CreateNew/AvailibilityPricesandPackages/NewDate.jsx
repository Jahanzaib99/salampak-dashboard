import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core";
import swal from "@sweetalert/with-react";

import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle as MuiDialogTitle,
    Grid,
    IconButton,
    MenuItem,
    TextField,
    Typography
} from "@material-ui/core";
import CloseIcon from '@material-ui/icons/Close';
import styles from "./style";
import { daysInAWeek } from "../../../../config/trip";
import environment from "../../../../config/config";
import moment from "moment";

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

class NewDate extends Component {
    constructor(props) {
        super(props);
        console.log('new Data clicked');
        this.state = {
            open: false, // Boolean
            type: "fixedDate", // String
            dayOfWeek: 1, // Number
            fixedDate: "", // Date,
            startDate: "", // Date,
            endDate: "", // Date,
            packagePrices: [] // Array
        };
        this.handleOpen = this.handleOpen.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        if (this.props.handleOpen) {
            this.handleOpen();
        }
    }

    handleOpen = () => {
        this.setState({ open: true });
    };

    handleClose = () => {
        this.setState({ open: false });
    };

    handleChange = (e) => {
        console.log("e.target.name :", e.target.name);
        console.log("e.target.value :", e.target.value);

        this.setState({ [e.target.name]: e.target.value });
    }

    handleSubmit = () => {
        let formData = {
            type: this.state.type,
            date: moment().format('YYYY-MM-DD'),
            dayOfWeek: +this.state.dayOfWeek,
            packages: this.state.packagePrices
        };
        if (this.state.type === "fixedDate") {
            formData.date = this.state.fixedDate;
        }
        else if (this.state.type === "weekly") {
            formData.dayOfWeek = +this.state.dayOfWeek;
        }
        else if (this.state.type === "daily") {
            formData.startDate = this.state.startDate;
            formData.endDate = this.state.endDate;
        }
        console.log("Friday formData", formData);

        if(formData.type === 'fixedDate' && formData.date === ''){
            swal('Date is required', {
                icon: 'error'
            });
        } 
        else {       
            this.props.getData(formData);
            this.handleClose();
            }
    }


    render() {
        const { classes } = this.props;
        return (
            <div>
                <Dialog
                    open={this.state.open}
                    onClose={this.handleClose}
                    aria-labelledby="customized-dialog-title">
                    <DialogTitle id="customized-dialog-title" onClose={this.handleClose}>
                        <span style={{ fontSize: 17 }}>New Date</span>
                    </DialogTitle>
                    <DialogContent dividers>
                        <form className={classes.form} noValidate>
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={12}>
                                    <TextField
                                        select
                                        className={classes.customTextField}
                                        name="type"
                                        label="Type"
                                        margin="dense"
                                        variant="outlined"
                                        value={this.state.type}
                                        onChange={this.handleChange}
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                    >
                                        <MenuItem value="fixedDate">Fixed Date</MenuItem>
                                        <MenuItem value="weekly">Weekly Recurring</MenuItem>
                                        <MenuItem value="daily">Daily Recurring</MenuItem>
                                    </TextField>
                                </Grid>
                                <Grid item xs={12} sm={12}>
                                    {this.state.type === "fixedDate"
                                        ? (
                                            <TextField
                                                className={classes.customTextField}
                                                name="fixedDate"
                                                label="Date"
                                                type="date"
                                                margin="dense"
                                                variant="outlined"
                                                value={this.state.fixedDate}
                                                onChange={this.handleChange}
                                                InputLabelProps={{
                                                    shrink: true,
                                                }}
                                            />
                                        )
                                        : null
                                    }
                                    {this.state.type === "weekly"
                                        ? (
                                            <TextField
                                                select
                                                className={classes.customTextField}
                                                name="dayOfWeek"
                                                label="Day of Week"
                                                margin="dense"
                                                variant="outlined"
                                                value={this.state.dayOfWeek}
                                                onChange={this.handleChange}
                                                InputLabelProps={{
                                                    shrink: true,
                                                }}
                                            >
                                                {daysInAWeek.map((item, index) => (
                                                    <MenuItem value={item.value} key={index}>{item.label}</MenuItem>
                                                ))}
                                            </TextField>
                                        )
                                        : null
                                    }
                                    {this.state.type === "daily"
                                        ? (
                                            <Fragment>
                                                <TextField
                                                    className={classes.customTextField}
                                                    name="startDate"
                                                    label="Start Date"
                                                    type="date"
                                                    margin="dense"
                                                    variant="outlined"
                                                    value={this.state.startDate}
                                                    onChange={this.handleChange}
                                                    InputLabelProps={{
                                                        shrink: true,
                                                    }}
                                                />
                                                <TextField
                                                    className={classes.customTextField}
                                                    name="endDate"
                                                    label="End Date"
                                                    type="date"
                                                    margin="dense"
                                                    variant="outlined"
                                                    value={this.state.endDate}
                                                    onChange={this.handleChange}
                                                    InputLabelProps={{
                                                        shrink: true,
                                                    }}
                                                />
                                            </Fragment>
                                        )
                                        : null
                                    }
                                </Grid>
                            </Grid>
                        </form>
                    </DialogContent>
                    <DialogActions>
                        <Button
                            className={classes.button}
                            onClick={this.handleSubmit}>
                            Create
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        );
    }
}

NewDate.propTypes = {
    className: PropTypes.string,
    classes: PropTypes.object.isRequired,
    countOfPackages: PropTypes.array
};

const mapStateToProps = state => ({
    auth: state.auth
});

export default connect(mapStateToProps)(withStyles(styles)(NewDate));
