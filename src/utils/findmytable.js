import _ from "lodash";

/**
 * Input method
 */



/**
 *  Remove property/attribute from array of objects
 */
export function removeProperties(array, difference) {
    // return from _.map
    return _.map(array, object =>
        _.omit(object, difference) // return from _.omit
    );
}

    
/**
 *  To flat json
 */
export function flatten (obj, path = '') {
    if (!(obj instanceof Object)) return { [path.replace(/\.$/g, '')]: obj };

    return Object.keys(obj).reduce((output, key) => {
        return obj instanceof Array ?
            { ...output, ...flatten(obj[key], path + '[' + key + '].') } :
            { ...output, ...flatten(obj[key], path + key + '.') };
    }, {});
}

export default {flatten, removeProperties}
