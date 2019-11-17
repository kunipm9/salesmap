/// Sys - AutoForm
import React from "react";
/// Sys - AutoForm --

/// Sys - Role
import { Users_Groups_Collection } from "@imports/api/Users/Groups_Collection";
console.assert(
  Users_Groups_Collection,
  "Users_Groups_Collection is undefined."
);
import { Session } from "meteor/session";
/// Sys - Role --

/// Custom - Layout
import { MDBBtn } from "mdbreact";
import { MDBIcon } from "mdbreact";
/// Custom - Layout --

/// Custom - Role - check permission
/**
 *
 *
 * @returns
 */
const Users_Login_SelectUserGroup_ComponentInfo = () => {
  const loggedInUser = Meteor.user();
  if (loggedInUser && loggedInUser.roles) {
    return { title: "SelectGroup", path: "/Users/Login/SelectUserGroup" };
  }
  return null;
};
/// Custom - Role - check permission --

/// Custom - Role - link button
/**
 *
 *
 * @param {*} {history}
 * @returns
 */
export const Users_Login_SelectUserGroup_Button = ({ history }) => {
  if (!Users_Login_SelectUserGroup_ComponentInfo()) {
    return <span />;
  }
  return (
    <MDBBtn
      color="primary"
      className="btnfont"
      onClick={() => {
        setTimeout(
          () => history.push("/Users/Login/SelectUserGroup"),
          window.$GLOBAL$.transitionDuration
        );
      }}
    >
      <MDBIcon icon="user" className="mr-1" />
      {Session.get("Users_Groups_title")} / {Meteor.user().profile.username}
    </MDBBtn>
  );
};
/// Custom - Role - link button --

/**
 *
 *
 * @export
 * @class Users_Login_SelectUserGroup
 * @extends {React.Component}
 */
export class Users_Login_SelectUserGroup extends React.Component {
  "use strict";

  /// Sys - Role
  /**
   *
   *
   * @param {*} d
   * @memberof Users_Login_SelectUserGroup
   */
  setUserGroup(d) {
    Session.setPersistent("Users_Groups_id", d._id);
    Session.setPersistent("Users_Groups_title", d.title);
  }
  /// Sys - Role --

  /**
   *Creates an instance of Users_Login_SelectUserGroup.
   * @param {*} props
   * @memberof Users_Login_SelectUserGroup
   */
  constructor(props) {
    super(props);

    /// Custom - Role - check permission
    this.ComponentInfo = Users_Login_SelectUserGroup_ComponentInfo;
    /// Custom - Role - check permission --
  }

  /**
   *
   *
   * @returns
   * @memberof Users_Login_SelectUserGroup
   */
  render() {
    /// Sys - Role
    const items = [];
    const loggedInUser = Meteor.user();
    for (const userGroupId in loggedInUser.roles) {
      if (userGroupId == Roles.GLOBAL_GROUP) {
        items.push({ _id: userGroupId, title: "System" });
      } else {
        const userGroup = Users_Groups_Collection.findOne({ _id: userGroupId });
        items.push({ _id: userGroupId, title: userGroup.title });
      }
    }
    /// Sys - Role --

    /// Custom - Layout
    return (
      <React.Fragment>
        {items.map(d => {
          return (
            <MDBBtn
              key={d._id}
              color="primary"
              className="btnfont"
              onClick={() => {
                this.setUserGroup(d);
                setTimeout(
                  () => this.props.history.replace("/"),
                  window.$GLOBAL$.transitionDuration
                );
              }}
            >
              {d.title}
            </MDBBtn>
          );
        })}

        <MDBBtn
          color="danger"
          className="btnfont"
          onClick={() => {
            Meteor.logout();
            setTimeout(() => (window.location.href = "/Users/Login/Login"));
          }}
        >
          Logout
        </MDBBtn>
      </React.Fragment>
    );
    /// Custom - Layout --
  }
}
