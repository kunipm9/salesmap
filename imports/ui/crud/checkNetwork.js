/// Sys - AutoForm - info
import { Bert } from "meteor/themeteorchef:bert";
/// Sys - AutoForm - info --

/// Sys - Network
/**
 *
 *
 * @export
 * @returns
 */
export function checkNetwork() {
  if (Meteor.status().status !== "connected") {
    if (Meteor.status().status !== "connecting") {
      Bert.alert({
        type: "danger",
        hideDelay: 3500,
        message: Meteor.status().status
      });
    }
    return false;
  }
  return true;
}
/// Sys - Network
