import React, { Component, Fragment } from 'react';
import {
    Avatar,
    Divider,
    IconButton,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    withStyles
} from '@material-ui/core';

import {
    Delete as DeleteIcon,
    Edit as EditIcon
} from "@material-ui/icons";

// Externals
import PropTypes from "prop-types";

// Custom Styles
import styles from "./style";

class CardGrid extends Component {
    editItem = i => () => {
        this.props.editItem(i);
    }
    removeItem = i => () => {
        this.props.removeItem(i);
    }
    render() {
        const { classes } = this.props;
        return (
            <List className={classes.root}>
                {this.props.data && this.props.data.map((item, index) => (
                    <Fragment key={index}>
                        <ListItem alignItems="flex-start">
                            <ListItemAvatar>
                                <Avatar>{index + 1}</Avatar>
                            </ListItemAvatar>
                            <ListItemText
                                primary={item.title}
                                secondary={
                                    item.options.map((option, optIndex) => (
                                        <span style={{ display: "block" }} key={optIndex}>
                                            {option.name} | Rs. {option.price} {(optIndex == 0)? <span>| {item.type} </span> : ''}
                                        </span>
                                    ))
                                }
                               
                            />
                            <IconButton
                                className={classes.buttonEdit}
                                aria-label="edit"
                                onClick={this.editItem(index)}>
                                <EditIcon />
                            </IconButton>
                            <IconButton
                                className={classes.buttonDel}
                                aria-label="delete"
                                onClick={this.removeItem(index)}>
                                <DeleteIcon />
                            </IconButton>
                        </ListItem>
                        <Divider variant="inset" component="li" />
                    </Fragment>
                ))}
            </List>
        );
    }
}

CardGrid.propTypes = {
    className: PropTypes.string,
    classes: PropTypes.object.isRequired
};


export default withStyles(styles)(CardGrid);