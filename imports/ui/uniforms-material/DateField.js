import React from 'react';
import TextField from '@material-ui/core/TextField';
import connectField from 'uniforms/connectField';
import filterDOMProps from 'uniforms/filterDOMProps';
import moment from "moment";
moment.locale("ja");
import { onBlur } from "./onBlur";

const DateConstructor = (typeof global === 'object' ? global : window).Date;
const dateFormat = value => {
  if (value) {
    // const vn = moment(value).format("YYYY/MM/DDT00:00:00");
    const vn = moment(value).format("YYYY-MM-DD");
    return vn;
  }
  return "";
}
const dateParse = (timestamp, onChange) => {
  const date = new DateConstructor(timestamp);
  if (date.getFullYear() < 10000) {
    onChange(date);
  } else if (isNaN(timestamp)) {
    onChange(undefined);
  }
};

const Date = ({
  InputLabelProps,
  disabled,
  error,
  errorMessage,
  helperText,
  inputRef,
  label,
  labelProps,
  name,
  onChange,
  placeholder,
  showInlineError,
  value,
  ...props
}) => (
  <TextField
    disabled={!!disabled}
    error={!!error}
    helperText={(error && showInlineError && errorMessage) || helperText}
    label={label}
    InputLabelProps={{shrink:true, ...labelProps, ...InputLabelProps}}
    name={name}
    onChange={event => disabled || dateParse(event.target.valueAsNumber, onChange)}
    onBlur={() => onBlur(name)}
    placeholder={placeholder}
    ref={inputRef}
    type="date"
    value={dateFormat(value)}
    InputProps={{className: "mui-TextField-custom", inputProps: {max: props.max} }}
    style={{marginBottom: '20px'}}
    {...filterDOMProps(props)}
  />
);

Date.defaultProps = {
  fullWidth: true,
  margin: 'dense'
};

export default connectField(Date);
