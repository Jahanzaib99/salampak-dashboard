import React, { Component } from "react";

// Externals
import PropTypes from "prop-types";

// Material helpers
import { withStyles } from "@material-ui/core";

// Material components
import {
    Grid,
    IconButton,
    TextField,
} from "@material-ui/core";

import {
    // Add as AddIcon,
    Delete as DeleteIcon
} from '@material-ui/icons';

// Component styles
import styles from "../style";

class PopulateOptions extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: "", // String
            price: "" // Number
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.removeOption = this.removeOption.bind(this);
    }

    componentDidMount() {
        this.setState({
            name: this.props.data[this.props.index].name,
            price: this.props.data[this.props.index].price
        })
    }

    handleChange = (e) => {
        this.setState({ [e.target.name]: e.target.value }, () => {
            if (this.state.name && this.state.price)
                this.handleSubmit();
        });
    }

    removeOption = () => {
        this.props.removeOption(this.props.index);
    }

    handleSubmit = () => {
        this.props.getOption(this.props.index, this.state)
    }

    render() {
        const { classes, index } = this.props;
        return (
            <div>
                <form className={classes.form} noValidate>
                    <Grid container alignItems="center" justify="center" spacing={1}>
                        <Grid item xs={4} sm={
                            (index === 0) ||
                                (index === 1) ||
                                (index === 2) ? 8 : 7}>
                            <TextField
                                className={classes.dialogTextField}
                                name="name"
                                placeholder="Option Tilte"
                                type="text"
                                margin="dense"
                                variant="outlined"
                                value={this.state.name}
                                onChange={this.handleChange}
                            />
                        </Grid>
                        <Grid item xs={4} sm={
                            (index === 0) ||
                                (index === 1) ||
                                (index === 2) ? 4 : 3}>
                            <TextField
                                className={classes.dialogTextField}
                                name="price"
                                placeholder="Price"
                                type="number"
                                margin="dense"
                                variant="outlined"
                                value={this.state.price}
                                onChange={this.handleChange}
                            />
                        </Grid>
                        <Grid item xs={4} sm={2}>
                            {(index === 0)
                                || (index === 1)
                                || (index === 2) ? null : (
                                    <IconButton
                                        className={classes.buttonDel}
                                        onClick={this.removeOption}
                                        aria-label="delete"
                                    >
                                        <DeleteIcon />
                                    </IconButton>
                                )}
                        </Grid>
                    </Grid>
                </form>
            </div>
        );
    }
}

PopulateOptions.propTypes = {
    className: PropTypes.string,
    classes: PropTypes.object.isRequired,
    index: PropTypes.number.isRequired,
};


export default withStyles(styles)(PopulateOptions);
