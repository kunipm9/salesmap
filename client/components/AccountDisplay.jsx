/// Sys - Router
import { Meteor } from "meteor/meteor";
import React from "react";
import { withRouter } from "react-router-dom";
/// Sys - Router --

/// Application - Router - menu
import { Users_Login_Login_Button } from "./Users/Login/Login";
import { Users_Login_SelectUserGroup_Button } from "./Users/Login/SelectUserGroup";
/// Application - Router - menu --

/// Application - Role - layout
/**
 *
 *
 * @export
 * @class AccountDisplay
 * @extends {React.Component}
 */
export class AccountDisplay extends React.Component {
  render() {
    return (
      <React.Fragment>
        {Meteor.user() ? (
          <Users_Login_SelectUserGroup_Button history={this.props.history} />
        ) : (
          <Users_Login_Login_Button history={this.props.history} />
        )}
        {this.props.children}
      </React.Fragment>
    );
  }
}
/// Application - Role - layout --

export const AccountDisplayWrapper = withRouter(AccountDisplay);
