export default theme => ({
    root: {
        width: '100%',
        backgroundColor: theme.palette.background.paper,
    },
    inline: {
        display: 'inline',
    },
    addButton: {
        background: 'linear-gradient(45deg, #1d976c 30%, #68bd87 90%)',
        border: 0,
        borderRadius: 3,
        boxShadow: '0 3px 5px 2px rgba(87, 217, 108, .3)',
        color: 'white',
    },
    button: {
        backgroundColor: "#f37248",
        color: "#fff",
        margin: theme.spacing(2),
        '&:hover': {
            backgroundColor: "#f44a08",
            color: "#fff",
        }
    },
    buttonDel: {
        backgroundColor: "#DD4A41",
        color: "#fff",
        margin: theme.spacing(2),
        '&:hover': {
            backgroundColor: "#ef4525",
            color: "#fff",
        }
    },
    buttonEdit: {
        backgroundColor: "#3a85ef",
        color: "#fff",
        margin: theme.spacing(2),
        '&:hover': {
            backgroundColor: "#095ef9",
            color: "#fff",
        }
    },
});