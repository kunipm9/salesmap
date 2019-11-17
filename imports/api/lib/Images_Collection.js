console.log("Images_Collection");

/// Sys - AutoForm - collection image
import { FilesCollection } from "meteor/ostrio:files";

export const Images_Collection = new FilesCollection({
  storagePath: "/opt/data/images",
  collectionName: "images",
  allowClientCode: true, // Disallow remove files from Client
  onBeforeUpload(file) {
    // Allow upload files under 2MB, and only in png/jpg/jpeg formats
    if (file.size <= 2485760 && /png|jpg|jpeg/i.test(file.extension)) {
      return true;
    } else {
      return "Please upload image, with size equal or less than 2MB";
    }
  }
});
/// Sys - AutoForm - collection image --

/// Sys - Collection Image - src
/**
 *
 *
 * @param {*} imgCursor
 * @returns
 */
export const getImageLink = imgCursor => {
  let link = null;
  if (imgCursor && imgCursor.link) {
    link = imgCursor.link();
    const p = link.indexOf("/cdn/storage");
    if (p > 0) {
      link = link.substring(p);
    }
    link = link.replace("http://localhost:3000", "");
  }
  return link;
};
/// Sys - Collection Image - src --

/// Sys - Server - start up
if (Meteor.isClient) {
  console.log("Meteor.subscribe('files.images.all')");
  Meteor.subscribe("files.images.all");
}

if (Meteor.isServer) {
  console.log("Meteor.publish('files.images.all')");
  Meteor.publish("files.images.all", function() {
    return Images_Collection.find().cursor;
  });
}
/// Sys - Server - start up --
