/// Sys - AutoForm
import React from "react";
import { Session } from "meteor/session";
import { ListLocalCollection } from "@imports/ui/crud/ListLocalCollection";
import InfiniteScroll from "react-infinite-scroll-component";
import Lightbox from "react-image-lightbox";
import mingo from "mingo";
import _ from "lodash";
const moji = require("moji");
/// Sys - AutoForm --

import { MapsSP_Pins_View_ComponentInfo } from "./View";
import { Edit } from "./Edit";

/// Custom - AutoForm - collection
import { Maps_Pins_Collection } from "@imports/api/Maps/Pins_Collection";
console.assert(Maps_Pins_Collection, "Maps_Pins_Collection is undefined.");

/// Custom - LocalStorage
import { Maps_PinsSum_Collection } from "@imports/api/Maps/PinsSum_Collection";
/// Custom - LocalStorage --

import { displayPin } from "./utils";

import { Maps_PinCategorys_Collection } from "@imports/api/Maps/PinCategorys_Collection";
console.assert(
  Maps_PinCategorys_Collection,
  "Maps_PinCategorys_Collection is undefined."
);
/// Custom - AutoForm - collection --

// import start
import { Segment } from "semantic-ui-react";
import { Grid } from "semantic-ui-react";
import { Item } from "semantic-ui-react";
import { Button } from "semantic-ui-react";

import { Icon } from "semantic-ui-react";
import { Input } from "semantic-ui-react";
import { Select } from "semantic-ui-react";
import { Image } from "semantic-ui-react";

import { MDBModalHeader, MDBModalBody } from "mdbreact";
import { MDBModalW } from "../lib/MDBModalW";

const zeroDate = new Date("0000-01-01").toISOString();

/**
 *
 *
 * @export
 * @class List
 * @extends {Update}
 */
export class List extends ListLocalCollection {
  "use strict";

  /**
   *Creates an instance of List.
   * @param {*} props
   * @memberof List
   */
  constructor(props) {
    console.log(new Date().getTime(), "List constructor");
    super(props);

    /// Custom - Tabular - link button
    this.detailPath = "/MapsSP/Pins/Detail/";
    /// Custom - Tabular - link button --

    /// Custom - Role - check permission
    this.ComponentInfo = MapsSP_Pins_View_ComponentInfo;
    /// Custom - Role - check permission --

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

    this.pins = [];
    this.optionCat1 = [];
    this.optionCat2 = [];
    this.state.pins = [];
    this.state.keyword = "";
    this.state.cat1 = "";
    this.state.cat2 = "";
    this.state.showSortOrder = false;
    this.state.sortOrder = Session.get("MapsSP.Pins.List.sortOrder") || "name";
    this.state.sortOrderDsc =
      Session.get("MapsSP.Pins.List.sortOrderDsc") || false;
    this.state.selectedId = null;
    this.state.selectedDoc = {};
    this.state.showSelector = true;
    this.state.showEdit = false;

    this.state.displayDelay = false;
    this.state.showLightBox = false;
    this.state.lightBoxImgSrc = null;

    /// Custom - SortOrder
    this.sortOrder_pre = "name";
    this.sortOrderDsc_pre = true;

    this.dispSortOrder = {
      name: "名前順",
      modifiedAt: "更新日順",
      executedAt: "貼付日順"
    };
    this.dispSortOrderAsc = {
      true: "up",
      false: "down"
    };
    /// Custom - SortOrder --

    this.onSearchKeyword = this.onSearchKeyword.bind(this);
    this.debouncedOnSearchKeyword = _.debounce(
      this.debouncedOnSearchKeyword.bind(this),
      1000
    );

    let cat = window.$GLOBAL$.__ConsumersView__.pinCategorys;
    this.cat2Dict = {};
    if (cat && cat.cat1) {
      for (let i = 0; i < cat.cat1.length; i++) {
        for (let j = 0; j < (cat.cat1[i].cat2 || []).length; j++) {
          const cat2 = cat.cat1[i].cat2[j];
          if (cat2) {
            this.cat2Dict[cat2.id] = cat2;
          }
        }
      }
    }

    this.postConstructor();

    this.window_innerHeight = window.innerHeight;
  }

  /**
   *
   *
   * @memberof List
   */
  componentDidMount() {
    console.log(
      new Date().getTime(),
      "List componentDidMount",
      this.Collection._name
    );

    super.componentDidMount();

    let cat = window.$GLOBAL$.__ConsumersView__.pinCategorys;
    let optionCat1 = [];
    if (cat && cat.cat1) {
      cat.cat1.unshift({ title: "未選択", id: "" });
      optionCat1 = cat.cat1.map(c1 => {
        return { text: c1.title, value: c1.id };
      });
    }
    this.setState({ optionCat1: optionCat1 });

    setTimeout(() => {
      const scrollTop = this.myRef.current.el.scrollTop;
      if (scrollTop < 160) {
        this.setState({ showSelector: true });
      } else {
        this.setState({ showSelector: false });
      }
    }, 100);

    this.setState({ displayDelay: false });
    setTimeout(() => {
      this.setState({ displayDelay: true });
    }, 50);
  }

  /**
   *
   *
   * @param {*} event
   * @memberof MapsSP_List_List
   */
  onSearchKeyword = event => {
    this.debouncedOnSearchKeyword(event.target.value);
    this.setState({ keyword: event.target.value });
  };

  /**
   *
   *
   * @param {*} value
   * @memberof MapsSP_List_List
   */
  debouncedOnSearchKeyword = keyword => {
    this.state.keyword = keyword;
    this.queryDocs();
  };

  /**
   *
   *
   * @param {*} event
   * @memberof List
   */
  onChangeCat1 = (e, { name, value }) => {
    const cat1id = value;
    this.setState({ cat1: cat1id });

    /// Custom - Collection - soft delete --
    const cat = Maps_PinCategorys_Collection.findOne({});
    let cat2tmp = [];
    if (cat) {
      const cat1 = cat.cat1 || [];
      const tmp = cat1.filter(c => c.id == cat1id);
      if (tmp.length) {
        cat2tmp = tmp[0].cat2 || [];
      }
    }
    const cat2 = cat2tmp.map(function(c) {
      return {
        text: c.title,
        value: c.id
      };
    });
    this.setState({ cat2: "", optionCat2: cat2 });
    this.state.cat1 = cat1id;
    this.state.cat2 = "";
    this.queryDocs();
  };

  /**
   *
   *
   * @param {*} event
   * @memberof List
   */
  onChangeCat2 = (e, { name, value }) => {
    this.state.selector.pinCategorys = [value];
    this.setState({ cat2: value, selector: this.state.selector });
    this.state.cat2 = value;
    this.queryDocs();
  };

  /**
   *
   *
   * @memberof _MapsSP_Companys_List
   */
  queryDocs = () => {
    console.log(new Date().getTime(), "queryDocs");

    /// Custom - Collection - selector
    const query = {};

    if (this.state.keyword) {
      const keyword = moji(this.state.keyword)
        .convert("HG", "KK")
        .convert("HK", "ZK")
        .convert("ZE", "HE")
        .toString();
      const selectorKeyword = new RegExp(".*" + keyword + ".*", "i");
      query["keyword"] = selectorKeyword;
    }
    /// Custom - Collection - selector --

    if (this.state.cat1) {
      query["cat1"] = this.state.cat1;
    }

    if (this.state.cat2) {
      query["cat2"] = this.state.cat2;
    }

    /// Custom - Collection - sort
    switch (this.state.sortOrder) {
      case "name":
        if (this.state.sortOrderDsc) {
          this.CollectionList.sort((a, b) => {
            if (a.title == b.title) return 0;
            return a.title < b.title ? -1 : 1;
          });
        } else {
          this.CollectionList.sort((a, b) => {
            if (a.title == b.title) return 0;
            return a.title < b.title ? 1 : -1;
          });
        }
        break;
      case "modifiedAt":
        for(let i = 0; i < this.CollectionList.length; i++) {
          if (this.CollectionList[i].modifiedAt) {
            this.CollectionList[i].modifiedAt = new Date(this.CollectionList[i].modifiedAt).toISOString();
          }
        }
        if (this.state.sortOrderDsc) {
          this.CollectionList.sort((a, b) => {
            const _a = a.modifiedAt ? a.modifiedAt : zeroDate;
            const _b = b.modifiedAt ? b.modifiedAt : zeroDate;
            if (_a == _b) return 0;
            return _a < _b ? -1 : 1;
          });
        } else {
          this.CollectionList.sort((a, b) => {
            const _a = a.modifiedAt ? a.modifiedAt : zeroDate;
            const _b = b.modifiedAt ? b.modifiedAt : zeroDate;
            if (_a == _b) return 0;
            return _a < _b ? 1 : -1;
          });
        }
        break;
      case "executedAt":
        for(let i = 0; i < this.CollectionList.length; i++) {
          if (this.CollectionList[i].executedAt) {
            this.CollectionList[i].executedAt = new Date(this.CollectionList[i].executedAt).toISOString();
          }
        }
        if (this.state.sortOrderDsc) {
          this.CollectionList.sort((a, b) => {
            const _a = a.executedAt ? a.executedAt : zeroDate;
            const _b = b.executedAt ? b.executedAt : zeroDate;
            if (_a == _b) return 0;
            return _a < _b ? -1 : 1;
          });
        } else {
          this.CollectionList.sort((a, b) => {
            const _a = a.executedAt ? a.executedAt : zeroDate;
            const _b = b.executedAt ? b.executedAt : zeroDate;
            if (_a == _b) return 0;
            return _a < _b ? 1 : -1;
          });
        }
        break;
      default:
        if (this.state.sortOrderDsc) {
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
  };

  /**
   *
   *
   * @returns
   * @memberof MapsSP_List_List
   */
  toggleSortOrder = () => {
    this.setState({ showSortOrder: !this.state.showSortOrder });
  };

  /**
   *
   *
   * @memberof MapsSP_List_List
   */
  showSortOrder = show => {
    this.setState({ showSortOrder: show });
  };

  /**
   *
   *
   * @memberof MapsSP_List_List
   */
  setSortOrder = sortOrder => {
    if (sortOrder == this.state.sortOrder) {
      this.setState({
        sortOrderDsc: !this.state.sortOrderDsc
      });
      Session.set("MapsSP.Pins.List.sortOrderDsc", !this.state.sortOrderDsc);
      this.showSortOrder(false);
    } else {
      this.setState({
        sortOrder: sortOrder,
        sortOrderDsc: true
      });
      Session.set("MapsSP.Pins.List.sortOrder", sortOrder);
      Session.set("MapsSP.Pins.List.sortOrderDsc", true);
      this.showSortOrder(false);
    }
  };

  /**
   *
   *
   * @memberof _MapsSP_Consumers_List
   */
  showLightBox = imgSrc => {
    this.setState({ showLightBox: true, lightBoxImgSrc: imgSrc });
  };

  /// Custom - InfiniteScroll
  /**
   *
   *
   * @memberof _MapsSP_Consumers_List
   */
  fetchMoreData = () => {
    console.log(new Date().getTime(), "List fetchMoreData");
    const start = new Date().getTime();

    let count = 100;
    if (this.state.listItems.length < this.listLastPage) {
      count = this.listLastPage;
    }
    console.log("fetchMoreData count", count);

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
      listItems.push([
        doc._id,
        displayPin(
          null,
          this.cat2Dict,
          doc,
          0,
          this.props.history,
          this.detailPath + doc._id,
          this.onClick,
          this.showLightBox
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
    console.log(new Date().getTime(), "List fetchMoreData end", end - start);
  };

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
   * @memberof _MapsSP_Consumers_List
   */
  onClick = docId => {
console.log("onClick---------------------------", docId);
    if (docId == this.state.selectedId) {
      this.setState({
        selectedId: null,
        selectedDoc: {},
        showEditButton: false
      });
    } else {
      const doc = this.Collection.docs[docId];
console.log("onClick doc---------------------------", doc);
      doc.__Form_name = this.Form_name;
      this.setState({
        selectedId: docId,
        selectedDoc: doc,
        showEditButton: true
      });
    }
  };

  /**
   *
   *
   * @memberof MapsSP_Consumers_Detail
   */
  toggleEdit = () => {
    this.setState({ showEdit: !this.state.showEdit });
  };

  /**
   *
   *
   * @memberof MapsSP_Consumers_Detail
   */
  closeEdit = () => {
    this.setState({ showEdit: false });
    this.setState({
      selectedId: null,
      selectedDoc: {},
      showEditButton: false
    });
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
   * @memberof _MapsSP_Consumers_List
   */
  gotoMapWithSelector = () => {
    Session.set("MapsSP_Maps_Selector", this.state.selector);
    const mapUrl = this.getMapUrl();
    this.props.history.replace(mapUrl);
  };

  /* global item */
  /* global index */

  /// Custom - InfiniteScroll --
  /**
   *
   *
   * @returns
   * @memberof List
   */
  render() {
    console.log(new Date().getTime(), "List render");

    if (
      this.sortOrder_pre != this.state.sortOrder ||
      this.sortOrderDsc_pre != this.state.sortOrderDsc
    ) {
      this.sortOrder_pre = this.state.sortOrder;
      this.sortOrderDsc_pre = this.state.sortOrderDsc;

      this.queryDocs();
    }

    return (
      <React.Fragment>
        {/* 検索条件 start */}
        <Segment
          padded
          style={{
            margin: "0",
            border: "none",
            borderRadius: "0",
            height: this.state.showSelector ? "220px" : "50px",
            paddingTop: this.state.showSelector ? "21px" : "10px",
            paddingBottom: this.state.showSelector ? "21px" : "10px",
            transition: "all 0.3s"
          }}
        >
          <div
            style={{
              height: this.state.showSelector ? "157px" : "0",
              opacity: this.state.showSelector ? 1 : 0,
              transition: "all 0.3s"
            }}
          >
            <Input
              onChange={this.onSearchKeyword}
              value={this.state.keyword}
              icon="search"
              iconPosition="left"
              placeholder="キーワードを入力"
              className="font-color font-family form-height"
              style={{ width: "100%", height: "43px" }}
            />
            <Image
              src={window.$GLOBAL$.__SVG__["虫メガネ"]}
              style={{ bottom: "33px", left: "7px", width: "25.795px" }}
            />
            <Image
              onClick={() => {
                this.setState({ keyword: "" });
                this.state.keyword = "";
                this.queryDocs();
              }}
              src={window.$GLOBAL$.__SVG__["×ボタン（タグで絞り込む1）"]}
              style={{ position: "absolute", right: "32px", top: "33px" }}
            />

            <Select
              onChange={this.onChangeCat1}
              placeholder="大カテゴリ"
              search
              selection
              options={this.state.optionCat1}
              style={{
                width: "50%",
                marginTop: "32px",
                bottom: "23px"
              }}
            />

            <Select
              onChange={this.onChangeCat2}
              placeholder="小カテゴリ"
              search
              selection
              options={this.state.optionCat2}
              style={{
                width: "50%",
                marginTop: "8px",
                bottom: "22px"
              }}
            />
          </div>

          {/* 件数エリア start */}
          <Grid>
            <Grid.Row className="num-height">
              <Grid.Column width={10} className="left aligned content">
                <span
                  className="font-color font-family"
                  style={{ marginRight: "4px" }}
                >
                  検索結果
                </span>
                <span className="font-color font-family num">
                  {this.state.listCursorCount}
                </span>
                <span
                  className="font-color font-family"
                  style={{ marginLeft: "4px" }}
                >
                  件
                </span>
              </Grid.Column>

              <Grid.Column
                onClick={() => {
                  this.showSortOrder(true);
                }}
                width={6}
                className="right aligned content"
              >
                <span className="font-color font-family">
                  {this.dispSortOrder[this.state.sortOrder]}
                </span>
                <Icon
                  name={
                    "sort amount " +
                    this.dispSortOrderAsc[this.state.sortOrderDsc]
                  }
                />
                <br />
              </Grid.Column>
            </Grid.Row>
          </Grid>
          {/* 件数エリア end */}
        </Segment>
        {/* 検索条件 end */}

        {/* スクロールエリア start */}
        <Segment
          style={{
            margin: 0,
            padding: 0,
            overflow: "auto",
            borderRadius: "0px",
            transition: "all .1s ease-out",
            filter: this.state.displayDelay ? "blur(0)" : "blur(1px)"
          }}
        >
          {/* あいうえお start */}
          <InfiniteScroll
            ref={this.myRef}
            dataLength={this.state.dataLength}
            next={this.fetchMoreData}
            hasMore={this.state.hasMore}
            loader={<h4>Loading...</h4>}
            height={
              this.window_innerHeight -
              (this.state.showSelector ? 420 : 250) +
              "px"
            }
            style={{ transition: "height 0.1s" }}
            onScroll={() => {
              this.debouncedOnScroll();
              const scrollTop = this.myRef.current.el.scrollTop;
              if (scrollTop < 160) {
                this.setState({ showSelector: true });
              } else {
                this.setState({ showSelector: false });
              }
            }}
            endMessage={
              <p style={{ textAlign: "center", height: "220px" }}>
                <b>Yay! You have seen it all</b>
              </p>
            }
          >
            <Item.Group divided>
              {
                <For each="item" index="index" of={this.state.listItems}>
                  <Item
                    key={index}
                    as="a"
                    id="pin-list-item"
                    style={{
                      backgroundColor:
                        this.state.selectedId == item[0] ? "lightgray" : "white"
                    }}
                  >
                    {item[1]}
                  </Item>
                </For>
              }
            </Item.Group>
          </InfiniteScroll>
        </Segment>
        {/* スクロールエリア end */}

        {/* 下部ボタン start */}
        {
          <If condition={this.state.showEditButton}>
            <Image
              onClick={() => this.setState({ showEdit: true })}
              src={window.$GLOBAL$.__SVG__["編集"]}
              className="pin-bottom-btn"
            />
          </If>
        }

        {
          <If condition={!this.state.showEditButton}>
            <Image
              onClick={this.gotoMapWithSelector}
              src={window.$GLOBAL$.__SVG__["結果を地図で表示"]}
              className="pin-bottom-btn"
            />
          </If>
        }
        {/* 下部ボタン end */}

        <MDBModalW
          isOpen={this.state.showSortOrder}
          toggle={this.toggleSortOrder}
          className="pinmodal-style2"
        >
          <MDBModalHeader>ソート</MDBModalHeader>
          <MDBModalBody>
            <p>
              <Button
                onClick={() => {
                  this.setSortOrder("name");
                }}
                className="font-color font-family"
                style={{
                  width: "100%",
                  marginBottom: 0,
                  padding: "15px 21px"
                }}
              >
                名前順
              </Button>
            </p>
            <p>
              <Button
                onClick={() => {
                  this.setSortOrder("modifiedAt");
                }}
                className="font-color font-family"
                style={{
                  width: "100%",
                  marginBottom: 0,
                  padding: "15px 21px"
                }}
              >
                更新日順
              </Button>
            </p>
            <p>
              <Button
                onClick={() => {
                  this.setSortOrder("executedAt");
                }}
                className="font-color font-family"
                style={{
                  width: "100%",
                  marginBottom: 0,
                  padding: "15px 21px"
                }}
              >
                貼付日順
              </Button>
            </p>
          </MDBModalBody>
        </MDBModalW>

        <MDBModalW
          size="large"
          isOpen={this.state.showEdit}
          toggle={this.toggleEdit}
          className="m-0 p-0"
          animation="left"
        >
          <MDBModalBody className="m-0 p-0">
            <Edit closeEdit={this.closeEdit} doc={this.state.selectedDoc} />
          </MDBModalBody>
        </MDBModalW>

        {
          <If condition={this.state.showLightBox}>
            <Lightbox
              mainSrc={this.state.lightBoxImgSrc}
              onCloseRequest={() => this.setState({ showLightBox: false })}
            />
          </If>
        }
      </React.Fragment>
    );
  }
}
