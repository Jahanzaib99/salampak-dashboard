import React, { Component, } from 'react';
import {
    Button,
    Grid,
    withStyles
} from '@material-ui/core';

import DateAndActions from "./Package/DateActions";
import PackageDetails from "./Package/PackageDetails";

// Externals
import PropTypes from "prop-types";

// Custom Styles
import styles from "./style";

class AvailibilityList extends Component {
    editItem = i => () => {
        this.props.editListItem(i);
    }
    removeItem = i => () => {
        this.props.removeListItem(i);
    }

    editPackage = (i, di) => () => {
        this.props.editPackage(i, di);
    }
    removePackage = (i, di) => () => {
        this.props.removePackage(i, di);
    }

    addNewPackages = (index) => {
        this.props.addPackage("add", index);
    }

    render() {
        const { classes, data } = this.props;
        return (
            <div className={classes.root}>
                <div>
                    {data.map((item, index) => (
                        <div
                            key={index}
                            style={{
                                border: "1px solid #ededed",
                                padding: 10,
                                marginBottom: 10
                            }}>
                            <Grid container>
                                <DateAndActions
                                    date={item.date}
                                    type={item.type}
                                    index={index}
                                    editItem={this.editItem}
                                    removeItem={this.removeItem}
                                />
                                {item.packages.length > 0 && (
                                    <PackageDetails
                                        data={item.packages}
                                        edit={this.editPackage}
                                        remove={this.removePackage}
                                        dateIndex={index}
                                    />
                                )}
                                <Grid item xs={12} sm={12}>
                                    <Button
                                        className={classes.simpleButton}
                                        color="secondary"
                                        variant="contained"
                                        onClick={e => this.addNewPackages(index)}
                                    >Add Package</Button>
                                </Grid>
                            </Grid>
                        </div>
                    ))}
                </div>
            </div>
        );
    }
}

AvailibilityList.propTypes = {
    className: PropTypes.string,
    classes: PropTypes.object.isRequired,
    data: PropTypes.array.isRequired
};


export default withStyles(styles)(AvailibilityList);