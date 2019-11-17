import BaseField from "uniforms/BaseField";
import invariant from "invariant";
import { createElement } from "react";

import NumField from "uniforms-bootstrap4/NumField";
import BoolField from "./styled/BoolField";
import DateField from "./styled/DateField";
import ListField from "./sortableList/ListField";
import ListFieldFixed from "./fixedList/ListField";
import NestField from "./NestField";
import TextField from "./TextField";
import RadioField from "./styled/RadioField";
import SelectField from "./styled/SelectField";

/**
 *
 *
 * @export
 * @class AutoField
 * @extends {BaseField}
 */
export default class AutoField extends BaseField {
  static displayName = "AutoField";

  /**
   *
   *
   * @returns
   * @memberof AutoField
   */
  getChildContextName() {
    return this.context.uniforms.name;
  }

  /**
   *
   *
   * @returns
   * @memberof AutoField
   */
  render() {
    const props = this.getFieldProps(undefined, { ensureValue: false });

    if (props.component === undefined) {
      if (props.allowedValues) {
        if (props.checkboxes && props.fieldType !== Array) {
          props.component = RadioField;
        } else {
          props.component = SelectField;
        }
      } else {
        switch (props.fieldType) {
          case Date:
            props.component = DateField;
            break;
          case Array:
            if (props.fixed) {
              props.component = ListFieldFixed;
            } else {
              props.component = ListField;
            }
            break;
          case Number:
            props.component = NumField;
            break;
          case Object:
            props.component = NestField;
            break;
          case String:
            props.component = TextField;
            break;
          case Boolean:
            props.component = BoolField;
            break;
        }

        invariant(
          props.component,
          "Unsupported field type: %s",
          props.fieldType.toString()
        );
      }
    }

    return createElement(props.component, this.props);
  }
}
