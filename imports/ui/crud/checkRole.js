/// Sys - Role
const _ = require("lodash");
import { Session } from "meteor/session";
import { Roles } from "meteor/alanning:roles";
/// Sys - Role --

/// Sys - Role
/**
 *
 *
 * @export
 * @returns
 */
export function checkSystemRole() {
  if (Session.get("Users_Groups_id") != Roles.GLOBAL_GROUP) {
    return false;
  }
  return true;
}

/**
 *
 *
 * @export
 * @returns
 */
export function checkAdminRole() {
  const loggedInUser = Meteor.user();
  return Roles.userIsInRole(
    loggedInUser,
    ["admin"],
    Session.get("Users_Groups_id")
  );
}

/**
 *
 *
 * @export
 * @param {*} requireAppRole
 * @param {*} requireFuncRole
 * @returns
 */
export function checkAppRole(requireAppRole, requireFuncRole) {
  if (!requireAppRole) {
    return true;
  }

  const loggedInUser = Meteor.user();

  if (!loggedInUser || !loggedInUser.profile || !loggedInUser.profile.roles) {
    return false;
  }

  const roles = loggedInUser.profile.roles.filter(
    role => role.organization == Session.get("Users_Groups_id")
  );
  if (roles.length == 0) {
    return false;
  }

  const approles = roles[0].approles;

  const approle = _.get(approles, requireAppRole) || false;

  if (!approle) {
    return false;
  }

  if (
    !(
      requireFuncRole == "create" ||
      requireFuncRole == "read" ||
      requireFuncRole == "update" ||
      requireFuncRole == "delete"
    )
  ) {
    console.error(`Security check illegal argument.`, requireFuncRole);
    return false;
  }

  if (approle.crud && approle.crud.includes(requireFuncRole)) {
    return true;
  }

  return false;
}
/// Sys - Role --
