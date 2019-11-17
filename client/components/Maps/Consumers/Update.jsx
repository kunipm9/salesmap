/// Sys - AutoForm
import Update from "@imports/ui/crud/Update";
/// Sys - AutoForm --

/// Custom - AutoForm - collection
import { Maps_Consumers_Collection } from "@imports/api/Maps/Consumers_Collection";
console.assert(
  Maps_Consumers_Collection,
  "Maps_Consumers_Collection is undefined."
);
/// Custom - AutoForm - collection --

/// Custom - LocalStorage
import { Maps_ConsumersSum_Collection } from "@imports/api/Maps/ConsumersSum_Collection";
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
export const Maps_Consumers_Update_ComponentInfo = mode => {
  if (!checkAppRole("Maps.Consumers", mode)) {
    return null;
  }

  if (checkSystemRole()) {
    return null;
  }

  return { title: "Maps/Consumers/Update", path: "/Maps/Consumers/Update" };
};
/// Custom - Role - check permission --

/**
 *
 *
 * @export
 * @class Maps_Consumers_Update
 * @extends {Update}
 */
export class Maps_Consumers_Update extends Update {
  "use strict";

  /**
   *Creates an instance of Maps_Consumers_Update.
   * @param {*} props
   * @memberof Maps_Consumers_Update
   */
  constructor(props) {
    super(props);

    /// Custom - Role - check permission
    this.ComponentInfo = Maps_Consumers_Update_ComponentInfo;
    /// Custom - Role - check permission --

    /// Custom - LocalStorage
    /// Custom - AutoForm - rebuild field
    this.Collection = {
      _name: "Maps_Consumers",
      docs: {},
      simpleSchema: Maps_Consumers_Collection.simpleSchema(),
      dispTitle: Maps_Consumers_Collection.dispTitle
    };
    this.Form_name = this.Collection._name;
    /// Custom - AutoForm - rebuild field --
    this.SumCollection = Maps_ConsumersSum_Collection;
    /** @type {any[]} */
    this.CollectionList = [];
    /// Custom - LocalStorage --

    /// Sys - AutoForm - rebuild field
    this.postConstructor();
    /// Sys - AutoForm - rebuild field --
  }
}
