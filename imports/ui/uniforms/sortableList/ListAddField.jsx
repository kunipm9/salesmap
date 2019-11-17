import React from "react";
import classnames from "classnames";
import cloneDeep from "lodash/cloneDeep";
import connectField from "uniforms/connectField";
import filterDOMProps from "uniforms/filterDOMProps";

/**
 *
 *
 * @param {*} {addIcon, className, disabled, parent, value, ...props}
 * @returns
 */
const ListAdd = ({ addIcon, className, disabled, parent, value, ...props }) => {
  const limitNotReached =
    !disabled && !(parent.maxCount <= parent.value.length);

  if (disabled) {
    return <span />;
  }

  return (
    <div
      className={classnames(
        "btn btn-xsm btn-floating mdb-color primary-color-dark pull-left",
        className
      )}
      onClick={() =>
        limitNotReached &&
        parent.onChange(parent.value.concat([cloneDeep(value)]))
      }
      {...filterDOMProps(props)}
    >
      {addIcon}
    </div>
  );
};

ListAdd.defaultProps = { addIcon: <i className="fa fa-plus fa-25x" /> };

export default connectField(ListAdd, {
  includeParent: true,
  initialValue: false
});
