import React from "react";
import { Route, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import environment from "../config/config";

const PrivateRoute = ({ component: Component, auth, ...rest }) => (
	<Route
		{...rest}
		render={props =>
			auth.isAuthenticated === true ? (
				<Component {...props} />
			) : (
				<Redirect to={process.env.NODE_ENV === "development" ? "/" : environment.production.prefix} />
			)
		}
	/>
);

PrivateRoute.propTypes = {
	auth: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
	auth: state.auth,
});

export default connect(mapStateToProps)(PrivateRoute);






{/* <div style={{ position: "relative" }}>
					<div style={{
						position: "fixed",
						top: "calc(100vh - 262px)",
						left: "50%",
						zIndex: "29",
					}}> <CircularProgress size={60} /></div>
					<Component {...props} />
				</div > */}