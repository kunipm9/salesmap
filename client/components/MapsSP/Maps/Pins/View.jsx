/// Sys - View
import React from "react";
/// Sys - View --

/// Custom - AutoForm - collection
import { Maps_Pins_Collection } from "@imports/api/Maps/Pins_Collection";
console.assert(Maps_Pins_Collection, "Maps_Pins_Collection is undefined.");
/// Custom - AutoForm - collection --

/// Sys - LocalStorage
import { MapsView_Base } from "../MapsView_Base";
import { Maps_PinsSum_Collection } from "@imports/api/Maps/PinsSum_Collection";
/// Sys - LocalStorage

/// Custom - AutoForm - collection
import { Maps_PinCategorys_Collection } from "@imports/api/Maps/PinCategorys_Collection";
console.assert(
  Maps_PinCategorys_Collection,
  "Maps_PinCategorys_Collection is undefined."
);
/// Custom - AutoForm - collection --

/// Sys - Collection - insert
import mingo from "mingo";
/// Sys - Collection - insert --

/// Sys - Map
import _ from "lodash";
/// Sys - Map --

/// Application
import { MDBModal } from "mdbreact";
import { Edit } from "./Edit";
/// Application --

/**
 *
 *
 * @class PinsLocalCollection
 * @extends {MapsLocalCollection}
 */
export class PinsView extends MapsView_Base {
  "use strict";

  /**
   *Creates an instance of _Maps_Pins_View.
   * @param {*} props
   * @memberof _Maps_Pins_View
   */
  constructor(props) {
    console.log(new Date().getTime(), "PinsLocalCollection constructor");
    super(props);

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
      clickedPoint: {
        address: {},
        location: {},
        rooms: [],
        message: ""
      },

      showInsertModal: false,
      insertDoc: {},
      showUpdateModal: false,
      updateDocId: null
    };

    this.getDocsInMapView = this.getDocsInMapView.bind(this);
    this.onClickMap = this.onClickMap.bind(this);

    this.getPolygonCallback = this.getPolygonCallback.bind(this);
    this.getAddressCallback = this.getAddressCallback.bind(this);
    this.getAddressCallbackError = this.getAddressCallbackError.bind(this);

    this.onRedrawMap = this.onRedrawMap.bind(this);

    this.updateCallback = this.updateCallback.bind(this);

    this.closeUserModal = this.closeUserModal.bind(this);

    this.postConstructor();

    const cat = Maps_PinCategorys_Collection.findOne();
    this.cat2Dict = {};
    if (cat && cat.cat1) {
      for (let i = 0; i < cat.cat1.length; i++) {
        for (let j = 0; j < (cat.cat1[i].cat2 || []).length; j++) {
          const cat2 = cat.cat1[i].cat2[j];
          if (cat2) {
            cat2.image = new Image();
            cat2.image.src = cat2.bitmap;
            this.cat2Dict[cat2.id] = cat2;
          }
        }
      }
    }
  }

  /**
   *
   *
   * @memberof PinsLocalCollection
   */
  getDocsInMapView = selector => {
    console.log(new Date().getTime(), "PinsLocalCollection getDocsInMapView");

    const targetCollectionDocs = this.getDocsInMapViewSuper(
      "residenceAddress.location.pos.coordinates",
      0.00005,
      0.00005
    );

    /// Custom - Collection - selector
    const query = {};

    if (this.state.showNormal) {
      query["_deleted"] = null;
    }

    if (selector && selector.pinCategorys && selector.pinCategorys.length > 0) {
      query["cat2"] = { $in: selector.pinCategorys };
    }
    console.log("List render query", query);
    /// Custom - Collection - selector --

    /// Custom - Collection - query
    const targetCollectionDocsSelected = [];
    mingo.find(targetCollectionDocs, query).map(doc => {
      targetCollectionDocsSelected.push(doc);
    });
    /// Custom - Collection - query --

    return targetCollectionDocsSelected;
  };

  /**
   *
   *
   * @memberof PinsLocalCollection
   */
  onClickMap = posWorld => {
    console.log(
      new Date().getTime(),
      "PinsLocalCollection onClickMap",
      posWorld
    );
    console.assert(posWorld, "posWorld is null");

    this.clickedPointPos = posWorld;

    const pathPosWorld = "residenceAddress.location.pos.coordinates";
    const targetCollectionDocs = this.getDocsInMapViewSuper(
      "residenceAddress.location.pos.coordinates",
      0.001,
      0.001
    );

    if (!targetCollectionDocs) {
      console.log(
        new Date().getTime(),
        "View onClickMap ! targetCollectionDocs return"
      );
      return;
    }
    if (targetCollectionDocs.count > 1000) {
      console.log(
        new Date().getTime(),
        "View onClickMap targetCollectionDocs.count > 1000 return"
      );
      return;
    }

    // 住所検索
    window.$GLOBAL$.__MapView__.getAddressByPoint(
      "pins",
      posWorld,
      targetCollectionDocs
    );

    // 登録済みDocs
    this.clickedPointCollectionDocId = null;
    for (let idx in targetCollectionDocs) {
      const doc = targetCollectionDocs[idx];
      if (!_.get(doc, pathPosWorld)) {
        continue;
      }

      // 指定地点をPolygonが含むか？
      if (
        window.$GLOBAL$.__MapView__.isNearby(
          _.get(doc, pathPosWorld),
          posWorld,
          32
        )
      ) {
        this.clickedPointCollectionDocId = targetCollectionDocs[idx]._id;
        break;
      }
    }
  };

  /**
   *
   *
   * @memberof PinsLocalCollection
   */
  getPolygonCallback = () => {};

  /**
   *
   *
   * @memberof PinsLocalCollection
   */
  getAddressCallback = (obj, ret) => {
    console.log(
      new Date().getTime(),
      "PinsLocalCollection getAddressCallback",
      obj,
      ret
    );

    if (!ret) {
      return;
    }

    ret.location.pos.coordinates = this.clickedPointPos;

    if (!this.clickedPointCollectionDocId) {
      const doc = {
        residenceAddress: {
          address: ret.address,
          location: ret.location
        }
      };
      doc.residenceAddress.address.addressRoomNo = "";
      doc.residenceAddress.address.shopName = "";

      this.setState({
        clickedPoint: ret,
        showInsertModal: true,
        showUpdateModal: false,
        insertDoc: doc
      });
    }

    if (this.clickedPointCollectionDocId) {
      this.setState({
        clickedPoint: ret,
        showInsertModal: false,
        showUpdateModal: true,
        updateDocId: this.clickedPointCollectionDocId
      });
    }
  };

  /**
   *
   *
   * @memberof PinsLocalCollection
   */
  getAddressCallbackError = () => {};

  /**
   *
   *
   * @memberof PinsLocalCollection
   */
  onRedrawMap = (mapExtent, selector) => {
    console.log(new Date().getTime(), "View onRedrawMap");
    console.assert(mapExtent, "mapExtent is null");

    const pathPosWorld = "residenceAddress.location.pos.coordinates";
    this.mapExtent = mapExtent;

    const targetCollectionDocs = this.getDocsInMapView(selector);

    if (!targetCollectionDocs) {
      console.log(
        new Date().getTime(),
        "PinsLocalCollection onRedrawMap ! targetCollectionDocs return"
      );
      return;
    }

    this.symbols = [];
    for (let idx in targetCollectionDocs) {
      const doc = targetCollectionDocs[idx];
      const cat2 = this.cat2Dict[doc.cat2];

      if (cat2) {
        this.symbols.push({
          posWorld: _.get(doc, pathPosWorld),
          flag: "0",
          symbol: cat2.symbol,
          color: cat2.color,
          text: cat2.shorttitle,
          id: doc.cat2
        });
      } else {
        this.symbols.push({
          posWorld: _.get(doc, pathPosWorld),
          flag: "0",
          symbol: "attention",
          color: "#000000",
          text: "",
          id: doc.cat2
        });
      }
    }

    if (this.clickedPointPos) {
      this.symbols.push({
        posWorld: this.clickedPointPos,
        flag: "p",
        color: "#ffffff",
        symbol: "",
        text: "",
        id: ""
      });
    }

    window.$GLOBAL$.__MapView__.drawSymbols(this.symbols, this.cat2Dict);
  };

  /**
   *
   *
   * @param {*} error
   * @memberof PinsLocalCollection
   */
  updateCallback(error) {
    /// Sys - AutoForm - update
    if (error) {
      Bert.alert({
        type: "danger",
        hideDelay: 10000,
        message: `Add failed: ${error.message}`
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
   * @memberof PinsLocalCollection
   */
  closeUserModal() {
    this.setState({
      showUserListModal: false,
      showRoomListModal: false,
      showInsertModal: false,
      showUpdateModal: false,
      insertDoc: {}
    });
  }

  /// Custom - View - layout
  /**
   *
   *
   * @returns
   * @memberof _Maps_Pins_View
   */
  render() {
    console.log(new Date().getTime(), "PinsLocalCollection render");

    /// Custom - Collection - subscribe
    if (this.props.loading) {
      return <span />;
    }
    /// Custom - Collection - subscribe --

    return (
      <React.Fragment>
        <this.renderInsertModal />
        <this.renderUpdateModal />
      </React.Fragment>
    );
  }
  /// Custom - View - layout --

  /**
   *
   *
   * @memberof _Maps_Pins_View
   */
  renderInsertModal = () => {
    return (
      <MDBModal
        size="large"
        isOpen={this.state.showInsertModal}
        toggle={() => {
          this.setState({ showInsertModal: false });
        }}
        className="m-0 p-0"
      >
        <Edit
          doc={{}}
          address={this.state.clickedPoint.address}
          location={this.state.clickedPoint.location}
          closeEdit={() => this.setState({ showInsertModal: false })}
        />
      </MDBModal>
    );
  };

  /**
   *
   *
   * @memberof _Maps_Pins_View
   */
  renderUpdateModal = () => {
    let doc;

    if (this.state.updateDocId) {
      doc = $.extend(true, {}, this.Collection.docs[this.state.updateDocId]);
      if (doc.residenceAddress) {
        doc.residenceAddress = {};
      }
      doc.residenceAddress.address = this.state.clickedPoint.address;
      doc.residenceAddress.location = this.state.clickedPoint.location;
    }

    return (
      <MDBModal
        size="large"
        isOpen={this.state.showUpdateModal}
        toggle={() => {
          this.setState({ showUpdateModal: false });
        }}
        className="m-0 p-0"
      >
        <Edit
          doc={this.Collection.docs[this.state.updateDocId]}
          address={this.state.clickedPoint.address}
          location={this.state.clickedPoint.location}
          closeEdit={() => this.setState({ showUpdateModal: false })}
        />
      </MDBModal>
    );
  };
}
