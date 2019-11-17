/// Sys - View
import React from "react";
/// Sys - View --

/// Custom - AutoForm - collection
import { Maps_Consumers_Collection } from "@imports/api/Maps/Consumers_Collection";
console.assert(
  Maps_Consumers_Collection,
  "Maps_Consumers_Collection is undefined."
);

import { Maps_Ranks_Collection } from "@imports/api/Maps/Ranks_Collection";
console.assert(Maps_Ranks_Collection, "Maps_Ranks_Collection is undefined.");
/// Custom - AutoForm - collection --

/// Sys - LocalStorage
import { MapsView_Base } from "../MapsView_Base";
import { Maps_ConsumersSum_Collection } from "@imports/api/Maps/ConsumersSum_Collection";
/// Sys - LocalStorage

/// Sys - Collection - insert
import mingo from "mingo";
/// Sys - Collection - insert --

/// Sys - Map
const classifyPoint = require("robust-point-in-polygon");
import _ from "lodash";
const moji = require("moji");
import moment from "moment";
moment.locale("ja");
const proj4 = require("proj4");
/// Sys - Map --

/// Application
import { Maps_Consumers_View_RoomList } from "./RoomList";
import { Maps_Consumers_View_UserList } from "./UserList";
import { Sel_Tags } from "./Sel_Tags";
/// Application --

import { MDBModalBody } from "mdbreact";
import { MDBModalW } from "../../lib/MDBModalW";

/**
 *
 *
 * @class ConsumersLocalCollection
 * @extends {MapsLocalCollection}
 */
export class ConsumersView extends MapsView_Base {
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
      showSel_Tags: false,

      clickedPoint: {
        address: {},
        location: {},
        rooms: [],
        message: ""
      },

      insertDoc: {},
      tagsDoc: {}
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

    this.ranks = [];
    for (let i = 0; i < 20; i++) {
      this.ranks.push({ color: "#ff0000" });
    }
    const rankRec = Maps_Ranks_Collection.findOne();
    if (rankRec && rankRec.ranks) {
      this.ranks = rankRec.ranks;
    }
  }

  /**
   *
   *
   * @memberof ConsumersLocalCollection
   */
  getDocsInMapView = selector => {
    console.log(
      new Date().getTime(),
      "ConsumersLocalCollection getDocsInMapView"
    );

    const targetCollectionDocs = this.getDocsInMapViewSuper(
      "residenceAddress.location.pos.coordinates",
      0.001,
      0.001
    );

    /// Custom - Collection - selector
    const query = {};

    if (this.state.showNormal) {
      query["_deleted"] = null;
    }

    if (selector.keyword) {
      const keyword = moji(selector.keyword)
        .convert("HG", "KK")
        .convert("HK", "ZK")
        .convert("ZE", "HE")
        .toString();
      const selectorKeyword = new RegExp(".*" + keyword + ".*", "i");
      query["keyword"] = selectorKeyword;
    }

    if (selector.createdAtFrom) {
      const tmp = new Date(
        moment(selector.createdAtFrom).format("YYYY/MM/DDT00:00:00")
      );
      query["createdAt"] = { $gt: tmp };
    }

    if (selector.createdAtTo) {
      const tmp = new Date(
        moment(selector.createdAtTo).format("YYYY/MM/DDT23:59:59")
      );
      query["createdAt"] = { $lt: tmp };
    }

    if (selector && selector.lastVisits && selector.lastVisits.length > 0) {
      const cond = [];
      const now = new Date().getTime();
      const m6 = new Date(
        moment(now)
          .subtract(6, "months")
          .toISOString()
      );
      const m12 = new Date(
        moment(now)
          .subtract(12, "months")
          .toISOString()
      );

      if (selector.lastVisits.indexOf("1m") != -1) {
        const tmp = { "communicationsLast.modifiedAt": { $gt: m6 } };
        cond.push(tmp);
      }
      if (selector.lastVisits.indexOf("6m") != -1) {
        const tmp = {
          $and: [
            { "communicationsLast.modifiedAt": { $lte: m6 } },
            { "communicationsLast.modifiedAt": { $gt: m12 } }
          ]
        };
        cond.push(tmp);
      }
      if (selector.lastVisits.indexOf("12m") != -1) {
        const tmp = { "communicationsLast.modifiedAt": { $lte: m12 } };
        cond.push(tmp);
      }
      if (selector.lastVisits.indexOf("none") != -1) {
        const tmp = { "communicationsLast.modifiedAt": { $exists: false } };
        cond.push(tmp);
      }
      query["$or"] = cond;
    }

    if (selector && selector.visitStatus && selector.visitStatus.length > 0) {
      query["communicationsLast.type"] = { $in: selector.visitStatus };
    }

    if (selector && selector.ranks && selector.ranks.length > 0) {
      query["rank"] = { $in: selector.ranks };
    }

    const tags = [];
    if (
      selector &&
      selector.tags &&
      selector.tags.or &&
      selector.tags.or.length > 0
    ) {
      tags.push({ tags: { $in: selector.tags.or } });
    }
    if (
      selector &&
      selector.tags &&
      selector.tags.not &&
      selector.tags.not.length > 0
    ) {
      tags.push({ tags: { $not: { $in: selector.tags.not } } });
    }
    if (
      selector &&
      selector.tags &&
      selector.tags.and &&
      selector.tags.and.length > 0
    ) {
      tags.push({ tags: { $all: selector.tags.and } });
    }
    if (tags.length > 0) {
      query["$and"] = tags;
    }
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
   * @memberof ConsumersLocalCollection
   */
  onClickMap = posWorld => {
    console.log(
      new Date().getTime(),
      "ConsumersLocalCollection onClickMap",
      posWorld
    );
    console.assert(posWorld, "posWorld is null");

    const pathPolygonTokyo = "residenceAddress.location.shape.polygonTokyo";
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
      "consumers",
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

    if (this.clickedPointCollectionDocIds.length) {
      this.setState({ showUserListModal: true, clickedPoint: null });
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
    console.log(
      new Date().getTime(),
      "ConsumersLocalCollection getAddressCallback",
      obj,
      ret
    );

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
  getAddressCallbackError = () => {};

  /**
   *
   *
   * @param {number[]} posTokyo
   * @returns
   * @memberof MapViewZnet
   */
  tokyo2world(posTokyo) {
    console.assert(posTokyo, "posTokyo is null");

    const ret = proj4("EPSG:4301", "EPSG:4326", [
      posTokyo[0] / 3600000,
      posTokyo[1] / 3600000
    ]);
    return ret;
  }

  /**
   *
   *
   * @memberof ConsumersLocalCollection
   */
  onRedrawMap = (mapExtent, selector, showVisitSymbol) => {
    console.log(new Date().getTime(), "View onRedrawMap");
    console.assert(mapExtent, "mapExtent is null");

    this.mapExtent = mapExtent;

    const targetCollectionDocs = this.getDocsInMapView(selector);

    if (!targetCollectionDocs) {
      console.log(
        new Date().getTime(),
        "ConsumersLocalCollection onRedrawMap ! targetCollectionDocs return"
      );
      return;
    }

    // 建物毎に集約
    const pathPolygonTokyo = "residenceAddress.location.shape.polygonTokyo";
    const pathCommunicationsLastModifiedAt = "communicationsLast.modifiedAt";
    const targetCollectionBuildings = {};
    targetCollectionDocs.map(doc => {
      const ml = _.get(doc, pathCommunicationsLastModifiedAt) || 99999999999;
      const p = _.get(doc, pathPolygonTokyo);
      const p0 = p[0][0];
      const rank = Number(doc.rank || 10);
      if (p) {
        const building = targetCollectionBuildings[p0];
        if (building) {
          building.flag = "2";
          building.rankHist[rank]++;
          if (building.communicationsLast > ml) {
            building.communicationsLast = ml;
          }
        } else {
          const buildingNew = {
            flag: "1",
            communicationsLast: ml,
            rankHist: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            polygonTokyo: p
          };
          buildingNew.rankHist[rank]++;
          targetCollectionBuildings[p0] = buildingNew;
        }
      }
    });

    // 建物単位で形状、最終訪問日、ランクを算出
    this.shapesTokyo = [];
    Object.keys(targetCollectionBuildings).map(p0 => {
      const building = targetCollectionBuildings[p0];
      const rankCount = _.max(building.rankHist);
      let rank = building.rankHist.indexOf(rankCount);
      this.shapesTokyo.push({
        polygon: building.polygonTokyo,
        flag: building.flag,
        color: this.ranks[rank].color
      });
    });

    if (this.clickedPointPolygonTokyo) {
      this.shapesTokyo.push({
        polygon: this.clickedPointPolygonTokyo,
        flag: "p"
      });
    }

    window.$GLOBAL$.__MapView__.drawBuildings(this.shapesTokyo);

    if (showVisitSymbol) {
      const symbols = [];
      const now = new Date().getTime();
      Object.keys(targetCollectionBuildings).map(p0 => {
        const building = targetCollectionBuildings[p0];
        const p = building.polygonTokyo[0];
        const po = p[0];
        const ph = p[Math.ceil(p.length / 2)];
        const pc = [po[0] * 0.8 + ph[0] * 0.2, po[1] * 0.8 + ph[1] * 0.2];

        let color = "#888888";
        let id = "visit_gray";
        let days = "";
        if (building.communicationsLast != 99999999999) {
          days = moment(now).diff(building.communicationsLast, "days");
          const months = moment(now).diff(
            building.communicationsLast,
            "months"
          );
          if (months >= 12) {
            color = "#FF6666";
            id = "visit_red";
          } else if (months > 6) {
            color = "#FFCC00";
            id = "visit_yellow";
          } else {
            color = "#33CC99";
            id = "visit_green";
          }
        }

        let symbol = "status-1";
        if (days >= 10) {
          symbol = "status-2";
        }
        if (days >= 100) {
          symbol = "status-3";
        }

        symbols.push({
          posWorld: this.tokyo2world(pc),
          flag: "1",
          symbol: symbol,
          color: color,
          text: String(days),
          id: id
        });
      });

      setTimeout(
        () => window.$GLOBAL$.__MapView__.drawSymbols(symbols, {}),
        100
      );
    }
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
   * @memberof ConsumersLocalCollection
   */
  closeUserModal() {
    this.setState({
      showUserListModal: false,
      insertDoc: {}
    });
  }

  /**
   *
   *
   * @memberof ConsumersLocalCollection
   */
  showRoomListModal = addRoomFunc => {
    this.addRoomFunc = addRoomFunc;
    this.setState({ showRoomListModal: true });
  };

  /**
   *
   *
   * @memberof ConsumersLocalCollection
   */
  closeRoomListModal = () => {
    this.setState({ showRoomListModal: false });
  };

  /**
   *
   *
   * @memberof ConsumersLocalCollection
   */
  addRoom = room => {
    this.props.addRoom(room);
  };

  /**
   *
   *
   * @memberof ConsumersLocalCollection
   */
  showTagListModal = (addTagFunc, doc) => {
    console.log("showTagListModal ===================", doc);
    this.addTagFunc = addTagFunc;
    this.setState({ showSel_Tags: true, tagsDoc: doc });
  };

  /**
   *
   *
   * @memberof MapsSP_Consumers_Detail
   */
  toggleTags = () => {
    this.setState({ showSel_Tags: !this.state.showSel_Tags });
  };

  /**
   *
   *
   * @memberof MapsSP_Consumers_Detail
   */
  closeSel_Tags = () => {
    this.setState({ showSel_Tags: false });
  };

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
        <MDBModalW
          isOpen={this.state.showUserListModal}
          toggle={() => {
            this.closeUserModal();
          }}
          className="map6-modal"
          animation="right"
        >
          <Maps_Consumers_View_UserList
            clickedPoint={this.state.clickedPoint}
            docIds={this.clickedPointCollectionDocIds}
            docs={this.Collection.docs}
            showRoomListModal={this.showRoomListModal}
            showTagListModal={this.showTagListModal}
          />
        </MDBModalW>

        <MDBModalW
          size="fluid"
          isOpen={this.state.showRoomListModal}
          toggle={this.closeRoomListModal}
          className="pinmodal-style2"
          id="modal-black"
        >
          <Maps_Consumers_View_RoomList
            clickedPoint={this.state.clickedPoint}
            close={this.closeRoomListModal}
            addRoom={this.addRoomFunc}
          />
        </MDBModalW>

        <MDBModalW
          size="large"
          isOpen={this.state.showSel_Tags}
          toggle={this.toggleTags}
          className="m-0 p-0"
        >
          <MDBModalBody className="m-0 p-0">
            <Sel_Tags
              close={this.closeSel_Tags}
              doc={this.state.tagsDoc}
              addTags={this.addTagFunc}
            />
          </MDBModalBody>
        </MDBModalW>
      </React.Fragment>
    );
  }
  /// Custom - View - layout --
}
