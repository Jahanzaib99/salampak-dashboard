import { green } from '@material-ui/core/colors';
export default theme => ({
    root: {
        padding: theme.spacing(3)
    },
    content: {
        marginTop: theme.spacing(2)
    },
    button: {
        // backgroundColor:  theme.palette.primary.main,
        // color: "#fff",
        marginLeft: '57px',
        //margin: theme.spacing(0),
        'margin-bottom': '25px',
        // '&:hover': {
        //     backgroundColor: theme.palette.primary.dark,
        //     color: "#fff",
        // }
    },
    caption: {
        margin: theme.spacing(2),
        color: "#9e9e9e"
    },
    saveButton: {
        backgroundColor: "#45b010",
        color: "#fff",
        margin: theme.spacing(2),
        '&:hover': {
            backgroundColor: "#6cad03",
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
    progressWrapper: {
        paddingTop: "48px",
        paddingBottom: "24px",
        display: "flex",
        justifyContent: "center"
    },
    form: {
        paddingLeft: '50px',
        paddingRight: '50px',
        paddingBottom: '25px',
        flexBasis: '700px',
        [theme.breakpoints.down('sm')]: {
            paddingLeft: theme.spacing(2),
            paddingRight: theme.spacing(2)
        }
    },
    textField: {
        width: '100%',
        marginTop: theme.spacing(2),
        '& + & ': {
            marginTop: theme.spacing(2)
        },
    },
    textArea: {
        width: '100%',
        marginTop: theme.spacing(2),
        '& + & ': {
            marginTop: theme.spacing(2)
        },
        padding: 5
    },
    textFieldWithCustomPlaceholder: {
        width: '100%',
        marginTop: theme.spacing(2),
        '&::placeholder': {
            color: "#333333"
        },
        '& + & ': {
            marginTop: theme.spacing(2)
        }
    },
    input: {
        display: "none"
    },
    textCenter: {
        textAlign: "center"
    },
    card: {
        minWidth: 275,
    },
    bullet: {
        display: 'inline-block',
        margin: '0 2px',
        transform: 'scale(0.8)',
    },
    title: {
        fontSize: 14,
    },
    pos: {
        marginBottom: 12,
    },
    icon: {
        color: 'rgba(255, 255, 255, 0.54)',
    },
    wrapper: {
        margin: theme.spacing(1),
        position: 'relative',
    },
    buttonProgress: {
        color: green[500],
        position: 'absolute',
        top: '50%',
        left: '50%',
        marginTop: -12,
        marginLeft: -12,
    }
});
