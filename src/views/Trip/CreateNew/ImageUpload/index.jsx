/////////////////////////////
// Image Uploading Component
/////////////////////////////

import React, { Component } from "react";
import axios from "axios";
import swal from "@sweetalert/with-react";
import PropTypes from "prop-types";

// Material components
import {
    Button,
    CircularProgress,
    Grid,
    GridList,
    GridListTile,
    GridListTileBar,
    IconButton,
    withStyles
} from "@material-ui/core";

import {
    FullscreenOutlined as ZoomIcon,
    Delete as DeleteIcon,
} from "@material-ui/icons";

// Component styles
import styles from "./style";

import {
    events,
    getImageById
} from "../../../../config/routes";

// Sub-component
import NewImage from "./NewImage";
import ViewImage from "./ViewImage";
import log from "config/log";

class ImageUploadComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            eventId: "",
            openDialog: false,
            viewDialog: false,
            viewImage: 0,
            images: [],
            base64: [],
            widths: [],
            heights: [],
            links: [],
            isLoading: false
        };
        this.imageRef = React.createRef();
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        if (this.props.data && this.props.data.length > 0) {
            this.setState({
                eventId: this.props.event,
                links: this.props.data
            }, () => this.getEventImages(this.state.eventId));
        }
        this.setState({
            eventId: this.props.event,
        }, () => this.getEventImages(this.state.eventId));
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        if (nextProps.event) {
            this.setState({
                tripVendor: nextProps.vendor,
                eventId: nextProps.event,
                links: nextProps.data
            });
        }
        if (nextProps.event && nextProps.data) {
            this.setState({
                tripVendor: nextProps.vendor,
                eventId: nextProps.event,
                links: nextProps.data
            });
        }
    }

    getEventImages = (id) => {
        axios
            .get(`${events}/${id}`)
            .then(response => {
                log(`GET ${events}/${id} ===> ImageUpload Component`, "info", response.data.data);
                let res = response.data.data;
                let data = {};
                if (res.photoIds.length > 0) {
                    data.links = res.photoIds;
                }
                this.setState(data);
            })
            .catch(error => {
                if (this.state.links && this.state.links.length > 0) {
                    log("Error at fetching images", "error", error?.response?.data);
                    swal(error?.response?.data.error.message, {
                        icon: "warning"
                    });
                }
                else {
                    log("Info", "info", "Don't throw errors if its not edit form");
                }
            })
    };

    handleSubmit = () => {
        let success = "";
        this.setState({
            isLoading: true,
        }, async () => {
            await this.state.base64.forEach(async item => {
                let data = {
                    photo: item
                }
                await axios
                    .post(`${events}/${this.state.eventId}/photos`, data)
                    .then(response => {
                        success = response.data.data.message;
                        this.setState({
                            links: response.data.data.id,
                            isLoading: false
                        }, () => {
                            this.props.enableTabs(true);
                            this.props.retainData({
                                dataImg: this.state.links
                            });
                            swal(success, {
                                icon: 'success'
                            });
                        });
                    })
                    .catch(error => {
                        this.setState({
                            isLoading: false,
                        }, () => {
                            swal(error?.response?.data.error.message, {
                                icon: 'error'
                            });
                        });
                    });
            });
        })
        if (success.length > 0) {
            this.props.enableTabs(true);
        }
    }

    openDialog = () => {
        this.setState({
            openDialog: !this.state.openDialog
        })
    }

    openViewDialog = (index) => {
        this.setState({
            viewDialog: !this.state.viewDialog,
            viewImage: index
        });
    }

    getImage = (image) => {
        let images = this.state.images;
        let base64s = this.state.base64;
        let widths = this.state.widths;
        let heights = this.state.heights;
        images.push(image.blob);
        base64s.push(image.base64);
        widths.push(image.width);
        heights.push(image.height);
        this.setState({
            images: images,
            base64: base64s,
            widths: widths,
            heights: heights,
            openDialog: false
        });
    }

    removeImage = (index) => {
        swal({
            title: "Are you sure?",
            text: "Once deleted, you will not be able to recover this record!",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        }).then(willDelete => {
            if (willDelete) {
                let images = this.state.images,
                    base64_images = this.state.base64,
                    widths = this.state.widths,
                    heights = this.state.heights;
                images.splice(index, 1);
                base64_images.splice(index, 1);
                widths.splice(index, 1);
                heights.splice(index, 1);
                this.setState({
                    images: images,
                    base64: base64_images,
                    widths: widths,
                    heights: heights
                });
            }
            else {
                swal("Image has not been deleted!", {
                    icon: "info"
                });
            }
        });
    }

    deleteImage = (id) => {
        swal({
            title: "Are you sure?",
            text: "Once deleted, you will not be able to recover this record!",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        }).then(willDelete => {
            if (willDelete) {
                axios
                    .delete(`${events}/${this.state.eventId}/photos/${id}`)
                    .then(response => {
                        swal(response.data.data.message, {
                            icon: "success"
                        });
                    })
                    .catch(error => {
                        swal(error?.response?.data.error.message, {
                            icon: 'error'
                        });
                    });
            }
            else {
                swal("Image has not been deleted!", {
                    icon: "info"
                });
            }
        })
    }

    validateDimension = (index) => {
        if (this.state.widths[index] < 960
            || this.state.heights[index] < 540) {
            swal("Please re-upload some other good quality image", {
                icon: 'error'
            });
            return false;
        }
        if (this.state.widths[index] > 1920
            || this.state.heights[index] > 1080) {
            swal("Please re-upload some other good quality image", {
                icon: 'error'
            });
            return false;
        }
        return true;
    }

    render() {
        const { classes } = this.props;
        const { openDialog, viewDialog, viewImage, images, links, isLoading } = this.state;
        return (
            <div>
                <form className={classes.form}>
                    <p className={classes.caption}>
                        <strong>Image Uploading Guide: </strong>
                        Allowed dimensions are 960 x 540 (min) and 1920 x 1080 (max)
                    </p>
                    <Button variant="outlined" className={classes.button} onClick={this.openDialog}>
                        Upload Image
                    </Button>
                    {openDialog && (
                        <NewImage open={openDialog} close={this.openDialog} submit={this.getImage} />
                    )}
                    {viewDialog && (
                        <ViewImage
                            open={viewDialog}
                            close={this.openViewDialog}
                            data={images}
                            index={viewImage}
                        />
                    )}
                    {images && images.length > 0 ? (
                        <React.Fragment>
                            <Grid container spacing={2}>
                                <GridList cols={3}>
                                    {images.map((item, index) => (
                                        <GridListTile key={index}>
                                            <img
                                                alt={`Crop - ${index}`}
                                                style={{
                                                    maxWidth: '100%',
                                                    boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)"
                                                }}
                                                src={item}
                                            />
                                            <GridListTileBar
                                                title={this.validateDimension(index) === false
                                                    ? "Please re-upload some other good quality image"
                                                    : `${this.state.widths[index]} x ${this.state.heights[index]}`}
                                                actionIcon={
                                                    <React.Fragment>
                                                        <IconButton onClick={e => this.openViewDialog(index)} className={classes.icon}>
                                                            <ZoomIcon />
                                                        </IconButton>
                                                        <IconButton onClick={e => this.removeImage(index)} className={classes.icon}>
                                                            <DeleteIcon />
                                                        </IconButton>
                                                    </React.Fragment>
                                                }
                                            />
                                        </GridListTile>
                                    ))}
                                </GridList>
                            </Grid>
                            <div style={{ textAlign: "right", marginTop: 20 }}>
                                {isLoading &&
                                    <CircularProgress size={24} className={classes.buttonProgress} />}
                                <Button
                                    className={classes.saveButton}
                                    onClick={this.handleSubmit}
                                    disabled={isLoading}
                                >Save</Button>
                            </div>
                        </React.Fragment>
                    ) : links && links.length > 0 && (
                        <React.Fragment>
                            <Grid container spacing={2}>
                                <GridList cellHeight={200}>
                                    {links.map((item, index) => (
                                        <GridListTile key={index}>
                                            <img
                                                alt={`Crop - ${index}`}
                                                style={{
                                                    maxWidth: '100%',
                                                    boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)"
                                                }}
                                                src={getImageById + item}
                                            />
                                            <GridListTileBar
                                                actionIcon={
                                                    <IconButton onClick={e => this.deleteImage(item)} className={classes.icon}>
                                                        <DeleteIcon />
                                                    </IconButton>
                                                }
                                            />
                                        </GridListTile>
                                    ))}
                                </GridList>
                            </Grid>
                        </React.Fragment>
                    )}
                </form>
            </div>
        );
    }
}

ImageUploadComponent.propTypes = {
    className: PropTypes.string,
    classes: PropTypes.object.isRequired
};

export default withStyles(styles)(ImageUploadComponent);
