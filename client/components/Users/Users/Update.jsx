/// Sys - Network
import { checkNetwork } from "@imports/ui/crud/checkNetwork";
/// Sys - Network --

/// Sys - AutoForm
import Update from "@imports/ui/crud/Update";
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
export const Users_Users_Update_ComponentInfo = mode => {
  if (checkSystemRole()) {
    return null;
  }

  if (!checkAdminRole()) {
    return null;
  }

  return { title: "Users/Users/Update", path: "/Users/Users/Update" };
};
/// Custom - Role - check permission --

/// Custom AutoForm - schema
const schemaCopy = $.extend(true, {}, schema);
schemaCopy["emails.$.address"].custom = function() {
  return customValidatorCheckOtherEmails(customErrors, Form_name, this);
};
const AdminsUpdateSchema = new SimpleSchema(schemaCopy);
/// Custom AutoForm - schema --

/**
 *
 *
 * @export
 * @class Users_Users_Update
 * @extends {Update}
 */
export class Users_Users_Update extends Update {
  "use strict";

  /**
   *Creates an instance of Users_Users_Update.
   * @param {*} props
   * @memberof Users_Users_Update
   */
  constructor(props) {
    super(props);

    /// Custom - Role - check permission
    this.ComponentInfo = Users_Users_Update_ComponentInfo;
    /// Custom - Role - check permission --

    /// Custom - AutoForm - rebuild field
    this.Collection = {
      simpleSchema: AdminsUpdateSchema
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
   * @memberof Users_Users_Update
   */
  componentDidMount() {
    /// Sys - Network - check
    checkNetwork();
    /// Sys - Network - check --

    /// Custom - Role - check permission
    if (this.ComponentInfo) {
      if (!this.ComponentInfo()) {
        console.error(`Security check.`);

        this.props.history.replace("/");
      }
    }
    /// Custom - Role - check permission --

    /// Custom - Autoform - load data
    const Users_Groups_id = Session.get("Users_Groups_id");
    const { _id } = this.props.match.params;
    if (_id) {
      Meteor.call("Users_Users.findOne", Users_Groups_id, _id, (err, doc) => {
        if (err) {
          /// Custom - AutoForm - check data
          Bert.alert({
            type: "danger",
            hideDelay: 10000,
            message: `find failed: ${err.message}`
          });
          this.props.history.goBack();
          /// Custom - AutoForm - check data --
        } else {
          /// Custom - AutoForm - load data
          const roles = doc.profile.roles.filter(
            role => role.organization == Users_Groups_id
          );
          const editData = {
            _id: doc._id,
            username: doc.profile.username,
            emails: doc.profile.emails,
            organization_roles: roles[0].roles,
            approles: roles[0].approles,
            Images_id: doc.profile.Images_id
          };

          /// Sys - AutoForm - rebuild field
          editData.__Form_name = this.Form_name;
          /// Sys - AutoForm - rebuild field --

          this.setState({ doc: editData });
          /// Custom - AutoForm - load data --
        }
      });
    }
    /// Custom - Autoform - load data --
  }

  /**
   *
   *
   * @param {*} doc
   * @returns
   * @memberof Users_Users_Update
   */
  submit(doc) {
    /// Sys - Network - check
    if (!checkNetwork()) {
      return;
    }
    /// Sys - Network - check --

    /// Custom - Autoform - update
    // Caution Uniforms Magic !!
    doc.organization_roles = doc.organization_roles || [];

    const Users_Groups_id = Session.get("Users_Groups_id");
    Meteor.call(
      "Users_Users.update",
      Users_Groups_id,
      this.formRef.props.model._id,
      doc,
      error => {
        if (!error) {
          this.updateCallback();
        }
      }
    );
    /// Custom - Autoform - update --
  }

  /**
   *
   *
   * @returns
   * @memberof Users_Users_Update
   */
  remove() {
    /// Sys - Network - check
    if (!checkNetwork()) {
      return;
    }
    /// Sys - Network - check --

    /// Sys - AutoForm - remove
    const Users_Groups_id = Session.get("Users_Groups_id"); // eslint-disable-line no-redeclare
    Meteor.call(
      "Users_Users.remove",
      Users_Groups_id,
      this.formRef.props.model._id,
      this.formRef.props.model,
      this.updateCallback
    );
    /// Sys - AutoForm - remove --
  }
}
