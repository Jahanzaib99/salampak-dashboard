import React, { Component } from "react";

// Externals
import PropTypes from "prop-types";

// Material helpers
import { withStyles } from "@material-ui/core";
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';

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

import NewOption from './NewOption';

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

class AddOption extends Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
            title: "", // String
            type: "single", // single or multiple
            options: [],
            optionsCount: ['', '', ''],
            addonType: 'multiple'
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
        this.setState({ open: this.props.handleOpen });
    }

    handleOpen = () => {
        this.setState({ open: true });
    };

    handleClose = () => {
        this.setState({ open: false });
    };

    handleChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });
     //   console.log('khd', 'e.target.name: ', e.target.name);
     //   console.log('khd', 'e.target.value: ', e.target.value);
    }

    handleAlignment = (event, newAlignment) => {
      //  console.log("debug khalid", newAlignment);
        if(newAlignment != null){
            this.setState({ addonType: newAlignment });
        }
    }

    addOption = (e) => {
        e.preventDefault();
        let options = this.state.optionsCount.concat(['']);
        this.setState({ optionsCount: options });
    }

    removeOption = i => {
        let options = [
            ...this.state.optionsCount.slice(0, i),
            ...this.state.optionsCount.slice(i + 1),
        ];
        this.setState({ optionsCount: options });
    }

    getOptions = (index, obj) => {
        let options = this.state.options;
        options[index] = (obj);
        this.setState({ options: options });
    }

    handleSubmit = () => {
        let options = {
            title: this.state.title,
            //type: this.state.type,
            type: this.state.addonType,
            options: this.state.options
        }
        this.props.getData(options);
        this.handleClose();
    }


    render() {
        const { classes } = this.props;
        const {addonType} = this.state;
        return (
            <div>
                <Dialog
                    open={this.state.open}
                    onClose={this.handleClose}
                    aria-labelledby="customized-dialog-title">
                    <DialogTitle id="customized-dialog-title" onClose={this.handleClose}>
                        <span style={{ fontSize: 17 }}>New Add-on</span>
                    </DialogTitle>
                    <DialogContent dividers>
                        <Grid container spacing={1}>

                            <div>    
                         <ToggleButtonGroup 
                            value={this.state.addonType }//formType}
                            exclusive
                            size='large'
                            disabled='true'
                            onChange={this.handleAlignment}
                           // onChange={this.props.handleAlignment}
                            >
                                <ToggleButton   className={classes.toggleButtonGroup} value="single"  disabled={ (addonType === 'multiple') ? false : true} >
                                    Single
                                </ToggleButton>
                                <ToggleButton className={classes.toggleButtonGroup} value="multiple" disabled={ (addonType === 'single') ? false : true} >
                                    Multiple
                                </ToggleButton>
                            </ToggleButtonGroup>
                                            
                           </div>
                
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
                                <NewOption
                                    index={index}
                                    key={index}
                                    getOption={this.getOptions}
                                    removeOption={this.removeOption}
                                />
                            )
                            )}
                            <Grid item xs={12} sm={12}>
                                <Button
                                    className={classes.buttonEdit}
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
                            Create
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        );
    }
}

AddOption.propTypes = {
    className: PropTypes.string,
    classes: PropTypes.object.isRequired
};

export default withStyles(styles)(AddOption);
