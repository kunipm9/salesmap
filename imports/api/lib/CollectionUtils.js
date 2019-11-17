const _ = require("lodash");
const escapeHtml = require("escape-html");

/// Sys - Collection - soft delete
/**
 *
 *
 * @param {*} _deleted
 * @param {*} title
 * @returns
 */
export const displayTitle = (_deleted, title) => {
  "use strict";

  if (_deleted) {
    return (
      '<i class="fa fa-trash" aria-hidden="true"></i> <span style="color: #f00; text-decoration: line-through;"><span style="color: #000;">' +
      escapeHtml(title) +
      "</span></span>"
    );
    // return '&#x1f6ae; ' + this.title;
    // return 'deleted -- ' + this.title;
  } else {
    return title;
  }
};
/// Sys - Collection - soft delete --

/// Sys - AutoForm - rebuild field
/**
 *
 *
 * @returns
 */
export const getCurrentFormName = () => {
  "use strict";

  return window.$GLOBAL$.changingFormName;
};
/// Sys - AutoForm - rebuild field --

/// Sys - AutoForm - rebuild field
/**
 *
 *
 * @returns
 */
export const setCurrentFormName = formName => {
  "use strict";

  window.$GLOBAL$.changingFormName = formName;
};
/// Sys - AutoForm - rebuild field --

/// Sys - AutoForm - rebuild field
/**
 *
 *
 * @param {*} fieldName
 * @returns
 */
export const getField = fieldName => {
  "use strict";

  const formName = getCurrentFormName();
  return window.$GLOBAL$.fields[formName + ":" + fieldName];
};
/// Sys - AutoForm - rebuild field --

/// Sys - AutoForm - rebuild field
/**
 *
 *
 * @param {*} formName
 * @returns
 */
export const checkFormState = formName => {
  "use strict";

  if (!(formName in window.$GLOBAL$.formRef)) {
    return false;
    // throw `Form:${formName} is not defined.`;
  }
  const form = window.$GLOBAL$.formRef[formName];
  if (form == "init" || !form) {
    return false;
  }
  return true;
};
/// Sys - AutoForm - rebuild field --

/// Sys - AutoForm - rebuild field
/**
 *
 *
 * @param {*} fieldFullPath
 * @returns
 */
export const getSchemaFieldName = fieldFullPath => {
  let tmp = fieldFullPath.split(".");
  for (let i = 0; i < tmp.length; i++) {
    if (!isNaN(tmp[i])) {
      tmp[i] = "$";
    }
  }
  tmp = tmp.join(".");
  return tmp;
};
/// Sys - AutoForm - rebuild field --

/// Sys - AutoForm - rebuild field
/**
 *
 *
 * @param {*} formName
 * @param {*} fieldFullPath
 * @returns
 */
export const checkFieldState = (formName, fieldFullPath) => {
  if (!(formName in window.$GLOBAL$.formRef)) {
    throw `Form:${formName} is not defined.`;
  }
  const form = window.$GLOBAL$.formRef[formName];
  if (form == "init" || !form) {
    throw `Form:${formName} is not ready.`;
  }

  const tmp = getSchemaFieldName(fieldFullPath);
  if (form.props.schema._schemaKeys.indexOf(tmp) == -1) {
    throw `Field: ${formName}/${fieldFullPath} is not defined.`;
  }
  return;
};
/// Sys - AutoForm - rebuild field

/// Sys - AutoForm - rebuild field
/**
 *
 *
 * @param {*} formName
 * @param {*} fieldName
 * @param {*} parentLevel
 * @param {*} fieldLeafeName
 * @returns
 */
export const generateFieldName = (
  formName,
  fieldName,
  parentLevel,
  fieldLeafeName
) => {
  "use strict";

  const formPaths = fieldName.split(".");
  formPaths.pop();
  if (formPaths.slice(-1)[0] == ".") {
    formPaths.pop();
  }

  while (parentLevel) {
    formPaths.pop();
    if (formPaths.slice(-1)[0] == ".") {
      formPaths.pop();
    }
    parentLevel--;
  }

  formPaths.push(fieldLeafeName);

  const fieldFullPath = formPaths.join(".");
  checkFieldState(formName, fieldFullPath);
  return fieldFullPath;
};
/// Sys - AutoForm - rebuild field --

/// Sys - AutoForm - rebuild field
/**
 *
 *
 * @param {*} formName
 * @param {*} fieldFullPath
 * @returns
 */
export const getFieldValue = (formName, fieldFullPath) => {
  "use strict";

  checkFieldState(formName, fieldFullPath);
  const form = window.$GLOBAL$.formRef[formName];
  const model = form.getModel();
  const fieldValue = _.get(model, fieldFullPath, null);
  return fieldValue;
};
/// Sys - AutoForm - rebuild field --

/// Sys - AutoForm - option label
/**
 *
 *
 * @param {*} Collection
 * @param {*} field
 * @param {*} value
 * @returns
 */
export const getOptionLabel = (Collection, field, value) => {
  let option = Collection._c2._simpleSchema._schema[
    field
  ].uniforms.options.filter(option => option.value == value);
  let label = "";
  if (option.length > 0) {
    label = option[0].label;
  }
  return label;
};
/// Sys - AutoForm - display option label --
