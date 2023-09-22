import React, { Component } from "react";

// Externals
import PropTypes from "prop-types";

// Material components
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle
} from "@material-ui/core";

class AlertBox extends Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false
        };
        this.handleOpen = this.handleOpen.bind(this);
        this.handleClose = this.handleClose.bind(this);
    }

    componentDidMount() {
        this.setState({ open: this.props.handleOpen });
    }

    handleOpen = () => {
        this.setState({ open: true });
    };
    handleClose = () => {
        this.setState({ open: false });
        this.props.handleClose();
    };

    render() {
        return (
            <div>
                <Dialog
                    fullWidth={true}
                    maxWidth="sm"
                    open={this.state.open}
                    onClose={this.handleClose}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description">
                    <DialogTitle id="alert-dialog-title">
                        {this.props.title}
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description" style={{ fontSize: 18 }}>
                            {this.props.description}
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleClose} variant="contained" size="large" style={{ backgroundColor: "#808080", color: "#fff" }}>
                            Cancel
                        </Button>
                        <Button
                            onClick={this.props.affirm}
                            variant="contained"
                            size="large"
                            style={{ backgroundColor: "#f37248", color: "#fff" }}
                            autoFocus>
                            Continue
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        );
    }
}

AlertBox.propTypes = {
    className: PropTypes.string
};

export default AlertBox;
