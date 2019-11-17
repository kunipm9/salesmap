/// Sys - AutoForm
import React from "react";
/// Sys - AutoForm --

/// Sys - Network
import { checkNetwork } from "@imports/ui/crud/checkNetwork";
/// Sys - Network --

/**
 *
 *
 * @export
 * @class View
 * @extends {React.Component}
 */
export default class View extends React.PureComponent {
  "use strict";

  constructor(props) {
    super(props);
  }

  /**
   *
   *
   * @param {*} self
   * @memberof View
   */
  securityCheck(self) {
    if (self.ComponentInfo) {
      if (!self.ComponentInfo("read")) {
        console.error(`Security check.`);
        if (this.props.history) {
          this.props.history.replace("/");
        } else {
          window.location.href = "/";
        }
      }
    }
  }

  /**
   *
   *
   * @memberof View
   */
  componentDidMount() {
    console.log(new Date().getTime(), "super super View componentDidMount");

    /// Sys - Network - check
    const networkStatus = checkNetwork();
    /// Sys - Network - check --

    /// Custom - Role - check permission
    if (networkStatus) {
      this.securityCheck(this);
    } else {
      setTimeout(() => {
        this.securityCheck(this);
      }, 500);
    }
    /// Custom - Role - check permission --
  }
}
