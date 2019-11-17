
/// Sys - AutoForm
import Edit from '@imports/ui/crud/Edit';
/// Sys - AutoForm --

/// Custom - AutoForm - collection
import { Books_Languages_Collection } from '@imports/api/Books/Languages_Collection';
console.assert(Books_Languages_Collection, "Books_Languages_Collection is undefined.");
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
export const Books_Languages_Edit_ComponentInfo = (mode) => {
  if (! checkAppRole('Books.Languages', mode)) {
    return null;
  }

  if (checkSystemRole()) {
    return null;
  }

  /// Application
  return {title: 'Books/Languages/Edit', path: '/Books/Languages/Edit'};
  /// Application --
}
/// Custom - Role - check permission --


/**
 *
 *
 * @export
 * @class Books_Languages_Edit
 * @extends {Edit}
 */
export class Books_Languages_Edit extends Edit {

  "use strict";

  /**
   *Creates an instance of Books_Languages_Edit.
   * @param {*} props
   * @memberof Books_Languages_Edit
   */
  constructor(props) {
    super(props);

    /// Custom - Role - check permission
    this.ComponentInfo = Books_Languages_Edit_ComponentInfo;
    /// Custom - Role - check permission --

    /// Custom - AutoForm - rebuild field
    this.Collection = Books_Languages_Collection;
    this.Form_name = this.Collection._name;
    /// Custom - AutoForm - rebuild field --

    /// Application - AutoForm - initial value
    this.initialValue = {
      languages: [
        {language: 'JP'},
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
