
/// Sys - LocalStorage
import React from 'react';
import { Session } from "meteor/session";
import { localCollection_ComponentInit } from "@imports/api/lib/localCollection";
import { localCollection_ComponentDidMount } from "@imports/api/lib/localCollection";
import { localCollection_ComponentWillUnmount } from "@imports/api/lib/localCollection";
/// Sys - LocalStorage --

/// Sys - Map
const proj4 = require("proj4");
import _ from "lodash";
/// Sys - Map --

/**
 *
 *
 * @class MapsView
 * @extends {ViewLocalCollection}
 */
export class MapsView extends React.Component {
  "use strict";

  /**
   *Creates an instance of MapsView.
   * @param {*} props
   * @memberof MapsView
   */
  constructor(props) {
    console.log(new Date().getTime(), "MapsView constructor");
    super(props);

    this.mapExtent = null;
    this.clickedPointCollectionDocIds = [];
    this.clickedPointPolygonTokyo = null;

    this.postConstructor = this.postConstructor.bind(this);
    this.loadData = this.loadData.bind(this);
    this.onRedrawMapSuper = this.onRedrawMapSuper.bind(this);
    this.getDocsInMapViewSuper = this.getDocsInMapViewSuper.bind(this);
  }

  /**
   *
   *
   * @memberof MapsView
   */
  postConstructor() {
    console.log(new Date().getTime(), "MapsView postConstructor");

    /// Sys - LocalStorage
    this.Collection.docs = window.$GLOBAL$.Collection[this.Collection._name];
    localCollection_ComponentInit(
      this,
      this.Collection._name,
      this.SumCollection
    );
    /// Sys - LocalStorage --

    /// Sys - Collection - selector
    const tmpSelector =
      Session.get(this.Collection._name + ".List.selector") || null;
    if (tmpSelector) {
      this.state.selector = tmpSelector; // eslint-disable-line react/no-direct-mutation-state
    }
    /// Sys - Collection - selector --
  }

  /**
   *
   *
   * @memberof MapsView
   */
  componentDidMount() {
    console.log(new Date().getTime(), "MapsView componentDidMount");

    /// Sys - LocalStorage
    localCollection_ComponentDidMount(this);
    /// Sys - LocalStorage --

    /// Custom - LocalStorage - update
    this.localCollection_redrawProc = this.loadData;
    /// Custom - LocalStorage - update --
  }

  /**
   *
   *
   * @memberof MapsView
   */
  componentWillUnmount() {
    console.log(new Date().getTime(), "MapsView componentWillUnmount");

    /// Sys - LocalStorage
    localCollection_ComponentWillUnmount(this);
    /// Sys - LocalStorage --
  }

  /// Sys - Collection - selector
  /**
   *
   *
   * @memberof MapsView
   */
  updateSelector = (key, value) => {
    console.log(new Date().getTime(), "MapsView updateSelector", key, value);
    this.state.selector[key] = value; // eslint-disable-line react/no-direct-mutation-state
    this.setState({ selector: this.state.selector });

    Session.setPersistent(
      this.Collection._name + ".List.selector",
      this.state.selector
    );
  };
  /// Sys - Collection - selector --

  /// Sys - LocalStorage - update
  /**
   *
   *
   * @memberof MapsView
   */
  loadData() {
    console.log(new Date().getTime(), "MapsView loadData", this.Collection._name);

    this.Collection.docs = window.$GLOBAL$.Collection[this.Collection._name];

    this.CollectionList = [];
    for (let key in this.Collection.docs) {
      this.CollectionList.push(this.Collection.docs[key]);
    }

    if (
      window.$GLOBAL$.__MapView__.requestReDrawMap
    ) {
      window.$GLOBAL$.__MapView__.requestReDrawMap();
    }
    //TODO loadDataが早すぎるときは、reDrawMapでExtentがnullかも
  }
  /// Sys - LocalStorage - update --

  /**
   *
   *
   * @memberof MapsView
   */
  onRedrawMapSuper = mapExtent => {
    console.log(new Date().getTime(), "MapsView onRedrawMap");
    console.assert(mapExtent, "mapExtent is null");

    this.mapExtent = mapExtent;
  };

  /**
   *
   *
   * @memberof MapsView
   */
  getDocsInMapViewSuper = (pathCoordinates) => {
    console.log(new Date().getTime(), "MapsView getDocsInMapView");

    if (!this.mapExtent) {
      console.log(
        new Date().getTime(),
        "View getDocsInMapView ! this.mapExtent"
      );

      return null;
    }

    const targetCollectionDocs = [];

    for (let key in this.Collection.docs) {
      const doc = this.Collection.docs[key];
      if (!_.get(doc, pathCoordinates)) {
        continue;
      }

      const p = _.get(doc, pathCoordinates);
      if (
        p[0] < this.mapExtent.minWorld.x - 0.001 ||
        p[0] > this.mapExtent.maxWorld.x + 0.001
      ) {
        continue;
      }
      if (
        p[1] < this.mapExtent.minWorld.y - 0.001 ||
        p[1] > this.mapExtent.maxWorld.y + 0.001
      ) {
        continue;
      }
      targetCollectionDocs.push(this.Collection.docs[key]);
    }

    return targetCollectionDocs;
  };

  /**
   *
   *
   * @param {*} posWorld
   * @returns
   * @memberof MapsView
   */
  world2tokyo(posWorld) {
    console.assert(posWorld, "posWorld is null");

    let ret = proj4("EPSG:4326", "EPSG:4301", posWorld);
    ret = [Math.round(ret[0] * 3600000), Math.round(ret[1] * 3600000)];
    return ret;
  }
}
