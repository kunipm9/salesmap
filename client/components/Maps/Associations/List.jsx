/// Sys - Tabular
import React from "react";
import { withTracker } from "meteor/react-meteor-data";
import { ListPersisted } from "@imports/ui/crud/ListPersisted";
import { displayTitle } from "@imports/api/lib/CollectionUtils";
/// Sys - Tabular --

/// Custom - AutoForm - collection
import { Session } from "meteor/session";
import { Maps_Associations_Collection } from "@imports/api/Maps/Associations_Collection";
console.assert(Maps_Associations_Collection, "Maps_Associations_Collection is undefined.");
/// Custom - AutoForm - collection --

/// Custom - Tabular - insert button
import { Maps_Associations_Insert_ComponentInfo } from "./Insert";
console.assert(
  Maps_Associations_Insert_ComponentInfo,
  "Maps_Associations_Insert_ComponentInfo is undefined."
);
/// Custom - Tabular - insert button --

/// Sys - Role
import { checkSystemRole, checkAppRole } from "@imports/ui/crud/checkRole";
/// Sys - Role --

/// Custom - Role - check permission
/**
 *
 *
 * @param {*} mode
 * @returns
 */
export const Maps_Associations_List_ComponentInfo = mode => {
  if (!checkAppRole("Maps.Associations", mode)) {
    return null;
  }

  if (checkSystemRole()) {
    return null;
  }

  return { title: "Maps/Associations/List", path: "/Maps/Associations/List" };
};
/// Custom - Role - check permission --

/**
 *
 *
 * @export
 * @class _Maps_Associations_List
 * @extends {ListPersisted}
 */
export class _Maps_Associations_List extends ListPersisted {
  "use strict";

  /**
   *Creates an instance of _Maps_Associations_List.
   * @param {*} props
   * @memberof _Maps_Associations_List
   */
  constructor(props) {
    super(props);

    /// Custom - Tabular - link button
    this.updatePath = "/Maps/Associations/Update/";
    /// Custom - Tabular - link button --

    /// Custom - Role - check permission
    this.ComponentInfo = Maps_Associations_List_ComponentInfo;
    this.Insert_ComponentInfo = Maps_Associations_Insert_ComponentInfo;
    /// Custom - Role - check permission --

    /// Custom - Tabular - collection
    this.Collection = Maps_Associations_Collection;
    /// Custom - Tabular - collection --

    this.columns = [
      //      { title: "<input id='select-all' type='checkbox' style='opacity: 1'/>"},
      {
        field: "name",
        title: "Name",
        // eslint-disable-next-line no-unused-vars
        formatter: function(cell, formatterParams, onRendered) {
          return displayTitle(
            cell._cell.row.data._deleted,
            cell._cell.row.data.name
          );
        }
      },
      {
        field: "_id",
        title: " ",
        align: "center",
        cssClass: "py-0",
        formatter: this.reactFormatter(<this.UpdateButton />)
      }
    ];
  }
}

/// Custom - List - tracker
export const Maps_Associations_List = withTracker(() => {
  /// Custom - Collection - subscribe
  const handles = [
    Meteor.subscribe(Maps_Associations_Collection._name, Session.get("Users_Groups_id"))
  ];
  const loading = handles.some(handle => !handle.ready());

  if (!loading) {
    Maps_Associations_Collection.find().fetch();
  }
  /// Custom - Collection - subscribe --

  return {
    ComponentInfo: Maps_Associations_List_ComponentInfo,
    loading: loading
  };
})(_Maps_Associations_List);
/// Custom - List - tracker --
