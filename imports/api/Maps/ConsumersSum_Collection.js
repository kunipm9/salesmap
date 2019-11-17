console.log("Maps_ConsumersSum_Collection");

/// Sys - localCollection - update trigger
import { Tracker } from "meteor/tracker";
import { Mongo } from "meteor/mongo";
import { SimpleSchema } from "meteor/aldeed:simple-schema";
/// Sys - localCollection - update trigger --

/// Custom - Collection - filter
import { Session } from "meteor/session";
/// Custom - Collection - filter --

/// Custom - Collection
export const Maps_ConsumersSum_Collection = new Mongo.Collection(
  "Maps_ConsumersSum"
);
Maps_ConsumersSum_Collection.defaultCollectionHooks();
/// Custom - Collection --

/// Custom - Persister
if (Meteor.isClient) {
  Maps_ConsumersSum_Collection.attachPersister();
}
/// Custom - Persister --

/// Custom - localCollection - update trigger
const Maps_ConsumersSum_Schema = new SimpleSchema({
  _id: {
    optional: true,
    type: String
  },
  /// Custom - Collection - optimistic lock
  modifiedAt: {
    optional: true,
    type: Number,
    defaultValue: null
  },
  /// Custom - Collection - optimistic lock --
  Users_Groups_id: {
    optional: true,
    type: String,
    label: "User Group"
  }
});
Maps_ConsumersSum_Collection.attachSchema(Maps_ConsumersSum_Schema, {
  tracker: Tracker
});
/// Custom - localCollection - update trigger --

/// Custom - Server - start up
if (Meteor.isServer) {
  Meteor.publish("Maps_ConsumersSum", function(Users_Groups_id) {
    "use strict";

    console.log("### Meteor.publish('Maps_ConsumersSum')", Users_Groups_id);
    return Maps_ConsumersSum_Collection.find(
      { Users_Groups_id: Users_Groups_id },
      { limit: 1 }
    );
  });

  Meteor.startup(function() {});
}

if (Meteor.isClient) {
  Tracker.autorun(() => {
    "use strict";

    Meteor.subscribe("Maps_ConsumersSum", Session.get("Users_Groups_id"));
  });
}
/// Custom - Server - start up --
