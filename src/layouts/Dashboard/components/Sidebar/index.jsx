import React, { Component } from "react";
import { connect } from "react-redux";
import {
    setNestedLink_1,
    setNestedLink_2,
    setNestedLink_3,
    setNestedLink_4,
    setNestedLink_5
} from "../../../../actions/nestedLinkActions";
import { compose } from "recompose";
import { Link, NavLink } from "react-router-dom";

// Externals
import classNames from "classnames";
import PropTypes from "prop-types";
import onClickOutside from 'react-onclickoutside'
import environment from "../../../../config/config";
import {
    whatToDo,
    categories,
    courses,
    dashboard,
    accomodations,
    surroundings,
    eventdtv2,
    whereToGo,
    pressRelease,
    media,
    users,
    facilities,
    trip,
    events,
    booking,
    languages,
    news,
    blogs
    // otherTags,
    // startingLocations,
} from "../../../../config/urls";

// Material helpers
import { withStyles } from "@material-ui/core";

// Material components
import {
    Avatar,
    Divider,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Collapse,
    Typography,
} from "@material-ui/core";

// Material icons
import {
    ArtTrackOutlined as ActivitiesIcon,
    // ArchiveOutlined as OtherTagsIcon,
    CategoryOutlined as TagsIcon,
    DashboardOutlined as DashboardIcon,
    HomeWorkOutlined,
    ExpandMore,
    ExpandLess,
    Filter2Outlined as Eventv2Icon,
    MyLocationOutlined as LocationIcon,
    // NearMeOutlined as StartinglocationIcon,
    ViewListOutlined as CategoriesIcon,
    ClassOutlined as ClassAddIcon,
    NewReleasesOutlined as NewReleasesOutlined,
    PermMediaOutlined as PermMediaOutlined
} from "@material-ui/icons";
import CardTravelIcon from '@material-ui/icons/CardTravel';
import GamesIcon from '@material-ui/icons/Games';
import EventIcon from '@material-ui/icons/Event';
import PeopleIcon from '@material-ui/icons/People';
import RoomServiceIcon from '@material-ui/icons/RoomService';
import GTranslateIcon from '@material-ui/icons/GTranslate';
import BeenhereIcon from '@material-ui/icons/Beenhere';
import AnnouncementIcon from '@material-ui/icons/Announcement';
import WebIcon from '@material-ui/icons/Web';
import ViewModuleIcon from '@material-ui/icons/ViewModule';
import PeopleAltIcon from '@material-ui/icons/PeopleAlt';
// Component styles
import styles from "./styles";

// Capitalize the String
import Capitalize from "../../../../helpers/Capitalize";

// Male and Female Avatars & FMA Logo
import female_av from "../../../../assets/images/female_av.png";
import male_av from "../../../../assets/images/male_av.png";
import fma_logo from "../../../../assets/images/logo1.png";

class Sidebar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: {
                name: "",
                type: "",
                imageUrl: "",
                gender: ""
            },
            openNested1: null,
            openNested2: null,
            openNested3: null,
            openNested4: null,
            openNestedOthers: null
        };
        this.handleNestedLink1 = this.handleNestedLink1.bind(this);
        this.handleNestedLink2 = this.handleNestedLink2.bind(this);
        this.handleNestedLink3 = this.handleNestedLink3.bind(this);
        this.handleNestedLink4 = this.handleNestedLink4.bind(this);
        this.handleNestedLink5 = this.handleNestedLink5.bind(this);
        this.handleNestedOthers = this.handleNestedOthers.bind(this);

    }


    handleClickOutside = () => {
        this.props.onToggleSidebar();
    }

    componentDidMount() {
        const { auth } = this.props;
        let nested1 = this.props.nestedLinks.openNested1;
        let nested2 = this.props.nestedLinks.openNested2;
        let nested3 = this.props.nestedLinks.openNested3;
        let nested4 = this.props.nestedLinks.openNested4;
        let nested5 = this.props.nestedLinks.openNested5;
        this.setState({
            openNested1: nested1 === false ? false : true,
            openNested2: nested2 === false ? false : true,
            openNested3: nested3 === false ? false : true,
            openNested4: nested4 === false ? false : true,
            openNested5: nested5 === false ? false : true,
        });
        this.setState({
            user: {
                name: `${auth?.profile?.firstName} ${auth?.profile?.lastName}`,
                type: auth?.profile?.type,
                imageUrl: auth?.profile?.imageUrl,
                gender: auth?.profile?.gender,
            }
        })
    }
    UNSAFE_componentWillReceiveProps(nextProps) {
        let nested1 = nextProps.nestedLinks.openNested1;
        let nested2 = nextProps.nestedLinks.openNested2;
        let nested3 = nextProps.nestedLinks.openNested3;
        let nested4 = nextProps.nestedLinks.openNested4;
        let nested5 = nextProps.nestedLinks.openNested5;
        this.setState({
            openNested1: nested1 === false ? false : true,
            openNested2: nested2 === false ? false : true,
            openNested3: nested3 === false ? false : true,
            openNested4: nested4 === false ? false : true,
            openNested5: nested5 === false ? false : true,
        })
    }

    // toggle nested list items in sidebar
    handleNestedLink1 = () => {
        this.props.setNestedLink_1(!this.state.openNested1);
        this.setState({ openNested1: !this.state.openNested1 }, () => { });
    }
    handleNestedLink2 = () => {
        this.props.setNestedLink_2(!this.state.openNested2);
        this.setState({ openNested2: !this.state.openNested2 }, () => { });
    }
    handleNestedLink3 = () => {
        this.props.setNestedLink_3(!this.state.openNested3);
        this.setState({ openNested3: !this.state.openNested3 }, () => { });
    }
    handleNestedLink4 = () => {
        this.props.setNestedLink_4(!this.state.openNested4);
        this.setState({ openNested4: !this.state.openNested4 }, () => { });
    }
    handleNestedLink5 = () => {
        this.props.setNestedLink_5(!this.state.openNested5);
        this.setState({ openNested5: !this.state.openNested5 }, () => { });
    }
    handleNestedOthers = () => {
        // this.props.setNestedLink_5(!this.state.openNested5);
        this.setState({ openNestedOthers: !this.state.openNestedOthers }, () => { });
    }

    componentDidUpdate = (prevProps) => {
        const { auth } = this.props;
        if (JSON.stringify(auth) !== JSON.stringify(prevProps.auth)) {
            this.setState({
                user: {
                    name: `${auth?.profile?.firstName} ${auth?.profile?.lastName}`,
                    type: auth?.profile?.type,
                    imageUrl: auth?.profile?.imageUrl,
                    gender: auth?.profile?.gender,
                }
            })
        }
    }
    render() {
        const { classes, className } = this.props;
        const rootClassName = classNames(classes.root, className);

        return (
            <nav className={rootClassName}>
                <div className={classes.logoWrapper}>
                    <Link
                        className={classes.logoLink}
                        to={process.env.NODE_ENV === "development" ? "/" : `${environment.production.prefix}`}>
                        <img
                            alt="FindMyAdventure Logo"
                            className={classes.logoImage}
                            src={fma_logo}
                            style={{}}
                        />
                    </Link>
                </div>
                <Divider className={classes.logoDivider} />
                <div className={classes.profile}>
                    <Avatar
                        alt={this.state.user.name}
                        className={classes.avatar}
                        src={this.state.user.gender === "female" ? female_av : male_av}
                    />
                    <Typography className={classes.nameText} variant="h6">
                        {this.state.user.name}
                    </Typography>
                    <Typography className={classes.bioText} variant="caption">
                        {this?.state?.user?.type ? Capitalize(this.state.user.type) : ""}
                    </Typography>
                </div>
                <Divider className={classes.profileDivider} />
                <List component="div" disablePadding>
                    <ListItem
                        activeClassName={classes.activeListItem}
                        className={classes.listItem}
                        component={NavLink}
                        to={process.env.NODE_ENV === "development" ? `/${dashboard}` : `${environment.production.prefix}/${dashboard}`}>
                        <ListItemIcon className={classes.listItemIcon}>
                            <DashboardIcon />
                        </ListItemIcon>
                        <ListItemText
                            classes={{ primary: classes.listItemText }}
                            primary="Dashboard"
                        />
                    </ListItem>
                    {
                        this.props?.auth?.userPermissions?.locations?.get ||
                            this.props?.auth?.userPermissions?.locations?.delete ||
                            this.props?.auth?.userPermissions?.locations?.update ||
                            this.props?.auth?.userPermissions?.locations?.post ||
                            this.props?.auth?.userPermissions?.categories?.get ||
                            this.props?.auth?.userPermissions?.categories?.delete ||
                            this.props?.auth?.userPermissions?.categories?.update ||
                            this.props?.auth?.userPermissions?.categories?.post ||
                            this.props?.auth?.userPermissions?.activities?.get ||
                            this.props?.auth?.userPermissions?.activities?.delete ||
                            this.props?.auth?.userPermissions?.activities?.update ||
                            this.props?.auth?.userPermissions?.activities?.post ||
                            this.props?.auth?.userPermissions?.facilities?.get ||
                            this.props?.auth?.userPermissions?.facilities?.delete ||
                            this.props?.auth?.userPermissions?.facilities?.update ||
                            this.props?.auth?.userPermissions?.facilities?.post ||
                            this.props?.auth?.userPermissions?.languages?.get ||
                            this.props?.auth?.userPermissions?.languages?.delete ||
                            this.props?.auth?.userPermissions?.languages?.update ||
                            this.props?.auth?.userPermissions?.languages?.post ?
                            <ListItem button onClick={this.handleNestedLink2} className={classes.withOutHoverListItem}>
                                <ListItemIcon className={classes.listItemIcon}>
                                    <TagsIcon />
                                </ListItemIcon>
                                <ListItemText
                                    classes={{ primary: classes.listItemText }}
                                    primary="Tags"
                                />
                                {this.state.openNested2
                                    ? <ListItemIcon className={classes.listItemIcon}><ExpandLess /></ListItemIcon>
                                    : <ListItemIcon className={classes.listItemIcon}><ExpandMore /></ListItemIcon>
                                }
                            </ListItem>
                            : ""}
                    <Collapse
                        in={this.state.openNested2}
                        // timeout="auto"
                        unmountOnExit>
                        <List component="div" disablePadding>
                            {
                                this.props?.auth?.userPermissions?.locations?.get ||
                                    this.props?.auth?.userPermissions?.locations?.delete ||
                                    this.props?.auth?.userPermissions?.locations?.update ||
                                    this.props?.auth?.userPermissions?.locations?.post ?
                                    <ListItem
                                        activeClassName={classes.nestedActiveListItem}
                                        className={classes.nested}
                                        component={NavLink}
                                        to={process.env.NODE_ENV === "development" ? `/${whereToGo}` : `${environment.production.prefix}/${whereToGo}`}>
                                        <ListItemIcon className={classes.listItemIcon}>
                                            <LocationIcon />
                                        </ListItemIcon>
                                        <ListItemText
                                            classes={{ primary: classes.listItemText }}
                                            primary="Where To Go (Destinations)"
                                        />
                                    </ListItem>
                                    : ""}
                            {
                                this.props?.auth?.userPermissions?.categories?.get ||
                                    this.props?.auth?.userPermissions?.categories?.delete ||
                                    this.props?.auth?.userPermissions?.categories?.update ||
                                    this.props?.auth?.userPermissions?.categories?.post ?
                                    <ListItem
                                        activeClassName={classes.nestedActiveListItem}
                                        className={classes.nested}
                                        component={NavLink}
                                        to={process.env.NODE_ENV === "development" ? `/${categories}` : `${environment.production.prefix}/${categories}`}>
                                        <ListItemIcon className={classes.listItemIcon}>
                                            <CategoriesIcon />
                                        </ListItemIcon>
                                        <ListItemText
                                            classes={{ primary: classes.listItemText }}
                                            primary="Categories"
                                        />
                                    </ListItem>
                                    : ""}
                            {
                                this.props?.auth?.userPermissions?.activities?.get ||
                                    this.props?.auth?.userPermissions?.activities?.delete ||
                                    this.props?.auth?.userPermissions?.activities?.update ||
                                    this.props?.auth?.userPermissions?.activities?.post ?
                                    <ListItem
                                        activeClassName={classes.nestedActiveListItem}
                                        className={classes.nested}
                                        component={NavLink}
                                        to={process.env.NODE_ENV === "development" ? `/${whatToDo}` : `${environment.production.prefix}/${whatToDo}`}>
                                        <ListItemIcon className={classes.listItemIcon}>
                                            <ActivitiesIcon />
                                        </ListItemIcon>
                                        <ListItemText
                                            classes={{ primary: classes.listItemText }}
                                            primary="What To Do (Activities)"
                                        />
                                    </ListItem>
                                    : ""}
                            {
                                this.props?.auth?.userPermissions?.facilities?.get ||
                                    this.props?.auth?.userPermissions?.facilities?.delete ||
                                    this.props?.auth?.userPermissions?.facilities?.update ||
                                    this.props?.auth?.userPermissions?.facilities?.post ?
                                    <ListItem
                                        activeClassName={classes.nestedActiveListItem}
                                        className={classes.nested}
                                        component={NavLink}
                                        to={process.env.NODE_ENV === "development" ? `/${facilities}` : `${environment.production.prefix}/${facilities}`}>
                                        <ListItemIcon className={classes.listItemIcon}>
                                            <RoomServiceIcon />
                                        </ListItemIcon>
                                        <ListItemText
                                            classes={{ primary: classes.listItemText }}
                                            primary="Facilities"
                                        />
                                    </ListItem>
                                    : ""}
                            {/* {
                                this.props?.auth?.userPermissions?.languages?.get ||
                                    this.props?.auth?.userPermissions?.languages?.delete ||
                                    this.props?.auth?.userPermissions?.languages?.update ||
                                    this.props?.auth?.userPermissions?.languages?.post ?
                                    <ListItem
                                        activeClassName={classes.nestedActiveListItem}
                                        className={classes.nested}
                                        component={NavLink}
                                        to={process.env.NODE_ENV === "development" ? `/${languages}` : `${environment.production.prefix}/${languages}`}>
                                        <ListItemIcon className={classes.listItemIcon}>
                                            <GTranslateIcon />
                                        </ListItemIcon>
                                        <ListItemText
                                            classes={{ primary: classes.listItemText }}
                                            primary="Languages"
                                        />
                                    </ListItem>
                                    : ""} */}

                        </List>
                    </Collapse>
                    {
                        this.props?.auth?.userPermissions?.trips?.get ||
                            this.props?.auth?.userPermissions?.trips?.delete ||
                            this.props?.auth?.userPermissions?.trips?.update ||
                            this.props?.auth?.userPermissions?.trips?.post ?
                            <ListItem
                                activeClassName={classes.activeListItem}
                                className={classes.listItem}
                                component={NavLink}
                                to={process.env.NODE_ENV === "development" ? `/${trip}` : `${environment.production.prefix}/${trip}`}>
                                <ListItemIcon className={classes.listItemIcon}>
                                    <CardTravelIcon />
                                </ListItemIcon>
                                <ListItemText
                                    classes={{ primary: classes.listItemText }}
                                    primary="Trips"
                                />
                            </ListItem> : ""}
                    {
                        this.props?.auth?.userPermissions?.accomodations?.get ||
                            this.props?.auth?.userPermissions?.accomodations?.delete ||
                            this.props?.auth?.userPermissions?.accomodations?.update ||
                            this.props?.auth?.userPermissions?.accomodations?.post
                            ?
                            <ListItem
                                activeClassName={classes.activeListItem}
                                className={classes.listItem}
                                component={NavLink}
                                to={process.env.NODE_ENV === "development" ? `/${accomodations}` : `${environment.production.prefix}/${accomodations}`}>
                                <ListItemIcon className={classes.listItemIcon}>
                                    <HomeWorkOutlined />
                                </ListItemIcon>
                                <ListItemText
                                    classes={{ primary: classes.listItemText }}
                                    primary="Accomodations"
                                />
                            </ListItem>

                            : ""}
                    {
                        this.props?.auth?.userPermissions?.events?.get ||
                            this.props?.auth?.userPermissions?.events?.delete ||
                            this.props?.auth?.userPermissions?.events?.update ||
                            this.props?.auth?.userPermissions?.events?.post ?
                            <ListItem
                                activeClassName={classes.activeListItem}
                                className={classes.listItem}
                                component={NavLink}
                                to={process.env.NODE_ENV === "development" ? `/${events}` : `${environment.production.prefix}/${events}`}>
                                <ListItemIcon className={classes.listItemIcon}>
                                    <EventIcon />
                                </ListItemIcon>
                                <ListItemText
                                    classes={{ primary: classes.listItemText }}
                                    primary="Events"
                                />
                            </ListItem> : ""
                    }


                    {
                        this.props?.auth?.userPermissions?.users?.get ||
                            this.props?.auth?.userPermissions?.users?.delete ||
                            this.props?.auth?.userPermissions?.users?.update ||
                            this.props?.auth?.userPermissions?.users?.post ?
                            <ListItem
                                activeClassName={classes.activeListItem}
                                className={classes.listItem}
                                component={NavLink}
                                to={process.env.NODE_ENV === "development" ? `/${users}` : `${environment.production.prefix}/${users}`}>
                                <ListItemIcon className={classes.listItemIcon}>
                                    <PeopleIcon />
                                </ListItemIcon>
                                <ListItemText
                                    classes={{ primary: classes.listItemText }}
                                    primary="Users"
                                />
                            </ListItem> : ""
                    }



                    {
                        this.props?.auth?.userPermissions?.complaintMangement?.get ?
                            <ListItem
                                activeClassName={classes.activeListItem}
                                className={classes.listItem}
                                component={NavLink}
                                to={process.env.NODE_ENV === "development" ? `/complaint-Management` : `${environment.production.prefix}/complaint-Management`}>
                                <ListItemIcon className={classes.listItemIcon}>
                                    <BeenhereIcon />
                                </ListItemIcon>
                                <ListItemText
                                    classes={{ primary: classes.listItemText }}
                                    primary="Complaint Management"
                                />
                            </ListItem>
                            : ""
                    }



                    {
                        this.props?.auth?.userPermissions?.bookings?.get ?
                            <ListItem
                                activeClassName={classes.activeListItem}
                                className={classes.listItem}
                                component={NavLink}
                                to={process.env.NODE_ENV === "development" ? `/${booking}` : `${environment.production.prefix}/${booking}`}>
                                <ListItemIcon className={classes.listItemIcon}>
                                    <CardTravelIcon />
                                </ListItemIcon>
                                <ListItemText
                                    classes={{ primary: classes.listItemText }}
                                    primary="Bookings"
                                />
                            </ListItem>
                            : ""}

                    <Collapse
                        in={this.state.openNested4}
                        // timeout="auto"
                        unmountOnExit>
                        <List component="div" disablePadding>
                            <ListItem
                                activeClassName={classes.nestedActiveListItem}
                                className={classes.nested}
                                component={NavLink}
                                to={process.env.NODE_ENV === "development" ? `/${eventdtv2}` : `${environment.production.prefix}/${eventdtv2}`}>
                                <ListItemIcon className={classes.listItemIcon}>
                                    <Eventv2Icon />
                                </ListItemIcon>
                                <ListItemText
                                    classes={{ primary: classes.listItemText }}
                                    primary="Events Listing"
                                />
                            </ListItem>

                        </List>
                    </Collapse>

                    <Collapse
                        in={this.state.openNested5}
                        // timeout="auto"
                        unmountOnExit>
                        <List component="div" disablePadding>
                            <ListItem
                                activeClassName={classes.nestedActiveListItem}
                                className={classes.nested}
                                component={NavLink}
                                to={process.env.NODE_ENV === "development" ? `/${courses}` : `${environment.production.prefix}/${courses}`}>
                                <ListItemIcon className={classes.listItemIcon}>
                                    <ClassAddIcon />
                                </ListItemIcon>
                                <ListItemText
                                    classes={{ primary: classes.listItemText }}
                                    primary="Courses"
                                />
                            </ListItem>
                        </List>
                    </Collapse>



                    {/* Nested Items */}

                    {/* Nested Item Room */}



                    <ListItem button onClick={this.handleNestedLink3} className={classes.withOutHoverListItem}>
                        <ListItemIcon className={classes.listItemIcon}>
                            <WebIcon />
                        </ListItemIcon>
                        <ListItemText
                            classes={{ primary: classes.listItemText }}
                            primary="Blogs"
                        />
                        {this.state.openNested2
                            ? <ListItemIcon className={classes.listItemIcon}><ExpandLess /></ListItemIcon>
                            : <ListItemIcon className={classes.listItemIcon}><ExpandMore /></ListItemIcon>
                        }
                    </ListItem>
                    <Collapse
                        in={this.state.openNested3}
                        // timeout="auto"
                        unmountOnExit
                    >
                        <List component="div" disablePadding>
                            <ListItem
                                activeClassName={classes.nestedActiveListItem}
                                className={classes.nested}
                                component={NavLink}
                                to={process.env.NODE_ENV === "development" ? `/${blogs}/list` : `${environment.production.prefix}/${blogs}/list`}>
                                <ListItemIcon className={classes.listItemIcon}>
                                    <ViewModuleIcon />
                                </ListItemIcon>
                                <ListItemText
                                    classes={{ primary: classes.listItemText }}
                                    primary="Blog List"
                                />
                            </ListItem>
                            <ListItem
                                activeClassName={classes.nestedActiveListItem}
                                className={classes.nested}
                                component={NavLink}
                                to={process.env.NODE_ENV === "development" ? `/${blogs}/users` : `${environment.production.prefix}/${blogs}/users`}>
                                <ListItemIcon className={classes.listItemIcon}>
                                    <PeopleAltIcon />
                                </ListItemIcon>
                                <ListItemText
                                    classes={{ primary: classes.listItemText }}
                                    primary="Blog User"
                                />
                            </ListItem>
                        </List>
                    </Collapse>
                    {
                        this.props?.auth?.userPermissions?.pressRelase?.get ||
                            this.props?.auth?.userPermissions?.pressRelase?.delete ||
                            this.props?.auth?.userPermissions?.pressRelase?.update ||
                            this.props?.auth?.userPermissions?.pressRelase?.post ||
                            this.props?.auth?.userPermissions?.news?.get ||
                            this.props?.auth?.userPermissions?.news?.delete ||
                            this.props?.auth?.userPermissions?.news?.update ||
                            this.props?.auth?.userPermissions?.news?.post ||
                            this.props?.auth?.userPermissions?.media?.get ||
                            this.props?.auth?.userPermissions?.media?.delete ||
                            this.props?.auth?.userPermissions?.media?.update ||
                            this.props?.auth?.userPermissions?.media?.post ||
                            this.props?.auth?.userPermissions?.surroundings?.get ||
                            this.props?.auth?.userPermissions?.surroundings?.delete ||
                            this.props?.auth?.userPermissions?.surroundings?.update ||
                            this.props?.auth?.userPermissions?.surroundings?.post ?
                            <ListItem button onClick={this.handleNestedOthers} className={classes.withOutHoverListItem}>
                                <ListItemIcon className={classes.listItemIcon}>
                                    <TagsIcon />
                                </ListItemIcon>
                                <ListItemText
                                    classes={{ primary: classes.listItemText }}
                                    primary="Others"
                                />
                                {this.state.openNestedOthers
                                    ? <ListItemIcon className={classes.listItemIcon}><ExpandLess /></ListItemIcon>
                                    : <ListItemIcon className={classes.listItemIcon}><ExpandMore /></ListItemIcon>
                                }
                            </ListItem>
                            : ""}
                    <Collapse
                        in={this.state.openNestedOthers}
                        // timeout="auto"
                        unmountOnExit
                    >
                        <List component="div" disablePadding>
                            {
                                this.props?.auth?.userPermissions?.pressRelase?.get ||
                                    this.props?.auth?.userPermissions?.pressRelase?.delete ||
                                    this.props?.auth?.userPermissions?.pressRelase?.update ||
                                    this.props?.auth?.userPermissions?.pressRelase?.post ?
                                    <ListItem
                                        activeClassName={classes.nestedActiveListItem}
                                        className={classes.nested}
                                        component={NavLink}
                                        to={process.env.NODE_ENV === "development" ? `/${pressRelease}` : `${environment.production.prefix}/${pressRelease}`}>
                                        <ListItemIcon className={classes.listItemIcon}>
                                            <NewReleasesOutlined />
                                        </ListItemIcon>
                                        <ListItemText
                                            classes={{ primary: classes.listItemText }}
                                            primary="Press Releases"
                                        />
                                    </ListItem>
                                    : ""}
                            {
                                this.props?.auth?.userPermissions?.news?.get ||
                                    this.props?.auth?.userPermissions?.news?.delete ||
                                    this.props?.auth?.userPermissions?.news?.update ||
                                    this.props?.auth?.userPermissions?.news?.post ?
                                    <ListItem
                                        activeClassName={classes.nestedActiveListItem}
                                        className={classes.nested}
                                        component={NavLink}
                                        to={process.env.NODE_ENV === "development" ? `/${news}` : `${environment.production.prefix}/${news}`}>
                                        <ListItemIcon className={classes.listItemIcon}>
                                            <AnnouncementIcon />
                                        </ListItemIcon>
                                        <ListItemText
                                            classes={{ primary: classes.listItemText }}
                                            primary="News"
                                        />
                                    </ListItem>
                                    : ""}
                            {
                                this.props?.auth?.userPermissions?.media?.get ||
                                    this.props?.auth?.userPermissions?.media?.delete ||
                                    this.props?.auth?.userPermissions?.media?.update ||
                                    this.props?.auth?.userPermissions?.media?.post ?
                                    <ListItem
                                        activeClassName={classes.nestedActiveListItem}
                                        className={classes.nested}
                                        component={NavLink}
                                        to={process.env.NODE_ENV === "development" ? `/${media}` : `${environment.production.prefix}/${media}`}>
                                        <ListItemIcon className={classes.listItemIcon}>
                                            <PermMediaOutlined />
                                        </ListItemIcon>
                                        <ListItemText
                                            classes={{ primary: classes.listItemText }}
                                            primary="Media"
                                        />
                                    </ListItem> : ""}
                            {
                                this.props?.auth?.userPermissions?.surroundings?.get ||
                                    this.props?.auth?.userPermissions?.surroundings?.delete ||
                                    this.props?.auth?.userPermissions?.surroundings?.update ||
                                    this.props?.auth?.userPermissions?.surroundings?.post
                                    ?
                                    <ListItem
                                        activeClassName={classes.nestedActiveListItem}
                                        className={classes.nested}
                                        component={NavLink}
                                        to={process.env.NODE_ENV === "development" ? `/${surroundings}` : `${environment.production.prefix}/${surroundings}`}>
                                        <ListItemIcon className={classes.listItemIcon}>
                                            <GamesIcon />
                                        </ListItemIcon>
                                        <ListItemText
                                            classes={{ primary: classes.listItemText }}
                                            primary="Surroundings"
                                        />
                                    </ListItem>
                                    : ""}
                        </List>
                    </Collapse>

                </List>
            </nav>
        );
    }
}

Sidebar.propTypes = {
    setNestedLink_1: PropTypes.func,
    setNestedLink_2: PropTypes.func,
    setNestedLink_3: PropTypes.func,
    setNestedLink_4: PropTypes.func,
    setNestedLink_5: PropTypes.func,
    nestedLinks: PropTypes.object,
    className: PropTypes.string,
    classes: PropTypes.object.isRequired,
    onToggleSidebar: PropTypes.func,
    auth: PropTypes.object.isRequired,
};

Sidebar.defaultProps = {
    onToggleSidebar: () => {
    }
};

const mapStateToProps = state => ({
    nestedLinks: state.nestedLinks,
    auth: state.auth
});

export default compose(
    withStyles(styles),
    connect(
        mapStateToProps, {
        setNestedLink_1,
        setNestedLink_2,
        setNestedLink_3,
        setNestedLink_4,
        setNestedLink_5,
    })
)(onClickOutside(Sidebar));