import React from 'react';
import Button from "@material-ui/core/Button";
import Dialog from '@material-ui/core/Dialog';
import Fab from '@material-ui/core/Fab';
import MenuItem from '@material-ui/core/MenuItem';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import TextField from "@material-ui/core/TextField";
import Typography from '@material-ui/core/Typography';

import AddIcon from '@material-ui/icons/Add';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';

import {
    Grid,
    withStyles,
    Tooltip,
} from "@material-ui/core";

import log from "../../../config/log";

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
    }
});

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250
        }
    }
};

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


export default function Form(props) {
    const [open, setOpen] = React.useState(false);
    const [data, setData] = React.useState({
        title: "",
        description: "",
        date: "",
        isFeatured: false
    });

    const handleClickOpen = () => {
        setOpen(true);
        if (props.data) {
            log("Data Prop from Parent", "info", props.data);
            let myDate;
            if (props.data.date) {
                myDate = new Date(props.data.date)
                myDate.setDate(myDate.getDate() + 1);
                myDate = myDate.toISOString().substr(0, 10);
            }
            setData({
                title: props.data.title ? props.data.title : '',
                date: props.data.date ? myDate : "",
                description: props.data.description ? props.data.description : '',
                isFeatured: props.data.isFeatured ? props.data.isFeatured : false
            });
        }
    };
    const handleClose = () => {
        setOpen(false);
    };
    const handleChange = (value, id) => {
        if (id === 1) {
            setData({
                title: value.target.value,
                date: data.date,
                description: data.description,
                isFeatured: data.isFeatured
            });
        }
        else if (id === 2) {
            setData({
                title: data.title,
                date: value.target.value,
                description: data.description,
                isFeatured: data.isFeatured
            });
        }
        else if (id === 3) {
            setData({
                title: data.title,
                date: data.date,
                description: value.target.value,
                isFeatured: data.isFeatured
            });
        }
        else if (id === 4) {
            setData({
                title: data.title,
                date: data.date,
                description: data.description,
                isFeatured: value.target.value
            });
        }
    }
    const handleSubmit = () => {
        if (props.submit) {
            log("Passing data to Parent", "info", "Submit")
            props.submit(data);
        }
        else if (props.update) {
            log("Passing data to Parent", "info", "Update")
            props.update(data, props.data._id);
        }
        handleClose();
    }
    const handleDelete = (id) => {
        log("Delete triggered at middleware", "warning", id);
        props.delete(id);
    }

    const filteredArr = props.fields.reduce((acc, current) => {
        const x = acc.find(item => item.name === current.name);
        if (!x) {
            return acc.concat([current]);
        } else {
            return acc;
        }
    }, []);
    return (
        <div>
            {props.create && (
                <Fab color="primary" variant="extended" onClick={handleClickOpen}>
                    <AddIcon style={{ marginRight: 5 }} />
                    ADD
                </Fab>
            )}
            {props.edit && (
                <>
                    <Tooltip title="edit" aria-label="edit">
                        <IconButton onClick={handleClickOpen} aria-label="edit">
                            <EditIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>
                    {log("Props at middleware", "info", props)}

                </>
            )}
            {props.delete && (
                <Tooltip title="delete" aria-label="delete">
                    <IconButton onClick={e => handleDelete(props.data._id)} aria-label="edit">
                        <DeleteIcon fontSize="small" />
                    </IconButton>
                </Tooltip>
            )}
            <Dialog onClose={handleClose} aria-labelledby="customized-dialog-title" open={open}>
                <DialogTitle id="customized-dialog-title" onClose={handleClose}>
                    {props.edit ? "Edit" : "Add"} {props.title}
                </DialogTitle>
                <DialogContent dividers>
                    <Grid container spacing={2}>
                        {filteredArr.map((item, index) => {
                            if (item.type !== 4) {
                                return (
                                    <Grid item xs={12} sm={12} md={12}>
                                        <TextField
                                            key={index}
                                            margin="dense"
                                            name={item.name}
                                            label={item.label}
                                            fullWidth
                                            type={(item.type === 2) ? "date" : "text"}
                                            variant="outlined"
                                            autoFocus={item.type === 1 ? true : false}
                                            multiline={(item.type === 3) ? true : false}
                                            rows={item.type === 3 ? 3 : 0}
                                            onChange={(e) => handleChange(e, item.type === 1 ? 1
                                                : item.type === 2 ? 2 : item.type === 3 ? 3 : 0
                                            )}
                                            value={
                                                item.type === 1 ? data.title
                                                    : item.type === 3 ? data.description
                                                        : item.type === 2 ? data.date : ""
                                            }
                                            InputLabelProps={{
                                                shrink: true,
                                            }}
                                        />
                                    </Grid>
                                );
                            }
                            else if (item.type === 4) {
                                return (
                                    <Grid item xs={12} sm={12} md={12}>
                                        <TextField
                                            key={index}
                                            margin="dense"
                                            name={item.name}
                                            label={item.label}
                                            fullWidth
                                            variant="outlined"
                                            select
                                            onChange={(e) => handleChange(e, item.type)}
                                            value={item.type === 4 ? data.isFeatured : ''}
                                            InputLabelProps={{
                                                shrink: true,
                                            }}
                                        >
                                            {item.options && item.options.map((each, key) => (
                                                <MenuItem key={key} value={each.value}>
                                                    {each.name}
                                                </MenuItem>

                                            ))}
                                        </TextField>
                                    </Grid>
                                )
                            }
                            else {
                                return null;
                            }
                        })}
                    </Grid>
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
