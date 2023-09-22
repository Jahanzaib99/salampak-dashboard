import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';

const styles = theme => ({
    root: {
        margin: 0,
        padding: theme.spacing(2),
    },
    closeButton: {
        position: 'absolute',
        right: theme.spacing(1),
        top: theme.spacing(1),
        color: theme.palette.grey[500],
    },
});

const DialogTitle = withStyles(styles)(props => {
    const { children, classes, onClose, ...other } = props;
    return (
        <MuiDialogTitle disableTypography className={classes.root} {...other}>
            <Typography variant="h6">{children}</Typography>
            <IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
                <CloseIcon />
            </IconButton>
        </MuiDialogTitle>
    );
});

const DialogContent = withStyles(theme => ({
    root: {
        padding: theme.spacing(2),
    },
}))(MuiDialogContent);


export default class CustomizedDialogs extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            open: this.props.open,
            src: this.props.data[this.props.index],
            cropResult: "",
            width: "",
            height: ""
        }
    }

    componentDidMount() {
        this.setState({
            open: this.props.open,
            src: this.props.data[this.props.index]
        });
    }

    render() {
        const { open, src } = this.state;
        return (
            <div>
                <Dialog onClose={this.handleClose} aria-labelledby="customized-dialog-title" open={open}>
                    <DialogTitle id="customized-dialog-title" onClose={this.props.close}>
                        View Image
                    </DialogTitle>
                    <DialogContent dividers>
                        {src && src.length > 0 && (
                            <img
                                style={{ height: 400, width: '100%' }}
                                src={src}
                                alt={"Image - " + this.props.index}
                            />
                        )}
                    </DialogContent>
                </Dialog>
            </div>
        );
    }
}
