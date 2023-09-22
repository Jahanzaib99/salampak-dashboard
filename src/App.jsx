import React, { useEffect } from "react";
import { Router } from "react-router-dom";
import { createBrowserHistory } from "history";
import { Provider } from "react-redux";
import jwt_decode from "jwt-decode";
import setAuthToken from "./utils/setAuthToken";
import { setCurrentUser, logoutUser, getUserPermission } from "./actions/authActions";
import store from "./store";
import { ThemeProvider } from "@material-ui/styles";
import theme from "./theme";
import "./assets/scss/index.scss";
import Routes from "./Routes";
const browserHistory = createBrowserHistory();

if (localStorage.userToken && (localStorage.userType === "admin" || localStorage.userType === "superAdmin" || localStorage.userType === "vendor" || localStorage.userType === "employee")) {
    setAuthToken(localStorage.userToken);
    const decoded = jwt_decode(localStorage.userToken);
    decoded.profile = {
        firstName: localStorage.getItem("firstName"),
        lastName: localStorage.getItem("lastName"),
        email: localStorage.getItem("userEmail"),
        type: localStorage.getItem("userType"),
        gender: localStorage.getItem("userGender"),
        // dob: +localStorage.getItem("dob"),
        mobile: localStorage.getItem("mobile"),
        nic: localStorage.getItem("nic"),
        profilePhoto: localStorage.getItem("userImage"),
        vendorType: localStorage.getItem("vendorType"),
        companyName: localStorage.getItem("companyName"),
        bankTitle: localStorage.getItem("bankTitle"),
        accountName: localStorage.getItem("accountName"),
        accountNumber: localStorage.getItem("accountNumber")

    }
    store.dispatch(setCurrentUser(decoded));
    let expiry = localStorage.exp;
    if (Date.now() > +expiry) {
        store.dispatch(logoutUser());
        window.location.href = process.env.NODE_ENV === "development" ? "/" : "/ptdc-panel";
    }
}


function App() {
    useEffect(() => {
        const userId = localStorage.getItem("userId")
        userId && store.dispatch(getUserPermission(userId))
    }, [])

    return (
        <Provider store={store}>
            <ThemeProvider theme={theme}>
                <Router history={browserHistory}>
                    <Routes history={browserHistory} />
                </Router>
            </ThemeProvider>
        </Provider>
    );
}

export default App;