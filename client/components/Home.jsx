/// Sys - React
import { Meteor } from "meteor/meteor";
import React from "react";
/// Sys - React --

import { isMobile } from "@imports/ui/utils/util";

/**
 *
 *
 * @export
 * @class Home
 * @extends {React.Component}
 */
export default class Home extends React.Component {
  /**
   *
   *
   * @returns
   * @memberof Home
   */
  render() {
    /// Sys - Network - check
    // checkNetwork();
    /// Sys - Network - check --

    if (isMobile() && Meteor.user() && !Meteor.user().profile._deleted) {
      this.props.history.replace("/MapsSP/Home/View");
    }

    if (isMobile() && !Meteor.user()) {
      this.props.history.replace("/Users/Login/Login");
    }

    if (!isMobile() && Meteor.user() && !Meteor.user().profile._deleted) {
      //      this.props.history.replace("/Maps/Consumers/List");
    }

    /// Application - Router - menu
    return (
      <React.Fragment>
        <h1>Home</h1>
      </React.Fragment>
    );
    /// Application - Router - menu --
  }
}
