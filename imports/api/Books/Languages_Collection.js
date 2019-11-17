console.log("Books_Languages_Collection");

/// Sys - AutoForm - collection
import { Tracker } from "meteor/tracker";
import { Mongo } from "meteor/mongo";
import { SimpleSchema } from "meteor/aldeed:simple-schema";
import { displayTitle } from "@imports/api/lib/CollectionUtils";
/// Sys - AutoForm - collection --

/// Custom - AutoForm - validation
import { customValidatorCheckDuplicateValueInArrayField } from "@imports/api/customValidator";
/// Custom - AutoForm - validation --

/// Custom - AutoForm - layout
import NullField from "@imports/ui/uniforms/NullField";
import CountryFlagField from "@imports/ui/uniforms/CountryFlagField";
/// Custom - AutoForm - layout --

/// Custom - Collection - filter
import { Session } from "meteor/session";
/// Custom - Collection - filter --

/// Custom - Collection
export const Books_Languages_Collection = new Mongo.Collection(
  "Books_Languages"
);
Books_Languages_Collection.defaultCollectionHooks();
/// Custom - Collection --

/// Custom - Persister
if (Meteor.isClient) {
  Books_Languages_Collection.attachPersister();
}
/// Custom - Persister --

/// Custom - AutoForm - schema
const Books_Languages_Schema = new SimpleSchema({
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
  languages: {
    optional: true,
    type: [Object],
    uniforms: {
      minCount: 1,
      label: "言語",
      className: "col col-12",
      sortable: true
    }
  },
  "languages.$.language": {
    type: String,

    /// Custom - AutoForm - validation
    custom: function() {
      return customValidatorCheckDuplicateValueInArrayField(this);
    },
    /// Custom - AutoForm - validation --

    uniforms: {
      label: null,
      className: "col col-12",
      component: CountryFlagField
    }
  }
});
Books_Languages_Collection.attachSchema(Books_Languages_Schema, {
  tracker: Tracker
});
/// Custom - AutoForm - schema --

/// Custom - Collection - helpers
Books_Languages_Collection.dispTitle = function(doc) {
  /// System - Collection - soft delete
  return displayTitle(doc._deleted, doc.title);
  /// System - Collection - soft delete --
};

Books_Languages_Collection.helpers({
  disp_title() {
    return Books_Languages_Collection.dispTitle(this);
  }
});
/// Custom - Collection - helpers --

/// Custom - Collection - method
Meteor.methods({
  "Books_Languages.insert": function(Users_Groups_id, data) {
    "use strict";

    data.Users_Groups_id = Users_Groups_id;
    return Books_Languages_Collection.insert(data);
  },

  "Books_Languages.update": function(Users_Groups_id, _id, data) {
    "use strict";

    /// Custom - Collection - optimistic lock
    const tmp = Books_Languages_Collection.findOne({ _id: _id });
    if (tmp.modifiedAt != data.modifiedAt) {
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

    data.Users_Groups_id = Users_Groups_id;
    Books_Languages_Collection.update(_id, { $set: data });
  },

  "Books_Languages.remove": function(Users_Groups_id, _id, data) {
    "use strict";

    /// Custom - Collection - optimistic lock
    const tmp = Books_Languages_Collection.findOne({ _id: _id });
    if (tmp.modifiedAt != data.modifiedAt) {
      console.log(
        "Books_Languages.update tmp.modifiedAt != data.modifiedAt",
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

    /// Custom - Collection - soft delete
    // Books_Languages_Collection.remove({Users_Groups_id: Users_Groups_id, _id: _id});
    Books_Languages_Collection.update(_id, { $set: { _deleted: _id } });
    /// Custom - Collection - soft delete --
  },

  // eslint-disable-next-line no-unused-vars
  "Books_Languages.recover": function(Users_Groups_id, _id, editData) {
    "use strict";

    /// Custom - Collection - soft delete
    Books_Languages_Collection.update(_id, { $set: { _deleted: null } });
    /// Custom - Collection - soft delete --
  }
});
/// Custom - Collection - method --

/// Custom - Server - start up
if (Meteor.isServer) {
  Meteor.publish("Books_Languages", function(Users_Groups_id) {
    "use strict";

    console.log("### Meteor.publish('Books_Languages')", Users_Groups_id);
    return Books_Languages_Collection.find({
      Users_Groups_id: Users_Groups_id
    });
  });

  Meteor.startup(function() {
    /// Custom - Collection - collection uniq key
    /// Custom - Collection - soft delete
    console.log(
      "Books_Languages_Collection._ensureIndex({ Users_Groups_id:1, title: 1, _deleted: 1 }, { unique: true });"
    );
    Books_Languages_Collection._ensureIndex(
      { Users_Groups_id: 1, title: 1, _deleted: 1 },
      { unique: true }
    );
    /// Custom - Collection - soft delete --
    /// Custom - Collection - collection uniq key --
  });
}

if (Meteor.isClient) {
  Tracker.autorun(() => {
    "use strict";

    Meteor.subscribe("Books_Languages", Session.get("Users_Groups_id"));
    console.log(
      "### Meteor.subscribe('Books_Languages');",
      Session.get("Users_Groups_id")
    );
  });
}
/// Custom - Server - start up --
