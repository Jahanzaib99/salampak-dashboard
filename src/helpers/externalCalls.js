import { events, tags, uploadTrip } from "../../src/config/routes";
import Capitalize from "../helpers/Capitalize";
import axios from "axios";

export const fetchTagFromDB = async(payload) => {

    let url = tags;
    let filters = {
        locations: [],
        subLocations: [],
        categories: [],
        activities: [],
        subActivities: [],
        startingLocations: [],
        tags: []
    };

    if (payload.isDomestic === false) {
        url += "?isDomestic=false";
    } else {
        url += "?isDomestic=true";
    }
    await axios
        .get(url)
        .then(response => {
            let resp = response.data.data;
            // console.log(`GET ${url}`, "info", resp);
          
            resp.locations.forEach(each => {
                filters.locations.push({
                    label: Capitalize(each.name),
                    value: each._id,
                    alias: each.alias
                });
            });
            resp.subLocations.forEach(each => {
                filters.subLocations.push({
                    label: Capitalize(each.name),
                    value: each._id,
                    parent: each.parent.id,
                    alias: each.alias
                });
            });
            resp.categories.forEach(each => {
                filters.categories.push({
                    label: Capitalize(each.name),
                    value: each._id,
                    alias: each.alias
                });
            });
            resp.activities.forEach(each => {
                filters.activities.push({
                    label: Capitalize(each.name),
                    value: each._id,
                    parent: each.parent.id,
                    alias: each.alias
                });
            });
            resp.subActivities.forEach(each => {
                filters.subActivities.push({
                    label: Capitalize(each.name),
                    value: each._id,
                    parent: each.parent.id,
                    alias: each.alias
                });
            });
            resp.startingLocations.forEach(each => {
                filters.startingLocations.push({
                    label: Capitalize(each.name),
                    value: each._id,
                    alias: each.alias
                });
            });
            resp.tags.forEach(each => {
                filters.tags.push({
                    label: Capitalize(each.name),
                    value: each._id,
                    alias: each.alias
                });
            });
});

return filters;
}

