/// Sys - Network
import { checkNetwork } from "@imports/ui/crud/checkNetwork";
/// Sys - Network --

/// Sys - AutoForm
import Insert from "@imports/ui/crud/Insert";
/// Sys - AutoForm --

/// Custom - AutoForm - collection
import { Meteor } from "meteor/meteor";
import { Session } from "meteor/session";
/// Custom - AutoForm - collection --

/// Custom - AutoForm - schema
import { schema, Form_name, customErrors } from "./schema";
import { customValidatorCheckOtherEmails } from "@imports/api/customValidator";
/// Custom - AutoForm - schema --

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
export const Users_Admins_Insert_ComponentInfo = mode => {
  if (!checkSystemRole()) {
    return false;
  }

  if (!checkAdminRole()) {
    return false;
  }

  return { title: "Users/Admins/Insert", path: "/Users/Admins/Insert" };
};
/// Custom - Role - check permission --

/// Custom AutoForm - schema
const schemaCopy = $.extend(true, {}, schema);
schemaCopy.password.optional = false;
schemaCopy.password.uniforms.help = null;
schemaCopy["emails.$.address"].custom = function() {
  return customValidatorCheckOtherEmails(customErrors, Form_name, this);
};
const UsersInsertSchema = new SimpleSchema(schemaCopy);
/// Custom AutoForm - schema --

/**
 *
 *
 * @export
 * @class Users_Admins_Insert
 * @extends {Insert}
 */
export class Users_Admins_Insert extends Insert {
  "use strict";

  /**
   *Creates an instance of Users_Admins_Insert.
   * @param {*} props
   * @memberof Users_Admins_Insert
   */
  constructor(props) {
    super(props);

    /// Custom - Role - check permission
    this.ComponentInfo = Users_Admins_Insert_ComponentInfo;
    /// Custom - Role - check permission --

    /// Custom - AutoForm - rebuild field
    this.Collection = {
      simpleSchema: UsersInsertSchema
    };
    this.Form_name = Form_name;
    /// Custom - AutoForm - rebuild field --

    /// Custom - AutoForm - validation
    customErrors = {};
    /// Custom - AutoForm - validation --

    /// Sys - AutoForm - rebuild field
    this.postConstructor();
    /// Sys - AutoForm - rebuild field --
  }

  /**
   *
   *
   * @param {*} doc
   * @returns
   * @memberof Users_Admins_Insert
   */
  submit(doc) {
    /// Sys - Network - check
    if (!checkNetwork()) {
      return;
    }
    /// Sys - Network - check --

    /// Custom - AutoForm - update
    const Users_Groups_id = Session.get("Users_Groups_id");
    Meteor.call(
      "Users_Admins.update",
      Users_Groups_id,
      null,
      doc,
      (error, ret) => {
        if (error) {
          console.log("Meteor.call", error, ret);
        } else {
          this.updateCallback();
        }
      }
    );
    /// Custom - AutoForm - update --
  }
}
