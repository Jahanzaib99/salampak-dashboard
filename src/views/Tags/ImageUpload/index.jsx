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
  withStyles,
  MobileStepper,
  Tooltip,
} from "@material-ui/core";
import SwipeableViews from "react-swipeable-views";

import InsertPhotoRoundedIcon from "@material-ui/icons/InsertPhotoRounded";

import {
  FullscreenOutlined as ZoomIcon,
  Delete as DeleteIcon,
  KeyboardArrowRight,
  KeyboardArrowLeft,
} from "@material-ui/icons";

// Component styles
import styles from "./style";

import { getImageById } from "../../../../src/config/routes";

// Sub-component
import NewImage from "./NewImage";
import ViewImage from "./ViewImage";
import log from "../../../../src/config/log";

class ImageUploadComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      objectId: "",
      openDialog: false,
      viewDialog: false,
      viewImage: 0,
      images: [],
      base64: [],
      widths: [],
      heights: [],
      links: [],
      formData: [],
      isLoading: false,
      saveButton: true,
      activeStep: 0,
    };
    this.imageRef = React.createRef();
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    if (this.props.data && this.props.data.length > 0) {
      this.setState(
        {
          objectId: this.props.objectId,
          links: this.props.data,
        },
        () => this.getEventImages(this.state.objectId)
      );
    }
    this.setState(
      {
        objectId: this.props.objectId,
      },
      () => this.getEventImages(this.state.objectId)
    );
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.objectId) {
      this.setState(
        {
          tripVendor: nextProps.vendor,
          objectId: nextProps.objectId,
          links: nextProps.data,
        },
        () => {
          this.getEventImages(this.state.objectId);
        }
      );
    }
    if (nextProps.objectId && nextProps.data) {
      this.setState(
        {
          tripVendor: nextProps.vendor,
          objectId: nextProps.objectId,
          links: nextProps.data,
        },
        () => {
          this.getEventImages(this.state.objectId);
        }
      );
    }
  }

  getEventImages = (id) => {
    axios
      .get(`${this.props.apiUrl}/${id}`)
      .then((response) => {
        log(
          `GET ${this.props.apiUrl}/${id} ===> Image fetch Component`,
          "info",
          response.data.data
        );
        let res = response.data.data;
        let data = {};
        data.links = res.photos;
        this.setState(data);
      })
      .catch((error) => {
        if (this.state.links && this.state.links.length > 0) {
          log("Error at fetching images", "error", error?.response?.data);
          swal(error?.response?.data.error?.message?error?.response?.data.error?.message:"Something wrong", {
            icon: "warning",
          });
        } else {
          log("Info", "info", "Don't throw errors if its not edit form");
        }
      });
  };

  openDialog = () => {
    this.setState({
      openDialog: !this.state.openDialog,
    });
  };

  openViewDialog = (index) => {
    this.setState({
      viewDialog: !this.state.viewDialog,
      viewImage: index,
    });
  };

  handleNext = () => {
    this.setState({ activeStep: this.state.activeStep + 1 });
  };

  handleBack = () => {
    this.setState({ activeStep: this.state.activeStep - 1 });
  };

  handleStepChange = (step) => {
    this.setState({ activeStep: step });
  };

  handleSubmit = () => {
    let success = "";
    this.setState(
      {
        isLoading: true,
      },
      async () => {
        await this.state.formData.forEach(async (item) => {
          // let data = {
          //   photo: item,
          //   locationId: this.state.objectId,
          // };
          await axios
            .post(`${this.props.apiUrl}/${this.state.objectId}/photos`, item)
            .then((response) => {
              success = response.data.data.message;
              let temp = this.state.links;
              temp.push(response.data.data.photo);
              this.setState(
                {
                  links: temp,
                  isLoading: false,
                  images: [],
                  base64: [],
                  widths: [],
                  heights: [],
                  formData:[]
                },
                () => {
                  this.setState({
                    saveButton: false,
                  });
                }
              );
            })
            .catch((error) => {
              this.setState(
                {
                  isLoading: false,
                },
                () => {
                  swal(error?.response?.data.error?.message?error?.response?.data.error?.message:"Something wrong", {
                    icon: "error",
                  });
                }
              );
            });
        });
      }
    );
    if (success.length > 0) {
      this.props.enableTabs(true);
    }
  };

  getImage = (image) => {
    let images = this.state.images;
    let base64s = this.state.base64;
    let widths = this.state.widths;
    let heights = this.state.heights;
    let formData = this.state.formData;

    images.push(image.blob);
    base64s.push(image.base64);
    widths.push(image.width);
    heights.push(image.height);
    formData.push(image.formData)
    this.setState({
      images: images,
      base64: base64s,
      widths: widths,
      heights: heights,
      formData,
      openDialog: false,
      saveButton: true,
    });
  };

  removeImage = (index) => {
    swal({
      title: "Are you sure?",
      text: "Once deleted, you will not be able to recover this record!",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then((willDelete) => {
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
          heights: heights,
        });
      } else {
        swal("Image has not been deleted!", {
          icon: "info",
        });
      }
    });
  };

  deleteImage = (id) => {
    let photoId;
    photoId = id.indexOf("photo-")
    photoId = id.slice(photoId);
    swal({
      title: "Are you sure?",
      text: "Once deleted, you will not be able to recover this record!",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        axios
          .delete(`${this.props.apiUrl}/${this.state.objectId}/photos/${photoId}`)
          .then((response) => {
            let temp = this.state.links;
            temp.splice(temp.indexOf(id), 1);
            this.setState(
              {
                links: temp,
              },
              () => {
                if (this.state.activeStep === temp.length) {
                  this.setState({
                    activeStep: this.state.links.length - 1,
                  });
                }
              }
            );
            swal(response.data.data.message, {
              icon: "success",
            });
          })
          .catch((error) => {
            swal(error?.response?.data.error?.message?error?.response?.data.error?.message:"Something wrong", {
              icon: "error",
            });
          });
      } else {
        swal("Image has not been deleted!", {
          icon: "info",
        });
      }
    });
  };

  validateDimension = (index) => {
    if (this.state.widths[index] < 960 || this.state.heights[index] < 540) {
      swal("Please re-upload some other good quality image", {
        icon: "error",
      });
      return false;
    }
    if (this.state.widths[index] > 1920 || this.state.heights[index] > 1080) {
      swal("Please re-upload some other good quality image", {
        icon: "error",
      });
      return false;
    }
    return true;
  };

  render() {
    const {
      classes,
      isForm,
      isHideButton,
      disabledUploadBtn,
      isEditMode,
    } = this.props;
    let {
      openDialog,
      viewDialog,
      viewImage,
      images,
      links,
      isLoading,
      activeStep = 1,
    } = this.state;
    return (
      <div
        style={
          !isForm
            ? {}
            : { display: "flex", justifyContent: "center", width: "100%" }
        }
      >
        {((links && links.length === 0) || (images && images.length > 0)) &&
          (!isForm || !images?.length) &&
          (!disabledUploadBtn ? (
            <Tooltip title="Upload Image" aria-label="image">
              <Button
                variant={isForm ? "contained" : ""}
                color="primary"
                onClick={this.openDialog}
                startIcon={<InsertPhotoRoundedIcon />}
              >
                <span>{!isForm ? "" : "Upload Image"}</span>
              </Button>
            </Tooltip>
          ) : (
            <InsertPhotoRoundedIcon fontSize="small" />
          ))}
        <form
          className={!isForm ? classes.form : ""}
          style={!isForm ? { padding: "0", marginLeft: "-40px" } : {}}
        >
          {openDialog && (
            <NewImage
              open={openDialog}
              close={this.openDialog}
              submit={this.getImage}
            />
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
                    <GridListTile
                      key={index}
                      style={{ width: "140px", height: "140px" }}
                    >
                      <img
                        alt={`Crop - ${index}`}
                        style={{
                          width: "500px",
                          height: "500px",
                          // paddingTop: "25px",
                          paddingBottom: "1px",
                          marginBottom: "1px",
                          boxShadow:
                            "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)",
                        }}
                        src={item}
                      />
                      <GridListTileBar
                        title={
                          // this.validateDimension(index) === false
                          //   ? "Please re-upload some other good quality image"
                          //   : 
                            `${this.state.widths[index]} x ${this.state.heights[index]}`
                        }
                        actionIcon={
                          <React.Fragment>
                            <IconButton
                              onClick={(e) => this.openViewDialog(index)}
                              className={classes.icon}
                            >
                              <ZoomIcon />
                            </IconButton>
                            <IconButton
                              onClick={(e) => this.removeImage(index)}
                              className={classes.icon}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </React.Fragment>
                        }
                      />
                    </GridListTile>
                  ))}
                </GridList>
              </Grid>
              <div style={{ textAlign: "left", marginTop: 20 }}>
                {isLoading && (
                  <CircularProgress
                    size={24}
                    className={classes.buttonProgress}
                  />
                )}
                {this.state.saveButton === true && (
                  <Button
                    className={classes.saveButton}
                    onClick={this.handleSubmit}
                    disabled={isLoading}
                  >
                    Save
                  </Button>
                )}
              </div>
            </React.Fragment>
          ) : (
            links &&
            links.length > 0 && (
              <React.Fragment>
                <SwipeableViews
                  style={{ maxWidth: "145px" }}
                  // axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
                  index={activeStep == -1 ? 0 : activeStep}
                  onChangeIndex={this.handleStepChange}
                  enableMouseEvents
                  slideClassName={classes.slideView}
                >
                  {links.map((item, index) => (
                    <div key={index}>
                      {Math.abs(activeStep - index) <= 2 && (
                        <span>
                          <img
                            alt={`Crop - ${index}`}
                            style={{ width: "145px", height: "145px" }}
                            src={ item}
                          ></img>
                          <div
                            style={{
                              width: "145px",
                              marginTop: "-40px",
                              background: "black",
                              opacity: 0.9,
                            }}
                          >
                            {!isHideButton || isEditMode ? (
                              <Tooltip title="Delete Image" aria-label="delete">
                                <IconButton
                                  onClick={(e) => this.deleteImage(item)}
                                  className={classes.icon}
                                >
                                  <DeleteIcon />
                                </IconButton>
                              </Tooltip>
                            ) : (
                              ""
                            )}
                            {!isHideButton ? (
                              <Tooltip
                                title="Upload more Image"
                                aria-label="image"
                              >
                                <IconButton
                                  className={classes.icon}
                                  onClick={this.openDialog}
                                >
                                  <InsertPhotoRoundedIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            ) : (
                              ""
                            )}
                          </div>
                        </span>
                      )}
                    </div>
                  ))}
                </SwipeableViews>
                {!this.props.paginationImgHide ? (
                  <MobileStepper
                    style={{ maxWidth: "145px" }}
                    steps={links.length}
                    position="static"
                    variant="text"
                    activeStep={activeStep}
                    nextButton={
                      <IconButton
                        aria-label="delete"
                        onClick={this.handleNext}
                        disabled={activeStep === links.length - 1}
                        className={classes.margin}
                        size="small"
                      >
                        <KeyboardArrowRight fontSize="inherit" />
                      </IconButton>
                    }
                    backButton={
                      <IconButton
                        aria-label="delete"
                        onClick={this.handleBack}
                        disabled={activeStep === 0}
                        className={classes.margin}
                        size="small"
                      >
                        <KeyboardArrowLeft fontSize="inherit" />
                      </IconButton>
                    }
                  />
                ) : (
                  ""
                )}
              </React.Fragment>
            )
          )}
        </form>
      </div>
    );
  }
}

ImageUploadComponent.propTypes = {
  className: PropTypes.string,
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ImageUploadComponent);
