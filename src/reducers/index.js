// Root Reducer file
import { combineReducers } from "redux";
import authReducer from "./authReducer";
import errorReducer from "./errorReducer";
import nestedLinkReducer from "./nestedLinkReducer";

export default combineReducers({
	auth: authReducer,
	errors: errorReducer,
	nestedLinks: nestedLinkReducer
});
