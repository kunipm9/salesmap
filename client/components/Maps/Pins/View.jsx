/// Sys - View
import React from "react";
import { ViewLocalCollection } from "@imports/ui/crud/ViewLocalCollection";
import { withTracker } from "meteor/react-meteor-data";
/// Sys - View --

/// Custom - AutoForm - collection
import { Maps_Pins_Collection } from "@imports/api/Maps/Pins_Collection";
console.assert(Maps_Pins_Collection, "Maps_Pins_Collection is undefined.");
/// Custom - AutoForm - collection --

/// Custom - LocalStorage
import { Maps_PinsSum_Collection } from "@imports/api/Maps/PinsSum_Collection";
/// Custom - LocalStorage --

/// Sys - Collection - insert
import { Session } from "meteor/session";
import { Persister } from "@imports/api/lib/persist-method";
import { Random } from "meteor/random";
/// Sys - Collection - insert --

/// Sys - Role
import { checkSystemRole, checkAppRole } from "@imports/ui/crud/checkRole";
/// Sys - Role --

/// Application
import { MDBBtn } from "mdbreact";
import { MapView } from "@imports/ui/utils/MapView";
import _ from "lodash";
/// Application --

/// Custom - Role - check permission
/**
 *
 *
 * @param {*} mode
 * @returns
 */
export const Maps_Pins_View_ComponentInfo = mode => {
  if (!checkAppRole("Maps.Pins", mode)) {
    return null;
  }

  if (checkSystemRole()) {
    return null;
  }

  /// Application
  return { title: "Maps/Pins/View", path: "/Maps/Pins/View" };
  /// Application --
};
/// Custom - Role - check permission --

/**
 *
 *
 * @class _Maps_Pins_View
 * @extends {ViewLocalCollection}
 */
class _Maps_Pins_View extends ViewLocalCollection {
  /**
   *Creates an instance of _Maps_Pins_View.
   * @param {*} props
   * @memberof _Maps_Pins_View
   */
  constructor(props) {
    super(props);

    /// Custom - Role - check permission
    this.ComponentInfo = Maps_Pins_View_ComponentInfo;
    /// Custom - Role - check permission --

    /// Custom - LocalStorage
    /// Custom - AutoForm - rebuild field
    this.Collection = {
      _name: "Maps_Pins",
      docs: {},
      simpleSchema: Maps_Pins_Collection.simpleSchema(),
      dispTitle: Maps_Pins_Collection.dispTitle
    };
    this.Form_name = this.Collection._name;
    /// Custom - AutoForm - rebuild field --
    this.SumCollection = Maps_PinsSum_Collection;
    /** @type {any[]} */
    this.CollectionList = [];
    /// Custom - LocalStorage --

    this.state = {
      confirmTarget: null,
      confirmDelete: false,
      zoom: 9,
      viewMode: 0
    };

    this.center = [139.767125, 35.681236];
    this.mapExtent = null;

    this.deleteMap = this.deleteMap.bind(this);

    this.onClickMap = this.onClickMap.bind(this);
    this.onDblClickMap = this.onDblClickMap.bind(this);
    this.onRedrawMap = this.onRedrawMap.bind(this);

    this.updateCallback = this.updateCallback.bind(this);

    this.getBldPolygonCallback = this.getBldPolygonCallback.bind(this);
    this.getBldFeatureCallback = this.getBldFeatureCallback.bind(this);
    this.getAddressCallback = this.getAddressCallback.bind(this);
    this.getAddressCallbackError = this.getAddressCallbackError.bind(this);

    this.myRef = React.createRef();

    this.postConstructor();
  }

  /**
   *
   *
   * @memberof _Maps_Pins_View
   */
  componentDidMount() {
    console.log(new Date().getTime(), "View componentDidMount");

    super.componentDidMount();

    /// Custom - LocalStorage - update
    this.localCollection_redrawProc = this.loadData;
    /// Custom - LocalStorage - update --
  }

  /// Sys - LocalStorage - update
  /**
   *
   *
   * @memberof _Maps_Consumers_View
   */
  loadData() {
    console.log(new Date().getTime(), "loadData", this.Collection._name);

    this.Collection.docs = window.$GLOBAL$.Collection[this.Collection._name];

    this.CollectionList = [];
    for (let key in this.Collection.docs) {
      this.CollectionList.push(this.Collection.docs[key]);
    }

    if (
      this.refs &&
      this.myRef &&
      window.$GLOBAL$.__MapView__ &&
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
   * @memberof _Maps_Pins_View
   */
  handleLocationFound = e => {
    this.setState({
      hasLocation: true,
      latlng: e.latlng
    });
  };

  /**
   *
   *
   * @memberof _Maps_Pins_View
   */
  deleteMap() {
    this.setState({ confirmDelete: false });
  }

  /**
   *
   *
   * @memberof _Maps_Pins_View
   */
  onClickMap = posWorld => {
    console.log(new Date().getTime(), "View click", posWorld);
    console.assert(posWorld, "posWorld is null");

    this.myRef.current.getBldPolygon(123, posWorld);
    this.myRef.current.getBldFeature(123, posWorld);
    this.myRef.current.getAddress(123, posWorld);
  };

  /**
   *
   *
   * @memberof _Maps_Pins_View
   */
  onDblClickMap = posWorld => {
    console.log(new Date().getTime(), "View dbl click", posWorld);
    console.assert(posWorld, "posWorld is null");
  };

  /**
   *
   *
   * @memberof _Maps_Pins_View
   */
  onRedrawMap = mapExtent => {
    console.log(new Date().getTime(), "View onRedrawMap");
    console.assert(mapExtent, "mapExtent is null");

    this.mapExtent = mapExtent;

    this.shapesTokyo = [];

    for (let key in this.Collection.docs) {
      if (!_.get(this.Collection.docs[key], "location.pos.coordinates")) {
        continue;
      }
      if (!_.get(this.Collection.docs[key], "location.shape.polygonTokyo")) {
        continue;
      }

      const p = this.Collection.docs[key].location.pos.coordinates;
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

      this.shapesTokyo.push({
        polygon: this.Collection.docs[key].location.shape.polygonTokyo,
        flag: "0"
      });
    }

    this.myRef.current.clearLayer();

    switch (this.state.viewMode) {
      case 0: this.myRef.current.drawHeatmap(this.shapesTokyo); break;
      case 1: this.myRef.current.drawBuildings(this.shapesTokyo); break;
    }
  };

  /**
   *
   *
   * @memberof _Maps_Pins_View
   */
  getBldPolygonCallback = (obj, posWorld, polygonTokyo) => {
    console.log(
      new Date().getTime(),
      "View getBldPolygonCallback",
      obj,
      polygonTokyo
    );
    console.assert(posWorld, "posWorld is null");
    console.assert(polygonTokyo, "polygonTokyo is null");

    if (!polygonTokyo) {
      console.log(
        new Date().getTime(),
        "View getBldPolygonCallback null return",
        obj,
        polygonTokyo
      );

      return;
    }

    this.myRef.current.drawBuildings([polygonTokyo]);

    const Users_Groups_id = Session.get("Users_Groups_id");
    const location = {
      pos: { type: "Point", coordinates: posWorld },
      shape: { type: "building", polygonTokyo: polygonTokyo }
    };
    const doc = {
      Users_Groups_id: Users_Groups_id,
      title: "add_" + Random.id(15),
      location: location
    };
    Persister.call(
      "Maps_Pins.insert",
      Users_Groups_id,
      doc,
      this.updateCallback
    );
  };

  /**
   *
   *
   * @param {*} error
   * @memberof _Maps_Pins_View
   */
  updateCallback(error) {
    /// Sys - AutoForm - update
    if (error) {
      Bert.alert({
        type: "danger",
        hideDelay: 10000,
        message: `Add failed: ${ error.message }`
      });
    } else {
      Bert.alert({
        type: "success",
        hideDelay: 10000,
        message: "情報を更新しました"
      });
    }
    /// Sys - AutoForm - update --
  }

  /**
   *
   *
   * @memberof _Maps_Pins_View
   */
  getBldFeatureCallback = (obj, ret) => {
    console.log(new Date().getTime(), "View getBldFeatureCallback", obj, ret);
    console.assert(ret, "ret is null");
  };

  /**
   *
   *
   * @memberof _Maps_Pins_View
   */
  getAddressCallback = (obj, ret) => {
    console.log(new Date().getTime(), "View getAddressCallback", obj, ret);
    console.assert(ret, "ret is null");
  };

  /**
   *
   *
   * @memberof _Maps_Pins_View
   */
  getAddressCallbackError = () => {
  };

  /**
   *
   *
   * @memberof _Maps_Pins_View
   */
  getGPS() {
    navigator.geolocation.getCurrentPosition(
      _pos => {
        const posWorld = [_pos.coords.longitude, _pos.coords.latitude];
        this.myRef.current.scrollTo(posWorld);
      },
      e => {
        console.log("getGPS callback error", e);
      }
    );
  }

  /// Custom - View - layout
  /**
   *
   *
   * @returns
   * @memberof _Maps_Pins_View
   */
  render() {
    console.log(new Date().getTime(), "View render");

    /// Custom - Collection - subscribe
    if (this.props.loading) {
      return <span />;
    }
    /// Custom - Collection - subscribe --

    return (
      <React.Fragment>
        <MapView
          ref={this.myRef}
          style={{ width: "100%", height: "400px" }}
          center={this.center}
          onClickMap={this.onClickMap}
          onDblClickMap={this.onDblClickMap}
          onRedrawMap={this.onRedrawMap}
          getBldPolygonCallback={this.getBldPolygonCallback}
          getBldFeatureCallback={this.getBldFeatureCallback}
          getAddressCallback={this.getAddressCallback}
          getAddressCallbackError={this.getAddressCallbackError}
        >
        </MapView>

        <MDBBtn
          color="danger"
          onClick={() => this.setState({ viewMode: 0 })}
          className="btnfont"
        >
          Heatmap
        </MDBBtn>

        <MDBBtn
          color="danger"
          onClick={() => this.setState({ viewMode: 1 })}
          className="btnfont"
        >
          Pins
        </MDBBtn>
      </React.Fragment>
    );
  }
  /// Custom - View - layout --
}

/// Custom - View - tracker
export const Maps_Pins_View = withTracker(() => {
  /// Custom - Collection - subscribe
  const handles = [
    Meteor.subscribe(Maps_PinsSum_Collection._name, Session.get('Users_Groups_id')),
  ];
  const loading = handles.some(handle => !handle.ready());

  return {
    ComponentInfo: Maps_Pins_View_ComponentInfo,
    loading: loading
  };
  /// Custom - Collection - subscribe --
})(_Maps_Pins_View);
/// Custom - View - tracker --
