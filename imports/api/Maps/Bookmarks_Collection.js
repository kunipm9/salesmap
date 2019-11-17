console.log("Maps_Bookmarks_Collection");

/// Sys - AutoForm - collection
import { Tracker } from "meteor/tracker";
import { Mongo } from "meteor/mongo";
import { SimpleSchema } from "meteor/aldeed:simple-schema";
import { displayTitle } from "@imports/api/lib/CollectionUtils";
/// Sys - AutoForm - collection --

/// Custom - AutoForm - layout
import NullField from "@imports/ui/uniforms/NullField";
/// Custom - AutoForm - layout --

/// Custom - Collection - filter
import { Session } from "meteor/session";
/// Custom - Collection - filter --

/// Custom - Collection
export const Maps_Bookmarks_Collection = new Mongo.Collection("Maps_Bookmarks");
Maps_Bookmarks_Collection.defaultCollectionHooks();
/// Custom - Collection --

/// Custom - Persister
if (Meteor.isClient) {
  Maps_Bookmarks_Collection.attachPersister();
}
/// Custom - Persister --

/// Custom - AutoForm - schema
const Maps_Bookmarks_Schema = new SimpleSchema({
  _id: {
    optional: true,
    type: String,
    uniforms: {
      component: NullField
    }
  },
  /// Custom - Collection - soft delete
  _deleted: {
    optional: true,
    type: String,
    defaultValue: null,
    uniforms: {
      component: NullField
    }
  },
  /// Custom - Collection - soft delete --
  /// Custom - Collection - optimistic lock
  modifiedAt: {
    optional: true,
    type: Number,
    defaultValue: null,
    uniforms: {
      component: NullField
    }
  },
  /// Custom - Collection - optimistic lock --
  Users_Groups_id: {
    optional: true,
    type: String,
    label: "User Group",
    uniforms: {
      component: NullField
    }
  },
  title: {
    type: String,
    label: "Title"
  },
  coordinates: {
    type: [Number],
    decimal: true,
    minCount: 2,
    maxCount: 2
  },
  zoomLevel: {
    type: Number,
    label: "zoomLevel"
  },
});
Maps_Bookmarks_Collection.attachSchema(Maps_Bookmarks_Schema, {
  tracker: Tracker
});
/// Custom - AutoForm - schema --

/// Custom - Collection - helpers
Maps_Bookmarks_Collection.dispTitle = function(doc) {
  /// System - Collection - soft delete
  return displayTitle(doc._deleted, doc.title);
  /// System - Collection - soft delete --
};

Maps_Bookmarks_Collection.helpers({
  disp_title() {
    return Maps_Bookmarks_Collection.dispTitle(this);
  }
});
/// Custom - Collection - helpers --

/// Custom - Collection - method
Meteor.methods({
  "Maps_Bookmarks.insert": function(Users_Groups_id, data) {
    "use strict";

    data.Users_Groups_id = Users_Groups_id;
    return Maps_Bookmarks_Collection.insert(data);
  },

  "Maps_Bookmarks.update": function(Users_Groups_id, _id, data) {
    "use strict";

    /// Custom - Collection - optimistic lock
    const tmp = Maps_Bookmarks_Collection.findOne({ _id: _id });
    if (tmp.modifiedAt != data.modifiedAt) {
      console.log(
        "Maps_Bookmarks.update tmp.modifiedAt != data.modifiedAt",
        tmp,
        data
      );
      const otherUser = Meteor.users.findOne({ _id: tmp.modifiedBy });
      if (otherUser) {
        throw new Meteor.Error(
          "lock",
          `modified by ${otherUser.profile.username}`
        );
      } else {
        throw new Meteor.Error("lock", `modified by other`);
      }
    }
    /// Custom - Collection - optimistic lock --

    //if (Meteor.isServer) {
    //  throw new Meteor.Error('lock', `modified by other`);
    //}

    data.Users_Groups_id = Users_Groups_id;
    Maps_Bookmarks_Collection.update(_id, { $set: data });
  },

  "Maps_Bookmarks.remove": function(Users_Groups_id, _id, data) {
    "use strict";

//    /// Custom - Collection - optimistic lock
//    const tmp = Maps_Bookmarks_Collection.findOne({ _id: _id });
//    if (tmp.modifiedAt != data.modifiedAt) {
//      const otherUser = Meteor.users.findOne({ _id: tmp.modifiedBy });
//      if (otherUser) {
//        throw new Meteor.Error(
//          "lock",
//          `modified by ${otherUser.profile.username}`
//        );
//      } else {
//        throw new Meteor.Error("lock", `modified by other`);
//      }
//    }
//    /// Custom - Collection - optimistic lock --

    /// Custom - Collection - soft delete
    Maps_Bookmarks_Collection.remove({Users_Groups_id: Users_Groups_id, _id: _id});
    // Maps_Bookmarks_Collection.update(_id, { $set: { _deleted: _id } });
    /// Custom - Collection - soft delete --
  },

  // eslint-disable-next-line no-unused-vars
  "Maps_Bookmarks.recover": function(Users_Groups_id, _id, editData) {
    "use strict";

    /// Custom - Collection - soft delete
    Maps_Bookmarks_Collection.update(_id, { $set: { _deleted: null } });
    /// Custom - Collection - soft delete --
  }
});
/// Custom - Collection - method --

/// Custom - Server - start up
if (Meteor.isServer) {
  Meteor.publish("Maps_Bookmarks", function(Users_Groups_id) {
    "use strict";

    console.log("### Meteor.publish('Maps_Bookmarks')", Users_Groups_id);
    return Maps_Bookmarks_Collection.find({
      Users_Groups_id: Users_Groups_id
    });
  });

  Meteor.startup(function() {
    /// Custom - Collection - collection uniq key
    /// Custom - Collection - soft delete
//    console.log(
//      "Maps_Bookmarks_Collection._ensureIndex({ Users_Groups_id:1, title: 1, _deleted: 1 }, { unique: true });"
//    );
//    Maps_Bookmarks_Collection._ensureIndex(
//      { Users_Groups_id: 1, title: 1, _deleted: 1 },
//      { unique: true }
//    );

//    Maps_Bookmarks_Collection._dropIndex(
//      { Users_Groups_id: 1, title: 1, _deleted: 1 },
//    );

    /// Custom - Collection - soft delete --
    /// Custom - Collection - collection uniq key --
  });
}

if (Meteor.isClient) {
  Tracker.autorun(() => {
    "use strict";

    Meteor.subscribe("Maps_Bookmarks", Session.get("Users_Groups_id"));
    console.log(
      "### Meteor.subscribe('Maps_Bookmarks');",
      Session.get("Users_Groups_id")
    );
  });
}
/// Custom - Server - start up --
