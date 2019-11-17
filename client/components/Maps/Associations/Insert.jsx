/// Sys - AutoForm
import Insert from "@imports/ui/crud/Insert";
/// Sys - AutoForm --

/// Custom - AutoForm - collection
import { Maps_Associations_Collection } from "@imports/api/Maps/Associations_Collection";
console.assert(Maps_Associations_Collection, "Maps_Associations_Collection is undefined.");
/// Custom - AutoForm - collection --

/// Sys - Role
import { checkSystemRole, checkAppRole } from "@imports/ui/crud/checkRole";
/// Sys - Role --

/// Custom - Role - check permission
/**
 *
 *
 * @param {*} mode
 * @returns
 */
export const Maps_Associations_Insert_ComponentInfo = mode => {
  if (!checkAppRole("Maps.Associations", mode)) {
    return null;
  }

  if (checkSystemRole()) {
    return null;
  }

  return { title: "Maps/Associations/Insert", path: "/Maps/Associations/Insert" };
};
/// Custom - Role - check permission --

/**
 *
 *
 * @export
 * @class Maps_Associations_Insert
 * @extends {Insert}
 */
export class Maps_Associations_Insert extends Insert {
  "use strict";

  /**
   *Creates an instance of Maps_Associations_Insert.
   * @param {*} props
   * @memberof Maps_Associations_Insert
   */
  constructor(props) {
    super(props);
    /// Custom - Role - check permission
    this.ComponentInfo = Maps_Associations_Insert_ComponentInfo;
    /// Custom - Role - check permission --

    /// Custom - AutoForm - rebuild field
    this.Collection = Maps_Associations_Collection;
    this.Form_name = this.Collection._name;
    /// Custom - AutoForm - rebuild field --

    /// Sys - AutoForm - rebuild field
    this.postConstructor();
    /// Sys - AutoForm - rebuild field --
  }
}
