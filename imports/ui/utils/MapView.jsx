/// Sys - AutoForm - map field
import React from "react";
import { MapViewLeaflet } from "@imports/ui/utils/MapViewLeaflet";
import { MapViewZnet } from "@imports/ui/utils/MapViewZnet";
/// Sys - AutoForm - map field --

import { isMobile } from "@imports/ui/utils/util";

/// Sys - AutoForm - map field
/**
 *
 *
 * @export
 * @class MapView
 * @extends {React.Component}
 */
export class MapView extends React.PureComponent {
  /**
   *Creates an instance of MapView.
   * @param {*} props
   * @memberof MapView
   */
  constructor(props) {
    super(props);
    console.log(new Date().getTime(), "MapView console");
    this.clearLayer = this.clearLayer.bind(this);
    this.requestReDrawMap = this.requestReDrawMap.bind(this);
    this.scrollTo = this.scrollTo.bind(this);
    this.searchAddress = this.searchAddress.bind(this);
    this.drawSymbols = this.drawSymbols.bind(this);
    this.drawBuildings = this.drawBuildings.bind(this);

    this.isProvideBldApi = this.isProvideBldApi.bind(this);
    this.getAddressByString = this.getAddressByString.bind(this);
    this.getAddressByPoint = this.getAddressByPoint.bind(this);
    this.getAddressCallback = this.getAddressCallback.bind(this);
    this.getAddressCallbackError = this.getAddressCallbackError.bind(this);
    this.getPolygonCallback = this.getPolygonCallback.bind(this);

    this.isNearby = this.isNearby.bind(this);
    this.getCenterPos = this.getCenterPos.bind(this);
    this.getZoomLevel = this.getZoomLevel.bind(this);
    this.setZoomLevel = this.setZoomLevel.bind(this);

    this.myRef = React.createRef();
  }

  /**
   *
   *
   * @returns
   * @memberof MapView
   */
  isProvideBldApi() {
    console.log(new Date().getTime(), "MapView isProvideBldApi");
    return this.myRef.current.isProvideBldApi();
  }

  /**
   *
   *
   * @memberof MapView
   */
  clearLayer() {
    console.log(new Date().getTime(), "MapView clearLayer");
    if (this.myRef && this.myRef.current) {
      this.myRef.current.clearLayer();
    }
  }

  /**
   *
   *
   * @memberof MapView
   */
  requestReDrawMap() {
    if (this.myRef && this.myRef.current) {
      this.myRef.current.requestReDrawMap();
    }
  }

  /**
   *
   *
   * @param {number[]} pos
   * @memberof MapView
   */
  scrollTo(pos) {
    if (this.myRef && this.myRef.current) {
      this.myRef.current.scrollTo(pos);
    }
  }

  /**
   *
   *
   * @param {string} address
   * @memberof MapView
   */
  searchAddress(address) {
    if (this.myRef && this.myRef.current) {
      this.myRef.current.searchAddress(address);
    }
  }

  /**
   *
   *
   * @param {*} buildings
   * @memberof MapView
   */
  drawHeatmap(buildings) {
    console.log(new Date().getTime(), "MapView drawBuildings");
    if (this.myRef && this.myRef.current) {
      this.myRef.current.drawHeatmap(buildings);
    }
  }

  /**
   *
   *
   * @param {*} buildings
   * @memberof MapView
   */
  drawSymbols(symbols) {
    console.log(new Date().getTime(), "MapView drawSymbols");
    if (this.myRef && this.myRef.current) {
      this.myRef.current.drawSymbols(symbols);
    }
  }

  /**
   *
   *
   * @param {*} buildings
   * @memberof MapView
   */
  drawBuildings(buildings) {
    console.log(new Date().getTime(), "MapView drawBuildings");
    if (this.myRef && this.myRef.current) {
      this.myRef.current.drawBuildings(buildings);
    }
  }

  /// Sys - Map - Address
  /**
   *
   *
   * @param {*} obj
   * @param {string} addressString
   * @param {string} name
   * @memberof MapView
   */
  getAddressByString(obj, addressString, name) {
    console.log(new Date().getTime(), "MapView getAddressByString");
    if (this.myRef && this.myRef.current) {
      this.myRef.current.getAddressByString(obj, addressString, name);
    }
  }

  /**
   *
   *
   * @param {*} obj
   * @param {number[]} posWorld
   * @param {number[]} posOrg
   * @param {*} polygonOrg
   * @memberof MapView
   */
  getAddressByPoint(obj, posWorld, aroundDocs) {
    console.log(new Date().getTime(), "MapView getAddressByPoint");
    if (this.myRef && this.myRef.current) {
      this.myRef.current.getAddressByPoint(obj, posWorld, aroundDocs);
    }
  }

  /**
   *
   *
   * @param {*} obj
   * @param {*} ret
   * @memberof MapView
   */
  getAddressCallback(obj, ret) {
    console.log(new Date().getTime(), "MapView getAddressCallback");
    if (this.myRef && this.myRef.current) {
      this.props.getAddressCallback(obj, ret);
    }
  }

  /**
   *
   *
   * @param {*} obj
   * @memberof MapView
   */
  getAddressCallbackError(obj) {
    console.log(new Date().getTime(), "MapView getAddressCallbackError");
    if (this.myRef && this.myRef.current) {
      this.props.getAddressCallbackError(obj);
    }
  }

  /**
   *
   *
   * @param {*} obj
   * @param {number[]} posWorld
   * @param {*} polygonTokyo
   * @memberof MapView
   */
  getPolygonCallback(obj, posWorld, polygonTokyo) {
    console.log(new Date().getTime(), "MapView getPolygonCallback");
    if (this.myRef && this.myRef.current) {
      this.props.getPolygonCallback(obj, posWorld, polygonTokyo);
    }
  }
  /// Sys - Map - Address --

  /**
   *
   *
   * @memberof MapView
   */
  isNearby(pos1, pos2, distancePix) {
    return this.props.isNearby(pos1, pos2, distancePix);
  }

  /**
   *
   *
   * @memberof MapView
   */
  getCenterPos() {
    console.log(new Date().getTime(), "MapView getCenterPos");
    if (this.myRef && this.myRef.current) {
      return this.props.getCenterPos();
    }
    return [0, 0];
  }

  /**
   *
   *
   * @memberof MapView
   */
  setCenterPos(posWorld) {
    console.log(new Date().getTime(), "MapView setCenterPos");
    if (this.myRef && this.myRef.current) {
      this.props.setCenterPos(posWorld);
    }
  }

  /**
   *
   *
   * @memberof MapView
   */
  getZoomLevel() {
    console.log(new Date().getTime(), "MapView getZoomLevel");
    if (this.myRef && this.myRef.current) {
      return this.props.getZoomLevel();
    }
    return 9;
  }

  /**
   *
   *
   * @memberof MapView
   */
  setZoomLevel(zoomLevel) {
    console.log(new Date().getTime(), "MapView setZoomLevel");
    if (this.myRef && this.myRef.current) {
      this.props.setZoomLevel(zoomLevel);
    }
  }

  /**
   *
   *
   * @returns
   * @memberof MapView
   */
  render() {
    let MapView;
    if (isMobile()) {
      MapView = MapViewZnet;
    } else {
      MapView = MapViewLeaflet;
    }

    return (
      <MapView
        ref={this.myRef}
        style={this.props.style}
        center={this.props.center}
        marker={this.props.value}
        onClickMap={this.props.onClickMap}
        onDblClickMap={this.props.onDblClickMap}
        onRedrawMap={this.props.onRedrawMap}
        getAddressCallback={this.getAddressCallback}
        getPolygonCallback={this.getPolygonCallback}
      >
        {this.props.children}
      </MapView>
    );
  }
}
/// Sys - AutoForm - map field --
