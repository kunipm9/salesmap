import FormLabel from '@material-ui/core/FormLabel';
import InputLabel from '@material-ui/core/InputLabel';
import React from 'react';
import connectField from 'uniforms/connectField';
import injectName from 'uniforms/injectName';
import joinName from 'uniforms/joinName';

import AutoField from './AutoField';
import wrapField from './wrapField';

const Nest = ({children, fields, itemProps, label, name, ...props}) => {
  const labelStyle = props.InputLabelProps ? (props.InputLabelProps.style ? props.InputLabelProps.style : {}) : {};
  const labelClass = props.InputLabelProps ? (props.InputLabelProps.className ? props.InputLabelProps.className : null) : null;

  if (props.wrapClass) {
    return wrapField(
      {...props, component: undefined},
      label && <InputLabel shrink={true} style={labelStyle} className={labelClass}>{label}</InputLabel>,
      <div className={props.wrapClass}>
{
      children
        ? injectName(name, children)
        : fields.map(key => <AutoField key={key} name={joinName(name, key)} {...itemProps} />)
}
      </div>
    );
  } else {
    return wrapField(
      {...props, component: undefined},
      label && <FormLabel component="legend" style={labelStyle}>{label}</FormLabel>,
      children
        ? injectName(name, children)
        : fields.map(key => <AutoField key={key} name={joinName(name, key)} {...itemProps} />)
    );
  }
}

Nest.defaultProps = {
  fullWidth: true,
  margin: 'dense'
};

export default connectField(Nest, {ensureValue: false, includeInChain: false});
