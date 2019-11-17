/// Sys - View
import React from "react";
/// Sys - View --

/// Custom - AutoForm - collection
import { Maps_Pins_Collection } from "@imports/api/Maps/Pins_Collection";
console.assert(
  Maps_Pins_Collection,
  "Maps_Pins_Collection is undefined."
);
/// Custom - AutoForm - collection --

/// Sys - LocalStorage
import { MapsView } from "../MapsView";
import { Maps_PinsSum_Collection } from "@imports/api/Maps/PinsSum_Collection";
/// Sys - LocalStorage

/// Custom - Collection - selector
import { View_Selector } from "./View_Selector";
/// Custom - Collection - selector --

/// Sys - Collection - insert
import mingo from "mingo";
/// Sys - Collection - insert --

/// Sys - Map
const classifyPoint = require("robust-point-in-polygon");
import _ from "lodash";
/// Sys - Map --

/// Application
import { MDBModal, MDBModalHeader, MDBModalBody, MDBBtn } from "mdbreact";
import { Maps_Pins_View_Insert } from "./View_Insert";
import { Maps_Pins_View_Update } from "./View_Update";
/// Application --

/**
 *
 *
 * @class PinsLocalCollection
 * @extends {MapsLocalCollection}
 */
export class PinsView extends MapsView {
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
      showUserListModal: false,
      showMapSelectorModal: false,

      selector: {
        tags: {
          or: [],
          not: [],
          and: []
        },
      },

      clickedPoint: {
        address: {},
        location: {},
        rooms: [],
        message: ""
      },

      insertDocState: false,
      insertDoc: {},
      updateDocState: false,
      updateDocId: null,
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
  }

  /**
   *
   *
   * @memberof PinsLocalCollection
   */
  getDocsInMapView = () => {
    console.log(new Date().getTime(), "PinsLocalCollection getDocsInMapView");

    const targetCollectionDocs = this.getDocsInMapViewSuper("residenceAddress.location.pos.coordinates");

    /// Custom - Collection - selector
    const query = {};

    if (this.state.showNormal) {
      query["_deleted"] = null;
    }

    const tags = [];
    if (
      this.state.selector.tags &&
      this.state.selector.tags.or &&
      this.state.selector.tags.or.length > 0
    ) {
      tags.push({ tags: { $in: this.state.selector.tags.or } });
    }
    if (
      this.state.selector.tags &&
      this.state.selector.tags.not &&
      this.state.selector.tags.not.length > 0
    ) {
      tags.push({ tags: { $not: { $in: this.state.selector.tags.not } } });
    }
    if (
      this.state.selector.tags &&
      this.state.selector.tags.and &&
      this.state.selector.tags.and.length > 0
    ) {
      tags.push({ tags: { $all: this.state.selector.tags.and } });
    }
    if (tags.length > 0) {
      query["$and"] = tags;
    }
    console.log("List render query", query);
    /// Custom - Collection - selector --

    /// Custom - Collection - sort
    /// Custom - Collection - sort --

    /// Custom - Collection - query
    targetCollectionDocs.map(doc => {
      doc.flag = "0";
    });

    mingo.find(targetCollectionDocs, query).map(doc => {
      doc.flag = "0";
    });
    /// Custom - Collection - query --

    return targetCollectionDocs;
  };

  /**
   *
   *
   * @memberof PinsLocalCollection
   */
  onClickMap = (posWorld) => {
    console.log(new Date().getTime(), "PinsLocalCollection onClickMap", posWorld);
    console.assert(posWorld, "posWorld is null");

    const pathPolygonTokyo = "location.shape.polygonTokyo";
    const targetCollectionDocs = this.getDocsInMapView();

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
      123,
      posWorld,
      targetCollectionDocs
    );

    // 登録済みDocs
    this.clickedPointCollectionDocIds = [];
    const posTokyo = this.world2tokyo(posWorld);
    for (let idx in targetCollectionDocs) {
      const doc = targetCollectionDocs[idx];
      if (!_.get(doc, pathPolygonTokyo)) {
        continue;
      }

      // 指定地点をPolygonが含むか？
      const polygonTokyo = _.get(doc, pathPolygonTokyo);
      for (let p in polygonTokyo) {
        if (classifyPoint(polygonTokyo[p], posTokyo) != 1) {
          this.clickedPointCollectionDocIds.push(targetCollectionDocs[idx]._id);
          break;
        }
      }
    }
  };

  /**
   *
   *
   * @memberof PinsLocalCollection
   */
  getPolygonCallback = (obj, posWorld, polygonTokyo) => {
    console.log(
      new Date().getTime(),
      "PinsLocalCollection getAddressCallback",
      obj,
      posWorld,
      polygonTokyo
    );

    if (!polygonTokyo) {
      return;
    }

    this.clickedPointPolygonTokyo = polygonTokyo;
    window.$GLOBAL$.__MapView__.requestReDrawMap();
  };

  /**
   *
   *
   * @memberof PinsLocalCollection
   */
  getAddressCallback = (obj, ret) => {
    console.log(new Date().getTime(), "PinsLocalCollection getAddressCallback", obj, ret);

    if (!ret) {
      return;
    }

    this.setState({ showUserListModal: true, clickedPoint: ret });
  };

  /**
   *
   *
   * @memberof PinsLocalCollection
   */
  getAddressCallbackError = () => {
  };

  /**
   *
   *
   * @memberof PinsLocalCollection
   */
  onRedrawMap = (mapExtent) => {
    console.log(new Date().getTime(), "View onRedrawMap");
    console.assert(mapExtent, "mapExtent is null");

    const pathPolygonTokyo = "location.shape.polygonTokyo";
    this.mapExtent = mapExtent;

    const targetCollectionDocs = this.getDocsInMapView();

    if (!targetCollectionDocs) {
      console.log(
        new Date().getTime(),
        "PinsLocalCollection onRedrawMap ! targetCollectionDocs return"
      );
      return;
    }

    this.shapesTokyo = [];
    for (let idx in targetCollectionDocs) {
      this.shapesTokyo.push({
        polygon: _.get(targetCollectionDocs[idx], pathPolygonTokyo),
        flag: targetCollectionDocs[idx].flag
      });
    }

    if (this.clickedPointPolygonTokyo) {
      this.shapesTokyo.push({
        polygon: this.clickedPointPolygonTokyo,
        flag: "0"
      });
    }

    window.$GLOBAL$.__MapView__.drawBuildings(this.shapesTokyo);
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
   * @memberof PinsLocalCollection
   */
  closeUserModal() {
    this.setState({
      showUserListModal: false,
      insertDocState: false,
      updateDocState: false,
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
        <MDBBtn
          color="info"
          onClick={() => {
            this.setState({ showMapSelectorModal: true });
          }}
          className="btnfont"
        >
          タグ選択
        </MDBBtn>

        <this.renderUserListModal />
        <this.renderMapSelectorModal />

      </React.Fragment>
    );
  }
  /// Custom - View - layout --

  /* global index */
  /* global docId */

  /**
   *
   *
   * @memberof _Maps_Pins_View
   */
  renderUserListModal = () => {
    return (
      <MDBModal
        isOpen={this.state.showUserListModal}
        toggle={() => {
          this.closeUserModal();
        }}
      >
        <MDBModalHeader
          toggle={() => {
            this.closeUserModal();
          }}
        >
          入力
          </MDBModalHeader>
        <MDBModalBody>
          {
            <If condition={this.state.clickedPoint.address}>
              {this.state.clickedPoint.address.postalCode}
              {this.state.clickedPoint.address.prefecture}
              {this.state.clickedPoint.address.addressCity}
              {this.state.clickedPoint.address.addressTown}
              {this.state.clickedPoint.address.addressNumber}
              {this.state.clickedPoint.address.addressBuilding}
              {this.state.clickedPoint.address.addressRoomNo}
              {this.state.clickedPoint.address.shopName}
            </If>
          }

          {
            <For
              each="docId"
              index="index"
              of={this.clickedPointCollectionDocIds}
            >
              <MDBBtn
                key={index}
                color="info"
                onClick={() => {
                  this.setState({
                    insertDocState: false,
                    updateDocState: true,
                    updateDocId: docId
                  });
                }}
                className="btnfont"
              >
                {this.Collection.docs[docId].identity.name}
              </MDBBtn>
            </For>
          }

          {
            <If condition={this.state.insertDocState}>
              <Maps_Pins_View_Insert
                doc={this.state.insertDoc}
                address={this.state.clickedPoint.address}
                location={this.state.clickedPoint.location}
                closeUserModal={this.closeUserModal}
              />
            </If>
          }

          {
            <If condition={this.state.updateDocState}>
              <Maps_Pins_View_Update
                match={{ params: { _id: this.state.updateDocId } }}
                address={this.state.clickedPoint.address}
                location={this.state.clickedPoint.location}
                setState={this.setState}
              />
            </If>
          }
        </MDBModalBody>
      </MDBModal>
    );
  }

  /**
   *
   *
   * @memberof _Maps_Pins_View
   */
  renderMapSelectorModal = () => {
    return (
      <MDBModal
        isOpen={this.state.showMapSelectorModal}
        toggle={() => {
          this.setState({ showMapSelectorModal: false });
        }}
      >
        <MDBModalHeader
          toggle={() => {
            this.setState({ showMapSelectorModal: false });
          }}
        >
          TAG
          </MDBModalHeader>
        <MDBModalBody>
          <View_Selector
            updateSelector={this.updateSelector}
            value={this.state.selector}
          />
        </MDBModalBody>
      </MDBModal>
    );
  }
}
