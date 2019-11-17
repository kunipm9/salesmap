/// Sys - AutoForm - collection excel
import React from "react";
import _ from "lodash";
import { Overlay, Popover } from "react-bootstrap";
import { MDBBtn } from "mdbreact";
import { MDBSpinner } from "mdbreact";
import Dropzone from "react-dropzone";
import { Excels_Collection } from "@imports/api/lib/Excels_Collection";

let XLSX;

if (Meteor.isClient) {
  require("blueimp-canvas-to-blob"); // polyfill
  XLSX = require("xlsx");
}
/// Sys - AutoForm - collection excel --

/// Sys - AutoForm - collection excel

// see: https://github.com/mathiasbynens/String.fromCodePoint/issues/1
/**
 *
 *
 * @param {*} array
 * @returns
 */
const handleCodePoints = array => {
  const CHUNK_SIZE = 0x8000; // arbitrary number here, not too small, not too big
  let index = 0;
  const length = array.length;
  let result = "";
  let slice;
  while (index < length) {
    slice = array.slice(index, Math.min(index + CHUNK_SIZE, length)); // `Math.min` is not really necessary here I think
    result += String.fromCharCode.apply(null, slice);
    index += CHUNK_SIZE;
  }
  return result;
};

/**
 *
 *
 * @param {*} file
 * @param {*} onResult
 */
const parseExcelFile = (file, onResult) => {
  const reader = new global.FileReader();
  reader.onload = function(readerEvent) {
    const data = readerEvent.target.result;
    const arr = handleCodePoints(new Uint8Array(data));
    onResult(null, XLSX.read(btoa(arr), { type: "base64" }));
  };
  reader.readAsArrayBuffer(file);
};

const EXCEL_MIME_TYPES = [
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "xlsx"
];

/**
 *
 *
 * @param {*} { size, type }
 * @returns
 */
const shouldImport = ({ size, type }) => {
  if (Excels_Collection.MAX_SIZE * 1024 >= size) {
    return false;
  }
  if (_.includes(EXCEL_MIME_TYPES, type)) {
    return true;
  }
  if (type.indexOf("application/vnd.ms-excel") >= 0) {
    return true;
  }
  return false;
};

/**
 *
 *
 * @class ExcelView
 * @extends {React.Component}
 */
export class ExcelView extends React.Component {
  constructor(props) {
    super(props);
    this.getExcelLink = this.getExcelLink.bind(this);
    this.deleteExcel = this.deleteExcel.bind(this);
    this.Excels_id_pre = null;
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
   * @memberof ExcelView
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

  /**
   *
   *
   * @returns
   * @memberof ExcelView
   */
  getExcelLink() {
    if (!this.props.value) {
      return null;
    }

    if (this.state.link) {
      return this.state.link;
    }

    const excelCursor = Excels_Collection.findOne({ _id: this.props.value });
    let link = "";
    if (excelCursor) {
      link = excelCursor.link();
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

  /**
   *
   *
   * @param {*} file
   * @param {*} fieldContext
   * @memberof ExcelView
   */
  upload(file, fieldContext) {
    Excels_Collection.insert({
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

          if (fieldContext.Excels_id_pre) {
            console.log(
              "Excels_Collection.remove  _id:",
              fieldContext.Excels_id_pre
            );
            Excels_Collection.remove({ _id: fieldContext.Excels_id_pre });
          }
          fieldContext.Excels_id_pre = file._id;
        }
      }
    });
  }

  /**
   *
   *
   * @param {*} files
   * @param {*} fieldContext
   * @memberof ExcelView
   */
  onDrop(files, fieldContext) {
    if (shouldImport(files[0])) {
      console.log("Uploading...");
      fieldContext.setState({ uploadStatus: "uploading" });

      // eslint-disable-next-line no-unused-vars
      parseExcelFile(files[0], (error, workbook) => {
        if (!error) {
          fieldContext.upload(files[0], fieldContext);
        } else {
          console.log("Error during upload: " + error);
          fieldContext.setState({ uploadStatus: "failed" });
        }
      });
    } else {
      console.log("Wrong file type.");
      fieldContext.setState({ uploadStatus: "failed" });
    }
  }

  /**
   *
   *
   * @param {*} fieldContext
   * @memberof ExcelView
   */
  deleteExcel(fieldContext) {
    fieldContext.props.onChange(null);
    fieldContext.setState({ link: null });
    this.setState({ confirmDelete: false });
  }

  /**
   *ß
   *
   * @returns
   * @memberof ExcelView
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
            {this.props.value && (
              <MDBBtn
                color="primary"
                className="btnfont"
                href={this.getExcelLink()}
              >
                Download
              </MDBBtn>
            )}
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
                      <MDBBtn
                        color="primary"
                        className="btnfont"
                        href={this.getExcelLink()}
                      >
                        Download
                      </MDBBtn>
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
              onClick={() => this.deleteExcel(this)}
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
