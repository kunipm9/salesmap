//@ts-check

/// Sys - AutoForm - collection
import { Tracker } from "meteor/tracker";
import { Mongo } from "meteor/mongo";
import { SimpleSchema } from "meteor/aldeed:simple-schema";
/* eslint-disable no-unused-vars */
import {
  displayTitle,
  checkFormState,
  generateFieldName,
  getFieldValue,
  getSchemaFieldName
} from "@imports/api/lib/CollectionUtils";
/* eslint-enable no-unused-vars */
/// Sys - AutoForm - collection --

/// Custom - AutoForm - validation
import { customValidatorCheckExistsRecordInUserGroup } from "@imports/api/customValidator";
/// Custom - AutoForm - validation --

/// Custom - AutoForm - rebuild field
const _ = require("lodash"); // eslint-disable-line no-unused-vars
/// Custom - AutoForm - rebuild field --

/// Custom - AutoForm - layout
import NullField from "@imports/ui/uniforms/NullField";
/// Custom - AutoForm - layout --

/// Custom - Collection - filter
import { Session } from "meteor/session";
/// Custom - Collection - filter --

/// Custom - Collection
export const Maps_ZnetLicences_Collection = new Mongo.Collection(
  "Maps_ZnetLicences"
);
Maps_ZnetLicences_Collection.defaultCollectionHooks();
/// Custom - Collection --

/// Custom - Persister
if (Meteor.isClient) {
  Maps_ZnetLicences_Collection.attachPersister();
}
/// Custom - Persister --

const Maps_ZnetLicences_Schema = new SimpleSchema({
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
  licenceKey: {
    type: String,
    label: "ライセンスキー",

    /// Custom - AutoForm - validation
    custom: function() {
      return customValidatorCheckExistsRecordInUserGroup(
        Maps_ZnetLicences_Collection,
        "key",
        this
      );
    },
    /// Custom - AutoForm - validation --

    uniforms: {
      className: "col col-12 col-lg-3 col-xl-3"
    }
  },
  limitAt: {
    type: Date,
    label: "期限",
    uniforms: {
      className: "col col-12 col-lg-3 col-xl-3"
    }
  }
});
Maps_ZnetLicences_Collection.attachSchema(Maps_ZnetLicences_Schema, {
  tracker: Tracker
});
/// Custom - AutoForm - schema --

/// Custom - Collection - helpers
Maps_ZnetLicences_Collection.dispTitle = function(doc) {
  /// System - Collection - soft delete
  return displayTitle(doc._deleted, doc.title);
  /// System - Collection - soft delete --
};

Maps_ZnetLicences_Collection.helpers({
  disp_title() {
    return Maps_ZnetLicences_Collection.dispTitle(this);
  }
});
/// Custom - Collection - helpers --

/// Custom - Collection - method
Meteor.methods({
  "Maps_ZnetLicences.insert": function(Users_Groups_id, data) {
    "use strict";

    data.Users_Groups_id = Users_Groups_id;
    return Maps_ZnetLicences_Collection.insert(data);
  },

  "Maps_ZnetLicences.update": function(Users_Groups_id, _id, data) {
    "use strict";

    /// Custom - Collection - optimistic lock
    const tmp = Maps_ZnetLicences_Collection.findOne({ _id: _id });
    if (tmp.modifiedAt != data.modifiedAt) {
      console.log(
        "Maps_ZnetLicences.update tmp.modifiedAt != data.modifiedAt",
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

    data.Users_Groups_id = Users_Groups_id;
    Maps_ZnetLicences_Collection.update(_id, { $set: data });
  },

  "Maps_ZnetLicences.remove": function(Users_Groups_id, _id, data) {
    "use strict";

    /// Custom - Collection - optimistic lock
    const tmp = Maps_ZnetLicences_Collection.findOne({ _id: _id });
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

    /// Custom - Collection - soft delete
    // Maps_ZnetLicences_Collection.remove({Users_Groups_id: Users_Groups_id, _id: _id});
    Maps_ZnetLicences_Collection.update(_id, { $set: { _deleted: _id } });
    /// Custom - Collection - soft delete --
  },

  // eslint-disable-next-line no-unused-vars
  "Maps_ZnetLicences.recover": function(Users_Groups_id, _id, editData) {
    "use strict";

    /// Custom - Collection - soft delete
    Maps_ZnetLicences_Collection.update(_id, { $set: { _deleted: null } });
    /// Custom - Collection - soft delete --
  }
});
/// Custom - Collection - method

/// Custom - Server - start up
if (Meteor.isServer) {
  Meteor.publish("Maps_ZnetLicences", function(Users_Groups_id) {
    "use strict";

    console.log("### Meteor.publish('Maps_ZnetLicences')", Users_Groups_id);
    return Maps_ZnetLicences_Collection.find({
      Users_Groups_id: Users_Groups_id
    });
  });

  Meteor.startup(function() {
    /// Custom - Collection - collection uniq key
    /// Custom - Collection - soft delete
    console.log(
      "Maps_ZnetLicences_Collection._ensureIndex({ Users_Groups_id: 1, title: 1, _deleted: 1 }, { unique: true });"
    );
    Maps_ZnetLicences_Collection._ensureIndex(
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

    Meteor.subscribe("Maps_ZnetLicences", Session.get("Users_Groups_id"));
    console.log(
      "### Meteor.subscribe('Maps_ZnetLicences');",
      Session.get("Users_Groups_id")
    );
  });
}
/// Custom - Server - start up --
