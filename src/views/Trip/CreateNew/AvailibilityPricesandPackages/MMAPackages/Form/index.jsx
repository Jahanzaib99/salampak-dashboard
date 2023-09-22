import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Button from "@material-ui/core/Button";
import Checkbox from "@material-ui/core/Checkbox";
import Dialog from '@material-ui/core/Dialog';
import Fab from '@material-ui/core/Fab';
import FormControlLabel from "@material-ui/core/FormControlLabel";
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

import log from "../../../../../../config/log";

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


export default function Form(props) {
    const [open, setOpen] = React.useState(false);
    const [data, setData] = React.useState({
        name: "",
        alias: "",
        description: "",
        parent: {},
        isFilter: true,
        isDomestic: props.mark,
    });

    const handleClickOpen = () => {
        setOpen(true);
        if (props.data) {
            log("Data Prop from Parent", "info", props.data);
            setData({
                name: props.data.name,
                alias: props.data.alias,
                description: props.data.description,
                isFilter: props.data.isFilter,
                isDomestic: props.data.isDomestic,
            });
            if (props.data.parent) {
                setData({
                    name: props.data.name,
                    alias: props.data.alias,
                    description: props.data.description,
                    parent: {
                        id: props.data.parent.id,
                        name: props.data.parent.name
                    },
                    isFilter: props.data.isFilter,
                    isDomestic: props.data.isDomestic,
                });
            }
        }
    };
    const handleClose = () => {
        setOpen(false);
    };
    const handleChange = (value, id) => {
        if (id === 1) {
            setData({
                name: value.target.value,
                alias: data.alias,
                description: data.description,
                parent: data.parent,
                isFilter: data.isFilter,
                isDomestic: data.isDomestic,
            });
        }
        else if (id === 2) {
            setData({
                name: data.name,
                alias: value.target.value,
                description: data.description,
                parent: data.parent,
                isFilter: data.isFilter,
                isDomestic: data.isDomestic,
            });
        }
        else if (id === 3) {
            setData({
                name: data.name,
                alias: data.alias,
                description: value.target.value,
                parent: data.parent,
                isFilter: data.isFilter,
                isDomestic: data.isDomestic,
            });
        }
        else if (id === 4) {
            setData({
                name: data.name,
                alias: data.alias,
                description: data.description,
                parent: {
                    id: value.target.value.split("|")[0],
                    name: value.target.value.split("|")[1]
                },
                isFilter: data.isFilter,
                isDomestic: data.isDomestic,
            });
        }
        else if (id === 5) {
            setData({
                name: data.name,
                alias: data.alias,
                description: data.description,
                parent: data.parent,
                isFilter: data.isFilter,
                isDomestic: value.target.checked
            });
        }
    }
    const handleSubmit = () => {
        console.log('1234 handleSubmit');
        if (props.submit) {
            log("Passing data to Parent", "info", "Submit")
            props.submit(data);
        console.log('1234 handleSubmit props.submit', props.submit);

        }
        else if (props.update) {
            log("Passing data to Parent", "info", "Update")
            props.update(data, props.data._id);
        console.log('1234 handleSubmit props.update', props.update);

        }
        handleClose();
    }
    const handleDelete = (id) => {
        log("Delete triggered at middleware khalid", "warning", id);
        props.delete(id);
    }

    const handleDeleteWithoutId = (data) => {
        log("Delete triggered at middleware khalid", "warning", data);
        props.delete(data);
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
                   
                    {log("Props at middleware", "info", props)}
                    {props.delete && (
                        <Fab
                            size="small"
                            style={{ margin: 5 }}
                            color="default"
                            onClick={e => handleDeleteWithoutId(props.data)}>
                            <DeleteIcon />
                        </Fab>
                    )}
                </>
            )}
            <Dialog onClose={handleClose} aria-labelledby="customized-dialog-title" open={open}>
                <DialogTitle id="customized-dialog-title" onClose={handleClose}>
                    {props.edit ? "Edit" : "Add"} {props.title}
                </DialogTitle>
                <DialogContent dividers>
                    {filteredArr.map((item, index) => {
                        if (item.type !== 4 && item.type !== 5) {
                            return (
                                <TextField
                                    key={index}
                                    margin="dense"
                                    name={item.name}
                                    label={item.label}
                                    fullWidth
                                    variant="outlined"
                                    autoFocus={item.type === 1 ? true : false}
                                    multiline={item.type === 3 ? true : false}
                                    rows={item.type === 3 ? 4 : 0}
                                    onChange={(e) => handleChange(e, item.type === 1 ? 1
                                        : item.type === 2 ? 2 : item.type === 3 ? 3 : 0)}
                                    value={
                                        item.type === 1 ? data.name
                                            : item.type === 2 ? data.alias
                                                : item.type === 3 ? data.description : ""}
                                />
                            );
                        }
                        else if (item.type === 4) {
                            return (
                                <TextField
                                    style={{ marginTop: 5 }}
                                    key={index}
                                    select
                                    name={item.name}
                                    label={item.label}
                                    fullWidth
                                    variant="outlined"
                                    onChange={(e) => handleChange(e, 4)}
                                    value={item.type === 4 && data.name !== "" ? (data.parent.id + "|" + data.parent.name) : ""}>
                                    {item.options && item.options.map((each, key) => (
                                        <MenuItem key={key} value={each._id + "|" + each.name}>
                                            {each.name}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            )
                        }
                        else if (item.type === 5) {
                            return (
                                <FormControlLabel
                                    label={item.label}
                                    name={item.name}
                                    style={{ marginTop: 5 }}
                                    key={index}
                                    control={
                                        <Checkbox
                                            checked={data.isDomestic}
                                            name="isDomestic"
                                            onChange={(e) => handleChange(e, 5)}
                                            value={data.isDomestic}
                                            inputProps={{
                                                'aria-label': "seconday checkbox",
                                            }}
                                        />
                                    }
                                />
                            )
                        }
                        return null;
                    })}
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
