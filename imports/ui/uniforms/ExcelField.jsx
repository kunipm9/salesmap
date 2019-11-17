/// Sys - AutoForm - collection excel
import React from "react";
import connectField from "uniforms/connectField";
import wrapField from "uniforms-bootstrap4/wrapField";
import { ExcelView } from "@imports/ui/utils/ExcelView";

/**
 *
 *
 * @param {*} props
 * @returns
 */
function divField(props) {
  return (
    <ExcelView
      value={props.value}
      disabled={props.disabled}
      style={props.style}
      onChange={props.onChange}
    />
  );
}

/**
 *
 *
 * @param {*} props
 * @returns
 */
const ExcelField_ = props => {
  const props_ = $.extend(true, {}, props);
  props_.disabled = false;
  return wrapField(props_, divField(props));
};
export default connectField(ExcelField_);
/// Sys - AutoForm - collection excel --
