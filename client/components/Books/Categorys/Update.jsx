/// Sys - AutoForm
import Update from "@imports/ui/crud/Update";
/// Sys - AutoForm --

/// Custom - AutoForm - collection
import { Books_Categorys_Collection } from "@imports/api/Books/Categorys_Collection";
console.assert(
  Books_Categorys_Collection,
  "Books_Categorys_Insert_ComponentInfo is undefined."
);
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
export const Books_Categorys_Update_ComponentInfo = mode => {
  if (!checkAppRole("Books.Categorys", mode)) {
    return null;
  }

  if (checkSystemRole()) {
    return null;
  }

  return { title: "Books/Books/Update", path: "/Books/Books/Update" };
};
/// Custom - Role - check permission --

/**
 *
 *
 * @export
 * @class Books_Categorys_Update
 * @extends {Update}
 */
export class Books_Categorys_Update extends Update {
  "use strict";

  /**
   *Creates an instance of Books_Categorys_Update.
   * @param {*} props
   * @memberof Books_Categorys_Update
   */
  constructor(props) {
    super(props);

    /// Custom - Role - check permission
    this.ComponentInfo = Books_Categorys_Update_ComponentInfo;
    /// Custom - Role - check permission --

    /// Custom - AutoForm - rebuild field
    this.Collection = Books_Categorys_Collection;
    this.Form_name = this.Collection._name;
    /// Custom - AutoForm - rebuild field --

    /// Sys - AutoForm - rebuild field
    this.postConstructor();
    /// Sys - AutoForm - rebuild field --
  }
}
