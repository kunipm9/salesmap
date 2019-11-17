console.log("Users_Groups_Collection");

/// Sys - AutoForm - collection
import { Tracker } from "meteor/tracker";
import { Mongo } from "meteor/mongo";
import { SimpleSchema } from "meteor/aldeed:simple-schema";
import { displayTitle } from "@imports/api/lib/CollectionUtils";
/// Sys - AutoForm - collection --

/// Custom - AutoForm - validation
import { customValidatorCheckExistsRecord } from "@imports/api/customValidator";
/// Custom - AutoForm - validation --

/// Custom - AutoForm - layout
import NullField from "@imports/ui/uniforms/NullField";
/// Custom - AutoForm - layout --

/// Custom - Collection - filter
import { Session } from "meteor/session";
/// Custom - Collection - filter --

/// Custom - Collection
export const Users_Groups_Collection = new Mongo.Collection("Users_Groups");
if (Meteor.isClient) {
  Users_Groups_Collection.attachPersister();
}
Users_Groups_Collection.defaultCollectionHooks();
/// Custom - Collection --

/// Custom - AutoForm - schema
const Users_Groups_Schema = new SimpleSchema({
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
  title: {
    type: String,
    label: "Title",
    max: 200,

    /// Custom - AutoForm - validation
    custom: function() {
      return customValidatorCheckExistsRecord(
        Users_Groups_Collection,
        "title",
        this
      );
    },
    /// Custom - AutoForm - validation --

    uniforms: {
      className: "col col-12"
    }
  }
});
Users_Groups_Collection.attachSchema(Users_Groups_Schema, { tracker: Tracker });
/// Custom - AutoForm - schema --

/// Custom - Collection - helpers
Users_Groups_Collection.dispTitle = function(doc) {
  /// System - Collection - soft delete
  return displayTitle(doc._deleted, doc.title);
  /// System - Collection - soft delete --
};

Users_Groups_Collection.helpers({
  disp_title() {
    return Users_Groups_Collection.dispTitle(this);
  }
});
/// Custom - Collection - helpers --

/// Custom - AutoForm - methods
function adminCheck() {
  "use strict";

  const loggedInUser = Meteor.user();
  if (
    !loggedInUser ||
    !Roles.userIsInRole(loggedInUser, ["admin"], Roles.GLOBAL_GROUP)
  ) {
    throw new Meteor.Error(403, "Access denied");
  }
}

if (Meteor.isServer) {
  Meteor.methods({
    "Users_Groups.insert": function(Users_Groups_id, data) {
      "use strict";

      adminCheck();
      return Users_Groups_Collection.insert(data);
    },

    "Users_Groups.update": function(Users_Groups_id, _id, data) {
      "use strict";

      adminCheck();

      /// Custom - Collection - optimistic lock
      const tmp = Users_Groups_Collection.findOne({ _id: _id });
      if (tmp.modifiedAt != data.modifiedAt) {
        const otherUser = Meteor.users.findOne({ _id: tmp.modifiedBy });
        throw new Meteor.Error(
          "lock",
          `modified by ${otherUser.profile.username}`
        );
      }
      /// Custom - Collection - optimistic lock --

      Users_Groups_Collection.update(_id, { $set: data });
    },

    "Users_Groups.remove": function(Users_Groups_id, _id, data) {
      "use strict";

      adminCheck();

      /// Custom - Collection - optimistic lock
      const tmp = Users_Groups_Collection.findOne({ _id: _id });
      if (tmp.modifiedAt != data.modifiedAt) {
        const otherUser = Meteor.users.findOne({ _id: tmp.modifiedBy });
        throw new Meteor.Error(
          "lock",
          `modified by ${otherUser.profile.username}`
        );
      }
      /// Custom - Collection - optimistic lock --

      /// Custom - Collection - soft delete
      Users_Groups_Collection.update(_id, { $set: { _deleted: _id } });
      /// Custom - Collection - soft delete --
    },

    // eslint-disable-next-line no-unused-vars
    "Users_Groups.recover": function(Users_Groups_id, _id, editData) {
      "use strict";

      adminCheck();

      /// Custom - Collection - soft delete
      Users_Groups_Collection.update(_id, { $set: { _deleted: null } });
      /// Custom - Collection - soft delete --
    }
  });
}
/// Custom - AutoForm - methods --

/// Custom - Server - start up
if (Meteor.isServer) {
  Meteor.publish("Users_Groups", function(Users_Groups_id) {
    "use strict";

    console.log("### Meteor.publish('Users_Groups')", Users_Groups_id);
    return Users_Groups_Collection.find({});
  });

  Meteor.startup(function() {
    /// Custom - Collection - collection uniq key
    /// Custom - Collection - soft delete
    console.log(
      "Users_Groups_Collection._ensureIndex({ title: 1, _deleted: 1 }, { unique: true });"
    );
    Users_Groups_Collection._ensureIndex(
      { title: 1, _deleted: 1 },
      { unique: true }
    );
    /// Custom - Collection - soft delete --
    /// Custom - Collection - collection uniq key --
  });
}

if (Meteor.isClient) {
  Tracker.autorun(() => {
    "use strict";

    Meteor.subscribe("Users_Groups", Session.get("Users_Groups_id"));
    console.log(
      "### Meteor.subscribe('Users_Groups');",
      Session.get("Users_Groups_id")
    );
  });
}
/// Custom - Server - start up --
