// API Routes
import environment from "./config.js";

export let host =
    process.env.NODE_ENV === "development"
        ? `${environment.production.host}`
        : `${environment.production.host}`;

if (process.env.REACT_APP_PRODUCTION) {
    host = environment.production.host;
}

if (process.env.REACT_APP_STAGING) {
    host = environment.staging.host;
}

export const categories = host + "/api/blog/categories";
export const getImageById = "https://production9240.blob.core.windows.net/ptdc-photos/";
export const login = host + "/api/signin/local";
export const signUp = host + "/api/signup";
export const tags = host + "/api/v2/events/filters";
export const users = host + "/api/users";
export const user = host + "/api/user";
export const facility = host + "/api/facility";
export const language = host + "/api/language";
export const news = host + "/api/news";


/*
* => Tags 
*/
export const locationTag = host + "/api/location";
export const locationPhotoImage = host + "/api/location";
export const subLocationTag = locationTag + "/sub";
export const categoryTag = host + "/api/category";
export const categoryPhotoImage = host + "/api/category";
export const activityTag = host + "/api/activity";
export const activityPhotoImage = host + "/api/activity";
export const subActivityTag = activityTag + "/sub";
export const startingLocationTag = locationTag + "/starting";
export const otherTag = host + "/api/tag";
export const tagTypes = host + "/api/tagTypes" 
export const accommodations = host + "/api/accommodations"
export const surroundings = host + "/api/surrounding"
export const pressRelease = host + "/api/press-release"
export const media = host + "/api/media"
export const trip=host +'/api/trip'
export const events = host + '/api/events'
export const booking = host + '/api/bookings'
export const easyAdd = host + '/api/easyAdd'

// Permission
export const permission = host + '/api/users/permissions'

