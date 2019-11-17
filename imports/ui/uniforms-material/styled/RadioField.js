import React from "react";
import classnames from "classnames";
import connectField from "uniforms/connectField";

import wrapField from "uniforms-bootstrap4/wrapField";

/**
 *
 *
 * @param {*} props
 * @param {*} item
 * @returns
 */
const checkboxColorRadio = (props, item) => {
  if (!props.field.uniforms) {
    return "radio-primary";
  }
  let options = props.field.uniforms.options;
  if (typeof options === "function") {
    options = options(props);
  }

  const opts = options.filter(opt => opt.value == item);
  if (opts.length > 0 && opts[0].color) {
    return opts[0].color;
  } else {
    return "radio-primary";
  }
};

/**
 *
 *
 * @param {*} props
 */
const Radio = props =>
  wrapField(
    props,
    props.allowedValues.map(item => (
      <div
        key={item}
        className={classnames(
          props.inputClassName,
          "form-check",
          "radio",
          checkboxColorRadio(props, item),
          {
            "text-danger": props.error,
            "custom-control-inline": props.inline
          }
        )}
      >
        <input
          checked={item === props.value}
          className="form-check-input"
          disabled={props.disabled}
          id={`${props.id}-${item}`}
          name={props.name}
          onChange={() => props.onChange(item)}
          type="radio"
        />{" "}
        <label htmlFor={`${props.id}-${item}`} className="form-check-label">
          {props.transform ? props.transform(item) : item}
        </label>
      </div>
    ))
  );
export default connectField(Radio);
