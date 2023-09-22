export default theme => ({
    root: {
        padding: theme.spacing(3),
        flexGrow: 1,

    },
    content: {
        marginTop: theme.spacing(2)
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
    textFieldNumberLeft: {
        'margin-right': '6px',
        width: '50%',
        marginTop: theme.spacing(2),
        '& + & ': {
            marginTop: theme.spacing(2)
        },
    },
    textFieldNumberRight: {
        marginTop: theme.spacing(2),
        width: '49%',
        '& + & ': {
            marginTop: theme.spacing(2)
        },
    },
    toggleButtonGroup: {
        //color: 'red',
        'font-weight': 'bold',
        'font-weight': 900

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
    m20: {
        marginTop: "36px"
    },
    flexCol: {
        display: "flex",
        flexDirection: "column"
    }
});
