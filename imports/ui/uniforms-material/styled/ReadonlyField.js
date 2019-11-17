import React from 'react';
import FormLabel from '@material-ui/core/FormLabel';
import connectField from 'uniforms/connectField';
import moment from "moment";
moment.locale("ja");

const _Readonly = (props) => {
  let value = props.value;
  let options = props.options;
  if (options) {
    if (typeof options == 'function') {
      options = options(props);
    }
    const opt = options.filter(o=>o.value == props.value);
    if (opt.length) {
      value = opt[0].label;
    }
  }

  if (props.field.type.name == "Date") {
    value = moment(value).format("YYYY/MM/DD");
  }

  return (
    <span className="mui-ReadonlyField-custom">
      <FormLabel component="label" className="mui-ReadonlyField-FormLabel-custom">{props.legend || props.label}</FormLabel>
      <div style={{display: "inline-flex"}}>{value}</div>
    </span>
  );
}

_Readonly.defaultProps = {
  fullWidth: true,
  margin: 'dense',
  type: 'text'
};


export default connectField(_Readonly);
