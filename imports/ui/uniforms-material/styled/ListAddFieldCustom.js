import FormControl from '@material-ui/core/FormControl';
import IconButton from '@material-ui/core/IconButton';
import PropTypes from 'prop-types';
import React from 'react';
import filterDOMProps from 'uniforms/filterDOMProps';
import { Image } from "semantic-ui-react";

export const ListAddFieldCustom = ({ fullWidth, icon, margin, variant, ...props}) => {
  return (
    <FormControl className="mui-ListAddField" fullWidth={!!fullWidth} margin={margin} variant={variant}>
      <IconButton
        className="mui-ListAddField-IconButton-custom"
        {...filterDOMProps(props)}
      >
        <Image src="/smsk-front/新規追加.svg" className="add-new-img" />
      </IconButton>
    </FormControl>
  );
};

ListAddFieldCustom.propTypes = {
  icon: PropTypes.node
};

ListAddFieldCustom.defaultProps = {
  fullWidth: true,
  icon: '+',
  margin: 'dense'
};
