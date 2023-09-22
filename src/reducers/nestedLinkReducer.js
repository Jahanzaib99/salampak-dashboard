import {
    SET_NESTED_LINK_1,
    SET_NESTED_LINK_2,
    SET_NESTED_LINK_3,
    SET_NESTED_LINK_4,
    SET_NESTED_LINK_5,
} from "../actions/types";

const initialState = {
    openNested1: false,
    openNested2: false,
    openNested3: false,
    openNested4: false,
    openNested5: false,
};

export default function (state = initialState, action) {
    switch (action.type) {
        case SET_NESTED_LINK_1:
            return {
                ...state,
                openNested1: action.payload,
            };
        case SET_NESTED_LINK_2:
            return {
                ...state,
                openNested2: action.payload,
            };
        case SET_NESTED_LINK_3:
            return {
                ...state,
                openNested3: action.payload,
            };
        case SET_NESTED_LINK_4:
            return {
                ...state,
                openNested4: action.payload,
            };
        case SET_NESTED_LINK_5:
            return {
                ...state,
                openNested5: action.payload,
            };
        default:
            return state;
    }
}
