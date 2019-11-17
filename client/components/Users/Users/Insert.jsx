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
export const Users_Users_Insert_ComponentInfo = mode => {
  if (checkSystemRole()) {
    return null;
  }

  if (!checkAdminRole()) {
    return null;
  }

  return { title: "Users/Users/Insert", path: "/Users/Users/Insert" };
};
/// Custom - Role - check permission --

/// Custom AutoForm - schema
const schemaCopy = $.extend(true, {}, schema);
schemaCopy["emails.$.address"].custom = function() {
  return customValidatorCheckOtherEmails(customErrors, Form_name, this);
};
schemaCopy.password.optional = false;
schemaCopy.password.uniforms.help = null;

const AdminsInsertSchema = new SimpleSchema(schemaCopy);
/// Custom AutoForm - schema --

/**
 *
 *
 * @export
 * @class Users_Users_Insert
 * @extends {Insert}
 */
export class Users_Users_Insert extends Insert {
  "use strict";

  /**
   *Creates an instance of Users_Users_Insert.
   * @param {*} props
   * @memberof Users_Users_Insert
   */
  constructor(props) {
    super(props);

    /// Custom - Role - check permission
    this.ComponentInfo = Users_Users_Insert_ComponentInfo;
    /// Custom - Role - check permission --

    /// Custom - AutoForm - rebuild field
    this.Collection = {
      simpleSchema: AdminsInsertSchema
    };
    this.Form_name = Form_name;
    /// Custom - AutoForm - rebuild field --

    /// Custom - AutoForm - validation
    customErrors = {};
    /// Custom - AutoForm - validation --

    /// Application - check button
    this.skipEvent_checkButton = false;
    /// Application - check button --

    /// Sys - AutoForm - rebuild field
    this.postConstructor();
    /// Sys - AutoForm - rebuild field --
  }

  /**
   *
   *
   * @param {*} doc
   * @returns
   * @memberof Users_Users_Insert
   */
  submit(doc) {
    /// Sys - Network - check
    if (!checkNetwork()) {
      return;
    }
    /// Sys - Network - check --

    /// Custom - AutoForm - update
    // Caution Uniforms Magic !!
    doc.organization_roles = doc.organization_roles || [];

    const Users_Groups_id = Session.get("Users_Groups_id");
    Meteor.call(
      "Users_Users.update",
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
