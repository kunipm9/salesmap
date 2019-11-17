/// Sys - Tabular
import React from "react";
import { ListLocalCollection } from "@imports/ui/crud/ListLocalCollection";
import InfiniteScroll from "react-infinite-scroll-component";
import mingo from "mingo";
require("jquery.nicescroll");
const moji = require("moji");
import moment from "moment";
moment.locale("ja");
import _ from "lodash";
/// Sys - Tabular --

import { Edit_Info } from "./Edit_Info";

/// Custom - AutoForm - collection
import { Maps_Consumers_Collection } from "@imports/api/Maps/Consumers_Collection";
console.assert(
  Maps_Consumers_Collection,
  "Maps_Consumers_Collection is undefined."
);
//import { Maps_Tags_Collection } from "@imports/api/Maps/Tags_Collection";
//console.assert(Maps_Tags_Collection, "Maps_Tags_Collection is undefined.");
/// Custom - AutoForm - collection --

/// Custom - LocalStorage
import { Maps_ConsumersSum_Collection } from "@imports/api/Maps/ConsumersSum_Collection";
/// Custom - LocalStorage --

/// Custom - Tabular - insert button
import { Session } from "meteor/session";
/// Custom - Tabular - insert button --

/// Sys - Role
import { checkSystemRole, checkAppRole } from "@imports/ui/crud/checkRole";
/// Sys - Role --

import { displayConsumer } from "./utils";

// import start
import { Segment } from "semantic-ui-react";
import { Grid } from "semantic-ui-react";
import { Item } from "semantic-ui-react";
import { Label } from "semantic-ui-react";
import { Icon } from "semantic-ui-react";

import { MDBModalBody } from "mdbreact";
import { MDBModalW } from "../lib/MDBModalW";
// import end

const zeroDate = new Date("0000-01-01").toISOString();

/// Custom - Role - check permission
/**
 *
 *
 * @param {*} mode
 * @returns
 */
export const MapsSP_Consumers_List_ComponentInfo = mode => {
  if (!checkAppRole("MapsSP.Consumers", mode)) {
    return null;
  }

  if (checkSystemRole()) {
    return null;
  }

  return { title: "MapsSP/Consumers/List", path: "/MapsSP/Consumers/List" };
};
/// Custom - Role - check permission --

export class MapsSP_Consumers_List extends ListLocalCollection {
  "use strict";

  /**
   *Creates an instance of _Maps_Consumers_List.
   * @param {*} props
   * @memberof _MapsSP_Consumers_List
   */
  constructor(props) {
    console.log(new Date().getTime(), "Consumers List constructor");
    super(props);

    /// Custom - Tabular - link button
    this.detailPath = "/MapsSP/Consumers/Detail/";
    /// Custom - Tabular - link button --

    /// Custom - Role - check permission
    this.ComponentInfo = MapsSP_Consumers_List_ComponentInfo;
    /// Custom - Role - check permission --

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

    /// Custom - Collection - selector
    this.state.showModal = false;

    this.state.keyword = "";

    this.state.selector = {
      keyword: "",
      createdAtKind: "",
      createdAtFrom: "",
      createdAtTo: "",
      transportationAtKind: "",
      transportationAtFrom: "",
      transportationAtTo: "",
      ranks: [],
      visits: [],
      tags: {
        or: [],
        not: [],
        and: []
      },
      lastVisits: [],
      visitStatus: [],
      pinCategorys: []
    };
    this.state.selectgorString = "";

    this.state.showEdit_Info = false;

    this.state.displayDelay = false;

    //    this.listCursorCount = 0;
    //    this.listCursor = null;
    /// Custom - Collection - selector --

    /// Custom - SortOrder
    this.sortOrder_pre = "name";
    this.sortOrderDsc_pre = true;

    this.dispSortOrder = {
      name: "名前順",
      introduceNum: "紹介者数",
      visitAt: "最終訪問日",
      createdAt: "名簿登録日",
      modifiedAt: "最終更新日"
    };
    this.dispSortOrderAsc = {
      true: "up",
      false: "down"
    };
    /// Custom - SortOrder --

    this.fetchMoreData = this.fetchMoreData.bind(this);
    this.queryDocs = this.queryDocs.bind(this);

    this.debouncedOnScroll = _.debounce(this.debouncedOnScroll.bind(this), 100);

    this.postConstructor();

    this.window_innerHeight = window.innerHeight;
  }

  /**
   *
   *
   * @memberof _MapsSP_Consumers_List
   */
  componentDidMount() {
    console.log(
      new Date().getTime(),
      "Consumers List componentDidMount",
      this.Collection._name
    );

    super.componentDidMount();

    this.props.setSearchKeyword(this.state.selector.keyword || "");

    this.setState({ displayDelay: false });
    setTimeout(() => {
      this.setState({ displayDelay: true });
    }, 100);

    this.props.setParent(this);
  }

  /**
   *
   *
   * @memberof _MapsSP_Consumers_List
   */
  searchByKeyword = keyword => {
    this.updateSelector("keyword", keyword);
  };

  /**
   *
   *
   * @memberof _MapsSP_Consumers_List
   */
  clearCondition = () => {
    this.clearSelectorCondition();
    this.queryDocs();
  };

  /**
   *
   *
   * @memberof _MapsSP_Consumers_List
   */
  getSelector = () => {
    return this.state.selector;
  };

  /**
   *
   *
   * @memberof _MapsSP_Consumers_List
   */
  getMapUrl = () => {
    if (this.state.listItems.length) {
      const pathCoordinates = "residenceAddress.location.pos.coordinates";
      for (let i = 0; i < this.state.listItems.length; i++) {
        const key = this.state.listItems[i][1].key;
        const center = _.get(
          window.$GLOBAL$.Collection[this.Collection._name][key],
          pathCoordinates
        );
        if (!center) {
          continue;
        }
        return "/MapsSP/Maps/ViewPos/" + center[0] + "," + center[1];
      }
    }
    return "/MapsSP/Maps/View";
  };

  /**
   *
   *
   * @memberof MapsSP_Consumers_Detail
   */
  toggleEdit_Info = () => {
    this.setState({ showEdit_Info: !this.state.showEdit_Info });
  };

  /**
   *
   *
   * @memberof MapsSP_Consumers_Detail
   */
  closeEdit_Info = () => {
    this.setState({ showEdit_Info: false });
  };

  /**
   *
   *
   * @memberof _MapsSP_Consumers_List
   */
  queryDocs() {
    console.log(new Date().getTime(), "Consumers List queryDocs");

    /// Custom - Collection - selector
    const query = {};

    if (this.state.showNormal) {
      query["_deleted"] = null;
    }

    if (this.state.selector.keyword) {
      const keyword = moji(this.state.selector.keyword)
        .convert("HG", "KK")
        .convert("HK", "ZK")
        .convert("ZE", "HE")
        .toString();
      const selectorKeyword = new RegExp(".*" + keyword + ".*", "i");
      query["keyword"] = selectorKeyword;
    }

    if (this.state.selector.createdAtFrom) {
      const tmp = new Date(
        moment(this.state.selector.createdAtFrom).format("YYYY/MM/DDT00:00:00")
      );
      query["createdAt"] = { $gt: tmp };
    }

    if (this.state.selector.createdAtTo) {
      const tmp = new Date(
        moment(this.state.selector.createdAtTo).format("YYYY/MM/DDT23:59:59")
      );
      query["createdAt"] = { $lt: tmp };
    }

    if (
      this.state.selector &&
      this.state.selector.lastVisits &&
      this.state.selector.lastVisits.length > 0
    ) {
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

      if (this.state.selector.lastVisits.indexOf("1m") != -1) {
        const tmp = { "communicationsLast.modifiedAt": { $gt: m6 } };
        cond.push(tmp);
      }
      if (this.state.selector.lastVisits.indexOf("1m") != -1) {
        const tmp = {
          $and: [
            { "communicationsLast.modifiedAt": { $lte: m6 } },
            { "communicationsLast.modifiedAt": { $gt: m12 } }
          ]
        };
        cond.push(tmp);
      }
      if (this.state.selector.lastVisits.indexOf("1m") != -1) {
        const tmp = { "communicationsLast.modifiedAt": { $lte: m12 } };
        cond.push(tmp);
      }
      if (this.state.selector.lastVisits.indexOf("none") != -1) {
        const tmp = { "communicationsLast.modifiedAt": { $exists: false } };
        cond.push(tmp);
      }
      query["$or"] = cond;
    }

    if (
      this.state.selector &&
      this.state.selector.visitStatus &&
      this.state.selector.visitStatus.length > 0
    ) {
      query["communicationsLast.type"] = {
        $in: this.state.selector.visitStatus
      };
    }

    if (
      this.state.selector &&
      this.state.selector.ranks &&
      this.state.selector.ranks.length > 0
    ) {
      query["rank"] = { $in: this.state.selector.ranks };
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

    /// Custom - Collection - selector --

    /// Custom - Collection - sort
    switch (this.props.sortOrder) {
      case "name":
        if (this.props.sortOrderDsc) {
          this.CollectionList.sort((a, b) => {
            const _a = a.identity
              ? a.identity.kana
                ? a.identity.kana
                : "追"
              : "追"; // UNICODE 8FFD
            const _b = b.identity
              ? b.identity.kana
                ? b.identity.kana
                : "追"
              : "追"; // UNICODE 8FFD
            return _a < _b ? -1 : _a > _b ? 1 : 0;
          });
        } else {
          this.CollectionList.sort((a, b) => {
            const _a = a.identity
              ? a.identity.kana
                ? a.identity.kana
                : "追"
              : "追"; // UNICODE 8FFD
            const _b = b.identity
              ? b.identity.kana
                ? b.identity.kana
                : "追"
              : "追"; // UNICODE 8FFD
            return _a < _b ? 1 : _a > _b ? -1 : 0;
          });
        }
        break;
      case "introduceNum":
        if (this.props.sortOrderDsc) {
          this.CollectionList.sort((a, b) => {
//communicationsLast.modifiedAt
            const _a = a.introductions
              ? a.introductions.length
                ? a.introductions.length
                : 0
              : 0;
            const _b = b.introductions
              ? b.introductions.length
                ? b.introductions.length
                : 0
              : 0;
            if (_a == _b) return 0;
            return _a < _b ? -1 : 1;
          });
        } else {
          this.CollectionList.sort((a, b) => {
            const _a = a.introductions
              ? a.introductions.length
                ? a.introductions.length
                : 0
              : 0;
            const _b = b.introductions
              ? b.introductions.length
                ? b.introductions.length
                : 0
              : 0;
            if (_a == _b) return 0;
            return _a < _b ? 1 : -1;
          });
        }
        break;
      case "modifiedAt":
        if (this.props.sortOrderDsc) {
          this.CollectionList.sort((a, b) => {
            const _a = a.modifiedAt;
            const _b = b.modifiedAt;
            if (_a == _b) return 0;
            return _a < _b ? -1 : 1;
          });
        } else {
          this.CollectionList.sort((a, b) => {
            const _a = a.modifiedAt;
            const _b = b.modifiedAt;
            if (_a == _b) return 0;
            return _a < _b ? 1 : -1;
          });
        }
        break;
      case "visitAt":
        for(let i = 0; i < this.CollectionList.length; i++) {
          if (this.CollectionList[i].communicationsLast && this.CollectionList[i].communicationsLast.modifiedAt) {
            this.CollectionList[i].communicationsLast.modifiedAt = new Date(this.CollectionList[i].communicationsLast.modifiedAt).toISOString();
          }
        }
        if (this.props.sortOrderDsc) {
          this.CollectionList.sort((a, b) => {
//communicationsLast.modifiedAt
            const _a = a.communicationsLast
              ? a.communicationsLast.modifiedAt
                ? a.communicationsLast.modifiedAt
                : zeroDate
              : zeroDate;
            const _b = b.communicationsLast
              ? b.communicationsLast.modifiedAt
                ? b.communicationsLast.modifiedAt
                : zeroDate
              : zeroDate;
            if (_a == _b) return 0;
            return _a < _b ? -1 : 1;
          });
        } else {
          this.CollectionList.sort((a, b) => {
            const _a = a.communicationsLast
              ? a.communicationsLast.modifiedAt
                ? a.communicationsLast.modifiedAt
                : zeroDate
              : zeroDate;
            const _b = b.communicationsLast
              ? b.communicationsLast.modifiedAt
                ? b.communicationsLast.modifiedAt
                : zeroDate
              : zeroDate;
            if (_a == _b) return 0;
            return _a < _b ? 1 : -1;
          });
        }
        break;
      default:
        if (this.props.sortOrderDsc) {
          this.CollectionList.sort((a, b) => {
            const _a = a.modifiedAt;
            const _b = b.modifiedAt;
            if (_a == _b) return 0;
            return _a < _b ? -1 : 1;
          });
        } else {
          this.CollectionList.sort((a, b) => {
            const _a = a.modifiedAt;
            const _b = b.modifiedAt;
            if (_a == _b) return 0;
            return _a < _b ? 1 : -1;
          });
        }
        break;
    }
    /// Custom - Collection - sort --

    /// Custom - Collection - query
    this.listCursor = mingo.find(this.CollectionList, query);
    this.state.listItems = [];
    this.state.hasMore = true;
    this.state.dataLength = 0;
    this.state.listCursorCount = this.listCursor.count();
    this.listCursor = mingo.find(this.CollectionList, query);
    setTimeout(() => this.fetchMoreData());
    /// Custom - Collection - query --
  }

  /**
   *
   *
   * @memberof _MapsSP_Consumers_List
   */
  clearSelectorCondition = () => {
    const selector = {
      keyword: "",
      createdAtKind: "",
      createdAtFrom: "",
      createdAtTo: "",
      transportationAtKind: "",
      transportationAtFrom: "",
      transportationAtTo: "",
      ranks: [],
      visits: [],
      tags: {
        or: [],
        not: [],
        and: []
      }
    };
    Session.setPersistent(
      this.Collection._name + "_scrollListSelector",
      selector
    );
  };

  /// Custom - InfiniteScroll
  /**
   *
   *
   * @memberof _MapsSP_Consumers_List
   */
  fetchMoreData = () => {
    console.log(new Date().getTime(), "Consumers List fetchMoreData");
    const start = new Date().getTime();

    let count = 100;
    if (this.state.listItems.length < this.listLastPage) {
      count = this.listLastPage;
    }
    console.log("Consumers fetchMoreData count", count);

    let hasMore = this.state.hasMore;
    const listItems = Object.assign([], this.state.listItems);

    // eslint-disable-next-line no-constant-condition
    while (true) {
      count--;
      if (count < 0) {
        break;
      }

      if (!this.listCursor || !this.listCursor.hasNext()) {
        hasMore = false;
        break;
      }

      const doc = this.listCursor.next();
      const kana = _.get(doc, "identity.kana") || " ";
      listItems.push([
        kana.slice(0, 1),
        displayConsumer(
          null,
          doc,
          0,
          this.props.history,
          this.detailPath + doc._id,
          this.props.showTelephone,
          this.props.sortOrder == "name"
        )
      ]);
    }

    this.setState({
      hasMore: hasMore,
      listItems: listItems,
      listCursorCount: this.state.listCursorCount,
      dataLength: listItems.length,
      componentUpdater: this.state.componentUpdater + 1
    });

    const end = new Date().getTime();
    console.log(
      new Date().getTime(),
      "Consumers List fetchMoreData end",
      end - start
    );
  };
  /// Custom - InfiniteScroll --

  /* global index */
  /* global item */

  /**
   *
   *
   * @memberof _MapsSP_Consumers_List
   */
  debouncedOnScroll = () => {
    this.saveScrollPos();
  };

  /**
   *
   *
   * @returns
   * @memberof _MapsSP_Consumers_List
   */
  render() {
    console.log(new Date().getTime(), "Consumers List render");
    const start = new Date().getTime();

    /// Custom - Collection - subscribe
    if (this.props.loading) {
      console.log(new Date().getTime(), "Consumers List render loading...");
      return <span />;
    }
    /// Custom - Collection - subscribe --

    if (
      this.sortOrder_pre != this.props.sortOrder ||
      this.sortOrderDsc_pre != this.props.sortOrderDsc
    ) {
      this.sortOrder_pre = this.props.sortOrder;
      this.sortOrderDsc_pre = this.props.sortOrderDsc;

      this.queryDocs();
    }

    /// Custom - Tabular - layout
    const ret = (
      <React.Fragment>
        {/* 件数エリア start */}
        <Grid id="results-number">
          <Grid.Row className="num-height">
            <Grid.Column width={10} className="left aligned content">
              <span className="font-color font-family num">
                {this.state.listCursorCount}
              </span>
              <span className="font-color font-family">件見つかりました</span>
            </Grid.Column>

            <Grid.Column
              onClick={() => {
                this.props.showSortOrder(true);
              }}
              width={6}
              className="right aligned content"
            >
              <span className="font-color font-family">
                {this.dispSortOrder[this.props.sortOrder]}
              </span>
              <Icon
                name={
                  "sort amount " +
                  this.dispSortOrderAsc[this.props.sortOrderDsc]
                }
              />
              <br />
            </Grid.Column>
          </Grid.Row>
        </Grid>
        {/* 件数エリア end */}

        <Segment
          style={{
            margin: 0,
            padding: 0,
            overflow: "auto",
            borderRadius: "0px",
            transition: "all .1s ease-out",
            filter: this.state.displayDelay ? "blur(0)" : "blur(1px)"
            //            transition: "opacity .1s ease-out",
            //            opacity: this.state.displayDelay ? 1 : 0.5
          }}
        >
          {/* あいうえお start */}
          <InfiniteScroll
            ref={this.myRef}
            dataLength={this.state.dataLength}
            next={this.fetchMoreData}
            hasMore={this.state.hasMore}
            loader={<h4>Loading...</h4>}
            height={this.window_innerHeight - 104 - 70 + "px"}
            onScroll={() => {
              this.debouncedOnScroll();
              const scrollTop = this.myRef.current.el.scrollTop;
              if (scrollTop < 10) {
                this.props.showSearchInput(true);
              } else {
                this.props.showSearchInput(false);
              }
            }}
            endMessage={
              <p style={{ textAlign: "center", height: "100px" }}>
                <b>Yay! You have seen it all</b>
              </p>
            }
          >
            {
              <If condition={this.props.sortOrder == "name"}>
                {
                  <For each="item" index="index" of={this.state.listItems}>
                    {
                      <If
                        condition={
                          index == 0 ||
                          this.state.listItems[index - 1][0] != item[0]
                        }
                      >
                        <Segment
                          key={index}
                          padded
                          className="list-display-segment"
                        >
                          <Label
                            attached="top"
                            className="font-color font-family order-label"
                          >
                            {item[0] != " " ? item[0] : "(なし)"}
                          </Label>
                          <Item.Group divided style={{ paddingTop: "10px" }}>
                            {item[1]}
                          </Item.Group>
                        </Segment>
                      </If>
                    }
                    {
                      <If
                        condition={
                          index > 0 &&
                          this.state.listItems[index - 1][0] == item[0]
                        }
                      >
                        <Segment
                          key={index}
                          padded
                          className="list-display-segment"
                        >
                          <Item.Group divided>{item[1]}</Item.Group>
                        </Segment>
                      </If>
                    }
                  </For>
                }
              </If>
            }

            {
              <If condition={this.props.sortOrder != "name"}>
                <Segment
                  padded
                  style={{
                    margin: "0",
                    marginBottom: "1px",
                    paddingRight: "40px"
                  }}
                >
                  <Item.Group divided>
                    {
                      <For each="item" index="index" of={this.state.listItems}>
                        {item[1]}
                      </For>
                    }
                  </Item.Group>
                </Segment>
              </If>
            }
          </InfiniteScroll>
        </Segment>

        <MDBModalW
          size="large"
          isOpen={this.state.showEdit_Info}
          toggle={this.toggleEdit_Info}
          className="m-0 p-0"
          animation="left"
        >
          <MDBModalBody className="m-0 p-0">
            <Edit_Info
              closeEdit_Info={this.closeEdit_Info}
              doc={{}}
              updateDoc={this.updateDoc}
            />
          </MDBModalBody>
        </MDBModalW>
      </React.Fragment>
    );
    /// Custom - Tabular - layout --

    const end = new Date().getTime();
    console.log(new Date().getTime(), "Consumers List render end", end - start);

    return ret;
  }
}
