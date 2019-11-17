/// Sys - Tabular
import React from "react";
import { withTracker } from "meteor/react-meteor-data";
import { ListPersisted } from "@imports/ui/crud/ListPersisted";
/// Sys - Tabular --

/// Custom - AutoForm - collection
import { Session } from "meteor/session";
import { Books_Books_Collection } from "@imports/api/Books/Books_Collection";
console.assert(Books_Books_Collection, "Books_Books_Collection is undefined.");
/// Custom - AutoForm - collection --

/// Custom - Tabular - insert button
import { Books_Books_Insert_ComponentInfo } from "./Insert";
console.assert(
  Books_Books_Insert_ComponentInfo,
  "Books_Books_Insert_ComponentInfo is undefined."
);
/// Custom - Tabular - insert button --

/// Custom - Tabular - display
import moment from "moment";
moment.locale("ja");
/// Custom - Tabular - display --

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
export const Books_Books_List_ComponentInfo = mode => {
  if (!checkAppRole("Books.Books", mode)) {
    return null;
  }

  if (checkSystemRole()) {
    return null;
  }

  return { title: "Books/Books/List", path: "/Books/Books/List" };
};
/// Custom - Role - check permission --

/**
 *
 *
 * @export
 * @class _Books_Books_List
 * @extends {ListPersisted}
 */
export class _Books_Books_List extends ListPersisted {
  "use strict";

  /**
   *Creates an instance of _Books_Books_List.
   * @param {*} props
   * @memberof _Books_Books_List
   */
  constructor(props) {
    super(props);

    /// Custom - Tabular - link button
    this.updatePath = "/Books/Books/Update/";
    /// Custom - Tabular - link button --

    /// Custom - Role - check permission
    this.ComponentInfo = Books_Books_List_ComponentInfo;
    this.Insert_ComponentInfo = Books_Books_Insert_ComponentInfo;
    /// Custom - Role - check permission --

    /// Custom - Tabular - collection
    this.Collection = Books_Books_Collection;
    /// Custom - Tabular - collection --

    this.columns = [
      //      { title: "<input id='select-all' type='checkbox' style='opacity: 1'/>"},
      {
        field: "title",
        title: "Title",
        // eslint-disable-next-line no-unused-vars
        formatter: function(cell, formatterParams, onRendered) {
          return Books_Books_Collection.dispTitle(cell._cell.row.data);
        }
      },
      { field: "author", title: "Author" },
      { field: "copyies", title: "Copies Available" },
      {
        field: "lastCheckedOut",
        title: "Last Checkout",
        // eslint-disable-next-line no-unused-vars
        formatter: function(cell, formatterParams, onRendered) {
          if (cell.getValue() instanceof Date) {
            return moment(cell.getValue()).format("YYYY/MM/DD");
          } else {
            return "Never";
          }
        }
      },
      { field: "summary", title: "Summary" },
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
export const Books_Books_List = withTracker(() => {
  /// Custom - Collection - subscribe
  const handles = [
    Meteor.subscribe(
      Books_Books_Collection._name,
      Session.get("Users_Groups_id")
    )
  ];
  const loading = handles.some(handle => !handle.ready());

  if (!loading) {
    Books_Books_Collection.find().fetch();
  }
  /// Custom - Collection - subscribe --

  return {
    ComponentInfo: Books_Books_List_ComponentInfo,
    loading: loading
  };
})(_Books_Books_List);
/// Custom - List - tracker --
