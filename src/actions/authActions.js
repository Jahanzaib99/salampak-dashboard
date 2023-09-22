// Node Modules
import axios from "axios";
import setAuthToken from "../utils/setAuthToken";
import jwt_decode from "jwt-decode";
import moment from "moment";

import { GET_ERRORS, SET_CURRENT_USER, SIGNUP_SUCCESS, GET_USER_PERMISSIONS, GET_USER_PERMISSIONS_SUCCESS, GET_USER_PERMISSIONS_FAILURE, LOG_OUT } from "./types";
import { login, users, signUp, permission } from "../config/routes";
import log from "../config/log";

// // Register User
// export const registerUser = (userData, history) => dispatch => {
// 	axios
// 		.post(register, userData)
// 		.then(res => history.push("/login"))
// 		.catch(err =>
// 			dispatch({
// 				type: GET_ERRORS,
// 				payload: err.response.data,
// 			}),
// 		);
// };

// Login - Get User Token
export const loginUser = userData => dispatch => {
    axios
        .post(login, userData)
        .then(res => {
            log(`POST ${login}`, "info", res.data.data);
            // Save to local storage
            const { token } = res.data.data;
            const { id } = res.data.data;
            const { type } = res.data.data;
            dispatch(getUserPermission(id))
            if (type === "admin" || type === "vendor" || type === "superAdmin" || type === "employee") {
                // Set Token & id in local storage
                localStorage.setItem("userToken", token);
                localStorage.setItem("userId", id);
                localStorage.setItem("exp", moment().add(1, 'd').valueOf());
                // Set Token to auth header
                setAuthToken(token);
                axios
                    .get(users + "/" + id)
                    .then(response => {
                        log(`GET ${users}/${id}`, "info", response.data.data);
                        localStorage.setItem("userName", response.data.data.profile.firstName ? response.data.data.profile.firstName : "" + ' ' + response.data.data.profile.lastName ? response.data.data.profile.lastName : "");
                        localStorage.setItem("firstName", response.data.data.profile.firstName ? response.data.data.profile.firstName : "");
                        localStorage.setItem("lastName", response.data.data.profile.lastName ? response.data.data.profile.lastName : "");
                        localStorage.setItem("userEmail", response.data.data.profile.email ? response.data.data.profile.email : "");
                        localStorage.setItem("userType", response.data.data.type ? response.data.data.type : "");
                        localStorage.setItem("userImage", response.data.data.profile.profilePhoto ? response.data.data.profile.profilePhoto : "");
                        localStorage.setItem("userGender", response.data.data.profile.gender ? response.data.data.profile.gender : "");
                        // localStorage.setItem("dob", response.data.data.profile.dob ? response.data.data.profile.dob : "");
                        localStorage.setItem("mobile", response.data.data.profile.mobile ? response.data.data.profile.mobile : "");
                        localStorage.setItem("nic", response.data.data.profile.nic ? response.data.data.profile.nic : "");
                        localStorage.setItem("vendorType", response.data.data.vendorType ? response.data.data.vendorType : "");
                        localStorage.setItem("companyName", response?.data?.data?.profile?.companyName ? response.data.data.profile.companyName : "");
                        localStorage.setItem("bankTitle", response?.data?.data?.bankDetails?.bankTitle ? response.data.data.bankDetails.bankTitle : "");
                        localStorage.setItem("accountName", response?.data?.data?.bankDetails?.accountName ? response.data.data.bankDetails.accountName : "");
                        localStorage.setItem("accountNumber", response?.data?.data?.bankDetails?.accountNumber ? response.data.data.bankDetails.accountNumber : "");




                        log(`Setting data into LocalStorage...`, "info", localStorage);
                        // Decode Token to get User Data
                        const decoded = jwt_decode(token);
                        decoded.profile = {
                            firstName: response.data.data.profile.firstName,
                            lastName: response.data.data.profile.lastName,
                            email: response.data.data.profile.email,
                            type: response.data.data.type,
                            gender: response.data.data.profile.gender,
                            // dob: response.data.data.profile.dob,
                            mobile: response.data.data.profile.mobile,
                            nic: response.data.data.profile.nic,
                            profilePhoto: response.data.data.profile.profilePhoto,
                            vendorType: response.data.data.vendorType,
                            companyName: response.data.data.profile.companyName,
                            bankTitle: response?.data?.data?.bankDetails?.bankTitle ? response.data.data.bankDetails.bankTitle : "",
                            accountName: response?.data?.data?.bankDetails?.accountName ? response.data.data.bankDetails.accountName : "",
                            accountNumber: response?.data?.data?.bankDetails?.accountNumber ? response.data.data.bankDetails.accountNumber : ""


                        }
                        dispatch(setCurrentUser(decoded));
                    })
                    .catch(error => {
                        dispatch({
                            type: GET_ERRORS,
                            payload: error.response.data.error
                        })
                    })
            }
            else {
                let error = {
                    message: "You are not allowed to access this resource",
                };
                dispatch({
                    type: GET_ERRORS,
                    payload: error
                })
            }
        })
        .catch(err => {
            dispatch({
                type: GET_ERRORS,
                payload: err.response ? err.response.data.error : err
            });
        });
};

export const signUpUser = userData => dispatch => {
    axios
        .post(signUp, userData)
        .then(res => {
            log(`POST ${signUp}`, "info", res.data.data);
            dispatch({
                type: GET_ERRORS,
                payload: ""
            });
            dispatch({
                type: SIGNUP_SUCCESS,
                payload: true
            });

        })
        .catch(err => {
            dispatch({
                type: GET_ERRORS,
                payload: err.response ? err.response.data.error : err
            });
        });
};

// Set Logged in User
export const setCurrentUser = decoded => {
    return {
        type: SET_CURRENT_USER,
        payload: decoded
    };
};


export const getUserPermission = payload => dispatch => {
    dispatch({
        type: GET_USER_PERMISSIONS,
        payload: true
    });
    axios
        .get(`${permission}/${payload}`)
        .then(res => {
            dispatch({
                type: GET_USER_PERMISSIONS_SUCCESS,
                payload: res?.data?.data?.length ? res?.data?.data[0].permissions : {}
            });
        })
        .catch(err => {
            dispatch({
                type: GET_USER_PERMISSIONS_FAILURE,
                payload: err.response ? err.response.data.error : err
            });
        });


};

// Log Uer Out
export const logoutUser = () => dispath => {
    log(`Logout Requested`, "warning", "");
    // Remove token from local storage
    localStorage.removeItem("exp");
    localStorage.removeItem("userId");
    localStorage.removeItem("userToken");
    localStorage.removeItem("userName")
    localStorage.removeItem("userEmail")
    localStorage.removeItem("userType");
    localStorage.removeItem("userImage");
    localStorage.removeItem("firstName")
    localStorage.removeItem("lastName")
    localStorage.removeItem("userGender");
    // localStorage.removeItem("dob");
    localStorage.removeItem("mobile");
    localStorage.removeItem("nic");
    localStorage.removeItem("vendorType");
    localStorage.removeItem("companyName");
    localStorage.removeItem("bankTitle");
    localStorage.removeItem("accountName");
    localStorage.removeItem("accountNumber");

    // remove auth header for future requests
    setAuthToken(false);
    // set the current user to {} which will also set isAuthenticated: false
    dispath(setCurrentUser({}));
    dispath({ type: LOG_OUT })
};
