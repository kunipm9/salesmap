
/// Sys - AutoForm
import Edit from '@imports/ui/crud/Edit';
/// Sys - AutoForm --

/// Custom - AutoForm - collection
import { Maps_Ranks_Collection } from '@imports/api/Maps/Ranks_Collection';
console.assert(Maps_Ranks_Collection, "Maps_Ranks_Collection is undefined.");
/// Custom - AutoForm - collection --

/// Sys - Role
import { checkSystemRole, checkAppRole } from '@imports/ui/crud/checkRole';
/// Sys - Role --


/// Custom - Role - check permission
/**
 *
 *
 * @param {*} mode
 * @returns
 */
export const Maps_Ranks_Edit_ComponentInfo = (mode) => {
  if (!checkAppRole('Maps.Ranks', mode)) {
    return null;
  }

  if (checkSystemRole()) {
    return null;
  }

  /// Application
  return { title: 'Maps/Ranks/Edit', path: '/Maps/Ranks/Edit' };
  /// Application --
}
/// Custom - Role - check permission --


/**
 *
 *
 * @export
 * @class Maps_Ranks_Edit
 * @extends {Edit}
 */
export class Maps_Ranks_Edit extends Edit {

  "use strict";

  /**
   *Creates an instance of Maps_Ranks_Edit.
   * @param {*} props
   * @memberof Maps_Ranks_Edit
   */
  constructor(props) {
    super(props);

    /// Custom - Role - check permission
    this.ComponentInfo = Maps_Ranks_Edit_ComponentInfo;
    /// Custom - Role - check permission --

    /// Custom - AutoForm - rebuild field
    this.Collection = Maps_Ranks_Collection;
    this.Form_name = this.Collection._name;
    /// Custom - AutoForm - rebuild field --

    /// Application - AutoForm - initial value
    this.initialValue = {
      ranks: [
        { rank: 'S' },
        { rank: 'A' },
        { rank: 'B' },
        { rank: 'C' },
        { rank: 'D' },
      ],
    };
    /// Application - AutoForm - initial value --

    /// Custom - AutoForm - single record
    this.singleRecordKey = {};
    /// Custom - AutoForm - single record --

    /// Sys - AutoForm - rebuild field
    this.postConstructor();
    /// Sys - AutoForm - rebuild field --
  }

}
