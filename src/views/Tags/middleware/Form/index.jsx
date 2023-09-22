import React, { useEffect, useRef, useState } from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import Fab from "@material-ui/core/Fab";
import MenuItem from "@material-ui/core/MenuItem";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import MuiDialogContent from "@material-ui/core/DialogContent";
import MuiDialogActions from "@material-ui/core/DialogActions";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import Select from "@material-ui/core/Select";
import Chip from "@material-ui/core/Chip";
import InputLabel from "@material-ui/core/InputLabel";
import Checkbox from "@material-ui/core/Checkbox";
import ListItemText from "@material-ui/core/ListItemText";
import FormControl from "@material-ui/core/FormControl";

import AddIcon from "@material-ui/icons/Add";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import Paper from "@material-ui/core/Paper";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import {
  Grid,
  withStyles,
  Tooltip,
  FormControlLabel,
  RadioGroup,
  Radio,
  FormLabel,
} from "@material-ui/core";
import log from "../../../../config/log";
import ImageUpload from "../../ImageUpload";
import Capitalize from "../../../../helpers/Capitalize";
import { useSelector } from 'react-redux'
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import MyEditor from './../../../../components/editor';

const styles = (theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(2),
  },
  closeButton: {
    position: "absolute",
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
  flexColumn: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",


  }
});

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};


const TextFields = withStyles((theme) => ({
  root: {
    "& input::-webkit-clear-button, & input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button": {
      display: "none",
    },
  },

}))(TextField);
const DivButton = withStyles(styles)((props) => (<div className={props.classes.flexColumn}>
  {props.children}
</div>));

const DialogTitle = withStyles(styles)((props) => {
  const { children, classes, onClose, ...other } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      <Typography variant="h6">{children}</Typography>
      {onClose ? (
        <IconButton
          aria-label="close"
          className={classes.closeButton}
          onClick={onClose}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});

const DialogContent = withStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
  },
}))(MuiDialogContent);

const DialogActions = withStyles((theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(1),
  },
}))(MuiDialogActions);

export default function Form(props) {
  const [open, setOpen] = React.useState(false);
  const userPermissions = useSelector(state => state.auth.userPermissions)
  const [editorValue, setEditorValue,] = useState("");
  const [data, setData] = React.useState({
    name: "",
    alias: "",
    longitude: null,
    latitude: null,
    type: "",
    parentCategories: [],
    parentActivities: [],
    surroundings: [],
    description: "",
    longDescription: "",
    parentProvince: "",
    weatherId: "",
    isFeatured: false,
    dob: +new Date(),
    vendorType: ''
  });
  const [tab, setTab] = React.useState(0);

  const formatDate = (date) => {
    var d = new Date(date),
      month = "" + (d.getMonth() + 1),
      day = "" + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;

    return [year, month, day].join("-");
  };
  const handleClickOpen = () => {
    setOpen(true);
    if (props.data) {
      log("Data Prop from Parent", "info", props.data);
      setData({
        name: props.data.name ? props.data.name : "",
        alias: props.data.alias ? props.data.alias : "",
        code: props.data.code ? props.data.code : "",
        longitude:
          props.data.location && props.data.location.coordinates[0]
            ? props.data.location.coordinates[0]
            : null,
        latitude:
          props.data.location && props.data.location.coordinates[1]
            ? props.data.location.coordinates[1]
            : null,
        type: props.data.categoryType
          ? props.data.categoryType
          : props.data.activityType
            ? props.data.activityType
            : props.data.locationType
              ? props.data.locationType
              : props.data.type
                ? props.data.type
                : "",
        parentCategories: props.data.parentCategories
          ? props.data.parentCategories
          : [],
        parentActivities: props.data.parentActivities
          ? props.data.parentActivities
          : [],
        surroundings: props.data.surroundings ? props.data.surroundings : [],
        description: props.data.description ? props.data.description : "",
        longDescription: props.data.longDescription
          ? props.data.longDescription
          : "",
        parentProvince: props.data.parentProvince
          ? props.data.parentProvince
          : "",
        weatherId: props.data.weatherId ? props.data.weatherId : "",
        isFeatured: props.data.isFeatured ? props.data.isFeatured : false,
        firstName: props?.data?.profile?.firstName
          ? props.data.profile.firstName
          : "",
        lastName: props?.data?.profile?.lastName
          ? props.data.profile.lastName
          : "",
        mobile: props?.data?.profile?.mobile ? props.data.profile.mobile : "",
        gender: props?.data?.profile?.gender ? props.data.profile.gender : "",
        email: props?.data?.profile?.email ? props.data.profile.email : "",

        nic: props?.data?.profile?.nic ? props.data.profile.nic : "",
        dob: formatDate(
          props?.data?.profile?.dob ? props.data.profile.dob : +new Date()
        ),
        bankTitle: props?.data?.profile?.bankTitle ? props.data.profile.bankTitle : "",
        accountName: props?.data?.profile?.accountName ? props.data.profile.accountName : "",
        accountNumber: props?.data?.profile?.accountNumber ? props.data.profile.accountNumber : "",

        vendorType: props?.data?.vendorType ? props?.data?.vendorType : "",

      });
      return props.setObjectId ? props.setObjectId() : "";
    }
    else {
      setData({
        ...data,
        name: "",
        alias: "",
        longitude: null,
        latitude: null,
        type: "",
        parentCategories: [],
        parentActivities: [],
        surroundings: [],
        description: "",
        longDescription: "",
        parentProvince: "",
        weatherId: "",
        isFeatured: false,
        dob: +new Date(),
        vendorType: ''
      })
      return props.setObjectId ? props.setObjectId() : "";
    }
  };
  const handleClose = () => {
    setOpen(false);
    if (props.closeModal) { props.closeModal(); }
    return props?.emptyObjectId ? props.emptyObjectId() : "";
  };
  const handleChange = (value, id) => {
    if (id === 1) {
      setData({
        ...data,
        name: value.target.value,
        alias: data.alias,
        longitude: data.longitude,
        latitude: data.latitude,
        type: data.type,
        parentCategories: data.parentCategories,
        parentActivities: data.parentActivities,
        surroundings: data.surroundings,
        description: data.description,
        longDescription: data.longDescription,
        parentProvince: data.parentProvince,
        weatherId: data.weatherId,
        isFeatured: data.isFeatured,
      });
    } else if (id === 2) {
      setData({
        ...data,
        name: data.name,
        alias: value.target.value,
        longitude: data.longitude,
        latitude: data.latitude,
        type: data.type,
        parentCategories: data.parentCategories,
        parentActivities: data.parentActivities,
        surroundings: data.surroundings,
        description: data.description,
        longDescription: data.longDescription,
        parentProvince: data.parentProvince,
        weatherId: data.weatherId,
        isFeatured: data.isFeatured,
      });
    } else if (id === 3) {
      setData({
        ...data,
        name: data.name,
        alias: data.alias,
        longitude: value.target.value,
        latitude: data.latitude,
        type: data.type,
        parentCategories: data.parentCategories,
        parentActivities: data.parentActivities,
        surroundings: data.surroundings,
        description: data.description,
        longDescription: data.longDescription,
        parentProvince: data.parentProvince,
        weatherId: data.weatherId,
        isFeatured: data.isFeatured,
      });
    } else if (id === 4) {
      setData({
        ...data,
        name: data.name,
        alias: data.alias,
        longitude: data.longitude,
        latitude: value.target.value,
        type: data.type,
        parentCategories: data.parentCategories,
        parentActivities: data.parentActivities,
        surroundings: data.surroundings,
        description: data.description,
        longDescription: data.longDescription,
        parentProvince: data.parentProvince,
        weatherId: data.weatherId,
        isFeatured: data.isFeatured,
      });
    } else if (id === 5) {
      setData({
        ...data,
        name: data.name,
        alias: data.alias,
        longitude: data.longitude,
        latitude: data.latitude,
        type: value.target.value,
        parentCategories: data.parentCategories,
        parentActivities: data.parentActivities,
        surroundings: data.surroundings,
        description: data.description,
        longDescription: data.longDescription,
        parentProvince: data.parentProvince,
        weatherId: data.weatherId,
        isFeatured: data.isFeatured,
      });
    } else if (id === 6) {
      setData({
        ...data,
        name: data.name,
        alias: data.alias,
        longitude: data.longitude,
        latitude: data.latitude,
        type: data.type,
        parentCategories: value.target.value,
        parentActivities: data.parentActivities,
        surroundings: data.surroundings,
        description: data.description,
        longDescription: data.longDescription,
        parentProvince: data.parentProvince,
        weatherId: data.weatherId,
        isFeatured: data.isFeatured,
      });
    } else if (id === 7) {
      setData({
        ...data,
        name: data.name,
        alias: data.alias,
        longitude: data.longitude,
        latitude: data.latitude,
        type: data.type,
        parentCategories: data.parentCategories,
        parentActivities: value.target.value,
        surroundings: data.surroundings,
        description: data.description,
        longDescription: data.longDescription,
        parentProvince: data.parentProvince,
        weatherId: data.weatherId,
        isFeatured: data.isFeatured,
      });
    } else if (id === 8) {
      setData({
        ...data,
        name: data.name,
        alias: data.alias,
        longitude: data.longitude,
        latitude: data.latitude,
        type: data.type,
        parentCategories: data.parentCategories,
        parentActivities: data.parentActivities,
        surroundings: data.surroundings,
        description: value.target.value,
        longDescription: data.longDescription,
        parentProvince: data.parentProvince,
        weatherId: data.weatherId,
        isFeatured: data.isFeatured,
      });
    } else if (id === 9) {
      setData({
        ...data,
        name: data.name,
        alias: data.alias,
        longitude: data.longitude,
        latitude: data.latitude,
        type: data.type,
        parentCategories: data.parentCategories,
        parentActivities: data.parentActivities,
        surroundings: data.surroundings,
        description: data.description,
        longDescription: data.longDescription,
        parentProvince: value.target.value,
        weatherId: data.weatherId,
        isFeatured: data.isFeatured,
      });
    } else if (id === 10) {
      setData({
        ...data,
        name: data.name,
        alias: data.alias,
        longitude: data.longitude,
        latitude: data.latitude,
        type: data.type,
        parentCategories: data.parentCategories,
        parentActivities: data.parentActivities,
        surroundings: data.surroundings,
        description: data.description,
        longDescription: value.target.value,
        parentProvince: data.parentProvince,
        weatherId: data.weatherId,
        isFeatured: data.isFeatured,
      });
    } else if (id === 11) {
      setData({
        ...data,
        name: data.name,
        alias: data.alias,
        longitude: data.longitude,
        latitude: data.latitude,
        type: data.type,
        parentCategories: data.parentCategories,
        parentActivities: data.parentActivities,
        surroundings: data.surroundings,
        description: data.description,
        longDescription: data.longDescription,
        parentProvince: data.parentProvince,
        weatherId: value.target.value,
        isFeatured: data.isFeatured,
      });
    } else if (id === 12) {
      setData({
        ...data,
        name: data.name,
        alias: data.alias,
        longitude: data.longitude,
        latitude: data.latitude,
        type: data.type,
        parentCategories: data.parentCategories,
        parentActivities: data.parentActivities,
        surroundings: data.surroundings,
        description: data.description,
        longDescription: data.longDescription,
        parentProvince: data.parentProvince,
        weatherId: data.weatherId,
        isFeatured: value.target.checked,
      });
    } else if (id === 13) {
      if (value.target.value.length > 0) {
        let matchId = value.target.value[value.target.value.length - 1]._id;
        var count = 0;
        value.target.value.map((each) => {
          if (each._id == matchId) count++;
        });
        if (count > 1) {
          let matchedElements = value.target.value.map((surr) => {
            return surr._id === matchId;
          });
          matchedElements.map((each, index) => {
            if (each & (index < value.target.value.length - 1)) {
              value.target.value.splice(index, 1);
            } else if (each & (index === value.target.value.length)) {
              value.target.value.splice(value.target.value.length - 1, 1);
            }
          });
        }
      }
      setData({
        ...data,
        name: data.name,
        alias: data.alias,
        longitude: data.longitude,
        latitude: data.latitude,
        type: data.type,
        parentCategories: data.parentCategories,
        parentActivities: data.parentActivities,
        surroundings: value.target.value,
        description: data.description,
        longDescription: data.longDescription,
        parentProvince: data.parentProvince,
        weatherId: data.weatherId,
        isFeatured: data.isFeatured,
      });
    } else if ((id >= 14 && id <= 18) || id == 20 || (id >= 23 && id <= 27)) {
      if (id === 20 || id === 27) {
        let reg = /^[0-9.-]*$/g

        return reg.test(value.target.value) ?
          setData({
            ...data,
            [value.target.name]: value.target.value,
          })
          : ""
      }
      else {
        setData({
          ...data,
          [value.target.name]: value.target.value,
        });
      }
    } else if (id === 19) {
      setData({
        ...data,
        type: value.target.value,
      });
      return props?.getUserType ? props.getUserType(value.target.value) : ""
    } else if (id === 21) {
      setData({
        ...data,
        dob: value,
      });
    } else if (id === 22) {
      setData({
        ...data,
        gender: value.target.value,
      });
    }
  };
  const handleSubmit = () => {
    data.longDescription = editorValue ? editorValue : data.longDescription;
    if (props.submit) {
      data.coordinates = [];
      data.coordinates[0] = data.longitude;
      data.coordinates[1] = data.latitude;
      log("Passing data to Parent", "info", "Submit");
      props.submit(data);
    } else if (props.update) {
      data.coordinates = [];
      data.coordinates[0] = data.longitude;
      data.coordinates[1] = data.latitude;
      log("Passing data to Parent", "info", "Update");
      props.update(data, props.data._id);
    }
    return !props.apiUrl ? handleClose() : "";
  };
  const handleDelete = (id) => {
    log("Delete triggered at middleware", "warning", id);
    props.delete(id);
  };
  const filteredArr = props.fields.reduce((acc, current) => {
    const x = acc.find((item) => item.name === current.name);
    if (!x) {
      return acc.concat([current]);
    } else {
      return acc;
    }
  }, []);
  function usePrevious(value) {
    const ref = useRef();
    useEffect(() => {
      ref.current = value;
    });
    return ref.current;
  }
  var { modalOpen } = props;
  const prevState = usePrevious({ modalOpen });
  useEffect(() => {
    if (modalOpen !== prevState?.modalOpen) {
      if (modalOpen) {
        handleClickOpen();
      }
    }
  }, [modalOpen])

  useEffect(() => {
    if (props.create && props._objectId) {
      setTab(1)
    }
    else {
      setTab(0)
    }
  }, [props._objectId]);

  return (
    <div>
      {props.create && (
        <Fab style={{ whiteSpace: 'nowrap' }} color="primary" variant="extended" onClick={handleClickOpen}>
          <AddIcon style={{ marginRight: 5 }} />
          {props?.addbuttonText ? props?.addbuttonText : "ADD"}
        </Fab>
      )}
      {!props.isProfile && (
        <DivButton>
          {
            props.edit && (<Tooltip title="edit" aria-label="edit">
              <IconButton onClick={handleClickOpen} aria-label="edit">
                <EditIcon fontSize="small" />
              </IconButton>
            </Tooltip>)
          }

          {/* <Fab size="small" style={{ margin: 5 }} color="secondary" onClick={handleClickOpen}>
                        <EditIcon onClick={handleClickOpen} />
                    </Fab> */}
          {props.delete && (

            <Tooltip title="delete" aria-label="delete">
              <IconButton onClick={(e) => handleDelete(props.data._id)} aria-label="delete">

                <DeleteIcon />
              </IconButton>
            </Tooltip>
          )}
        </DivButton>
      )}
      <Dialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
        fullWidth
      >
        <DialogTitle id="customized-dialog-title" onClose={handleClose}>
          {props.edit ? "Edit" : "Add"} {props.title}
        </DialogTitle>
        <Paper square>
          <Tabs
            value={tab}
            indicatorColor="primary"
            textColor="primary"
            onChange={(e, uv) => setTab(uv)}
            aria-label="example"
            variant="fullWidth"
          >
            {/* <Tab label={`${props.edit ? "Edit" : "Add"} ${props.title}`} />
             */}
            <Tab label={"Basic Info"} />

            {props.isTab ? (
              <Tab label="Image" disabled={!props._objectId} />
            ) : (
              ""
            )}
            {/* <DialogTitle
              id="customized-dialog-title"
              onClose={handleClose}
            ></DialogTitle> */}
          </Tabs>
        </Paper>

        {tab == 0 ? (
          <DialogContent dividers>
            <Grid container spacing={2}>
              {filteredArr.map((item, index) => {
                if (
                  !item?.isHide &&
                  item.type !== 6 &&
                  item.type !== 7 &&
                  item.type !== 5 &&
                  item.type !== 9 &&
                  item.type !== 12 &&
                  item.type !== 13 &&
                  item.type !== 19 &&
                  item.type !== 21 &&
                  item.type !== 22 &&
                  item.type !== 24 &&
                  item.type !== 28
                  &&
                  // (item.type !== 16 || !props.update) &&
                  (item.type !== 18 || !props.update || item?.showfield)
                ) {
                  return (
                    <Grid
                      item
                      xs={12}
                      sm={12}
                      md={item.type === 3 || item.type === 4 ? 6 : 12}
                    >
                      <TextFields
                        key={index}
                        disabled={item.disabled}
                        margin="dense"
                        name={item.name}
                        label={item.label}
                        fullWidth
                        type={
                          item.type === 18
                            ? "password"
                            : item.type === 3 ||
                              item.type === 4 ||
                              item.type === 17
                              ? "number"
                              : "text"
                        }
                        variant="outlined"
                        autoFocus={item.type === 1 ? true : false}
                        multiline={
                          item.type === 8 || item.type === 10 ? true : false
                        }
                        rows={item.type === 8 ? 2 : item.type === 10 ? 4 : 0}
                        onChange={(e) =>
                          handleChange(
                            e,
                            item.type === 1
                              ? 1
                              : item.type === 2
                                ? 2
                                : item.type === 3
                                  ? 3
                                  : item.type === 4
                                    ? 4
                                    : item.type === 8
                                      ? 8
                                      : item.type === 10
                                        ? 10
                                        : item.type === 11
                                          ? 11
                                          : item.type === 14
                                            ? 14
                                            : item.type === 15
                                              ? 15
                                              : item.type === 16
                                                ? 16
                                                : item.type === 17
                                                  ? 17
                                                  : item.type === 18
                                                    ? 18
                                                    : item.type === 20
                                                      ? 20
                                                      : item.type === 23
                                                        ? 23
                                                        : item.type === 25
                                                          ? 25
                                                          : item.type === 26
                                                            ? 26
                                                            : item.type === 27
                                                              ? 27
                                                              : ""
                          )
                        }
                        value={
                          item.type === 1
                            ? data.name
                            : item.type === 2
                              ? data.alias
                              : item.type === 3
                                ? data.longitude
                                : item.type === 4
                                  ? data.latitude
                                  : item.type === 8
                                    ? data.description
                                    : item.type === 10
                                      ? data.longDescription
                                      : item.type === 11
                                        ? data.weatherId
                                        : item.type === 14
                                          ? data.firstName
                                          : item.type === 15
                                            ? data.lastName
                                            : item.type === 16
                                              ? data.email
                                              : item.type === 17
                                                ? data.mobile
                                                : item.type === 18
                                                  ? data.password
                                                  : item.type === 20
                                                    ? data.nic
                                                    : item.type === 23
                                                      ? data.code
                                                      : item.type === 25
                                                        ? data.bankTitle
                                                        : item.type === 26
                                                          ? data.accountName
                                                          : item.type === 27
                                                            ? data.accountNumber
                                                            : ""
                        }
                      />
                    </Grid>
                  );
                } else if (item.type === 6 || item.type === 7) {
                  return (
                    <Grid item xs={12} sm={12} md={12}>
                      <FormControl variant="outlined" size="small" fullWidth>
                        <InputLabel id={item.label}>{item.label}</InputLabel>
                        <Select
                          labelId={item.label}
                          key={index}
                          name={item.name}
                          label={item.label}
                          multiple
                          value={
                            item.type === 6
                              ? data.parentCategories
                              : item.type === 7
                                ? data.parentActivities
                                : []
                          }
                          onChange={(e) => handleChange(e, item.type)}
                          renderValue={(selected) => (
                            <div
                              className={{ display: "flex", flexWrap: "wrap" }}
                            >
                              {item.options &&
                                item.options.map((each) =>
                                  selected.map((value) => {
                                    if (each._id === value) {
                                      return (
                                        <Chip
                                          key={value}
                                          label={each.name}
                                          style={{ margin: "2" }}
                                        />
                                      );
                                    }
                                    return null;
                                  })
                                )}
                            </div>
                          )}
                          MenuProps={MenuProps}
                        >
                          {item.options &&
                            item.options.map((each, key) => (
                              <MenuItem key={key} value={each._id}>
                                <Checkbox
                                  checked={
                                    item.type === 6
                                      ? data.parentCategories.indexOf(
                                        each._id
                                      ) > -1
                                      : item.type === 7
                                        ? data.parentActivities.indexOf(
                                          each._id
                                        ) > -1
                                        : null
                                  }
                                />
                                <ListItemText primary={each.name} />
                              </MenuItem>
                            ))}
                        </Select>
                      </FormControl>
                    </Grid>
                  );
                } else if (
                  item.type === 5 ||
                  (item.type === 19
                    // && (item.type !== 19 || !props.update)
                  )
                ) {
                  return (
                    <Grid item xs={12} sm={12} md={12}>
                      <FormControl variant="outlined" size="small" fullWidth>
                        <InputLabel id="demo-simple-select-outlined-label">
                          {item.label}
                        </InputLabel>
                        <Select
                          key={index}
                          labelId="demo-simple-select-outlined-label"
                          id="demo-simple-select-outlined"
                          value={data.type ? data.type : ""}
                          name={item.name ? item.name : ""}
                          label={item.label}
                          onChange={(e) => handleChange(e, item.type)}
                          disabled={item.disabled}
                        >
                          <MenuItem value="" disabled>
                            <em>None</em>
                          </MenuItem>
                          {item.options &&
                            item.options.map((each, key) => (
                              <MenuItem key={each} value={each}>
                                {Capitalize(each)}
                              </MenuItem>
                            ))}
                        </Select>
                      </FormControl>
                    </Grid>
                  );
                } else if (item.type === 9) {
                  return (
                    <Grid item xs={12} sm={12} md={12}>
                      <FormControl variant="outlined" size="small" fullWidth>
                        <InputLabel id={item.label}>{item.label}</InputLabel>
                        <Select
                          key={index}
                          labelId={item.label}
                          id={item.label}
                          value={data.parentProvince ? data.parentProvince : ""}
                          label={item.label}
                          onChange={(e) => handleChange(e, 9)}
                        >
                          <MenuItem value="">
                            <em>None</em>
                          </MenuItem>
                          {item.options &&
                            item.options.map((each, key) => (
                              <MenuItem key={each._id} value={each.slug}>
                                {each.slug}
                              </MenuItem>
                            ))}
                        </Select>
                      </FormControl>
                    </Grid>
                  );
                } else if (item.type === 12) {
                  return (
                    <Grid item xs={12} sm={12} md={12}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            color="primary"
                            checked={data.isFeatured}
                            onChange={(e) => handleChange(e, 12)}
                            name="checkedF"
                          />
                        }
                        label={item.label}
                        labelPlacement="end"
                      />
                    </Grid>
                  );
                } else if (item.type === 13) {
                  return (
                    <Grid item xs={12} sm={12} md={12}>
                      <FormControl variant="outlined" size="small" fullWidth>
                        <InputLabel id={item.label}>{item.label}</InputLabel>
                        <Select
                          labelId={item.label}
                          key={index}
                          name={item.name}
                          label={item.label}
                          multiple
                          value={item.type === 13 ? data.surroundings : []}
                          onChange={(e) => handleChange(e, item.type)}
                          renderValue={(selected) => (
                            <div
                              className={{ display: "flex", flexWrap: "wrap" }}
                            >
                              {item.options &&
                                item.options.map((each) =>
                                  selected.map((value) => {
                                    if (each._id === value._id) {
                                      return (
                                        <Chip
                                          key={each._id}
                                          label={each.name}
                                          style={{ margin: "2" }}
                                        />
                                      );
                                    } else {
                                      return null;
                                    }
                                  })
                                )}
                            </div>
                          )}
                          MenuProps={MenuProps}
                        >
                          {item.options &&
                            item.options.map((each, key) => (
                              <MenuItem key={key} value={each}>
                                <Checkbox
                                  checked={
                                    data.surroundings.length > 0
                                      ? data.surroundings.findIndex(
                                        (surr) => surr._id === each._id
                                      ) > -1
                                      : false
                                  }
                                />
                                <ListItemText primary={each.name} />
                              </MenuItem>
                            ))}
                        </Select>
                      </FormControl>
                    </Grid>
                  );
                } else if (item.type === 21) {
                  return (
                    <Grid item xs={12} sm={12} md={12}>
                      <MuiPickersUtilsProvider utils={DateFnsUtils}>
                        <KeyboardDatePicker
                          margin="normal"
                          id="DOB"
                          fullWidth
                          label="Date of Birth"
                          format="MM/dd/yyyy"
                          value={data.dob}
                          onChange={(e) => handleChange(e, item.type)}
                          KeyboardButtonProps={{
                            "aria-label": "change date",
                          }}
                        />
                      </MuiPickersUtilsProvider>
                    </Grid>
                  );
                } else if (item.type === 22) {
                  return (
                    <Grid item xs={12} sm={12} md={12}>
                      <FormControl>
                        <FormLabel component="legend">Gender</FormLabel>
                        <RadioGroup
                          row
                          aria-label="gender"
                          name="gender"
                          value={data.gender}
                          onChange={(e) => handleChange(e, 22)}
                        >
                          {item?.options?.length
                            ? item.options.map((radioOpt) => {
                              const nameCapitalized =
                                radioOpt.charAt(0).toUpperCase() +
                                radioOpt.slice(1);
                              return (
                                <FormControlLabel
                                  value={radioOpt}
                                  control={<Radio color="primary" />}
                                  label={nameCapitalized}
                                  labelPlacement={nameCapitalized}
                                />
                              );
                            })
                            : ""}
                        </RadioGroup>
                      </FormControl>
                    </Grid>
                  );
                }
                else if (
                  item.type === 24) {
                  return (
                    <Grid item xs={12} sm={12} md={12}>
                      <FormControl variant="outlined" size="small" fullWidth>
                        <InputLabel id="demo-simple-select-outlined-label">
                          {item.label}
                        </InputLabel>
                        <Select
                          key={index}
                          labelId="demo-simple-select-outlined-label"
                          id="demo-simple-select-outlined"
                          value={data.vendorType ? data.vendorType : ""}
                          name={item.name ? item.name : ""}
                          label={item.label}
                          onChange={(e) => handleChange(e, item.type)}
                          disabled={item.disabled}
                        >
                          {item.options &&
                            item.options.map((each, key) => (
                              <MenuItem key={each} value={each}>
                                {Capitalize(each)}
                              </MenuItem>
                            ))}
                        </Select>
                      </FormControl>
                    </Grid>
                  );
                }
                else if (item.type === 28) {
                  return (
                    < MyEditor
                      onChange={(e) => setEditorValue(e)}
                      name={item.name ? item.name : ""}
                      mL={100}
                      height="auto"
                      background="#f8fafc"
                      width="80%"
                      value={data?.[item.name] ? data?.[item.name] : ""}
                      placeholder={item?.label ? item?.label : "placeholder..."}
                      data={data?.[item.name]}
                    />
                  )
                }

                return null;
              })}
            </Grid>
          </DialogContent>
        ) : (
          <DialogContent dividers>
            <Grid container spacing={2}>
              <div
                style={{
                  display: "flex",
                  width: "100%",
                  height: "400px",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <ImageUpload
                  objectId={props._objectId}
                  formType={null}
                  apiUrl={props.apiUrl}
                  isForm={true}
                  isHideButton={props.title === "Category" ? true : false}
                  isEditMode={props.edit ? true : false}
                  paginationImgHide={props.paginationImgHide ? true : false}
                />
              </div>
            </Grid>
          </DialogContent>
        )}
        {tab == 0 ? (
          <DialogActions>
            <Button autoFocus onClick={handleSubmit} color="primary">
              Save
            </Button>
          </DialogActions>
        ) : (
          ""
        )}
      </Dialog>
    </div>
  );
}
