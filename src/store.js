// Node Modules
import { createStore, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";

// Root Reducer
import rootReducer from "./reducers/index";

const initialState = {};

const middleware = [thunk];

// Create Redux store
const store = createStore(
	rootReducer,
	initialState,
	compose(
		applyMiddleware(...middleware),
		process.env.NODE_ENV === "development"
			? window.__REDUX_DEVTOOLS_EXTENSION__ ?
					window.__REDUX_DEVTOOLS_EXTENSION__()
					: compose
			: compose,
	),
);

export default store;
