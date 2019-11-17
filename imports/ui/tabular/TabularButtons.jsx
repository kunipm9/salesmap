import React from "react";
import { MDBBtn } from "mdbreact";

/**
 *
 *
 * @export
 * @class TabularButtons
 * @extends {React.Component}
 */
export default class TabularButtons extends React.Component {
  render() {
    if (this.props.option._deleted) {
      return (
        <MDBBtn color="blue" className="btnfont-tabular btn-sm edit">
          復旧
        </MDBBtn>
      );
    }

    return (
      <MDBBtn color="purple" className="btnfont-tabular btn-sm edit">
        詳細
      </MDBBtn>
    );
  }
}
