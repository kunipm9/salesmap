import React from "react";
import classnames from "classnames";
import connectField from "uniforms/connectField";
import { rebuildField, rebuildForm } from "@imports/ui/uniforms/rebuildField"; // eslint-disable-line no-unused-vars
import filterDOMProps from "uniforms/filterDOMProps";
import joinName from "uniforms/joinName";
import { Children } from "react";

import ListAddField from "./ListAddField";
import ListItemField from "./ListItemField";

import Sortable from "react-sortablejs";

import { MDBCollapseHeader, MDBCollapse } from "mdbreact"; // eslint-disable-line no-unused-vars

/**
 *
 *
 * @class List
 * @extends {React.Component}
 */
class List extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      collapse: props.collapsable === "init" ? true : false
    };
  }

  /**
   *
   *
   * @returns
   * @memberof List
   */
  render() {
    const {
      addIcon,
      children,
      className,
      disabled,
      error,
      errorMessage,
      feedbackable,
      initialCount,
      itemProps,
      label,
      name,
      removeIcon,
      showInlineError,
      value,
      sortable,
      collapsable,
      ...props
    } = this.props;

    let hasErrror = false;
    /**
     *
     *
     * @param {*} str
     * @param {*} obj
     */
    const deepMap = (str, obj) => {
      Object.keys(obj).forEach(function(k) {
        if (props.findError(str + "." + k)) {
          hasErrror = true;
        }
        if (obj[k] !== null && typeof obj[k] === "object") {
          deepMap(str + "." + k, obj[k]);
        }
      });
    };

    deepMap(this.props.name, this.props.value);

    return (
      <div
        className={classnames(className, "field", "form-group", {
          "has-feedback": error && feedbackable,
          "has-error": error
        })}
        {...filterDOMProps(props)}
      >
        {label && <label className="control-label">{label}&nbsp;</label>}

        {collapsable && (
          <span
            onClick={() => this.setState({ collapse: !this.state.collapse })}
          >
            <i
              className={
                this.state.collapse
                  ? "fa fa-arrow-circle-down fa-rotate-270 font-size-11rem"
                  : "fa fa-arrow-circle-down font-size-11rem"
              }
              style={{
                marginLeft: "6px",
                cursor: "pointer",
                color: this.state.collapse ? "#9f0500" : "black"
              }}
            />
            &nbsp;
            <span
              style={{ cursor: "pointer", textDecorationLine: "underline" }}
            >
              {value.length + " items"}
            </span>
          </span>
        )}

        <hr
          style={{
            display: !this.state.collapse ? "none" : "",
            marginTop: "0.1rem"
          }}
        />

        <MDBCollapse isOpen={!this.state.collapse || hasErrror}>
          <div className="card card-default">
            <div className="card-body uniforms-list-body">
              <Sortable
                options={{
                  handle: ".draggable"
                }}
                // eslint-disable-next-line no-unused-vars
                onChange={(order, sortable, evt) => {
                  const newValue = [];
                  for (let idx in order) {
                    const ord = order[idx];
                    const fieldIndex = +ord.slice(1 + ord.lastIndexOf("."));
                    newValue.push(value[fieldIndex]);
                  }
                  props.onChange(newValue);
                  rebuildForm(
                    window.$GLOBAL$.changingFormName,
                    window.$GLOBAL$.formRef[window.$GLOBAL$.changingFormName]
                      .state.model
                  );
                }}
              >
                {children
                  ? value.map((item, index) =>
                      Children.map(children, child =>
                        React.cloneElement(child, {
                          key: index,
                          label: null,
                          name: joinName(
                            name,
                            child.props.name &&
                              child.props.name.replace("$", index)
                          ),
                          removeIcon
                        })
                      )
                    )
                  : value.map((item, index) => (
                      <ListItemField
                        key={index}
                        label={null}
                        name={joinName(name, index)}
                        removeIcon={removeIcon}
                        value={item}
                        sortable={sortable}
                        {...itemProps}
                      />
                    ))}
              </Sortable>
            </div>

            {!disabled && (
              <div
                className={classnames("card-footer uniforms-list-control", {
                  "has-error": error
                })}
              >
                <ListAddField
                  name={`${name}.$`}
                  initialCount={initialCount}
                  addIcon={addIcon}
                />
                {!!(error && showInlineError) && (
                  <span className="help-block">{errorMessage}</span>
                )}
              </div>
            )}
          </div>
        </MDBCollapse>
      </div>
    );
  }
}

export default connectField(List, {
  ensureValue: false,
  includeInChain: false
});
