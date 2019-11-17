import React from 'react';
import FormLabel from '@material-ui/core/FormLabel';
import connectField from 'uniforms/connectField';

const _ReadonlyId = (props) => {
  let dispValue = "";
  const value = props.value;
  const collection = props.collection;

  let rec;
  /// Sys - Collection - LocalStorage
  if ("docs" in collection) {
    rec = window.$GLOBAL$.Collection[collection._name][value];
  } else {
    rec = collection.findOne({_id: value});
  }
  /// Sys - Collection - LocalStorage --

  if (rec) {
    dispValue = collection.dispTitle(rec);
  }

  return (
    <span className="mui-ReadonlyField-custom">
      <FormLabel component="label" className="mui-ReadonlyField-FormLabel-custom">{props.legend || props.label}</FormLabel>
      <div style={{display: "inline-flex"}}>{dispValue}</div>
    </span>
  );
}

_ReadonlyId.defaultProps = {
  fullWidth: true,
  margin: 'dense',
  type: 'text'
};


export default connectField(_ReadonlyId);
