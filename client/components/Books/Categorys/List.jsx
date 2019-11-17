/// Sys - Tabular
import React from "react";
import { withTracker } from "meteor/react-meteor-data";
import { ListPersisted } from "@imports/ui/crud/ListPersisted";
import { displayTitle } from "@imports/api/lib/CollectionUtils";
/// Sys - Tabular --

/// Custom - AutoForm - collection
import { Session } from "meteor/session";
import { Books_Categorys_Collection } from "@imports/api/Books/Categorys_Collection";
console.assert(
  Books_Categorys_Collection,
  "Books_Categorys_Collection is undefined."
);
/// Custom - AutoForm - collection --

/// Custom - Tabular - insert button
import { Books_Categorys_Insert_ComponentInfo } from "./Insert";
console.assert(
  Books_Categorys_Insert_ComponentInfo,
  "Books_Categorys_Insert_ComponentInfo is undefined."
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
export const Books_Categorys_List_ComponentInfo = mode => {
  if (!checkAppRole("Books.Categorys", mode)) {
    return null;
  }

  if (checkSystemRole()) {
    return null;
  }

  return { title: "Books/Categorys/List", path: "/Books/Categorys/List" };
};
/// Custom - Role - check permission --

/**
 *
 *
 * @export
 * @class _Books_Categorys_List
 * @extends {ListPersisted}
 */
export class _Books_Categorys_List extends ListPersisted {
  "use strict";

  /**
   *Creates an instance of _Books_Categorys_List.
   * @param {*} props
   * @memberof _Books_Categorys_List
   */
  constructor(props) {
    super(props);

    /// Custom - Tabular - link button
    this.updatePath = "/Books/Categorys/Update/";
    /// Custom - Tabular - link button --

    /// Custom - Role - check permission
    this.ComponentInfo = Books_Categorys_List_ComponentInfo;
    this.Insert_ComponentInfo = Books_Categorys_Insert_ComponentInfo;
    /// Custom - Role - check permission --

    /// Custom - Tabular - collection
    this.Collection = Books_Categorys_Collection;
    /// Custom - Tabular - collection --

    this.columns = [
      //      { title: "<input id='select-all' type='checkbox' style='opacity: 1'/>"},
      {
        field: "title",
        title: "Title",
        // eslint-disable-next-line no-unused-vars
        formatter: function(cell, formatterParams, onRendered) {
          return displayTitle(
            cell._cell.row.data._deleted,
            cell._cell.row.data.title
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
export const Books_Categorys_List = withTracker(() => {
  /// Custom - Collection - subscribe
  const handles = [
    Meteor.subscribe(
      Books_Categorys_Collection._name,
      Session.get("Users_Groups_id")
    )
  ];
  const loading = handles.some(handle => !handle.ready());

  if (!loading) {
    Books_Categorys_Collection.find().fetch();
  }
  /// Custom - Collection - subscribe --

  return {
    ComponentInfo: Books_Categorys_List_ComponentInfo,
    loading: loading
  };
})(_Books_Categorys_List);
/// Custom - List - tracker --
