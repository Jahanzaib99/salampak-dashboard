import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';
import Cropper from 'react-cropper';
import 'cropperjs/dist/cropper.css';

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

const DialogActions = withStyles(theme => ({
    root: {
        margin: 0,
        padding: theme.spacing(1),
    },
}))(MuiDialogActions);

export default class CustomizedDialogs extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            open: props.open,
            src: "",
            cropResult: "",
            width: "",
            height: ""
        }
        this.cropper = React.createRef("");
        this.onChange = this.onChange.bind(this);
        this.cropImage = this.cropImage.bind(this);
    }


    onChange(e) {
        e.preventDefault();
        let files;
        if (e.dataTransfer) {
            files = e.dataTransfer.files;
        } else if (e.target) {
            files = e.target.files;
        }
        const reader = new FileReader();
        let formData = new FormData();
        formData.append(`photo`, files[0])
        reader.onload = () => {
            this.setState({ src: reader.result, formData });
        };
        reader.readAsDataURL(files[0]);
    }

    cropImage() {
        const { formData } = this.state;
        if (!this.cropper.getCroppedCanvas || typeof this.cropper.getCroppedCanvas() === 'undefined') {
            this.setState({ open: false })
            return;
        }
        this.setState({
            open: false,
            cropResult: this.cropper.getCroppedCanvas().toDataURL(),
        }, () => {
            let image = {
                blob: this.state.cropResult,
                base64: this.state.cropResult.split(',')[1]
            }

            let src = "data:image/jpg;base64,";
            let image_new = src + image.base64;
            let imageEl = document.createElement('img');
            imageEl.src = image_new;

            let image_jpg = {
                blob: imageEl.src,
                base64: imageEl.src.split(',')[1],
                width: this.cropper.getCroppedCanvas().width,
                height: this.cropper.getCroppedCanvas().height,
                formData
            };

            this.props.submit(image_jpg);
        });
    }

    render() {
        const { open, src } = this.state;
        return (
            <div>
                <Dialog onClose={this.handleClose} aria-labelledby="customized-dialog-title" open={open}>
                    <DialogTitle id="customized-dialog-title" onClose={this.props.close}>
                        Crop Image
                    </DialogTitle>
                    <DialogContent dividers>
                        <input onChange={this.onChange} type="file" accept="image/png, image/gif, image/jpeg"/>
                        {src && src.length > 0 && (
                            <Cropper
                                style={{ height: 400, width: '100%' }}
                                aspectRatio={16 / 9}
                                src={src}
                                guides={false}
                                viewMode={2}
                                background={false}
                                rotatable={false}
                                zoomable={false}
                                ref={cropper => { this.cropper = cropper }}
                            />
                        )}
                    </DialogContent>
                    <DialogActions>
                        <Button autoFocus onClick={this.cropImage} color="primary">
                            Save changes
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        );
    }
}
