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
    Typography,
    InputAdornment
} from "@material-ui/core";

import CloseIcon from '@material-ui/icons/Close';

// Component styles
import styles from "../style";

import environment from "../../../../../config/config";

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

class EditPackage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false, // Boolean
            capacity: "", // Number,
            packageName: "", // String
            packagePrice: "", // Number
            packageDesc: "" //String
        };
        this.handleOpen = this.handleOpen.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.populateDataIntoState = this.populateDataIntoState.bind(this);
    }

    componentDidMount() {
        if (!localStorage.getItem("userToken")) {
            this.props.history.push(process.env.NODE_ENV === "development" ? "/" : environment.production.prefix);
        }
        let data = this.props.data;
        if (this.props.handleOpen && data) {
            this.handleOpen();
            this.populateDataIntoState();
        }

    }

    handleOpen = () => {
        this.setState({ open: true });
    };

    handleClose = () => {
        let data = this.props.data;
        let index = this.props.index;
        let dateIndex = this.props.dateIndex;
        let accessObj = data[dateIndex].packages[index];
        this.props.getData(index, dateIndex, accessObj);
        this.setState({ open: false });
    };

    handleChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });
    }

    populateDataIntoState = () => {
        let data = this.props.data;
        let index = this.props.index;
        let dateIndex = this.props.dateIndex;
        let accessPoint = data[dateIndex].packages[index];
        this.setState({
            capacity: accessPoint.capacity,
            packageName: accessPoint.packageName,
            packagePrice: accessPoint.packagePrice,
            packageDesc: accessPoint.packageDesc
        }, () => this.setState(this.state));
    }

    handleSubmit = () => {
        let index = this.props.index;
        let dateIndex = this.props.dateIndex;
        let extract_id = this.props.data[dateIndex];
        let id = (extract_id.packages.length - 1);
        let formData = {
            packageID: id,
            packageName: this.state.packageName,
            capacity: +this.state.capacity,
            packagePrice: +this.state.packagePrice,
            packageDesc: this.state.packageDesc
        };
        this.props.getData(index, dateIndex, formData);
        this.handleClose();
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
                        <span style={{ fontSize: 17 }}>New Package</span>
                    </DialogTitle>
                    <DialogContent dividers>
                        <form className={classes.form} noValidate>
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={12}>
                                    <TextField
                                        className={classes.customTextField}
                                        name="packageName"
                                        label="Package Name"
                                        type="text"
                                        margin="dense"
                                        variant="outlined"
                                        value={this.state.packageName}
                                        onChange={this.handleChange}
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        className={classes.customTextField}
                                        name="capacity"
                                        label="Capacity"
                                        type="number"
                                        margin="dense"
                                        variant="outlined"
                                        value={this.state.capacity}
                                        onChange={this.handleChange}
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        className={classes.customTextField}
                                        name="packagePrice"
                                        label="Price"
                                        type="number"
                                        margin="dense"
                                        variant="outlined"
                                        value={this.state.packagePrice}
                                        onChange={this.handleChange}
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                        InputProps={{
                                            endAdornment:
                                              <InputAdornment position='end'>PKR</InputAdornment>
                                          }}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={12}>
                                    <textarea
                                        className={classes.textArea}
                                        name="packageDesc"
                                        placeholder="Description"
                                        type="number"
                                        margin="dense"
                                        value={this.state.packageDesc}
                                        onChange={this.handleChange}
                                        style={{
                                            fontSize: 15,
                                            fontFamily: "Roboto, sans-serif",
                                            borderRadius: 4,
                                            borderColor: 'rgb(0, 0, 0, 0.23)',
                                            borderWidth: '1px'
                                        }}
                                        rows={6}
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

EditPackage.propTypes = {
    className: PropTypes.string,
    classes: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
    auth: state.auth
});

export default connect(mapStateToProps)(withStyles(styles)(EditPackage));
