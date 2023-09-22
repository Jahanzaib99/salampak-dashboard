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
} from "@material-ui/core";

import {
  FullscreenOutlined as ZoomIcon,
  Delete as DeleteIcon,
} from "@material-ui/icons";

// Component styles
import styles from "./style";

// Sub-component
import NewImage from "./NewImage";
import ViewImage from "./ViewImage";
import { trip } from "../../../../config/routes";

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
      formData:[],
      links: [],
      isLoading: false,
    };
    this.imageRef = React.createRef();
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    this.setState({
      links: this.props.data,
    });
  }

  getEventImages = (id) => { };

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
          // };
          await axios
            .post(`${trip}/${this.props.tripId}/tripPhoto`, item)
            .then((response) => {
              success = response.data.data.message;
              this.setState(
                {
                  links: [response.data.data.photo],
                  images: [],
                  isLoading: false,
                  base64: [],
                },
                () => {
                  this.props.enableTabs(4, this.props.tripId);

                  swal(success, {
                    icon: "success",
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
                  swal(error?.response?.data.error?.message ? error?.response?.data.error?.message : "Something wrong", {
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
    formData.push(image.formData);

    if (this.props?.getImageUrl) {
      this.props.getImageUrl(formData)
    }

    this.setState({
      images: images,
      base64: base64s,
      widths: widths,
      heights: heights,
      openDialog: false,
      formData
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
        this.props.getImageUrl("")
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
          .delete(`${trip}/${this.props.tripId}/tripPhoto/${photoId}`)
          .then((response) => {
            let success = response.data.data.message;
            this.props.enableTabs(2, this.props.tripId);

            this.setState(
              {
                links: [],
                isLoading: false,
                images: [],
                base64: [],


              },
              () => {
                swal(success, {
                  icon: "success",
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
                swal(error?.response?.data.error?.message ? error?.response?.data.error?.message : "Something wrong", {
                  icon: "error",
                });
              }
            );
          });
      }
    });
  };

  render() {
    const { classes, isSaveButtonHide } = this.props;
    const {
      openDialog,
      viewDialog,
      viewImage,
      images,
      links,
      isLoading,
    } = this.state;

    return (
      <div>
        <form className={classes.form} style={{ paddingLeft: '8px' }}>
          <p className={classes.caption}>
            <strong>Image Uploading Guide: </strong>
            Allowed dimensions are 960 x 540 (min) and 1920 x 1080 (max)
          </p>
          {(!images?.length && !links?.length) ||
            (images?.length < 1 && links?.length < 1) ? (
              <Button
                variant="outlined"
                className={classes.button}
                onClick={this.openDialog}
              >
                Upload Image
              </Button>
            ) : (
              ""
            )}
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
          {!links?.length && images && images.length > 0 ? (
            <React.Fragment>
              <Grid container spacing={2}>
                <GridList cols={3} className={classes.fullWidth}>
                  {images.map((item, index) => (
                    <GridListTile key={index}>
                      <img
                        alt={`Crop - ${index}`}
                        style={{
                          maxWidth: "100%",
                          boxShadow:
                            "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)",
                        }}
                        src={item}
                      />
                      <GridListTileBar
                        title={`${this.state.widths[index]} x ${this.state.heights[index]}`}
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
              <div style={{ textAlign: "right", marginTop: 20 }}>
                {isLoading && (
                  <CircularProgress
                    size={24}
                    className={classes.buttonProgress}
                  />
                )}
                {
                  !isSaveButtonHide ?
                    <Button
                      className={classes.saveButton}
                      onClick={this.handleSubmit}
                      disabled={isLoading}
                    >
                      Save
                </Button>
                    : ""
                }
              </div>
            </React.Fragment>
          ) : (
              links &&
              links.length > 0 && (
                <React.Fragment>
                  <Grid container spacing={2}>
                    <GridList
                      cols={3}
                      cellHeight={200}
                      className={classes.fullWidth}
                    >
                      {links.map((item, index) => (
                        <GridListTile key={index}>
                          <img
                            alt={`Crop - ${index}`}
                            style={{
                              maxWidth: "100%",
                              boxShadow:
                                "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)",
                            }}
                            src={item}
                          />
                          <GridListTileBar
                            actionIcon={
                              <IconButton
                                onClick={(e) => this.deleteImage(item)}
                                className={classes.icon}
                              >
                                <DeleteIcon />
                              </IconButton>
                            }
                          />
                        </GridListTile>
                      ))}
                    </GridList>
                  </Grid>
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
