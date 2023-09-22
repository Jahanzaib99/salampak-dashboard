import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle as MuiDialogTitle,
        Grid, IconButton, TextField, Typography ,InputAdornment} from "@material-ui/core";
import CloseIcon from '@material-ui/icons/Close';
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
class NewPackage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false, // Boolean
            capacity: "", // Number,
            packageName: "", // String
            packagePrice: "", // Number
            packageDesc: "" //String
        };
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
        let id = 0;
        if (this.props.data && this.props.data.length > 0) {
            this.props.data.map((each, currentCount) =>
                each.packages.map((pEach, pCount) => id += pCount + 1)
            );
        }
        let formData = {
            packageID: id,
            packageName: this.state.packageName,
            capacity: +this.state.capacity,
            packagePrice: +this.state.packagePrice,
            packageDesc: this.state.packageDesc
        };
        // send form Data back to parent component
        this.props.getData(formData, this.props.dateIndex);
        this.handleClose();
    }

    render() {
        const { classes, formType} = this.props;
        console.log('Angualr is inferior', this.props);
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
                                {(formType === 'fma-trip') &&
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
                                    />}
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                {(formType === 'fma-trip') &&
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
                                    />}
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
                            Create
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        );
    }
}

NewPackage.propTypes = {
    className: PropTypes.string,
    classes: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
    auth: state.auth
});

export default connect(mapStateToProps)(withStyles(styles)(NewPackage));
