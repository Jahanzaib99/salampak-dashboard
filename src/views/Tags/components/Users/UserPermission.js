
import React, { Component } from 'react'
import {
    Grid,
    withStyles,
    FormGroup,
    FormControlLabel,
    Checkbox,
    Button,
    CircularProgress
} from "@material-ui/core";
import PropTypes from "prop-types";
import styles from "./style";
import capitalizeFirstLetter from 'helpers/Capitalize'
import { compose } from "recompose";
import { connect } from "react-redux";
import axios from 'axios'
import { permission } from 'config/routes'
// Default Layout
import { Dashboard as DashboardLayout } from "layouts";
import swal from 'sweetalert';

class UserPermission extends Component {
    constructor() {
        super()
        this.state = {
            permissions: {},
            isLoading: true
        }
    }
    componentDidMount = () => {
        const { history } = this.props;
        const id = history.location.pathname.split('/users/')[1]
        axios
            .get(`${permission}/${id}`)
            .then(res => {
                this.setState({
                    permissions: res?.data?.data[0]?.permissions ? res?.data?.data[0]?.permissions : {},
                    user: res?.data?.data[0]?.userId ? res?.data?.data[0]?.userId : {},
                    isLoading: false
                })
            })
            .catch(error => {
                this.setState({
                    isLoading: false
                })
                swal(error?.response?.data?.error?.message, {
                    icon: "error",
                });
            });
    }

    updatePermission = () => {
        const { permissions } = this.state;
        const { history } = this.props;
        const id = history.location.pathname.split('/users/')[1]

        axios
            .put(`${permission}/${id}`, { permissions })
            .then(response => {
                swal(response.data.data.message, {
                    icon: "success",
                });
            })
            .catch(error => {
                swal(error?.response?.data.error?.message ? error?.response?.data.error?.message : "Something wrong", {
                    icon: "error",
                });
            });
    }

    render() {
        let { permissions, isLoading, user } = this.state;
        const { classes } = this.props;

        return (
            <div>
                <DashboardLayout title="User Permission">
                    <div className={classes.root}>
                        <Grid container spacing={3}>
                            <Grid item xs={12} className={classes.gridForTable}>
                                <FormGroup row style={{ background: "#fff" }}>
                                    <div style={{ width: "100%" }} >

                                        {
                                            !isLoading ? Object.keys(permissions ? permissions : "")?.length ?
                                                <div>
                                                    <div style={{ margin: "10px 30px" }}>
                                                        <h3>{capitalizeFirstLetter(user.profile.firstName ? `${user.profile.firstName ? user.profile.firstName : ""} ${user.profile.lastName ? user.profile.lastName : ""}(${user?.type ? user?.type : ""})` : "")}</h3>

                                                    </div>
                                                    <div style={{ width: "100%", display: "flex", flexWrap: "wrap", margin: "50px 0px" }}>
                                                        {
                                                            Object.keys(permissions).map((permission, index) => {
                                                                return (permission !== "dashboardPermission" && ((user.type === "vendor" && permission !== "users") || user.type !== "vendor")) ? <div key={index} style={{ margin: "10px 30px" }}>
                                                                    <h4 style={{ flex: 3 }}>{capitalizeFirstLetter(permission).replace(/([A-Z])/g, ' $1').trim()}:</h4>
                                                                    <div style={{ flex: 7 }}>
                                                                        {Object.keys(permissions[permission]).map((action, index) => {
                                                                            return <FormControlLabel
                                                                                control={<Checkbox color="primary" checked={permissions[permission][action]} onChange={(e) => {
                                                                                    permissions[permission][action] = e.target.checked
                                                                                    this.setState(
                                                                                        { permissions }
                                                                                    )
                                                                                }} name="checkedA" />}
                                                                                label={action === "get" ? "view" : action}
                                                                            />

                                                                        })}
                                                                    </div>
                                                                </div>
                                                                    : ""
                                                            })
                                                        }
                                                    </div>
                                                    <div>
                                                        {
                                                            Object.keys(permissions).map((permission, index) => {
                                                                return permission === "dashboardPermission" ? <div key={index} style={{ margin: "10px 30px" }}>
                                                                    <h3 style={{ flex: 1, marginBottom: "20px" }}>{capitalizeFirstLetter(permission).replace(/([A-Z])/g, ' $1').trim()}:</h3>
                                                                    <div>
                                                                        {Object.keys(permissions[permission]).map((item, index) => {
                                                                            return <div>
                                                                                <h4 style={{ flex: 3, marginBottom: "0px" }}>{capitalizeFirstLetter(item).replace(/([A-Z])/g, ' $1').trim()}:</h4>
                                                                                {
                                                                                    Object.keys(permissions[permission][item]).map((module, index) => {
                                                                                        return ((user.type === "vendor" && module !== "vendors"&& module !== "customers") || user.type !== "vendor")?<FormControlLabel
                                                                                            control={<Checkbox color="primary" checked={permissions[permission][item][module]} onChange={(e) => {
                                                                                                permissions[permission][item][module] = e.target.checked
                                                                                                this.setState(
                                                                                                    { permissions }
                                                                                                )
                                                                                            }} name="checkedA" />}
                                                                                            label={module}
                                                                                        />:""

                                                                                    })
                                                                                }
                                                                            </div>


                                                                        })}
                                                                    </div>
                                                                </div>
                                                                    : ""
                                                            })
                                                        }
                                                    </div>

                                                </div>
                                                : <div
                                                    style={{ textAlign: "center", width: "100%" }}
                                                ><h3>Do not have a Permission of this user</h3></div>
                                                : <div className={classes.flexCenter}>
                                                    <CircularProgress size={60} />
                                                </div>
                                        }
                                    </div>
                                    <div className={classes.btnDiv}>
                                        <Button className={classes.saveButton} onClick={this.updatePermission}>
                                            Save
                                </Button>
                                    </div>
                                </FormGroup>

                            </Grid>
                        </Grid>
                    </div>
                </DashboardLayout>
            </div>
        )
    }
}

UserPermission.propTypes = {
    className: PropTypes.string,
    classes: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
    auth: state.auth,
});


// export default withStyles(styles)(UserPermission);


export default compose(
    withStyles(styles),
    connect(
        mapStateToProps,
        null
    )
)(UserPermission);
