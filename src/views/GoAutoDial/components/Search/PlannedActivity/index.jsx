import React from 'react';
import moment from "moment";
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import IconButton from "@material-ui/core/IconButton";
import MuiDialogActions from '@material-ui/core/DialogActions';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import TextField from "@material-ui/core/TextField";
import Typography from '@material-ui/core/Typography';

import AlarmIcon from "@material-ui/icons/AlarmAddOutlined";
import CloseIcon from '@material-ui/icons/Close';

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

const DialogActions = withStyles(theme => ({
    root: {
        margin: 0,
        padding: theme.spacing(1),
    },
}))(MuiDialogActions);

export default function PlannedActivity(props) {
    const currentTime = moment().hours() + ":" + moment().minutes();
    const [open, setOpen] = React.useState(false);
    const [dueDate, setDueDate] = React.useState("");
    const [dueTime, setDueTime] = React.useState(currentTime);
    const [note, setNote] = React.useState("");

    const handleClickOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };

    const handleSubmit = () => {
        setOpen(false);
        let data = {
            deal_id: props.data.id,
            person_id: props.data.person_id.value,
            user_id: props.data.user_id.id,
            due_date: dueDate,
            due_time: dueTime,
            note: note,
            done: false,
        };
        props.addPlannedActivity(data, props.data.redirect_url);
    }

    return (
        <div>
            <IconButton color="primary" onClick={handleClickOpen}>
                <AlarmIcon />
            </IconButton>
            <Dialog fullWidth={true} maxWidth={"xs"} onClose={handleClose} aria-labelledby="customized-dialog-title" open={open}>
                <DialogTitle id="customized-dialog-title" onClose={handleClose}>
                    Plan Activity
                </DialogTitle>
                <DialogContent dividers>
                    <div style={{ textAlign: "center" }}>
                        <TextField
                            name="dueDate"
                            label="Date"
                            style={{ margin: 20, width: "90%" }}
                            type="date"
                            margin="dense"
                            variant="outlined"
                            value={dueDate}
                            onChange={(e) => setDueDate(e.target.value)}
                            InputLabelProps={{
                                shrink: true
                            }}
                        />
                        <TextField
                            name="dueTime"
                            label="Time"
                            style={{ margin: 20, width: "90%" }}
                            type="time"
                            margin="dense"
                            variant="outlined"
                            value={dueTime}
                            onChange={(e) => setDueTime(e.target.value)}
                            InputLabelProps={{
                                shrink: true
                            }}
                            inputProps={{
                                step: 300,
                            }}
                        />
                        <TextField
                            name="note"
                            label="Note"
                            style={{ margin: 20, width: "90%" }}
                            type="text"
                            margin="dense"
                            variant="outlined"
                            value={note}
                            rows={6}
                            multiline
                            onChange={(e) => setNote(e.target.value)}
                        />
                    </div>
                </DialogContent>
                <DialogActions>
                    <Button autoFocus onClick={handleSubmit} color="primary">
                        Save
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
