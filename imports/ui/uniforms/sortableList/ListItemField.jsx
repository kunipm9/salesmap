import React from "react";
import connectField from "uniforms/connectField";
import joinName from "uniforms/joinName";
import { Children } from "react";

import AutoField from "@imports/ui/uniforms/AutoField";
import ListDelField from "./ListDelField";

/**
 *
 *
 * @param {*} {removeIcon, disabled, sortable, ...props}
 */
const ListItem = ({ removeIcon, disabled, sortable, ...props }) => (
  <div className="row uniforms-list-row" data-id={props.name}>
    {!disabled && sortable && (
      <div className="col uniforms-list-handle">
        <span className="btn btn-xsm btn-floating mdb-color default-color-dark draggable">
          <i className="fa fa-sort fa-25x" />
        </span>
        <ListDelField name={props.name} removeIcon={removeIcon} />
      </div>
    )}

    {!disabled && !sortable && (
      <div className="col uniforms-list-handle">
        <ListDelField name={props.name} removeIcon={removeIcon} />
      </div>
    )}

    {disabled && <div className="col uniforms-list-handle" />}

    {props.children ? (
      Children.map(props.children, child =>
        React.cloneElement(child, {
          className: "col",
          name: joinName(props.name, child.props.name),
          label: null
        })
      )
    ) : (
      <AutoField {...props} className="col" />
    )}
  </div>
);
export default connectField(ListItem, {
  includeInChain: false,
  includeParent: true
});
