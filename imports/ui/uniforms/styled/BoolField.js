import React from "react";
import classnames from "classnames";
import connectField from "uniforms/connectField";

import wrapField from "uniforms-bootstrap4/wrapField";

/**
 *
 *
 * @param {*} props
 * @returns
 */
const checkboxColorBool = props => {
  if (!props.field.uniforms) {
    return "checkbox-primary";
  }
  const opts = props.field.uniforms.options;
  if (opts && opts.color) {
    return opts.color;
  } else {
    return "checkbox-primary";
  }
};

/**
 *
 *
 * @param {*} {label, labelBefore, ...props}
 */
const Bool = ({ label, labelBefore, ...props }) =>
  wrapField(
    { label: labelBefore, ...props },
    <div
      className={classnames(
        props.inputClassName,
        "checkbox",
        checkboxColorBool(props),
        {
          "text-danger": props.error,
          "custom-control-inline": props.inline
        }
      )}
    >
      <input
        checked={props.value}
        className="styled"
        disabled={props.disabled}
        id={props.id}
        name={props.name}
        onChange={() => props.onChange(!props.value)}
        ref={props.inputRef}
        type="checkbox"
      />
      <label htmlFor={props.id} className="form-check-label">
        {label}
      </label>
    </div>
  );
export default connectField(Bool);
