import BaseField from "uniforms/BaseField";
import nothing from "uniforms/nothing";

/**
 *
 *
 * @export
 * @class HiddenField
 * @extends {BaseField}
 */
export default class HiddenField extends BaseField {
  static displayName = "NullField";

  /**
   *
   *
   * @returns
   * @memberof HiddenField
   */
  render() {
    return nothing;
  }
}
