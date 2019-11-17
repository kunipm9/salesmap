/// Sys - AutoForm - map field
import React from "react";
import connectField from "uniforms/connectField";
import wrapField from "uniforms-bootstrap4/wrapField";
import { Overlay, Popover } from "react-bootstrap";
import { MDBBtn } from "mdbreact";

import { MapView } from "@imports/ui/utils/MapView";
/// Sys - AutoForm - map field --

/// Sys - AutoForm - map field
/**
 *
 *
 * @class MapField
 * @extends {React.Component}
 */
class MapField extends React.Component {
  /**
   *Creates an instance of MapField.
   * @param {*} props
   * @memberof MapField
   */
  constructor(props) {
    super(props);
    this.state = {
      confirmTarget: null,
      confirmDelete: false
    };
    this.center = [139.767125, 35.681236];

    this.deleteMap = this.deleteMap.bind(this);
    this.onClickDeleteButton = this.onClickDeleteButton.bind(this);

    this.onClickMap = this.onClickMap.bind(this);
    this.onDblClickMap = this.onDblClickMap.bind(this);
    this.onRedrawMap = this.onRedrawMap.bind(this);

    this.getAddressCallback = this.getAddressCallback.bind(this);
    this.getPolygonCallback = this.getPolygonCallback.bind(this);

    this.myRef = React.createRef();
  }

  /**
   *
   *
   * @memberof MapField
   */
  onClickMap = posWorld => {
    console.log(new Date().getTime(), "MapField click", posWorld);
    console.assert(posWorld, "posWorld is null");

    window.$GLOBAL$.__MapView__.getAddressByPoint(123, posWorld, null);
  };

  /**
   *
   *
   * @memberof MapField
   */
  onDblClickMap = posWorld => {
    console.log(new Date().getTime(), "MapField dbl click", posWorld);
    console.assert(posWorld, "posWorld is null");
  };

  /**
   *
   *
   * @memberof MapField
   */
  onRedrawMap = mapExtent => {
    console.log(new Date().getTime(), "MapField onRedrawMap");
    console.assert(mapExtent, "mapExtent is null");

    // MapField
    window.$GLOBAL$.__MapView__.clearLayer();
    if (this.props.value && this.props.value.shape) {
      window.$GLOBAL$.__MapView__.drawBuildings([
        { polygon: this.props.value.shape.polygonTokyo, flag: "p" }
      ]);
    }
  };

  /// Sys - Map - Address
  /**
   *
   *
   * @memberof MapField
   */
  getPolygonCallback = (obj, posWorld, polygonTokyo) => {
    console.log(
      new Date().getTime(),
      "MapField getPolygonCallback",
      this,
      obj,
      posWorld,
      polygonTokyo
    );

    // MapField
    setTimeout(() => {
      window.$GLOBAL$.__MapView__.clearLayer();

      if (polygonTokyo) {
        window.$GLOBAL$.__MapView__.drawBuildings([
          { polygon: polygonTokyo, flag: "p" }
        ]);
      }
    }, 200);
  };

  /**
   *
   *
   * @memberof MapField
   */
  getAddressCallback = (obj, ret) => {
    console.log(
      new Date().getTime(),
      "MapField getAddressCallback",
      this,
      obj,
      ret
    );
    console.assert(ret, "ret is null");

    // AutoForm
    this.props.onChange(ret.location);

    // Collection
    if (this.props.onCallback && typeof this.props.onCallback === "function") {
      this.props.onCallback(this.props.field, "getAddressCallback", ret);
    }
  };
  /// Sys - Map - Address --

  /**
   *
   *
   * @memberof MapField
   */
  onClickDeleteButton = ({ target }) => {
    console.log(new Date().getTime(), "MapField onClickDeleteButton", target);
    console.assert(target, "target is null");

    // Collection
    const ret = {};
    this.setState({ confirmTarget: target, confirmDelete: true });
    if (this.props.onCallback && typeof this.props.onCallback === "function") {
      this.props.onCallback(this.props.field, "onClickDeleteButton", ret);
    }
  };

  /**
   *
   *
   * @memberof MapField
   */
  deleteMap() {
    this.setState({ confirmDelete: false });
  }

  /**
   *
   *
   * @returns
   * @memberof MapField
   */
  render() {
    console.log(
      new Date().getTime(),
      "MapField render value",
      this.props.value
    );

    if (this.props.value && this.props.value.pos) {
      this.center = this.props.value.pos.coordinates;
    }
    console.log("this.center", this.center);

    return (
      <MapView
        ref={this.myRef}
        style={this.props.style}
        center={this.center}
        marker={this.props.value}
        onClickMap={this.onClickMap}
        onDblClickMap={this.onDblClickMap}
        onRedrawMap={this.onRedrawMap}
        getAddressCallback={this.getAddressCallback}
        getPolygonCallback={this.getPolygonCallback}
      >
        <Overlay
          show={this.state.confirmDelete}
          target={this.state.confirmTarget}
          placement="right"
          container={this}
          containerPadding={0}
        >
          <Popover id="top" title="削除しますか?">
            <MDBBtn
              color="info"
              onClick={() => {
                this.setState({ confirmDelete: false });
              }}
              className="btnfont"
            >
              取消
            </MDBBtn>
            <MDBBtn
              color="danger"
              onClick={() => this.deleteMap(this)}
              className="btnfont"
            >
              削除
            </MDBBtn>
          </Popover>
        </Overlay>
      </MapView>
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
    <MapField
      value={props.value}
      disabled={props.disabled}
      style={props.style}
      onChange={props.onChange}
      onCallback={props.onCallback}
      field={props}
    />
  );
}

/**
 *
 *
 * @param {*} props
 * @returns
 */
const MapField_ = props => {
  const wrapProps = Object.assign({}, props);
  delete wrapProps["style"];
  return wrapField(wrapProps, divField(props));
};
export default connectField(MapField_);
/// Sys - AutoForm - map field --
