/// Sys - Tabular
import { Template } from "meteor/templating";
import TabularButtons from "@imports/ui/tabular/TabularButtons";
import { ListTabular } from "@imports/ui/crud/ListTabular";
/// Sys - Tabular --

/// Custom - Tabular - insert button
import { Users_Groups_Insert_ComponentInfo } from "./Insert";
console.assert(
  Users_Groups_Insert_ComponentInfo,
  "Users_Groups_Insert_ComponentInfo is undefined."
);
/// Custom - Tabular - insert button --

/// Custom - Tabular - collection
import { Users_Groups_Collection } from "@imports/api/Users/Groups_Collection";
console.assert(
  Users_Groups_Collection,
  "Users_Groups_Collection is undefined."
);
import "@imports/api/Users/Groups_Tabular";
/// Custom - Tabular - collection --

/// Sys - Role
import { checkSystemRole, checkAdminRole } from "@imports/ui/crud/checkRole";
/// Sys - Role --

/// Custom - Role - check permission
/**
 *
 *
 * @param {*} mode
 * @returns
 */
// eslint-disable-next-line no-unused-vars
export const Users_Groups_List_ComponentInfo = mode => {
  if (!checkSystemRole()) {
    return null;
  }

  if (!checkAdminRole()) {
    return null;
  }

  return { title: "Users/Groups/一覧", path: "/Users/Groups/List" };
};
/// Custom - Role - check permission --

/// Custom - Tabular - update button event
let self;

// see packages/application-buttons/templates.html
console.assert(
  Template.Users_Groups_List_Buttons,
  "Template.Users_Groups_List_Buttons is not defined in application-buttons."
);

Template.Users_Groups_List_Buttons.events({
  "click .edit": function() {
    let id = this._id;
    setTimeout(function() {
      self.props.history.push("/Users/Groups/Update/" + id);
    }, window.$GLOBAL$.transitionDuration);
  }
});
/// Custom - Tabular - update button event --

/// Custom - Tabular - update button show control
Template.Users_Groups_List_Buttons.helpers({
  TabularButtons() {
    return TabularButtons;
  },
  option() {
    return {
      read: true,
      update: true,
      delete: true,

      /// Custom - Tabular - soft delete
      _deleted: this._deleted
      /// Custom - Tabular - soft delete --
    };
  }
});
/// Custom - Tabular - update button show control --

/**
 *
 *
 * @export
 * @class Users_Groups_List
 * @extends {ListTabular}
 */
export class Users_Groups_List extends ListTabular {
  "use strict";

  /**
   *Creates an instance of Users_Groups_List.
   * @param {*} props
   * @memberof Users_Groups_List
   */
  constructor(props) {
    super(props);

    /// Custom - Role - check permission
    this.ComponentInfo = Users_Groups_List_ComponentInfo;
    this.Insert_ComponentInfo = Users_Groups_Insert_ComponentInfo;
    /// Custom - Role - check permission --

    /// Custom - Tabular - tabular
    this.tabular = "Users_Groups_Tabular";
    /// Custom - Tabular - tabular --
  }

  /**
   *
   *
   * @memberof Users_Groups_List
   */
  UNSAFE_componentWillMount() {
    /// Custom - Tabular - update button
    self = this;
    /// Custom - Tabular - update button --
  }
}
