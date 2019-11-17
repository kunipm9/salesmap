import React from "react";
import classnames from "classnames";
import connectField from "uniforms/connectField";
import filterDOMProps from "uniforms/filterDOMProps";
import injectName from "uniforms/injectName";
import joinName from "uniforms/joinName";

import AutoField from "@imports/ui/uniforms/AutoField";

import { MDBCollapseHeader, MDBCollapse } from "mdbreact"; // eslint-disable-line no-unused-vars

/**
 *
 *
 * @class Nest
 * @extends {React.Component}
 */
class Nest extends React.Component {
  /**
   *Creates an instance of Nest.
   * @param {*} props
   * @memberof Nest
   */
  constructor(props) {
    super(props);
    this.state = {
      collapse: true,
      showDelay: false
    };
    if (
      this.props.collapsable !== "init" ||
      window.$GLOBAL$.changingFormMode == "insert"
    ) {
      this.state.collapse = false;
    }
  }

  /**
   *
   *
   * @memberof Nest
   */
  UNSAFE_componentWillReceiveProps() {
    /**
     *
     *
     * @param {string} str
     * @param {*} obj
     */
    const deepMap = (str, obj) => {
      Object.keys(obj).forEach(k => {
        if (this.props.findError(str + "." + k)) {
          this.setState({ collapse: false });
        }
        if (obj[k] !== null && typeof obj[k] === "object") {
          deepMap(str + "." + k, obj[k]);
        }
      });
    };

    if (this.props.value) {
      deepMap(this.props.name, this.props.value);
    }
  }

  /**
   *
   *
   * @returns
   * @memberof Nest
   */
  render() {
    const {
      children,
      className,
      error,
      errorMessage,
      feedbackable,
      fields,
      itemProps,
      label,
      name,
      showInlineError,
      collapsable,
      frameset,
      ...props
    } = this.props;

    return (
      <div
        className={classnames(className, "field", "form-group", {
          "has-feedback": error && feedbackable,
          "has-error": error
        })}
        {...filterDOMProps(props)}
      >
        {label && <label className="control-label">{label}&nbsp;</label>}

        {!!(error && showInlineError) && (
          <span className="text-danger">{errorMessage}</span>
        )}

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
              {this.props.fields.length + " fields"}
            </span>
          </span>
        )}

        {
          <If condition={frameset == "hr"}>
            <hr style={{ marginTop: "0.1rem" }} />
          </If>
        }

        {
          <If condition={frameset == "card"}>
            <hr
              style={{
                display: !this.state.collapse ? "none" : "",
                marginTop: "0.1rem"
              }}
            />
          </If>
        }

        {
          <If condition={this.state.collapse && !children}>
            {fields.map(key => {
              const field = props.findField(joinName(name, key));
              if (field.uniforms && field.uniforms.collapseHead) {
                return (
                  <AutoField
                    key={key}
                    name={joinName(name, key)}
                    {...itemProps}
                  />
                );
              } else {
                return <span key={key} />;
              }
            })}
          </If>
        }

        <MDBCollapse isOpen={!this.state.collapse}>

          {
            <If condition={frameset == "card"}>
              <div className="card card-default uniforms-nest-card">
                <div className="card-body uniforms-nest-card-body row">
                  {<If condition={children}>{injectName(name, children)}</If>}

                  {
                    <If condition={!children}>
                      {fields.map(key => {
                        return (
                          <AutoField
                            key={key}
                            name={joinName(name, key)}
                            {...itemProps}
                          />
                        );
                      })}
                    </If>
                  }
                </div>
              </div>
            </If>
          }

          {
            <If condition={frameset != "card"}>
              <div>
                <div className="uniforms-nest-body row">
                  {<If condition={children}>{injectName(name, children)}</If>}

                  {
                    <If condition={!children}>
                      {fields.map(key => {
                        return (
                          <AutoField
                            key={key}
                            name={joinName(name, key)}
                            {...itemProps}
                          />
                        );
                      })}
                    </If>
                  }
                </div>
              </div>
            </If>
          }

        </MDBCollapse>
      </div>
    );
  }
}
export default connectField(Nest, {
  ensureValue: false,
  includeInChain: false
});
