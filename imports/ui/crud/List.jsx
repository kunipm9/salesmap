/// Sys - Tabular
import React from "react";
/// Sys - Tabular --

/// Sys - AutoForm - layout
import { MDBBtn } from "mdbreact";
import { MDBSwitch } from "mdbreact";
/// Sys - AutoForm - layout --

/**
 *
 *
 * @export
 * @class List
 * @extends {React.Component}
 */
export default class List extends React.PureComponent {
  /**
   *
   *
   * @memberof List
   */
  securityCheck() {
    if (this.ComponentInfo) {
      if (!this.ComponentInfo("read")) {
        console.error(`Security check.`);
        this.props.history.replace("/");
      }
    }
  }

  /// Sys - Tabular - insert button
  /**
   *
   *
   * @memberof List
   */
  InsertButtons = componentInfo => {
    if (!componentInfo) {
      return <span />;
    }
    return (
      <MDBBtn
        color="primary"
        className="btnfont"
        onClick={() => {
          setTimeout(
            () => this.props.history.push(componentInfo.path),
            window.$GLOBAL$.transitionDuration
          );
        }}
      >
        {componentInfo.title}
      </MDBBtn>
    );
  };
  /// Sys - Tabular - insert button --

  /// Sys - Tabular - filter, soft delete
  /**
   *
   *
   * @memberof List
   */
  // eslint-disable-next-line no-unused-vars
  changeShowNormal = b => () => {
    this.setState({ showNormal: !this.state.showNormal });
  };
  /// Sys - Tabular - filter, soft delete --

  /// Sys - Tabular - filter, soft delete
  /**
   *
   *
   * @memberof List
   */
  ShowNormalSwitch = () => {
    return (
      <MDBSwitch
        checked={this.state.showNormal}
        onChange={this.changeShowNormal()}
        labelLeft=""
        labelRight="Normal Display"
        style={{ fontSize: "0.5rem" }}
      />
    );
  };
  /// Sys - Tabular - filter, soft delete --
}
