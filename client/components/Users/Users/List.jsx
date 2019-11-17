/// Sys - Tabular
import React from "react";
import { Template } from "meteor/templating";
import { TabularWrapper } from "@imports/ui/tabular/wrapper";
import TabularButtons from "@imports/ui/tabular/TabularButtons";
import { ListTabular } from "@imports/ui/crud/ListTabular";
/// Sys - Tabular --

/// Custom - Tabular - insert button
import { Users_Users_Insert_ComponentInfo } from "./Insert";
/// Custom - Tabular - insert button --

/// Custom - Tabular - collection
import { Users_Users_Tabular } from "@imports/api/Users/Users_Tabular"; // eslint-disable-line no-unused-vars
/// Custom - Tabular - collection --

/// Custom - Tabular - filter
import { Session } from "meteor/session";
/// Custom - Tabular - filter --

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
export const Users_Users_List_ComponentInfo = mode => {
  if (checkSystemRole()) {
    return null;
  }
  if (!checkAdminRole()) {
    return null;
  }
  return { title: "Users/Users/List", path: "/Users/Users/List" };
};
/// Custom - Role - check permission --

/// Custom - Tabular - update button event
let self;

// see packages/application-buttons/templates.html
console.assert(
  Template.Users_Users_List_Buttons,
  "Template.Users_Users_List_Buttons is not defined in application-buttons."
);

Template.Users_Users_List_Buttons.events({
  "click .edit": function() {
    let id = this._id;
    setTimeout(function() {
      self.props.history.push("/Users/Users/Update/" + id);
    }, window.$GLOBAL$.transitionDuration);
  }
});
/// Custom - Tabular - update button event --

/// Custom - Tabular - update button show control
Template.Users_Users_List_Buttons.helpers({
  TabularButtons() {
    return TabularButtons;
  },
  option() {
    return {
      read: true,
      update: true,
      delete: true
    };
  }
});
/// Custom - Tabular - update button show control --

/**
 *
 *
 * @export
 * @class Users_Users_List
 * @extends {ListTabular}
 */
export class Users_Users_List extends ListTabular {
  "use strict";

  /**
   *Creates an instance of Users_Users_List.
   * @param {*} props
   * @memberof Users_Users_List
   */
  constructor(props) {
    super(props);

    /// Custom - Role - check permission
    this.ComponentInfo = Users_Users_List_ComponentInfo;
    this.Insert_ComponentInfo = Users_Users_Insert_ComponentInfo;
    /// Custom - Role - check permission --
  }

  /**
   *
   *
   * @memberof Users_Users_List
   */
  UNSAFE_componentWillMount() {
    /// Custom - Tabular - update button
    self = this;
    /// Custom - Tabular - update button --
  }

  /**
   *
   *
   * @returns
   * @memberof Users_Users_List
   */
  render() {
    /// Custom - Tabular - filter
    this.role_str = "roles." + Session.get("Users_Groups_id");
    this.selector = { [this.role_str]: { $exists: true } };
    /// Custom - Tabular - filter --

    /// Custom - Tabular - layout
    /* eslint-disable react/no-string-refs */
    return (
      <React.Fragment>
        {this.InsertButtons(Users_Users_Insert_ComponentInfo())}

        <TabularWrapper
          table="Users_Users_Tabular"
          id="Users_Users_Tabular"
          ref="Users_Users_Tabular"
          selector={this.selector}
          class="table table-striped table-condensed"
        />
      </React.Fragment>
    );
    /* eslint-enable react/no-string-refs */
    /// Custom - Tabular - layout --
  }
}
