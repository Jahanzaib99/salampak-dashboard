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

class TimeLine extends Component {
    editItem = i => () => {
        this.props.editItinerary(i);
    }
    removeItem = i => () => {
        this.props.removeItinerary(i);
    }
    render() {
        const { classes } = this.props;
        return (
            <List className={classes.root}>
                {this.props.data && this.props.data.map((item, index) => (
                    <Fragment key={index}>
                        <ListItem alignItems="flex-start">
                            <ListItemAvatar>
                                <Avatar>{item?.day}</Avatar>
                            </ListItemAvatar>
                            <ListItemText
                                // primary={(((item.time.split('T')[1]).split(':')[0] / 12) < 1
                                //     ? (item.time.split('T')[1]).split(':')[0] + ':' +
                                //     (item.time.split('T')[1]).split(':')[1] + ' AM'
                                //     : ((item.time.split('T')[1]).split(':')[0] - 12) + ':' +
                                //     (item.time.split('T')[1]).split(':')[1] + ' PM')
                                //     + ' ~ ' +
                                //     (((item.duration.split('T')[1]).split(':')[0] / 12) < 1
                                //         ? (item.duration.split('T')[1]).split(':')[0] + ':' +
                                //         (item.duration.split('T')[1]).split(':')[1] + ' AM'
                                //         : ((item.duration.split('T')[1]).split(':')[0] - 12) + ':' +
                                //         (item.duration.split('T')[1]).split(':')[1] + ' PM')
                                // }
                                primary={
                                    item?.description
                                        ? (
                                            <div>
                                                <p style={{ whiteSpace: "pre-line" }}>
                                                    {item?.description}
                                                </p>
                                            </div>
                                        )
                                        : null
                                }
                            />
                            <IconButton
                                className={classes.buttonEdit}
                                onClick={this.editItem(index)}
                                aria-label="edit"
                            >
                                <EditIcon />
                            </IconButton>
                            <IconButton
                                className={classes.buttonDel}
                                onClick={this.removeItem(index)}
                                aria-label="delete"
                            >
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

TimeLine.propTypes = {
    className: PropTypes.string,
    classes: PropTypes.object.isRequired
};


export default withStyles(styles)(TimeLine);