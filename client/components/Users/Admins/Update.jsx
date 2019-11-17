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
export const Users_Admins_Update_ComponentInfo = mode => {
  if (!checkSystemRole()) {
    return null;
  }

  if (!checkAdminRole()) {
    return null;
  }

  return { title: "Users/Admins/Update", path: "/Users/Admins/Update" };
};
/// Custom - Role - check permission --

/// Custom AutoForm - schema
const schemaCopy = $.extend(true, {}, schema);
schemaCopy["emails.$.address"].custom = function() {
  return customValidatorCheckOtherEmails(customErrors, Form_name, this);
};
const UsersUpdateSchema = new SimpleSchema(schemaCopy);
/// Custom AutoForm - schema --

/**
 *
 *
 * @export
 * @class Users_Admins_Update
 * @extends {Update}
 */
export class Users_Admins_Update extends Update {
  "use strict";

  /**
   *Creates an instance of Users_Admins_Update.
   * @param {*} props
   * @memberof Users_Admins_Update
   */
  constructor(props) {
    super(props);

    /// Custom - Role - check permission
    this.ComponentInfo = Users_Admins_Update_ComponentInfo;
    /// Custom - Role - check permission --

    /// Custom - AutoForm - rebuild field
    this.Collection = {
      simpleSchema: UsersUpdateSchema
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
   * @memberof Users_Admins_Update
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

    /// Custom - AutoForm - load data
    const Users_Groups_id = Session.get("Users_Groups_id");
    const { _id } = this.props.match.params;
    if (_id) {
      Meteor.call("Users_Users.findOne", Users_Groups_id, _id, (err, doc) => {
        if (err) {
          Bert.alert({
            type: "danger",
            hideDelay: 10000,
            message: `find failed: ${err.message}`
          });
          this.props.history.goBack();
        } else {
          //const organizations = doc.profile.roles.map((role) => role.organization);
          const organizations = doc.profile.roles
            .filter(role => role.roles.includes("admin"))
            .map(role => role.organization);
          const editData = {
            _id: doc._id,
            username: doc.profile.username,
            emails: doc.profile.emails,
            organizations: organizations
          };
          this.setState({ doc: editData });
        }
      });
    }
    /// Custom - AutoForm - load data --
  }

  /**
   *
   *
   * @param {*} doc
   * @returns
   * @memberof Users_Admins_Update
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
      this.formRef.props.model._id,
      doc,
      error => {
        if (!error) {
          this.updateCallback();
        }
      }
    );
    /// Custom - AutoForm - update --
  }

  /**
   *
   *
   * @returns
   * @memberof Users_Admins_Update
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
      "Users_Admins.remove",
      Users_Groups_id,
      this.formRef.props.model._id,
      this.formRef.props.model,
      this.updateCallback
    );
    /// Sys - AutoForm - remove --
  }
}
