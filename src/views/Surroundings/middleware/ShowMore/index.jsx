import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Chip from "@material-ui/core/Chip";
import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';
import { Button } from '@material-ui/core';

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
            {onClose ? (
                <IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
                    <CloseIcon />
                </IconButton>
            ) : null}
        </MuiDialogTitle>
    );
});

const DialogContent = withStyles(theme => ({
    root: {
        padding: theme.spacing(2),
    },
}))(MuiDialogContent);


export default function Chips(props) {
    const [open, setOpen] = React.useState(false);
    const handleClickOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };
    const filteredArr = props.chips.reduce((acc, current) => {
        const x = acc.find(item => item === current);
        if (!x) {
            return acc.concat([current]);
        } else {
            return acc;
        }
    }, []);

    return (
        <div>
            <Button style={{ margin: 5 }} size="small" color="secondary" onClick={handleClickOpen}>Show More</Button>
            <Dialog onClose={handleClose} aria-labelledby="customized-dialog-title" open={open}>
                <DialogTitle id="customized-dialog-title" onClose={handleClose}>
                    {props.title}
                </DialogTitle>
                <DialogContent dividers>
                    <div style={{ margin: 10 }}>
                        {filteredArr.map((item, index) => (
                            <Chip style={{ margin: 5, }} label={item} key={index} color="primary" />
                        ))}
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
