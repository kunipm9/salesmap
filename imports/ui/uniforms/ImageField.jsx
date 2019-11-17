/// Sys - AutoForm - collection image
import React from "react";
import connectField from "uniforms/connectField";
import wrapField from "uniforms-bootstrap4/wrapField";
import _ from "lodash";
import { Overlay, Popover } from "react-bootstrap";
import { MDBBtn } from "mdbreact";
import { MDBSpinner } from "mdbreact";
import Dropzone from "react-dropzone";
import { Images_Collection } from "@imports/api/lib/Images_Collection";

if (Meteor.isClient) {
  require("blueimp-canvas-to-blob"); // polyfill
}
/// Sys - AutoForm - collection image --

/// Sys - AutoForm - collection image
const RESIZABLE_MIME_TYPES = ["image/jpeg", "image/png", "image/gif"];
const RESIZE_OPTIONS = {
  maxDimension: 720,
  quality: 0.8
};

/**
 *
 *
 * @param {*} { size, type }
 * @returns
 */
const shouldImport = ({ size, type }) => {
  if (100 * 1024 >= size) {
    return false;
  }
  if (_.includes(RESIZABLE_MIME_TYPES, type)) {
    return true;
  }
  return false;
};

/**
 *
 *
 * @param {*} { size, type }
 * @returns
 */
const shouldResize = ({ size, type }) => {
  if (Images_Collection.MAX_SIZE * 1024 >= size) {
    return false;
  }
  if (_.includes(RESIZABLE_MIME_TYPES, type)) {
    return true;
  }
  return false;
};

// http://stackoverflow.com/questions/23945494/use-html5-to-resize-an-image-before-upload
const resize = (file, { maxDimension = 640, quality = 0.6 } = {}, onResult) => {
  // Load the image
  const reader = new global.FileReader();
  reader.onload = function(readerEvent) {
    const image = new global.Image();
    // eslint-disable-next-line no-unused-vars
    image.onload = function(imageEvent) {

      // Resize the image
      const canvas = global.document.createElement("canvas");
      let width = image.width;
      let height = image.height;
      if (width > height) {
        if (width > maxDimension) {
          height *= maxDimension / width;
          width = maxDimension;
        }
      } else if (height > maxDimension) {
        width *= maxDimension / height;
        height = maxDimension;
      }
      canvas.width = width;
      canvas.height = height;
      canvas.getContext("2d").drawImage(image, 0, 0, width, height);
      canvas.toBlob(
        blob => {
          onResult(null, blob);
        },
        "image/jpeg",
        quality
      );
    };
    image.src = readerEvent.target.result;
  };
  reader.readAsDataURL(file);
};

/**
 *
 *
 * @class ImageField
 * @extends {React.Component}
 */
class ImageField extends React.Component {
  /**
   *Creates an instance of ImageField.
   * @param {*} props
   * @memberof ImageField
   */
  constructor(props) {
    super(props);
    this.getImageLink = this.getImageLink.bind(this);
    this.deleteImage = this.deleteImage.bind(this);
    this.Images_id_pre = null;
    (this.state = {
      uploadStatus: "idle",
      link: null,
      confirmTarget: null,
      confirmDelete: false
    }),
      (this.onClickDeleteButton = ({ target }) => {
        console.log("onClickDeleteButton", target);
        this.setState({ confirmTarget: target, confirmDelete: true });
      });
  }

  /**
   *
   *
   * @memberof ImageField
   */
  componentDidMount() {
    if (!this.state.link) {
      this.setState({ link: null });
    }

    setTimeout(() => {
      if (!this.state.link) {
        this.setState({ link: null });
      }
    }, 1000);
  }

  /// Sys - Collection Image - src
  /**
   *
   *
   * @returns
   * @memberof ImageField
   */
  getImageLink() {
    if (!this.props.value) {
      return null;
    }

    if (this.state.link) {
      return this.state.link;
    }

    const imgCursor = Images_Collection.findOne({ _id: this.props.value });
    let link = "";
    if (imgCursor) {
      link = imgCursor.link();
      const p = link.indexOf("/cdn/storage");
      if (p > 0) {
        link = link.substring(p);
      }
      link = link.replace("http://localhost:3000", "");
      setTimeout(() => {
        this.setState({ link: link });
      });
    }
    return link;
  }
  /// Sys - Collection Image - src --

  /**
   *
   *
   * @param {*} file
   * @param {*} fieldContext
   * @memberof ImageField
   */
  upload(file, fieldContext) {
    console.log("upload");
    Images_Collection.insert({
      file: file,
      streams: "dynamic",
      chunkSize: "dynamic",
      onStart: function() {},
      onProgress: function(num) {
        console.log("onProgress", num);
      },
      onUploaded: function(error, file) {
        if (error) {
          console.log("Error during upload: " + error);
          fieldContext.setState({ uploadStatus: "failed" });
        } else {
          console.log('File "' + file.name + '" successfully uploaded');
          fieldContext.props.onChange(file._id);

          setTimeout(function() {
            fieldContext.setState({ uploadStatus: "uploaded", link: null });
          }, 100);

          setTimeout(() => {
            if (!fieldContext.state.link) {
              fieldContext.setState({ link: null });
            }
          }, 1000);

          if (fieldContext.Images_id_pre) {
            console.log(
              "Images_Collection.remove  _id:",
              fieldContext.Images_id_pre
            );
            Images_Collection.remove({ _id: fieldContext.Images_id_pre });
          }
          fieldContext.Images_id_pre = file._id;
        }
      }
    });
  }

  /**
   *
   *
   * @param {*} files
   * @param {*} fieldContext
   * @memberof ImageField
   */
  onDrop(files, fieldContext) {
    if (!shouldImport(files[0])) {
      console.log("Error during upload");
      fieldContext.setState({ uploadStatus: "failed" });
    }

    if (shouldResize(files[0])) {
      resize(files[0], RESIZE_OPTIONS, (error, fileResized) => {
        if (!error) {
          fileResized.name = files[0].name + ".jpg";
          fieldContext.upload(fileResized, fieldContext);
        } else {
          console.log("Error during upload: " + error);
          fieldContext.setState({ uploadStatus: "failed" });
        }
      });
    } else {
      fieldContext.upload(files[0], fieldContext);
    }
    console.log("Uploading...");
    fieldContext.setState({ uploadStatus: "uploading" });
  }

  /**
   *
   *
   * @param {*} fieldContext
   * @memberof ImageField
   */
  deleteImage(fieldContext) {
    fieldContext.props.onChange(null);
    fieldContext.setState({ link: null });
    this.setState({ confirmDelete: false });
  }

  /**
   *
   *
   * @returns
   * @memberof ImageField
   */
  render() {
    let dropZoneStyle = {
      position: "relative",
      width: "240px",
      height: "160px",
      borderWidth: "2px",
      borderColor: "rgb(102, 102, 102, 0.4)",
      borderStyle: "dashed",
      borderRadius: "5px",
      backgroundImage: "url(/images/dragndrop.png)",
      backgroundSize: "contain",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
      margin: "16px",
      textAlign: "center"
    };

    if (this.props.disabled) {
      return (
        <section>
          <div>
            <img src={this.getImageLink()} style={this.props.style} />
          </div>
        </section>
      );
    }

    return (
      <section>
        <div>
          <Dropzone onDrop={files => this.onDrop(files, this)}>
            {({ getRootProps, getInputProps }) => {
              /* eslint-disable react/no-unescaped-entities */
              return (
                <section>
                  {this.props.value && (
                    <span>
                      <img src={this.getImageLink()} style={this.props.style} />
                      <MDBBtn
                        color="danger"
                        className="btnfont"
                        onClick={this.onClickDeleteButton}
                      >
                        削除
                      </MDBBtn>
                    </span>
                  )}
                  <div {...getRootProps()} style={dropZoneStyle}>
                    <input {...getInputProps()} />
                    <div
                      style={{
                        marginTop: "90px",
                        display:
                          this.state.uploadStatus == "failed" ? "" : "none",
                        color: "red"
                      }}
                    >
                      不正なファイルです...
                    </div>
                    <div
                      style={{
                        marginTop: "60px",
                        display:
                          this.state.uploadStatus == "uploading" ? "" : "none"
                      }}
                    >
                      <MDBSpinner />
                    </div>
                  </div>
                </section>
              );
              /* eslint-enable react/no-unescaped-entities */
            }}
          </Dropzone>
        </div>

        <Overlay
          show={this.state.confirmDelete}
          target={this.state.confirmTarget}
          placement="right"
          container={this}
          containerPadding={0}
        >
          <Popover id="top" title="削除しますか?">
            <MDBBtn
              color="info"
              onClick={() => {
                this.setState({ confirmDelete: false });
              }}
              className="btnfont"
            >
              取消
            </MDBBtn>
            <MDBBtn
              color="danger"
              onClick={() => this.deleteImage(this)}
              className="btnfont"
            >
              削除
            </MDBBtn>
          </Popover>
        </Overlay>
      </section>
    );
  }
}

/**
 *
 *
 * @param {*} props
 * @returns
 */
function divField(props) {
  return (
    <ImageField
      value={props.value}
      disabled={props.disabled}
      style={props.style}
      onChange={props.onChange}
    />
  );
}

/**
 *
 *
 * @param {*} props
 * @returns
 */
const ImageField_ = props => {
  const wrapProps = Object.assign({}, props);
  delete wrapProps["style"];
  return wrapField(wrapProps, divField(props));
};
export default connectField(ImageField_);
/// Sys - AutoForm - collection image --
