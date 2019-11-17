import React from 'react';
import TextField from '@material-ui/core/TextField';
import connectField from 'uniforms/connectField';
import filterDOMProps from 'uniforms/filterDOMProps';
import { onBlur } from "./onBlur";

const Text = ({
  disabled,
  error,
  errorMessage,
  helperText,
  inputRef,
  label,
  name,
  onChange,
  placeholder,
  showInlineError,
  type,
  value,
  ...props
}) => (
  <TextField
    disabled={!!disabled}
    error={!!error}
    helperText={(error && showInlineError && errorMessage) || helperText}
    label={label}
    name={name}
    onChange={event => disabled || onChange(event.target.value)}
    onBlur={() => onBlur(name)}
    placeholder={placeholder}
    ref={inputRef}
    type={type}
    value={value}
    InputProps={{className: "mui-TextField-custom"}}
    style={{marginBottom: '20px'}}
    {...filterDOMProps(props)}
  />
);
Text.defaultProps = {
  fullWidth: true,
  margin: 'dense',
  type: 'text'
};

export default connectField(Text);
