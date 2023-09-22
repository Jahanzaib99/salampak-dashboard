import React, { Component, Fragment } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { logoutUser, setCurrentUser } from "../../../../actions/authActions";
// Externals
import classNames from "classnames";
import compose from "recompose/compose";
import PropTypes from "prop-types";
import Form from "../../../../views/Tags/middleware/Form";

// Material helpers
import { withStyles } from "@material-ui/core";

// Material components
import {
    // Badge,
    IconButton,
    Popover,
    Toolbar,
    Tooltip,
    Typography,
    Grid,
    Paper,
    Avatar,
    ListItemAvatar,
    ListItemText,
    ListItem

} from "@material-ui/core";

// Material icons
import {
    Menu as MenuIcon,
    Close as CloseIcon,
    // NotificationsOutlined as NotificationsIcon,
    Input as InputIcon
} from "@material-ui/icons";

// Shared services
import { getNotifications } from "services/notification";

// Custom components
import AccountCircle from '@material-ui/icons/AccountCircle';
import { users } from './../../../../config/routes';
import axios from 'axios'
// Component styles
import styles from "./styles";
import swal from 'sweetalert';

class Topbar extends Component {
    signal = true;
    constructor(props) {
        super(props)
        this.state = {
            notifications: [],
            notificationsLimit: 4,
            notificationsCount: 0,
            notificationsEl: null,
            user: {
                profile: {
                    firstName: "",
                    lastName: "",
                    gender: "",
                    email: "",
                    // dob: "",
                    mobile: "",
                    nic: "",
                },
                _id: ""

            },
            formFields: [
                {
                    name: "firstName",
                    label: "First Name",
                    type: 14,
                },
                {
                    name: "lastName",
                    label: "Last Name",
                    type: 15,
                },
                {
                    name: "email",
                    label: "Email address",
                    type: 16,
                },
                {
                    name: "mobile",
                    label: "Mobile Number",
                    type: 17,
                },

                {
                    name: "nic",
                    label: "Nic",
                    type: 20,
                },
                {
                    name: "type",
                    label: "Type",
                    type: 5,
                    options: ["admin", "employee", 'vendor'],
                    disabled: true,
                },
                props.auth.type === 'vendor' ?
                    {
                        name: "name",
                        label: "Company Name",
                        type: 1,
                    } : {
                        isHide: true
                    },

                props.auth.type === 'vendor' ?
                    {
                        name: "vendorType",
                        label: "Vendor Type",
                        type: 24,
                        options: ["tripAndEvent", "hotel"],
                        disabled: true,
                    } : {
                        isHide: true
                    },
                props.auth.type === 'vendor' ?
                    {
                        name: "bankTitle",
                        label: "Bank Title",
                        type: 25,
                    } : {
                        isHide: true
                    },
                props.auth.type === 'vendor' ?
                    {
                        name: "accountName",
                        label: "Account Name",
                        type: 26,

                    } : {
                        isHide: true
                    },
                props.auth.type === 'vendor' ?
                    {
                        name: "accountNumber",
                        label: "Account Number",
                        type: 27,

                    } : {
                        isHide: true
                    },
                // {
                //     name: "dob",
                //     label: "Date of Birth",
                //     type: 21,
                // },
                {
                    name: "gender",
                    label: "Gender",
                    type: 22,
                    options: ["male", "female"],
                },
            ],
        };
    }

    async getNotifications() {
        try {
            const { notificationsLimit } = this.state;

            const {
                notifications,
                notificationsCount
            } = await getNotifications(notificationsLimit);

            if (this.signal) {
                this.setState({
                    notifications,
                    notificationsCount
                });
            }
        } catch (error) {
            return;
        }
    }

    componentDidMount() {
        this.signal = true;
        this.getNotifications();
        this.setUserData();
    }

    componentWillUnmount() {
        this.signal = false;
    }
    setUserData = () => {
        const { auth } = this.props;
        let user = {
            profile: {
                firstName: auth?.profile?.firstName,
                lastName: auth?.profile?.lastName,
                gender: auth?.profile?.gender,
                email: auth?.profile?.email,
                // dob: +auth?.profile?.dob,
                mobile: auth?.profile?.mobile,
                nic: auth?.profile?.nic,
                bankTitle: auth?.profile?.bankTitle,
                accountName: auth?.profile?.accountName,
                accountNumber: auth?.profile?.accountNumber,


            },
            name: auth?.profile?.companyName,
            vendorType: auth?.profile?.vendorType,
            _id: auth?.user,
            type: auth?.profile?.type

        }
        this.setState({
            user
        })
    }
    handleSignOut = e => {
        // Importing Logout functionality
        e.preventDefault();
        this.props.logoutUser();
    };

    handleShowNotifications = event => {
        this.setState({
            notificationsEl: event.currentTarget
        });
    };

    handleCloseNotifications = () => {
        this.setState({
            notificationsEl: null
        });
    };
    handleMenu = (event) => {
        this.setState({ dropdownEl: event.currentTarget })
    };

    handleClose = () => {
        this.setState({
            dropdownEl: null
        })
    };
    formatDate = (date) => {
        var d = new Date(date),
            month = "" + (d.getMonth() + 1),
            day = "" + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2) month = "0" + month;
        if (day.length < 2) day = "0" + day;

        return [year, month, day].join("-");
    };
    handleUpdate = (updatedData, id) => {
        let payload = {
            firstName: updatedData.firstName,
            lastName: updatedData.lastName,
            mobile: updatedData.mobile,
            gender: updatedData.gender,
            nic: updatedData.nic,
            // dob: this.formatDate(updatedData.dob),
            companyName: updatedData.name,
            vendorType: updatedData.vendorType,
            type: updatedData.type,
            bankTitle: updatedData.bankTitle,
            accountName: updatedData.accountName,
            accountNumber: updatedData.accountNumber,

        };
        axios
            .put(`${users}/${id}/update`, payload)
            .then((response) => {
                localStorage.setItem("userName", payload.firstName + ' ' + payload.lastName);
                localStorage.setItem("firstName", payload.firstName);
                localStorage.setItem("lastName", payload.lastName);
                localStorage.setItem("userGender", payload.gender);
                // localStorage.setItem("dob", payload.dob);
                localStorage.setItem("mobile", payload.mobile);
                localStorage.setItem("nic", payload.nic);
                localStorage.setItem("vendorType", payload.vendorType);
                localStorage.setItem("companyName", payload.companyName);
                localStorage.setItem("bankTitle",payload.bankTitle ?payload.bankTitle : "");
                localStorage.setItem("accountName",payload.accountName ?payload.accountName : "");
                localStorage.setItem("accountNumber",payload.accountNumber ?payload.accountNumber : "");

                payload = { ...payload, email: localStorage.getItem("userEmail") }
                let auth = { ...this.props.auth, ...{ profile: payload }, userId: id, userType: payload.type, }
                // auth.userId = payload.userId,
                // auth.userType = payload.userType,
                this.props.setCurrentUser(auth);

                this.setState({
                    user: {
                        profile: payload,
                        name: payload.companyName,
                        type: payload.type,
                        _id: id,
                        vendorType: payload.vendorType
                    }
                })
                swal(response.data.data.message, {
                    icon: "success",
                });
            })
            .catch((error) => {
                swal(error?.response?.data.error?.message?error?.response?.data.error?.message:"Something wrong", {
                    icon: "error",
                });
            });
    }

    updateFormAttr = () => {
        let { formFields } = this.state;
        formFields = formFields.map((form) => form.type === 16 ? { ...form, disabled: true } : form
        )
        this.setState({
            formFields,
        })
    }
    render() {
        const {
            classes,
            className,
            title,
            isSidebarOpen,
            onToggleSidebar
        } = this.props;
        const {
            modalOpen,
            // notificationsCount,
            notificationsEl,
            dropdownEl,
            formFields,
            user,
            user: {
                profile
            }
        } = this.state;

        const rootClassName = classNames(classes.root, className);
        const showNotifications = Boolean(notificationsEl);
        return (
            <Fragment>
                <div className={rootClassName}>
                    <Toolbar className={classes.toolbar}>
                        <IconButton
                            className={classes.menuButton}
                            onClick={onToggleSidebar}
                            variant="text">
                            {isSidebarOpen ? <CloseIcon /> : <MenuIcon />}
                        </IconButton>
                        <Typography className={classes.title} variant="h4">
                            {title}
                        </Typography>
                        {/* <IconButton
                            className={classes.notificationsButton}
                            onClick={this.handleShowNotifications}>
                            <Badge
                                badgeContent={notificationsCount}
                                color="primary"
                                variant="dot">
                                <NotificationsIcon />
                            </Badge>
                        </IconButton> */}

                        {/* <Tooltip title="Log Out">
                            <IconButton
                                //className={classes.signOutButton}
                                className={classes.notificationsButton}
                                onClick={this.handleSignOut}>
                                <InputIcon />
                            </IconButton>
                        </Tooltip> */}
                        <IconButton
                            className={classes.notificationsButton}
                            aria-label="account of current user"
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            onClick={this.handleMenu}
                            color="inherit"
                        >
                            <AccountCircle />
                        </IconButton>
                    </Toolbar>
                    <Form
                        title="Profile"
                        edit="Profile"
                        data={user}
                        fields={formFields}
                        update={this.handleUpdate}
                        isProfile={true}
                        modalOpen={modalOpen}
                        closeModal={() => this.setState({
                            modalOpen: false
                        })}
                        setObjectId={() => this.updateFormAttr()}



                    />
                </div>
                <Popover
                    anchorEl={dropdownEl}
                    anchorOrigin={{
                        vertical: "bottom",
                        horizontal: "center"
                    }}
                    onClose={this.handleClose}
                    open={dropdownEl ? true : false}
                    transformOrigin={{
                        vertical: "top",
                        horizontal: "left"
                    }}>
                    <Paper style={{ height: '130px', width: '300px' }}>
                        <Grid container spacing={1} >
                            <Grid item xs={12} style={{ backgroundColor: '#84b541' }}>
                            </Grid>
                            <Grid item xs={12}>
                                <Tooltip title="Update Profile" style={{ cursor: "pointer" }} onClick={() => this.setState({ modalOpen: true })}>
                                    <ListItem>
                                        <ListItemAvatar>
                                            <Avatar style={{ color: 'white', backgroundColor: '#84b541' }}>{profile?.firstName ? profile.firstName[0].toUpperCase() : ""}</Avatar>
                                        </ListItemAvatar>
                                        <ListItemText primary={`${profile?.firstName ? profile.firstName : ""} ${profile?.lastName ? profile.lastName : ""}`} secondary={profile?.email ? profile.email : ""} />
                                    </ListItem>
                                </Tooltip>
                            </Grid>
                        </Grid>
                        <Tooltip title="Log Out">
                            <IconButton
                                color="primary"
                                className={classes.signOutButton}
                                onClick={this.handleSignOut}>
                                <InputIcon />
                            </IconButton>
                        </Tooltip>
                    </Paper>
                </Popover>
            </Fragment>
        );
    }
}

Topbar.propTypes = {
    logoutUser: PropTypes.func.isRequired,
    setCurrentUser: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
    className: PropTypes.string,
    classes: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    isSidebarOpen: PropTypes.bool,
    onToggleSidebar: PropTypes.func,
    title: PropTypes.string
};

Topbar.defaultProps = {
    onToggleSidebar: () => { }
};

const mapStateToProps = state => ({
    auth: state.auth
});

export default compose(
    withRouter,
    withStyles(styles),
    connect(
        mapStateToProps,
        { logoutUser, setCurrentUser }
    )
)(Topbar);
