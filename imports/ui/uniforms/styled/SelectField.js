import React from "react";
import Select, { components } from "react-select";
import classnames from "classnames";
import connectField from "uniforms/connectField";

import wrapField from "uniforms-bootstrap4/wrapField";

/**
 *
 *
 * @param {*} item
 * @param {*} array
 * @returns
 */
const xor = (item, array) => {
  const index = array.indexOf(item);
  if (index === -1) {
    return array.concat([item]);
  }

  return array.slice(0, index).concat(array.slice(index + 1));
};

/**
 *
 *
 * @param {*} options
 * @param {*} item
 * @returns
 */
const checkboxColorCheckboxes = (options, item) => {
  const opts = options.filter(opt => opt.value == item);
  if (opts.length > 0 && opts[0].color) {
    return opts[0].color;
  }
  return "checkbox-primary";
};

/**
 *
 *
 * @param {*} options
 * @param {*} item
 * @returns
 */
const getType = (options, item) => {
  const opts = options.filter(opt => opt.value == item);
  if (opts.length > 0 && opts[0].type) {
    return opts[0].type;
  }
  return null;
};

/**
 *
 *
 * @param {*} props
 * @param {*} item
 * @param {*} options
 */
const changeCheckbox = (props, item, options) => {
  let valueTypeAll = null;
  for (let i in props.allowedValues) {
    if (getType(options, props.allowedValues[i]) === "all") {
      valueTypeAll = props.allowedValues[i];
      break;
    }
  }

  if (getType(options, item) === "all") {
    if (props.value && props.value.indexOf(item) != -1) {
      props.onChange(props.fieldType === Array ? [] : item);
    } else {
      props.onChange(props.fieldType === Array ? props.allowedValues : item);
    }
  } else {
    if (props.fieldType === Array) {
      let newValue = xor(item, props.value);
      if (valueTypeAll) {
        newValue = newValue.filter(v => v != valueTypeAll);
        if (newValue.length === props.allowedValues.length - 1) {
          newValue.push(valueTypeAll);
        }
      }
      props.onChange(newValue);
    } else {
      props.onChange(item);
    }
  }
};

/**
 *
 *
 * @param {*} props
 * @returns
 */
const renderCheckboxes = props => {
  let options = props.options;
  if (typeof options === "function") {
    options = options(props);
  }
  return props.allowedValues.map(item => (
    <div
      key={item}
      className={classnames(
        props.inputClassName,
        `checkbox`,
        checkboxColorCheckboxes(options, item),
        {
          "custom-control-inline": props.inline
        }
      )}
    >
      <input
        className={classnames(`styled`, `col-12`)}
        checked={
          props.fieldType === Array
            ? props.value.includes(item)
            : props.value === item
        }
        disabled={props.disabled}
        id={`${props.id}-${item}`}
        name={props.name}
        onChange={() => changeCheckbox(props, item, options)}
        type="checkbox"
      />
      <label htmlFor={`${props.id}-${item}`}>
        {props.transform ? props.transform(item) : item}
      </label>
    </div>
  ));
};

/**
 *
 *
 * @param {*} { children, ...props }
 */
const SingleValue = ({ children, ...props }) => (
  <components.SingleValue {...props}>
    <span dangerouslySetInnerHTML={{ __html: children }} />
  </components.SingleValue>
);

/**
 *
 *
 * @param {*} props
 * @returns
 */
const renderSelect = props => {
  let isValidAllowedValues = true;
  let options = props.allowedValues.map(value => {
    if (!value) {
      isValidAllowedValues = false;
    }
    const label = props.transform ? props.transform(value) : value;
    return { value: value, label: label };
  });
  if (!isValidAllowedValues) {
    options = props.options;
  }

  let value = null;
  let values = options.filter(opt => opt.value == props.value);
  if (options.length > 0 && options[0].options) {
    options.map(function(a) {
      a.options.map(function(b) {
        if (b.value === props.value) {
          values = [b];
        }
      });
    });
  }
  if (values.length > 0) {
    value = values[0];
  }

  const brandColor = "#66afe9";

  const customStyles = {
    control: (base, state) => {
      var borderColor = base.borderColor;
      if (props.error) {
        borderColor = "#dc3545";
      }
      return {
        ...base,
        boxShadow: state.isFocused ? 0 : 0,
        borderColor: state.isFocused ? brandColor : borderColor,
        "&:hover": {
          borderColor: state.isFocused ? brandColor : borderColor
        }
      };
    },
    // eslint-disable-next-line no-unused-vars
    menu: (base, state) => ({
      ...base,
      boxShadow:
        "0 0 0 1px hsla(0, 0%, 0%, 0.1), 0 4px 11px hsla(0, 0%, 0%, 0.6)"
    }),
    // eslint-disable-next-line no-unused-vars
    menuList: (base, state) => ({
      ...base,
      padding: "0"
    }),
    // eslint-disable-next-line no-unused-vars
    option: (base, state) => ({
      ...base,
      padding: "4px 10px"
    })
  };

  return (
    <Select
      styles={customStyles}
      className={classnames(props.inputClassName, "form-control", {
        "form-control-danger": props.error
      })}
      disabled={props.disabled}
      id={props.id}
      name={props.name}
      onChange={option => props.onChange(option.value)}
      ref={props.inputRef}
      value={value}
      components={{ SingleValue }}
      options={options}
      placeholder={props.placeholder}
      defaultMenuIsOpen={props.defaultMenuIsOpen}
      menuIsOpen={props.menuIsOpen}
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
  const divStyle = {
    "-webkit-box-shadow": "none",
    "-webkit-transition": "none",
    "-o-transition": "none",
    transition: "none",
    border: "none",
    padding: "0",
    "box-shadow": "none",
    "margin-bottom": "4px"
  };
  $("#" + props.id).css(divStyle);
  setTimeout(function() {
    $("#" + props.id).css(divStyle);
  });

  $("#" + props.id + " > div > div").css({
    "border-color": "#66afe9"
  });

  if (props.checkboxes || props.fieldType === Array) {
    return wrapField(props, renderCheckboxes(props));
  } else {
    return wrapField(props, renderSelect(props));
  }
};
export default connectField(wSelect);
