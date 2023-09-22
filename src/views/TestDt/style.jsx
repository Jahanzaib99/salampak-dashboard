export default theme => ({
    root: {
        width: "100%",
    },
    tableRoot: {
        margin: 10,
    },
    paperRoot: {
        width: "100%",
        padding: theme.spacing(3, 2),
        marginBottom: theme.spacing(2)
    },
    table: {
        overflowX: 'auto',
        overflowY: 'hidden',
    },
    tableHeader: {
        background: "#ffffff",
        borderTop: "1px solid #ededed",
        borderLeft: "1px solid #ededed",
        borderRight: "1px solid #ededed",
    },
    active: {
        color: "#f37248"
    },
    formControl: {
        margin: theme.spacing(1),
    },
    givePointer: {
        cursor: "pointer"
    },
    selectEmpty: {
        marginTop: theme.spacing(2)
    },
    hide: {
        display: "none"
    },
    textfield: {
        width: "100%"
    },
    selectfield: {
        width: "100%",
        marginTop: 8
    },
    customerIcon: {
        display: 'flex',
        alignItems: 'center',
        marginBottom: "-7px"
    },
    customerPara: {
        padding: 5,
    },
    customerParaUpperCase: {
        textTransform: "uppercase"
    },
    iconSize: {
        width: 20,
        height: 20
    },
    icon: {
        verticalAlign: 'bottom',
        height: 20,
        width: 20,
    },
    details: {
        alignItems: 'center',
        margin: 20
    },
    field: {
        width: "400px",
    },
    chips: {
        display: 'flex',
        // justifyContent: 'center',
        flexWrap: 'wrap',
        '& > *': {
            margin: theme.spacing(0.5),
        },
    },
});