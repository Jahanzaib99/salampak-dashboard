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
import Typography from '@material-ui/core/Typography';
import Select from "@material-ui/core/Select";
import InputLabel from "@material-ui/core/InputLabel";
import TextField from "@material-ui/core/TextField";


import AddIcon from '@material-ui/icons/Add';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';

import {
    Grid,
    withStyles,
} from "@material-ui/core";

import log from "../../../../config/log";

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
        categoryId: "",
        locationId: "",
        isFeatured: "",
        overview: "",
        hotel_name: ""
    });

    const handleClickOpen = () => {
        setOpen(true);
        if (props.data) {
            log("Data Prop from Parent", "info", props.data);
            console.log(props.data.isFeatured)
            setData({
                categoryId: (props.data.category && props.data.category._id) ? props.data.category._id : "",
                locationId: (props.data.location && props.data.location._id) ? props.data.location._id : "",
                isFeatured: (props.data.isFeatured) ? 'true' 
                            : (!props.data.isFeatured) ? 'false' : '' ,
                overview: props.data.overview ? props.data.overview : "",
                hotel_name: props.data.brand_name ? props.data.brand_name : ""
            });
        }
    };
    const handleClose = () => {
        setOpen(false);
    };
    const handleChange = (value, id) => {
        if (id === 1) {
            setData({
                categoryId: value.target.value,
                locationId: data.locationId,
                isFeatured: data.isFeatured,
                hotel_name: data.hotel_name,
                overview: data.overview,
            });
        }
        else if (id === 2) {
            setData({
                categoryId: data.categoryId,
                locationId: value.target.value,
                isFeatured: data.isFeatured,
                hotel_name: data.hotel_name,
                overview: data.overview,
            });
        }
        else if (id === 3) {
            setData({
                categoryId: data.categoryId,
                locationId: data.locationId,
                isFeatured: value.target.value,
                hotel_name: data.hotel_name,
                overview: data.overview,
            });
        }
        else if (id === 4) {
            setData({
                categoryId: data.categoryId,
                locationId: data.locationId,
                isFeatured: data.isFeatured,
                hotel_name: value.target.value,
                overview: data.overview
            });
        }
        else if (id === 5) {
            setData({
                categoryId: data.categoryId,
                locationId: data.locationId,
                isFeatured: data.isFeatured,
                hotel_name: data.hotel_name,
                overview: value.target.value,
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
                    <Fab size="small" style={{ margin: 5 }} color="secondary" onClick={handleClickOpen}>
                        <EditIcon />
                    </Fab>
                    {log("Props at middleware", "info", props)}
                    {props.delete && (
                        <Fab
                            size="small"
                            style={{ margin: 5 }}
                            color="default"
                            onClick={e => handleDelete(props.data._id)}>
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
                    <Grid container spacing={2}>
                        {filteredArr.map((item, index) => {
                            if(item.type !== 4 && item.type !== 5) {
                                return (
                                    <Grid key={index} item xs={12} sm={12} md={12}>
                                        <InputLabel id="demo-simple-select-outlined-label">{item.label}</InputLabel>
                                        <Select
                                            key={index}
                                            name={item.name}
                                            style={{ marginTop: 5 }}
                                            fullWidth
                                            variant="outlined"
                                            labelId="demo-simple-select-outlined-label"
                                            id="demo-simple-select-outlined"
                                            value={item.type === 1 ? data.categoryId
                                                : item.type === 2 ? data.locationId
                                                : item.type === 3 ? data.isFeatured
                                                : ""}
                                            onChange={(e) => handleChange(e, item.type)}
                                        >
                                            <MenuItem value="">
                                                <em>None</em>
                                            </MenuItem>
                                             {item.options && item.options.map((each, key) => (
                                                <MenuItem key={key} value={item.type !== 3 ? each._id : each}>
                                                   {item.type !== 3 ? each.name : each}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </Grid>
                                )    
                            } else if(item.type === 4 || item.type === 5) {
                                return (
                                    <Grid key={index} item xs={12} sm={12} md={12}>
                                        <TextField
                                            key={index}
                                            margin="dense"
                                            name={item.name}
                                            label={item.label}
                                            fullWidth
                                            type="text"
                                            variant="outlined"
                                            multiline={item.type === 5 ? true : false}
                                            rows={item.type === 5 ? 4 : 0}
                                            onChange={(e) => handleChange(e, item.type === 4 ? 4 
                                                : item.type === 5 ? 5 : 0
                                            )}
                                            value={ item.type === 4 ? data.hotel_name
                                                : item.type === 5 ? data.overview : ""
                                            }
                                        />
                                    </Grid>
                                )
                            } else return null
                                
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
