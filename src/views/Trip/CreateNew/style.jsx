export default theme => ({
    root: {
        backgroundColor: theme.palette.background.paper,
        width: "100%"
    },
    grid: {
        marginBottom: 25
    },
    greyBg: {
        borderLeft: "1px solid rgb(0, 0, 0, 0.27)",
        borderRight: "1px solid rgb(0, 0, 0, 0.27)",
        borderBottom: "1px solid rgb(0, 0, 0, 0.27)",
        borderBottomRightRadius: 5,
        borderBottomLeftRadius: 5,
        boxShadow: "0px 2px 4px -1px rgba(0,0,0,0.2),0px 4px 5px 0px rgba(0,0,0,0.14),0px 1px 10px 0px rgba(0,0,0,0.12)"
    },
    customTextField: {
        width: '100%',
        marginTop: theme.spacing(2),
        '& + & ': {
            marginTop: theme.spacing(2)
        },
    },
    tabStyle: {
        fontSize: 14,
        width: 140
    },
    inline: {
        display: 'flex',
        alignItems: 'center'
    },
    alignEl: {
        margin: 20,
    },
});
