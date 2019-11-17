import ListMaterial from '@material-ui/core/List';
import InputLabel from '@material-ui/core/InputLabel';
import React from 'react';
import connectField from 'uniforms/connectField';
import filterDOMProps from 'uniforms/filterDOMProps';
import joinName from 'uniforms/joinName';
import {Children} from 'react';

import ListItemField from './ListItemField';

const List = ({children, dense, itemProps, label, name, value, ...props}) => [
  <ListMaterial
    key="list"
    dense={dense}
    subheader={label ? <InputLabel shrink={true} className="mui-ListSubheader-custom">{label}</InputLabel> : undefined}
    {...filterDOMProps(props)}
  >
    {children
      ? value.map((item, index) =>
          Children.map(children, child =>
            React.cloneElement(child, {
              key: index,
              label: null,
              name: joinName(name, child.props.name && child.props.name.replace('$', index))
            })
          )
        )
      : value.map((item, index) => (
          <ListItemField key={index} label={null} name={joinName(name, index)} {...itemProps} />
        ))}

    {<If condition={value.length == 0}>
      <div style={{
        color: '#eeeeee',
        width: 'calc(100vw - 62px)',
        height: 0
      }}>
        未設定
      </div>
    </If>}
    {<If condition={value.length}>
      <div style={{
        marginBottom: '10px',
        color: '#eeeeee',
        width: 'calc(100vw - 62px)',
        borderBottom: (value.length) ? '1px solid rgba(0, 0, 0, 0.1)' : '',
      }}>
      </div>
    </If>}

  </ListMaterial>,
];

List.defaultProps = {
  dense: true
};

export default connectField(List, {ensureValue: false, includeInChain: false});
