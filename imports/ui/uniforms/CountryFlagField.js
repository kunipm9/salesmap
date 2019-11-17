import React from "react";
import classnames from "classnames";
import connectField from "uniforms/connectField";

import ReactFlagsSelect from "./lib/react-flags-select";

if (Meteor.isClient) {
  require("./lib/react-flags-select/react-flags-select.css");
}

import wrapField from "uniforms-bootstrap4/wrapField";

/**
 *
 *
 * @param {*} props
 * @returns
 */
const renderSelect = props => {
  return (
    <ReactFlagsSelect
      className={classnames(props.inputClassName, "form-control", {
        "form-control-danger": props.error
      })}
      disabled={props.disabled}
      id={props.id}
      name={props.name}
      onSelect={val => props.onChange(val)}
      ref={props.inputRef}
      defaultCountry={props.value}
      searchable={true}
      searchPlaceholder="Search for a country"
    />
  );
};

/**
 *
 *
 * @param {*} props
 * @returns
 */
const wSelect = props => {
  return wrapField(props, renderSelect(props));
};
export default connectField(wSelect);
