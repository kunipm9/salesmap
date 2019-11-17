/// Sys - Tabular
import React from "react";
import { withTracker } from "meteor/react-meteor-data";
import { Session } from "meteor/session";
/// Sys - Tabular --

/// Custom - AutoForm - collection
import { Maps_Ranks_Collection } from "@imports/api/Maps/Ranks_Collection";
import { Maps_Tags_Collection } from "@imports/api/Maps/Tags_Collection";
import { Maps_PinCategorys_Collection } from "@imports/api/Maps/PinCategorys_Collection";
/// Custom - AutoForm - collection --

/// Custom - Role - check permission --
class _DataKeeper extends React.Component {
  "use strict";
  render() {
    return <React.Fragment />;
  }
}

/// Custom - View - tracker
export const DataKeeper = withTracker(() => {
  /// Custom - Collection - subscribe
  const handles = [
    Meteor.subscribe(Maps_Ranks_Collection._name, Session.get("Users_Groups_id")),
    Meteor.subscribe(Maps_Tags_Collection._name, Session.get("Users_Groups_id")),
    Meteor.subscribe(Maps_PinCategorys_Collection._name, Session.get("Users_Groups_id"))
  ];
  const loading = handles.some(handle => !handle.ready());
  console.log(new Date().getTime(), "Edit_Category loading", loading);

  if (!window.$GLOBAL$.__ConsumersView__) {
    window.$GLOBAL$.__ConsumersView__ = {};
  }

  const rankRec = Maps_Ranks_Collection.findOne({ _deleted: null });
  let ranks = [];
  if (rankRec && rankRec.ranks) {
    ranks = rankRec.ranks;
  }
  window.$GLOBAL$.__ConsumersView__.ranks = ranks;

  const catRec = Maps_PinCategorys_Collection.findOne({ _deleted: null });
  window.$GLOBAL$.__ConsumersView__.pinCategorys = catRec;

  return {
    loading: loading
  };
  /// Custom - Collection - subscribe --
})(_DataKeeper);
/// Custom - View - tracker --
