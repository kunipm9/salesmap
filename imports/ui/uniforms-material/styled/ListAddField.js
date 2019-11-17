import FormControl from '@material-ui/core/FormControl';
import IconButton from '@material-ui/core/IconButton';
import PropTypes from 'prop-types';
import React from 'react';
import cloneDeep from 'lodash/cloneDeep';
import connectField from 'uniforms/connectField';
import filterDOMProps from 'uniforms/filterDOMProps';
import { Image } from "semantic-ui-react";

const ListAdd = ({disabled, fullWidth, icon, margin, parent, value, variant, ...props}) => {
  const limitNotReached = !disabled && !(parent.maxCount <= parent.value.length);

  return (
    <FormControl className="mui-ListAddField" fullWidth={!!fullWidth} margin={margin} variant={variant}>
      <IconButton
        className="mui-ListAddField-IconButton"
        disabled={!limitNotReached}
        onClick={() => limitNotReached && parent.onChange(parent.value.concat([cloneDeep(value)]))}
        {...filterDOMProps(props)}
      >
        <Image src="/smsk-front/新規追加.svg" className="add-new-img" />
      </IconButton>
    </FormControl>
  );
};

ListAdd.propTypes = {
  icon: PropTypes.node
};

ListAdd.defaultProps = {
  fullWidth: true,
  icon: '+',
  margin: 'dense'
};

export default connectField(ListAdd, {includeParent: true, initialValue: false});
