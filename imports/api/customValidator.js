/// System - AutoForm - validation
import { Meteor } from "meteor/meteor";
import { Session } from "meteor/session";
/// System - AutoForm - validation --

/// System - AutoForm - validation
/**
 *
 *
 * @param {*} str1
 * @param {*} str2
 * @returns
 */
function diffString(str1, str2) {
  "use strict";

  str1 = str1.split(".");
  str2 = str2.split(".");

  for (let i = 1; i <= str1.length; i++) {
    if (str1[i] != str2[i]) {
      return [str1.slice(i).join("."), str2.slice(i).join(".")];
    }
  }

  const oldStr = str1.slice(str1.length).join(".") || str1;
  const newStr = str2.slice(str1.length).join(".") || str2;

  return [oldStr, newStr];
}

/**
 *
 *
 * @export
 * @param {*} customErrors
 * @param {*} CollectionName
 * @param {*} schemaField
 * @returns
 */
export function customValidatorCheckOtherEmails(
  customErrors,
  CollectionName,
  schemaField
) {
  "use strict";

  if (!Meteor.isClient) {
    return;
  }

  if (schemaField.key in customErrors) {
    if (customErrors[schemaField.key].value == schemaField.value) {
      return customErrors[schemaField.key].error;
    }
  }

  delete customErrors[schemaField.key];
  const field = window.$GLOBAL$.fields[CollectionName + ":" + schemaField.key];
  const _id = schemaField.field("_id").value;

  Meteor.call(
    "Users_Users.checkOtherEmails",
    Session.get("Users_Groups_id"),
    _id,
    schemaField.value,
    (err, users) => {
      if (err) {
        customErrors[schemaField.key] = {
          error: "notAllowed",
          value: schemaField.value
        };
        field.onChange("");
        setTimeout(() => {
          field.onChange(schemaField.value);
        });
      } else {
        if (users.length > 0) {
          // show error
          customErrors[schemaField.key] = {
            error: "alreadyExists",
            value: schemaField.value
          };
          field.onChange("");
          setTimeout(() => {
            field.onChange(schemaField.value);
          });

          if (_id) {
            // set username
            const field_username =
              window.$GLOBAL$.fields[CollectionName + ":" + "username"];
            field_username.onChange(users[0].profile.username);
          }
        }
      }
    }
  );
}

/**
 *
 *
 * @export
 * @param {*} Collection
 * @param {*} fieldName
 * @param {*} schemaField
 * @returns
 */
export function customValidatorCheckExistsRecord(
  Collection,
  fieldName,
  schemaField
) {
  "use strict";

  if (!Meteor.isClient) {
    return;
  }

  const cond = {
    _id: { $ne: schemaField.field("_id").value },
    [fieldName]: schemaField.value
  };

  /// Sys - Collection -  soft delete
  if ("_deleted" in Collection.simpleSchema()._schema) {
    cond._deleted = null;
  }
  /// Sys - Collection -  soft delete --

  if (Collection.find(cond).count() > 0) {
    return "alreadyExists";
  }
}

/**
 *
 *
 * @export
 * @param {*} Collection
 * @param {*} fieldName
 * @param {*} schemaField
 * @returns
 */
export function customValidatorCheckExistsRecordInUserGroup(
  Collection,
  fieldName,
  schemaField
) {
  "use strict";

  if (!Meteor.isClient) {
    return;
  }

  const cond = {
    _id: { $ne: schemaField.field("_id").value },
    Users_Groups_id: Session.get("Users_Groups_id"),
    [fieldName]: schemaField.value
  };

  /// Sys - Collection -  soft delete
  if ("_deleted" in Collection.simpleSchema()._schema) {
    cond._deleted = null;
  }
  /// Sys - Collection -  soft delete --

  if (Collection.find(cond).count() > 0) {
    return "alreadyExists";
  }
}

/**
 *
 *
 * @export
 * @param {*} schemaField
 * @returns
 */
export function customValidatorCheckDuplicateValueInArrayField(schemaField) {
  "use strict";

  if (!Meteor.isClient) {
    return;
  }

  const tmp = diffString(schemaField.genericKey, schemaField.key);
  if (!tmp[0]) {
    return;
  }
  const arrayName = schemaField.genericKey.replace(tmp[0], "");
  const dollar = tmp[0].replace(/\..*/, "");
  const currentNo = tmp[1].replace(/\..*/, "");
  const suffix = tmp[0].substr(dollar.length);
  let duplicate = false;
  for (let i = 0; i < currentNo; i++) {
    const value = schemaField.field(arrayName + i + suffix).value;
    if (schemaField.value == value) {
      duplicate = true;
    }
  }

  if (duplicate) {
    return "duplicate";
  }
}
/// System - AutoForm - validation --
