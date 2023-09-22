export default function tagsMapper(data, tags) {
    let object = {
        locations: [],
        subLocations: [],
        categories: [],
        activities: [],
        subActivities: [],
        tags: [],
        startingLocation: {},
        primaryLocation: {},
        primaryCategory: {},
        primaryActivity: {},
        servicesIncluded: {},
        servicesExcluded: {}
    };

    data.locations.forEach(loc => {
        tags.locations.forEach(tagLoc => {
            if (tagLoc.alias === loc) {
                object.locations.push(tagLoc);
            }
        })
    });

    data.subLocations.forEach(subLoc => {
        tags.subLocations.forEach(tagSubLoc => {
            if (tagSubLoc.alias === subLoc) {
                object.subLocations.push(tagSubLoc);
            }
        })
    });

    data.categories.forEach(ctg => {
        tags.categories.forEach(tagCtg => {
            if (tagCtg.alias === ctg) {
                object.categories.push(tagCtg);
            }
        })
    });

    data.activities.forEach(actv => {
        tags.activities.forEach(tagActv => {
            if (tagActv.alias === actv) {
                object.activities.push(tagActv);
            }
        })
    });

    data.subActivities.forEach(subActv => {
        tags.subActivities.forEach(tagSubActv => {
            if (tagSubActv.alias === subActv) {
                object.subActivities.push(tagSubActv);
            }
        })
    });

    data.tags.forEach(otherTag => {
        tags.tags.forEach(tagOther => {
            if (tagOther.alias === otherTag) {
                object.tags.push(tagOther);
            }
        })
    });

    //console.log('mamam ', data);
        let temp = [];
    if(data.servicesIncluded){
        data.servicesIncluded.forEach(otherTag => {
            tags.servicesIncluded.forEach(tagOther => {
                if(otherTag == tagOther.alias){
                    temp.push(tagOther);
                }
            })
        });
        object.servicesIncluded = temp;
}

    let temp2 = [];
    if(data.servicesExcluded){
        data.servicesExcluded.forEach(otherTag => {
            tags.servicesExcluded.forEach(tagOther => {
                if(otherTag == tagOther.alias){
                   temp2.push(tagOther);
                }
            })
        });
        object.servicesExcluded = temp2;
    }
    

    tags.startingLocations.forEach(stLoc => {
        if (stLoc.alias === data.startingLocation) {
            object.startingLocation = stLoc
        }
    });

    tags.locations.forEach(prLoc => {
        if (prLoc.alias === data.primaryLocation) {
            object.primaryLocation = prLoc
        }
    });

    tags.categories.forEach(prCtg => {
        if (prCtg.alias === data.primaryCategory) {
            object.primaryCategory = prCtg
        }
    });

    tags.activities.forEach(prAct => {
        if (prAct.alias === data.primaryActivity) {
            object.primaryActivity = prAct
        }
    });

    return object;
}