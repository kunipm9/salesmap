import React from "react";
import connectField from "uniforms/connectField";
import joinName from "uniforms/joinName";
import { Children } from "react";

import AutoField from "@imports/ui/uniforms/AutoField";

/**
 *
 *
 * @param {*} {removeIcon, disabled, ...props}
 */
const ListItem = (
  { removeIcon, disabled, ...props } // eslint-disable-line no-unused-vars
) => (
  <div className="row uniforms-list-row" data-id={props.name}>
    <div className="col-1 uniforms-list-handle" />

    {props.children ? (
      Children.map(props.children, child =>
        React.cloneElement(child, {
          className: "row col-11",
          name: joinName(props.name, child.props.name),
          label: null
        })
      )
    ) : (
      <AutoField {...props} className="row col-11" />
    )}
  </div>
);
export default connectField(ListItem, {
  includeInChain: false,
  includeParent: true
});
