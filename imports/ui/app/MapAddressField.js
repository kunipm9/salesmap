import React from "react";
import connectField from "uniforms/connectField";
import wrapField from "uniforms-bootstrap4/wrapField";

/// Custom - Layout
import { MDBBtn } from "mdbreact";
/// Custom - Layout --

//function divField(props) {
//console.log("MapAddressField_ props ===================== ", props);
//  //return (
//    <MDBBtn onClick={ () => { props.onCallback && typeof props.onCallback === 'function' && props.onCallback(props.field) } } />
//  );
//}

/**
 *
 *
 * @class MapAddress
 * @extends {React.Component}
 */
class MapAddress extends React.Component {
  render() {
    return (
      <React.Fragment>
        <MDBBtn
          color="info"
          className="btnfont"
          onClick={() => {
            if (
              this.props.onCallback &&
              typeof this.props.onCallback === "function"
            ) {
              this.props.onCallback(this.props.field);
            }
          }}
        >
          住所正規化
        </MDBBtn>
        {this.props.value}
      </React.Fragment>
    );
  }
}

/**
 *
 *
 * @param {*} props
 * @returns
 */
function divField(props) {
  return (
    <MapAddress
      field={props}
      value={props.value}
      onCallback={props.onCallback}
    />
  );
}

/**
 *
 *
 * @param {*} props
 * @returns
 */
const MapAddressField_ = props => {
  return wrapField(props, divField(props));
};
export default connectField(MapAddressField_);
