/// Sys - AutoForm
import Insert from "@imports/ui/crud/Insert";
/// Sys - AutoForm --

/// Custom - AutoForm - collection
import { Maps_Companys_Collection } from "@imports/api/Maps/Companys_Collection";
console.assert(Maps_Companys_Collection, "Maps_Companys_Collection is undefined.");
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
export const Maps_Companys_Insert_ComponentInfo = mode => {
  if (!checkAppRole("Maps.Companys", mode)) {
    return null;
  }

  if (checkSystemRole()) {
    return null;
  }

  return { title: "Maps/Companys/Insert", path: "/Maps/Companys/Insert" };
};
/// Custom - Role - check permission --

/**
 *
 *
 * @export
 * @class Maps_Companys_Insert
 * @extends {Insert}
 */
export class Maps_Companys_Insert extends Insert {
  "use strict";

  /**
   *Creates an instance of Maps_Companys_Insert.
   * @param {*} props
   * @memberof Maps_Companys_Insert
   */
  constructor(props) {
    super(props);
    /// Custom - Role - check permission
    this.ComponentInfo = Maps_Companys_Insert_ComponentInfo;
    /// Custom - Role - check permission --

    /// Custom - AutoForm - rebuild field
    this.Collection = Maps_Companys_Collection;
    this.Form_name = this.Collection._name;
    /// Custom - AutoForm - rebuild field --

    /// Sys - AutoForm - rebuild field
    this.postConstructor();
    /// Sys - AutoForm - rebuild field --
  }
}
