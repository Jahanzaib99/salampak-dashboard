export const getParent = (data, id) => {
    let res = "";
    data.forEach(item => {
        if (item._id === id) {
            res = item.name;
        }
    });
    return res;
};

export const getChildren = (data, id) => {
    let res = [];
    data.forEach(item => {
        if (item.parent.id === id) {
            res.push(item.name);
        }
    });
    return res;
};
