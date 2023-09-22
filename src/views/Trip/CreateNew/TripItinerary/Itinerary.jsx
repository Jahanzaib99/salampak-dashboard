import React, { Component } from "react";

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

class Itinerary extends Component {
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
        this.setState({ [e.target.name]: e.target.value });
    }

    handleSubmit = () => {
        let formData = {
            day: +this.state.day,
            time: this.state.time,
            description: this.state.description
        };

        this.props.getData(formData);
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
                        <span style={{ fontSize: 17 }}>New Itinerary</span>
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
                                        variant="outlined"
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
                                        rows={8}
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
                            Create
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        );
    }
}

Itinerary.propTypes = {
    className: PropTypes.string,
    classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Itinerary);
