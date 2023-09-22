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
import styles from "../style";

import PopulateOptions from './PopulateOptions';

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

class EditOption extends Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
            title: "", // String
            type: "single", // single or multiple
            options: [],
            optionsCount: []
        };
        this.handleOpen = this.handleOpen.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.addOption = this.addOption.bind(this);
        this.removeOption = this.removeOption.bind(this);
        this.getOptions = this.getOptions.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        this.setState({
            open: this.props.handleOpen,
            title: this.props.data[this.props.index].title,
            type: this.props.data[this.props.index].type,
            options: this.props.data[this.props.index].options,
            optionsCount: this.props.data[this.props.index].options
        });
    }

    handleOpen = () => {
        this.setState({ open: true });
    };

    handleClose = () => {
        let options = {
            title: this.state.title,
            type: this.state.type,
            options: this.state.options
        }
        this.props.getData(this.props.index, options);
        this.setState({ open: false });
    };

    handleChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });
    }

    addOption = () => {
        let newOption = {
            name: "",
            price: "",
        };
        let options = this.state.options;
        options.push(newOption);
        let optionsLength = this.state.optionsCount;
        this.setState({
            optionsCount: optionsLength,
            options: options
        });
    }

    removeOption = i => {
        let updatedOptions = this.state.options;
        updatedOptions.pop(i);
        this.setState({ optionsCount: updatedOptions });
    }

    getOptions = (index, obj) => {
        let options = this.state.options;
        options[index] = (obj);
        this.setState({ options: options });
    }

    handleSubmit = () => {
        let options = {
            title: this.state.title,
            type: this.state.type,
            options: this.state.options
        }
        this.props.getData(this.props.index, options);
        this.handleClose();
    }


    render() {
        const { classes } = this.props;
        return (
            <div>
{console.log('EditAddon me hon')}
{console.log('this.state',this.state)}
{console.log('this.props',this.props)}
                <p1>EditAddon me hon</p1>
                <Dialog
                    open={this.state.open}
                    onClose={this.handleClose}
                    aria-labelledby="customized-dialog-title">
                    <DialogTitle id="customized-dialog-title" onClose={this.handleClose}>
                        <span style={{ fontSize: 17 }}>Edit Add-on</span>
                    </DialogTitle>
                    <DialogContent dividers>
                        <Grid container spacing={1}>
                            <Grid item xs={12} sm={12}>
                                <TextField
                                    className={classes.textField}
                                        name="title"
                                    placeholder="Title"
                                    type="text"
                                    margin="dense"
                                    variant="outlined"
                                    value={this.state.title}
                                    onChange={this.handleChange}
                                />
                            </Grid>
                            <Typography variant="h5" gutterBottom>
                                Options
                            </Typography>
                            {this.state.optionsCount.map((item, index) => (
                                <PopulateOptions
                                    index={index}
                                    key={index}
                                    data={this.state.options}
                                    getOption={this.getOptions}
                                    removeOption={this.removeOption}
                                />
                            ))}
                            <Grid item xs={12} sm={12}>
                                <Button
                                    className={classes.addButton}
                                    onClick={this.addOption}>
                                    + Add Option
                            </Button>
                            </Grid>
                        </Grid>
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

EditOption.propTypes = {
    className: PropTypes.string,
    classes: PropTypes.object.isRequired
};

export default withStyles(styles)(EditOption);
