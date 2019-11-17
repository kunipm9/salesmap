/// Sys - AutoForm
import Insert from "@imports/ui/crud/Insert";
/// Sys - AutoForm --

/// Custom - AutoForm - collection
import { Maps_Tags_Collection } from "@imports/api/Maps/Tags_Collection";
console.assert(Maps_Tags_Collection, "Maps_Tags_Collection is undefined.");
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
export const Maps_Tags_Insert_ComponentInfo = mode => {
  if (!checkAppRole("Maps.Tags", mode)) {
    return null;
  }

  if (checkSystemRole()) {
    return null;
  }

  return { title: "Maps/Tags/Insert", path: "/Maps/Tags/Insert" };
};
/// Custom - Role - check permission --

/**
 *
 *
 * @export
 * @class Maps_Tags_Insert
 * @extends {Insert}
 */
export class Maps_Tags_Insert extends Insert {
  "use strict";

  /**
   *Creates an instance of Maps_Tags_Insert.
   * @param {*} props
   * @memberof Maps_Tags_Insert
   */
  constructor(props) {
    super(props);
    /// Custom - Role - check permission
    this.ComponentInfo = Maps_Tags_Insert_ComponentInfo;
    /// Custom - Role - check permission --

    /// Custom - AutoForm - rebuild field
    this.Collection = Maps_Tags_Collection;
    this.Form_name = this.Collection._name;
    /// Custom - AutoForm - rebuild field --

    /// Sys - AutoForm - rebuild field
    this.postConstructor();
    /// Sys - AutoForm - rebuild field --
  }
}
