export default theme => ({
    root: {
        padding: theme.spacing(3)
    },
    portletFooter: {
        paddingLeft: theme.spacing(3),
        paddingRight: theme.spacing(3),
        paddingTop: theme.spacing(2),
        paddingBottom: theme.spacing(2)
    },
    field: {
        margin: theme.spacing(2)
    },
    radioField: {
        margin: theme.spacing(2),
        paddingTop: theme.spacing(3),
        paddingBottom: theme.spacing(2)
    },
    withHelperTextField: {
        margin: theme.spacing(2),
        paddingBottom: theme.spacing(1)
    },
    textField: {
        width: '80%',
        maxWidth: '100%',
    },
    selectField: {
        backgroundColor: "#f8fafc",
        width: '80%',
    },
    subTextField: {
        width: '40%',
        maxWidth: '100%',
    },
    promoTitle: {
        fontWeight: 300,
        letterSpacing: 2
    },
    textCenter: {
        textAlign: "center"
    },
    alignLeft: {
        width: "80%",
        maxWidth: '100%',
    },
    formLabel: {
        textAlign: "left",
        marginBottom: 10,
        fontSize: 15
    },
    promoBtn: {
        margin: 20,
        backgroundColor: "#f37248",
        color: "#fff",
        '&:hover': {
            backgroundColor: "#f58460",
            color: "#fff"
        }
    }
});