/// Sys - Network
import { checkNetwork } from "@imports/ui/crud/checkNetwork";
/// Sys - Network --

import React from "react";

/**
 *
 *
 * @export
 * @class Profile
 * @extends {React.Component}
 */
export default class Profile extends React.Component {
  /**
   *
   *
   * @returns
   * @memberof Profile
   */
  render() {
    /// Sys - Network - check
    checkNetwork();
    /// Sys - Network - check --
    return (
      <React.Fragment>
        <h1>Your Profile!</h1>
      </React.Fragment>
    );
  }
}
