/// Sys - View
import React from "react";
/// Sys - View --

/// Custom - AutoForm - collection
import { Maps_Consumers_Collection } from "@imports/api/Maps/Consumers_Collection";
console.assert(
  Maps_Consumers_Collection,
  "Maps_Consumers_Collection is undefined."
);
/// Custom - AutoForm - collection --

/// Sys - LocalStorage
import { MapsView } from "../MapsView";
import { Maps_ConsumersSum_Collection } from "@imports/api/Maps/ConsumersSum_Collection";
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
import { Maps_Consumers_View_Insert } from "./View_Insert";
import { Maps_Consumers_View_Update } from "./View_Update";
/// Application --

/**
 *
 *
 * @class ConsumersLocalCollection
 * @extends {MapsLocalCollection}
 */
export class ConsumersView extends MapsView {
  "use strict";

  /**
   *Creates an instance of _Maps_Consumers_View.
   * @param {*} props
   * @memberof _Maps_Consumers_View
   */
  constructor(props) {
    console.log(new Date().getTime(), "ConsumersLocalCollection constructor");
    super(props);

    /// Custom - LocalStorage
    /// Custom - AutoForm - rebuild field
    this.Collection = {
      _name: "Maps_Consumers",
      docs: {},
      simpleSchema: Maps_Consumers_Collection.simpleSchema(),
      dispTitle: Maps_Consumers_Collection.dispTitle
    };
    this.Form_name = this.Collection._name;
    /// Custom - AutoForm - rebuild field --
    this.SumCollection = Maps_ConsumersSum_Collection;
    /** @type {any[]} */
    this.CollectionList = [];
    /// Custom - LocalStorage --

    this.state = {
      showUserListModal: false,
      showRoomListModal: false,
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
   * @memberof ConsumersLocalCollection
   */
  getDocsInMapView = () => {
    console.log(new Date().getTime(), "ConsumersLocalCollection getDocsInMapView");

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
      doc.flag = "b";
    });

    mingo.find(targetCollectionDocs, query).map(doc => {
      doc.flag = "r";
    });
    /// Custom - Collection - query --

    return targetCollectionDocs;
  };

  /**
   *
   *
   * @memberof ConsumersLocalCollection
   */
  onClickMap = (posWorld) => {
    console.log(new Date().getTime(), "ConsumersLocalCollection onClickMap", posWorld);
    console.assert(posWorld, "posWorld is null");

    const pathPolygonTokyo = "residenceAddress.location.shape.polygonTokyo";
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
   * @memberof ConsumersLocalCollection
   */
  getPolygonCallback = (obj, posWorld, polygonTokyo) => {
    console.log(
      new Date().getTime(),
      "ConsumersLocalCollection getAddressCallback",
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
   * @memberof ConsumersLocalCollection
   */
  getAddressCallback = (obj, ret) => {
    console.log(new Date().getTime(), "ConsumersLocalCollection getAddressCallback", obj, ret);

    if (!ret) {
      return;
    }

    this.setState({ showUserListModal: true, clickedPoint: ret });
  };

  /**
   *
   *
   * @memberof ConsumersLocalCollection
   */
  getAddressCallbackError = () => {
  };

  /**
   *
   *
   * @memberof ConsumersLocalCollection
   */
  onRedrawMap = (mapExtent) => {
    console.log(new Date().getTime(), "View onRedrawMap");
    console.assert(mapExtent, "mapExtent is null");

    const pathPolygonTokyo = "residenceAddress.location.shape.polygonTokyo";
    this.mapExtent = mapExtent;

    const targetCollectionDocs = this.getDocsInMapView();

    if (!targetCollectionDocs) {
      console.log(
        new Date().getTime(),
        "ConsumersLocalCollection onRedrawMap ! targetCollectionDocs return"
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
        flag: "p"
      });
    }

    window.$GLOBAL$.__MapView__.drawBuildings(this.shapesTokyo);
  };

  /**
   *
   *
   * @param {*} error
   * @memberof ConsumersLocalCollection
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
   * @memberof ConsumersLocalCollection
   */
  closeUserModal() {
    this.setState({
      showUserListModal: false,
      showRoomListModal: false,
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
   * @memberof _Maps_Consumers_View
   */
  render() {
    console.log(new Date().getTime(), "ConsumersLocalCollection render");

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
        <this.renderRoomListModal />
        <this.renderMapSelectorModal />

      </React.Fragment>
    );
  }
  /// Custom - View - layout --

  /* global index */
  /* global docId */
  /* global room */

  /**
   *
   *
   * @memberof _Maps_Consumers_View
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
            <If condition={this.state.clickedPoint.rooms.length == 1}>
              <MDBBtn
                color="info"
                onClick={() => {
                  const doc = {
                    residenceAddress: {
                      address: $.extend(
                        true,
                        {},
                        this.state.clickedPoint.address
                      ),
                      location: $.extend(
                        true,
                        {},
                        this.state.clickedPoint.location
                      )
                    }
                  };
                  doc.residenceAddress.address.addressRoomNo = "";
                  doc.residenceAddress.address.shopName = "";

                  this.setState({
                    showRoomListModal: false,
                    insertDocState: true,
                    updateDocState: false,
                    insertDoc: doc
                  });
                }}
                className="btnfont"
              >
                新規追加
                </MDBBtn>
            </If>
          }

          {
            <If condition={this.state.clickedPoint.rooms.length > 1}>
              <MDBBtn
                color="info"
                onClick={() => {
                  this.setState({ showRoomListModal: true });
                }}
                className="btnfont"
              >
                新規追加・建物情報参照
                </MDBBtn>
            </If>
          }

          {
            <If condition={this.state.insertDocState}>
              <Maps_Consumers_View_Insert
                doc={this.state.insertDoc}
                address={this.state.clickedPoint.address}
                location={this.state.clickedPoint.location}
                closeUserModal={this.closeUserModal}
              />
            </If>
          }

          {
            <If condition={this.state.updateDocState}>
              <Maps_Consumers_View_Update
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
   * @memberof _Maps_Consumers_View
   */
  renderRoomListModal = () => {
    return (
      <MDBModal
        isOpen={this.state.showRoomListModal}
        toggle={() => {
          this.setState({ showRoomListModal: false });
        }}
      >
        <MDBModalHeader
          toggle={() => {
            this.setState({ showRoomListModal: false });
          }}
        >
          部屋選択
          </MDBModalHeader>
        <MDBModalBody>
          {
            <For each="room" index="index" of={this.state.clickedPoint.rooms}>
              <div key={index}>
                <MDBBtn
                  color="info"
                  onClick={() => {
                    const doc = {
                      identity: {
                        name: room.lastName
                      },
                      residenceAddress: {
                        address: $.extend(
                          true,
                          {},
                          this.state.clickedPoint.address
                        ),
                        location: $.extend(
                          true,
                          {},
                          this.state.clickedPoint.location
                        )
                      }
                    };
                    doc.residenceAddress.address.addressRoomNo = room.roomNo;
                    doc.residenceAddress.address.shopName = room.shopName;

                    this.setState({
                      showRoomListModal: false,
                      insertDocState: true,
                      updateDocState: false,
                      insertDoc: doc
                    });
                  }}
                  className="btnfont"
                >
                  選択
                  </MDBBtn>
                {room.roomNo}
                {room.lastName}
                {room.shopName}
              </div>
            </For>
          }
          <MDBBtn
            color="info"
            onClick={() => {
              const doc = {
                residenceAddress: {
                  address: $.extend(
                    true,
                    {},
                    this.state.clickedPoint.address
                  ),
                  location: $.extend(
                    true,
                    {},
                    this.state.clickedPoint.location
                  )
                }
              };
              doc.residenceAddress.address.addressRoomNo = "";
              doc.residenceAddress.address.shopName = "";

              this.setState({
                showRoomListModal: false,
                insertDocState: true,
                updateDocState: false,
                insertDoc: doc
              });
            }}
            className="btnfont"
          >
            選択
            </MDBBtn>
          それ以外
          </MDBModalBody>
      </MDBModal>
    );
  }

  /**
   *
   *
   * @memberof _Maps_Consumers_View
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
