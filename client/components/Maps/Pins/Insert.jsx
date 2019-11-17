/// Sys - AutoForm
import Insert from "@imports/ui/crud/Insert";
/// Sys - AutoForm --

/// Custom - AutoForm - collection
import { Maps_Pins_Collection } from "@imports/api/Maps/Pins_Collection";
console.assert(Maps_Pins_Collection, "Maps_Pins_Collection is undefined.");
/// Custom - AutoForm - collection --

/// Custom - LocalStorage
import { Maps_PinsSum_Collection } from "@imports/api/Maps/PinsSum_Collection";
/// Custom - LocalStorage --

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
export const Maps_Pins_Insert_ComponentInfo = mode => {
  if (!checkAppRole("Maps.Pins", mode)) {
    return null;
  }

  if (checkSystemRole()) {
    return null;
  }

  return { title: "Maps/Pins/Insert", path: "/Maps/Pins/Insert" };
};
/// Custom - Role - check permission --

/**
 *
 *
 * @export
 * @class Maps_Pins_Insert
 * @extends {Insert}
 */
export class Maps_Pins_Insert extends Insert {
  "use strict";

  /**
   *Creates an instance of Maps_Pins_Insert.
   * @param {*} props
   * @memberof Maps_Pins_Insert
   */
  constructor(props) {
    super(props);
    /// Custom - Role - check permission
    this.ComponentInfo = Maps_Pins_Insert_ComponentInfo;
    /// Custom - Role - check permission --

    /// Custom - LocalStorage
    /// Custom - AutoForm - rebuild field
    this.Collection = {
      _name: "Maps_Pins",
      docs: {},
      simpleSchema: Maps_Pins_Collection.simpleSchema(),
      dispTitle: Maps_Pins_Collection.dispTitle
    };
    this.Form_name = this.Collection._name;
    /// Custom - AutoForm - rebuild field --
    this.SumCollection = Maps_PinsSum_Collection;
    /** @type {any[]} */
    this.CollectionList = [];
    /// Custom - LocalStorage --

    /// Sys - AutoForm - rebuild field
    this.postConstructor();
    /// Sys - AutoForm - rebuild field --
  }
}
