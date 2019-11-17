/// Sys - View
import React from "react";
import { withTracker } from "meteor/react-meteor-data";
/// Sys - View --

import View from "@imports/ui/crud/View";

/// Custom - LocalStorage
import { ConsumersView } from "./../lib/Consumers/View";
import { Maps_ConsumersSum_Collection } from "@imports/api/Maps/ConsumersSum_Collection";
/// Custom - LocalStorage --

/// Sys - Collection - insert
import { Session } from "meteor/session";
/// Sys - Collection - insert --

/// Sys - Role
import { checkSystemRole, checkAppRole } from "@imports/ui/crud/checkRole";
/// Sys - Role --

/// Sys - Network
import { Persister } from "@imports/api/lib/persist-method";
/// Sys - Network --

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
export const Maps_Consumers_AutoMapView_ComponentInfo = mode => {
  if (!checkAppRole("Maps.Consumers", mode)) {
    return null;
  }

  if (checkSystemRole()) {
    return null;
  }

  /// Application
  return {
    title: "Maps/Consumers/AutoMapView",
    path: "/Maps/Consumers/AutoMapView"
  };
  /// Application --
};
/// Custom - Role - check permission --

/**
 *
 *
 * @class _Maps_Consumers_AutoMapView
 * @extends {View}
 */
class _Maps_Consumers_AutoMapView extends View {
  /**
   *Creates an instance of _Maps_Consumers_AutoMapView.
   * @param {*} props
   * @memberof _Maps_Consumers_AutoMapView
   */
  constructor(props) {
    super(props);

    /// Custom - Role - check permission
    this.ComponentInfo = Maps_Consumers_AutoMapView_ComponentInfo;
    /// Custom - Role - check permission --

    /// Application - Map
    this.center = [139.767125, 35.681236];
    /// Application - Map --

    this.jobStatus = {};

    this.autoMap = this.autoMap.bind(this);
    this.getAddressCallback = this.getAddressCallback.bind(this);

    this.myRefMap = React.createRef();
    this.myRefConsumers = React.createRef();
  }

  /**
   *
   *
   * @memberof _Maps_Consumers_AutoMapView
   */
  autoMap() {
    let delay = 0;
    const targetCollectionDocIds = this.myRefConsumers.current.getDocsInMapView();

    for (let docId of targetCollectionDocIds) {
      const doc = this.myRefConsumers.current.Collection.docs[docId];
      this.jobStatus[doc._id] = { state: '', error: '' };
      this.autoMapBody(doc, delay);
      delay += 1000;
    }
  }

  autoMapBody(doc, delay) {
    const address1 = _.get(doc, "residenceAddress.addressUnrefined.addess1");
    const address2 = _.get(doc, "residenceAddress.addressUnrefined.addess2");
    const name = _.get(doc, "identity.name");

    setTimeout(() => {
      this.jobStatus[doc._id].state = 'start';
      this.displaySlatus();

      window.$GLOBAL$.__MapView__.getAddressByString(
        doc._id,
        address1 + address2,
        name
      );
    }, delay);
  }

  getPolygonCallback = () => { }

  /**
   *
   *
   * @memberof _Maps_Consumers_View
   */
  getAddressCallback = (obj, ret) => {
    console.log(new Date().getTime(), "View getAddressCallback", obj, ret);

    const pathAddress = "residenceAddress.address";
    const pathLocation = "residenceAddress.location";

    if (!ret) {
      return;
    }

    _.set(this.Collection.docs[obj], pathAddress, _.get(ret, pathAddress));
    _.set(this.Collection.docs[obj], pathLocation, _.get(ret, pathLocation));

    const doc = this.Collection.docs[obj];
    const Users_Groups_id = Session.get("Users_Groups_id");

    /// Sys - AutoForm - update
    Persister.call(
      this.Form_name + ".update",
      Users_Groups_id,
      doc._id,
      doc,
      /// Sys - ApplicationError - init
      {
        methodCall: "update",
        proc: this.ComponentInfo("update").title,
        record: this.Collection.dispTitle(doc),
        callAt: Date.now()
      },
      /// Sys - ApplicationError - init --
      this.updateCallback
    );

    this.jobStatus[obj].state = 'end';
    this.displaySlatus();
    /// Sys - AutoForm - update --
  };

  /**
   *
   *
   * @memberof _Maps_Consumers_View
   */
  getAddressCallbackError = (obj) => {
    this.jobStatus[obj].state = 'error';
    this.displaySlatus();
  }
  /**
   *
   *
   * @memberof _Maps_Consumers_View
   */
  displayStatus = () => {
    const totalCount = this.jobStatus.length;
    const endCount = this.jobStatus.filter(e=>e.state=='end');
    const errorCount = this.jobStatus.filter(e=>e.state=='error');
  }

  /**
   *
   *
   * @memberof _Maps_Consumers_View
   */
  onRedrawMap = mapExtent => {
    this.myRefConsumers.current.onRedrawMap(mapExtent);
  }

  /// Custom - AutoMapView - layout
  /**
   *
   *
   * @returns
   * @memberof _Maps_Consumers_AutoMapView
   */
  render() {
    console.log(new Date().getTime(), "AutoMapView render");

    /// Custom - Collection - subscribe
    if (this.props.loading) {
      return <span />;
    }
    /// Custom - Collection - subscribe --

    return (
      <React.Fragment>
        <MDBBtn
          color="info"
          onClick={this.autoMap}
          className="btnfont"
        >
          自動地図落し実行
        </MDBBtn>

        <MapView
          ref={this.myRefMap}
          style={{ width: "1px", height: "1px" }}
          center={this.center}
          onRedrawMap={this.onRedrawMap}
          getAddressCallback={this.getAddressCallback}
          getPolygonCallback={this.getPolygonCallback}
          getAddressCallbackError={this.getAddressCallbackError}
        />

        <ConsumersView
          ref={this.myRefConsumers}
        />

      </React.Fragment>
    );
  }
  /// Custom - AutoMapView - layout --
}

/// Custom - AutoMapView - tracker
export const Maps_Consumers_AutoMapView = withTracker(() => {
  /// Custom - Collection - subscribe
  const handles = [
    Meteor.subscribe(Maps_ConsumersSum_Collection._name, Session.get('Users_Groups_id')),
  ];
  const loading = handles.some(handle => !handle.ready());
  console.log(
    new Date().getTime(),
    "Maps_Consumers_AutoMapView loading",
    loading
  );

  return {
    ComponentInfo: Maps_Consumers_AutoMapView_ComponentInfo,
    loading: loading
  };
  /// Custom - Collection - subscribe --
})(_Maps_Consumers_AutoMapView);
/// Custom - AutoMapView - tracker --
