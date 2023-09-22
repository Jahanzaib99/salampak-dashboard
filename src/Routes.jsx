import React, { Component } from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import ScrollTopTop from "./helpers/ScrollToTop";
import environment from "./config/config";
import {
    whatToDo,
    categories,
    dashboard,
    whereToGo,
    notFound,
    otherTags,
    startingLocations,
    accomodations,
    accomodationUpload,
    surroundings,
    pressRelease,
    media,
    users,
    facilities,
    trip,
    tripUpload,
    events,
    eventUpload,
    booking,
    editTrip,
    copyTrip,
    editEvent,
    copyEvent,
    languages,
    editAccomodation,
    news,
    blogs,
    
} from "./config/urls";

// Views
import ActivitiesTag from "./views/Tags/components/Activities";
import CategoriesTag from "./views/Tags/components/Categories";
import UsersTag from "./views/Tags/components/Users"
import Dashboard from "./views/Dashboard";
import FacilitiesTag from "./views/Tags/components/Facilities"
import Accomodations from "./views/Accomodations";
import UploadAccommodation from "./views/Accomodations/CreateNew"
import Surroundings from "./views/Surroundings";
import PressRelease from "./views/PressRelease";
import Media from "./views/Media";
import LocationsTag from "./views/Tags/components/Locations";
import NotFound from "./views/NotFound";
import OtherTags from "./views/Tags/components/Other";
import SignIn from "./views/SignIn";
import SignUpNew from "./views/SignUpNew"
import StartingLocationsTag from "./views/Tags/components/StartingLocations";
import TestDt from "./views/TestDt";
import Trip from "./views/TripNew/CreateNew"
import TripView from "./views/TripNew/TripView";
import Event from "./views/Event/CreateNew";
import EventView from "./views/Event/EventView";
import PrivateRoute from "./utils/PrivateRoute";
import Booking from "./views/Booking";
import LanguagesTag from "./views/Tags/components/Languages"
import ComplaintManagement from './views/ComplaintManagement'
import New from "./views/News";
import UserPermission from "./views/Tags/components/Users/UserPermission"
import BlogUser from "./views/BlogUser";
import BlogList from "./views/BlogList";





class Routes extends Component {
    render() {
        return (
            <ScrollTopTop>
                <Switch>
                    <Route component={SignIn} exact path={process.env.NODE_ENV === "development" ? "/" : environment.production.prefix} />
                    <Route component={SignUpNew} path={process.env.NODE_ENV === "development" ? "/sign-up" : `${environment.production.prefix}/sign-up`} />
                    <Switch>


                        <PrivateRoute
                            component={Dashboard}
                            exact
                            path={process.env.NODE_ENV === "development" ? `/${dashboard}` : `${environment.production.prefix}/${dashboard}`}
                        />

                        <PrivateRoute
                            component={ActivitiesTag}
                            exact
                            path={process.env.NODE_ENV === "development" ? `/${whatToDo}` : `${environment.production.prefix}/${whatToDo}`}
                        />
                        <PrivateRoute
                            component={CategoriesTag}
                            exact
                            path={process.env.NODE_ENV === "development" ? `/${categories}` : `${environment.production.prefix}/${categories}`}
                        />
                        <PrivateRoute
                            component={LocationsTag}
                            exact
                            path={process.env.NODE_ENV === "development" ? `/${whereToGo}` : `${environment.production.prefix}/${whereToGo}`}
                        />
                        <PrivateRoute
                            component={UsersTag}
                            exact
                            path={process.env.NODE_ENV === "development" ? `/${users}` : `${environment.production.prefix}/${users}`}
                        />
                        <PrivateRoute
                            component={UserPermission}
                            exact
                            path={process.env.NODE_ENV === "development" ? `/${users}/:id` : `${environment.production.prefix}/${users}/:id`}
                        />
                        <PrivateRoute
                            component={FacilitiesTag}
                            exact
                            path={process.env.NODE_ENV === "development" ? `/${facilities}` : `${environment.production.prefix}/${facilities}`}
                        />
                        <PrivateRoute
                            component={LanguagesTag}
                            exact
                            path={process.env.NODE_ENV === "development" ? `/${languages}` : `${environment.production.prefix}/${languages}`}
                        />
                        <PrivateRoute
                            component={StartingLocationsTag}
                            exact
                            path={process.env.NODE_ENV === "development" ? `/${startingLocations}` : `${environment.production.prefix}/${startingLocations}`}
                        />


                        <PrivateRoute
                            component={OtherTags}
                            exact
                            path={process.env.NODE_ENV === "development" ? `/${otherTags}` : `${environment.production.prefix}/${otherTags}`}
                        />
                        <PrivateRoute
                            component={Accomodations}
                            exact
                            path={process.env.NODE_ENV === "development" ? `/${accomodations}` : `${environment.production.prefix}/${accomodations}`}
                        />
                        <PrivateRoute
                            component={UploadAccommodation}
                            exact
                            path={process.env.NODE_ENV === "development" ? `/${accomodationUpload}` : `${environment.production.prefix}/${accomodationUpload}`}
                        />
                        <PrivateRoute
                            component={UploadAccommodation}
                            exact
                            path={process.env.NODE_ENV === "development" ? `/${editAccomodation}/:id` : `${environment.production.prefix}/${editAccomodation}/:id`}
                        />
                        <PrivateRoute
                            component={Surroundings}
                            exact
                            path={process.env.NODE_ENV === "development" ? `/${surroundings}` : `${environment.production.prefix}/${surroundings}`}
                        />
                        <PrivateRoute
                            component={PressRelease}
                            exact
                            path={process.env.NODE_ENV === "development" ? `/${pressRelease}` : `${environment.production.prefix}/${pressRelease}`}
                        />
                        <PrivateRoute
                            component={Media}
                            exact
                            path={process.env.NODE_ENV === "development" ? `/${media}` : `${environment.production.prefix}/${media}`}
                        />
                        <PrivateRoute
                            component={TripView}
                            exact
                            path={process.env.NODE_ENV === "development" ? `/${trip}` : `${environment.production.prefix}/${trip}`}
                        />
                        <PrivateRoute
                            component={Trip}
                            exact
                            path={process.env.NODE_ENV === "development" ? `/${tripUpload}` : `${environment.production.prefix}/${tripUpload}`}
                        />
                        <PrivateRoute
                            component={Trip}
                            exact
                            path={process.env.NODE_ENV === "development" ? `/${editTrip}/:id` : `${environment.production.prefix}/${editTrip}/:id`}
                        />
                        <PrivateRoute
                            component={Trip}
                            exact
                            path={process.env.NODE_ENV === "development" ? `/${copyTrip}/:c_id` : `${environment.production.prefix}/${copyTrip}/:c_id`}
                        />
                        <PrivateRoute
                            component={EventView}
                            exact
                            path={process.env.NODE_ENV === "development" ? `/${events}` : `${environment.production.prefix}/${events}`}
                        />
                        <PrivateRoute
                            component={Event}
                            exact
                            path={process.env.NODE_ENV === "development" ? `/${eventUpload}` : `${environment.production.prefix}/${eventUpload}`}
                        />
                        <PrivateRoute
                            component={Event}
                            exact
                            path={process.env.NODE_ENV === "development" ? `/${editEvent}/:id` : `${environment.production.prefix}/${editEvent}/:id`}
                        />
                        <PrivateRoute
                            component={Event}
                            exact
                            path={process.env.NODE_ENV === "development" ? `/${copyEvent}/:c_id` : `${environment.production.prefix}/${copyEvent}/:c_id`}
                        />
                        <PrivateRoute
                            component={Booking}
                            exact
                            path={process.env.NODE_ENV === "development" ? `/${booking}` : `${environment.production.prefix}/${booking}`}
                        />
                        <PrivateRoute
                            component={New}
                            exact
                            path={process.env.NODE_ENV === "development" ? `/${news}` : `${environment.production.prefix}/${news}`}
                        />
                        <PrivateRoute
                            component={TestDt}
                            exact
                            path={process.env.NODE_ENV === "development" ? `/test-dt` : `${environment.production.prefix}/test-dt`}
                        />
                        <PrivateRoute
                            component={ComplaintManagement}
                            exact
                            path={process.env.NODE_ENV === "development" ? `/complaint-Management` : `${environment.production.prefix}/complaint-Management`}
                        />
                        <PrivateRoute
                            component={BlogList}
                            exact
                            path={process.env.NODE_ENV === "development" ? `/${blogs}/list` : `${environment.production.prefix}/${blogs}/list`}
                        />
                        <PrivateRoute
                            component={BlogUser}
                            exact
                            path={process.env.NODE_ENV === "development" ? `/${blogs}/users` : `${environment.production.prefix}/${blogs}/users`}
                        />

                        <Route
                            component={NotFound}
                        />
                    </Switch>
                    <Redirect to={process.env.NODE_ENV === "development" ? `/${notFound}` : `${environment.production.prefix}/${notFound}`} />
                </Switch>
            </ScrollTopTop>
        );
    }
}
export default Routes;
