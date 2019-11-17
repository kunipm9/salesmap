/// Sys - View
import React from "react";
import { withTracker } from "meteor/react-meteor-data";
/// Sys - View --

import View from "@imports/ui/crud/View";

/// Custom - LocalStorage
import { ConsumersView } from "./../lib/Consumers/View";
import { Maps_ConsumersSum_Collection } from "@imports/api/Maps/ConsumersSum_Collection";

import { PinsView } from "./../lib/Pins/View";
import { Maps_PinsSum_Collection } from "@imports/api/Maps/PinsSum_Collection";
/// Custom - LocalStorage --

/// Sys - Collection - insert
import { Session } from "meteor/session";
/// Sys - Collection - insert --

/// Sys - Role
import { checkSystemRole, checkAppRole } from "@imports/ui/crud/checkRole";
/// Sys - Role --

/// Application
import { MapView } from "@imports/ui/utils/MapView";
/// Application --

/// Custom - Role - check permission
/**
 *
 *
 * @param {*} mode
 * @returns
 */
export const Maps_Maps_View_ComponentInfo = mode => {
  if (!checkAppRole("Maps.Consumers", mode)) {
    return null;
  }

  if (checkSystemRole()) {
    return null;
  }

  /// Application
  return { title: "Maps/Maps/View", path: "/Maps/Maps/View" };
  /// Application --
};
/// Custom - Role - check permission --

/**
 *
 *
 * @class _Maps_Maps_View
 * @extends {View}
 */
class _Maps_Maps_View extends View {
  "use strict";

  /**
   *Creates an instance of _Maps_Maps_View.
   * @param {*} props
   * @memberof _Maps_Maps_View
   */
  constructor(props) {
    console.log(new Date().getTime(), "Maps_Maps_View constructor");
    super(props);

    /// Custom - Role - check permission
    this.ComponentInfo = Maps_Maps_View_ComponentInfo;
    /// Custom - Role - check permission --

    /// Application - Map
    this.center = [139.767125, 35.681236];
    /// Application - Map --

    this.onClickMap = this.onClickMap.bind(this);

    this.myRefMap = React.createRef();
    this.myRefConsumers = React.createRef();
    this.myRefPins = React.createRef();
  }

  /**
   *
   *
   * @memberof _Maps_Maps_View
   */
  onClickMap = posWorld => {
    console.log(new Date().getTime(), "Maps_Maps_View onClickMap");

    this.myRefConsumers.current.onClickMap(posWorld);
    this.myRefPins.current.onClickMap(posWorld);
  }

  /**
   *
   *
   * @memberof _Maps_Maps_View
   */
  onRedrawMap = mapExtent => {
    console.log(new Date().getTime(), "Maps_Maps_View onRedrawMap");

    window.$GLOBAL$.__MapView__.clearLayer();

    this.myRefConsumers.current.onRedrawMap(mapExtent);
    this.myRefPins.current.onRedrawMap(mapExtent);
  }

  /**
   *
   *
   * @memberof _Maps_Maps_View
   */
  getPolygonCallback = (obj, posWorld, polygonTokyo) => {
    console.log(new Date().getTime(), "Maps_Maps_View getPolygonCallback");

    this.myRefConsumers.current.getPolygonCallback(obj, posWorld, polygonTokyo);
    this.myRefPins.current.getPolygonCallback(obj, posWorld, polygonTokyo);
  }

  /**
   *
   *
   * @memberof _Maps_Maps_View
   */
  getAddressCallback = (obj, ret) => {
    console.log(new Date().getTime(), "Maps_Maps_View getAddressCallback");

    this.myRefConsumers.current.getAddressCallback(obj, ret);
    this.myRefPins.current.getAddressCallback(obj, ret);
  }

  /**
   *
   *
   * @memberof _Maps_Maps_View
   */
  getAddressCallbackError = () => {
  }

  /// Custom - View - layout
  /**
   *
   *
   * @returns
   * @memberof _Maps_Maps_View
   */
  render() {
    console.log(new Date().getTime(), "Maps_Maps_View render");

    /// Custom - Collection - subscribe
    if (this.props.loading) {
      return <span />;
    }
    /// Custom - Collection - subscribe --

    return (
      <React.Fragment>
        <MapView
          ref={this.myRefMap}
          style={{ width: "100%", height: "400px" }}
          center={this.center}
          onClickMap={this.onClickMap}
          onRedrawMap={this.onRedrawMap}
          getAddressCallback={this.getAddressCallback}
          getPolygonCallback={this.getPolygonCallback}
          getAddressCallbackError={this.getAddressCallbackError}
        />

        <ConsumersView
          ref={this.myRefConsumers}
        />

        <PinsView
          ref={this.myRefPins}
        />

      </React.Fragment>
    );
  }
  /// Custom - View - layout --
}

/// Custom - View - tracker
export const Maps_Maps_View = withTracker(() => {
  /// Custom - Collection - subscribe
  const handles = [
    Meteor.subscribe(Maps_ConsumersSum_Collection._name, Session.get('Users_Groups_id')),
    Meteor.subscribe(Maps_PinsSum_Collection._name, Session.get('Users_Groups_id')),
  ];
  const loading = handles.some(handle => !handle.ready());
  console.log(new Date().getTime(), "Maps_Maps_View loading", loading);

  return {
    ComponentInfo: Maps_Maps_View_ComponentInfo,
    loading: loading
  };
  /// Custom - Collection - subscribe --
})(_Maps_Maps_View);
/// Custom - View - tracker --
