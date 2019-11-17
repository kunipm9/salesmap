"use strict";

/// Sys - AutoForm - onBlur field
// Form_name: form name
// key: model field key
/**
 *
 *
 * @param {*} onBlurFieldKey
 * @returns
 */
export const onBlur = onBlurFieldKey => {
  const Form_name = window.$GLOBAL$.changingFormName;

  if (!Form_name) return;
  if (!window.$GLOBAL$.formRef[Form_name]) return;
  if (!window.$GLOBAL$.formRef[Form_name].props) return;

  // generate Schema field onBlurFieldKey from Model value onBlurFieldKey
  const onBlurSchemaKey = onBlurFieldKey
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
        "onBlur" in fieldInSchemaDefs.uniforms
      ) {
        if (fieldNameInSchemaDefs == onBlurSchemaKey) {
          const field =
            window.$GLOBAL$.fields[Form_name + ":" + onBlurFieldKey];
          if (field) {
            setTimeout(() => {
              fieldInSchemaDefs.uniforms.onBlur(field);
            });
          }
        }
      }
    }
  );
};
/// Sys - AutoForm - rebuild field --
