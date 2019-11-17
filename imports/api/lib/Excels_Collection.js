console.log("Excels_Collection");

/// Sys - AutoForm - collection excel
import { FilesCollection } from "meteor/ostrio:files";

const Excels_Collection = new FilesCollection({
  storagePath: "/opt/data/excels",
  collectionName: "excels",
  allowClientCode: true, // Disallow remove files from Client
  onBeforeUpload(file) {
    // Allow upload files under 2MB, and only in png/jpg/jpeg formats
    if (file.size <= 2485760 && /xl/i.test(file.extension)) {
      return true;
    } else {
      return "Please upload excel, with size equal or less than 2MB";
    }
  }
});

Excels_Collection.readExcelFile = (condition, callback) => {
  const excelCursor = Excels_Collection.findOne(condition);
  if (excelCursor) {
    const reader = new global.FileReader();
    reader.onload = function(readerEvent) {
      const data = readerEvent.target.result;
      const arr = btoa(handleCodePoints(new Uint8Array(data)));
      callback(null, arr);
    };
    let link = excelCursor.link();
    const p = link.indexOf("/cdn/storage");
    if (p > 0) {
      link = link.substring(p);
    }
    link = link.replace("http://localhost:3000", "");
    const xhr = new XMLHttpRequest();
    xhr.open("GET", link, true);
    xhr.responseType = "blob";
    xhr.onload = function(e) {
      if (this.status == 200) {
        const blob = this.response;
        reader.readAsArrayBuffer(blob);
      } else {
        callback(e, null);
      }
    };
    xhr.send();
  }
};

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
/// Sys - AutoForm - collection excel --

/// Sys - Server - start up
if (Meteor.isClient) {
  console.log("Meteor.subscribe('files.excels.all')");
  Meteor.subscribe("files.excels.all");
}

if (Meteor.isServer) {
  console.log("Meteor.publish('files.excels.all')");
  Meteor.publish("files.excels.all", function() {
    return Excels_Collection.find().cursor;
  });
}
/// Sys - Server - start up --

export { Excels_Collection };
