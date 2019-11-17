"use strict";

/// Sys - AutoForm - rebuild field
/**
 *
 *
 * @param {string} str1
 * @param {string} str2
 * @returns
 */
function diffString(str1, str2) {
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
/// Sys - AutoForm - rebuild field --

/// Sys - AutoForm - rebuild field
// Form_name: form name
// key: model field key
/**
 *
 *
 * @param {string} Form_name
 * @param {string} changeValueKey
 * @returns
 */
export const rebuildField = (Form_name, changeValueKey) => {
  if (!Form_name) return;
  if (!window.$GLOBAL$.formRef[Form_name]) return;
  if (!window.$GLOBAL$.formRef[Form_name].props) return;

  // generate Schema field changeValueKey from Model value changeValueKey
  const changeValueSchemaKey = changeValueKey
    .replace(/\.\d+\./, ".$.")
    .replace(/\.\d+$/, ".$");

  // Find Schema field definitions
  Object.keys(window.$GLOBAL$.formRef[Form_name].props.schema._schema).forEach(
    fieldNameInSchemaDefs => {
      const fieldInSchemaDefs =
        window.$GLOBAL$.formRef[Form_name].props.schema._schema[
          fieldNameInSchemaDefs
        ];

      // Uniforms definitions
      if (
        "uniforms" in fieldInSchemaDefs &&
        "onChangeValue" in fieldInSchemaDefs.uniforms
      ) {
        if (fieldNameInSchemaDefs == changeValueSchemaKey) {
          const field =
            window.$GLOBAL$.fields[Form_name + ":" + changeValueKey];
          if (field) {
            setTimeout(() => {
              fieldInSchemaDefs.uniforms.onChangeValue(field);
            });
          }
        }
      }

      if (
        "uniforms" in fieldInSchemaDefs &&
        "triggerField" in fieldInSchemaDefs.uniforms
      ) {
        // find tirgger field
        const changeValueSchemaKeyShort = changeValueSchemaKey
          .split(".")
          .slice(-1)[0];

        if (
          fieldInSchemaDefs.uniforms.triggerField.includes(
            changeValueSchemaKey
          ) ||
          fieldInSchemaDefs.uniforms.triggerField.includes(
            changeValueSchemaKeyShort
          )
        ) {
          // generate rebuild field changeValueKey
          const [diffStrOld, diffStrNew] = diffString(
            changeValueSchemaKey,
            fieldNameInSchemaDefs
          );
          const rebuildFieldName = changeValueKey.replace(
            diffStrOld,
            diffStrNew
          );

          // do field calc function
          if ("calc" in fieldInSchemaDefs.uniforms) {
            const field =
              window.$GLOBAL$.fields[Form_name + ":" + rebuildFieldName];

            if (field) {
              setTimeout(() => {
                fieldInSchemaDefs.uniforms.calc(field);
              });
            }
          }

          // do field options function
          if ("options" in fieldInSchemaDefs.uniforms) {
            // current form field
            const field =
              window.$GLOBAL$.fields[Form_name + ":" + rebuildFieldName];

            if (field) {
              // refresh field
              const xx_value = -1234567890;
              const v = field.findValue(rebuildFieldName);
              if (field.fieldType === Array) {
                if (Array.isArray(v) && v.includes(xx_value)) {
                  return;
                }
              } else {
                if (v == xx_value) {
                  return;
                }
              }

              if (field.fieldType === Array) {
                field.onChange([xx_value]);
              } else {
                field.onChange(xx_value);
              }

              setTimeout(() => {
                field.onChange(v);
              }, 30);
            }
          }
        }
      }
    }
  );
};
/// Sys - AutoForm - rebuild field --

/// Sys - AutoForm - rebuild form
/**
 *
 *
 * @param {string} Form_name
 * @param {string} str
 * @param {*} obj
 */
function deepMap(Form_name, str, obj) {
  Object.keys(obj).forEach(function(k) {
    rebuildField(Form_name, (str + "." + k).slice(1));
    if (obj[k] !== null && typeof obj[k] === "object") {
      deepMap(Form_name, str + "." + k, obj[k]);
    }
  });
}

/**
 *
 *
 * @param {string} Form_name
 * @param {*} model
 */
export const rebuildForm = (Form_name, model) => {
  deepMap(Form_name, "", model);
};
/// Sys - AutoForm - rebuild form --
