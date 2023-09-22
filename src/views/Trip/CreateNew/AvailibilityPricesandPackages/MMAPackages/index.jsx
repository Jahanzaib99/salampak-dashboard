import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import {
    withStyles,
    Grid,
} from "@material-ui/core";
import { Dashboard as DashboardLayout } from "layouts";
import styles from "./style";
import { otherTag } from "../../../../../config/routes";
import MMAPackageTableComponent from "./MMAPackageTableComponent";

class OtherTags extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        const { classes } = this.props;
        console.log('Rect i on - > index: this.props', this.props);
        return (
                <div className={classes.root}>
                    <Grid container spacing={3}>
                        <Grid item xs={12} className={classes.gridForTable}>
                            <MMAPackageTableComponent 
                               eventId={this.props.eventId}
                            url={otherTag} />
                        </Grid>
                    </Grid>
                </div>
        );
    }
}

OtherTags.propTypes = {
    auth: PropTypes.object.isRequired,
    className: PropTypes.string,
    classes: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    auth: state.auth
});

export default connect(mapStateToProps)(withStyles(styles)(OtherTags));