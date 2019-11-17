/// Sys - Tabular
import React from "react";
import { ListPersistedScroll } from "@imports/ui/crud/ListPersistedScroll";
import InfiniteScroll from "react-infinite-scroll-component";
import { withTracker } from "meteor/react-meteor-data";
import mingo from "mingo";
require("jquery.nicescroll");
import _ from "lodash";
const moji = require("moji");
/// Sys - Tabular --

/// Custom - AutoForm - collection
import { Maps_Associations_Collection } from "@imports/api/Maps/Associations_Collection";
console.assert(
  Maps_Associations_Collection,
  "Maps_Associations_Collection is undefined."
);
/// Custom - AutoForm - collection --

/// Sys - Role
import { checkSystemRole, checkAppRole } from "@imports/ui/crud/checkRole";
/// Sys - Role --

import { displayAssociation } from "./utils";

// import start
import { Segment } from "semantic-ui-react";
import { Grid } from "semantic-ui-react";
import { Item } from "semantic-ui-react";

import { Label } from "semantic-ui-react";

import { Icon } from "semantic-ui-react";

// import end

/// Custom - Role - check permission
/**
 *
 *
 * @param {*} mode
 * @returns
 */
export const MapsSP_Associations_List_ComponentInfo = mode => {
  if (!checkAppRole("MapsSP.Companys", mode)) {
    return null;
  }

  if (checkSystemRole()) {
    return null;
  }

  return {
    title: "MapsSP/Associations/List",
    path: "/MapsSP/Associations/List"
  };
};
/// Custom - Role - check permission --

export class _MapsSP_Associations_List extends ListPersistedScroll {
  "use strict";

  /**
   *Creates an instance of _Maps_Associations_List.
   * @param {*} props
   * @memberof _MapsSP_Associations_List
   */
  constructor(props) {
    console.log(new Date().getTime(), "Associations List constructor");
    super(props);

    /// Custom - Tabular - link button
    this.detailPath = "/MapsSP/Associations/Detail/";
    /// Custom - Tabular - link button --

    /// Custom - Role - check permission
    this.ComponentInfo = MapsSP_Associations_List_ComponentInfo;
    /// Custom - Role - check permission --

    /// Custom - LocalStorage
    /// Custom - AutoForm - rebuild field
    this.Collection = Maps_Associations_Collection;
    /// Custom - AutoForm - rebuild field --

    /** @type {any[]} */
    this.CollectionList = [];
    /// Custom - LocalStorage --

    /// Custom - Collection - selector
    this.state.keyword = "";

    this.state.selector = {
      keyword: ""
    };
    this.state.selectgorString = "";

    this.listCursorCount = 0;
    this.listCursor = null;
    /// Custom - Collection - selector --

    /// Custom - SortOrder
    this.sortOrder_pre = "name";
    this.sortOrderDsc_pre = true;

    this.dispSortOrder = {
      name: "名前順",
      modifiedAt: "更新日順"
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
   * @memberof _MapsSP_Associations_List
   */
  componentDidMount() {
    console.log(new Date().getTime(), "Associations List componentDidMount");

    super.componentDidMount();

    this.queryDocs();
    this.scrollTop = this.myRef.current.el.scrollTop;
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
   * @memberof _MapsSP_Associations_List
   */
  queryDocs() {
    console.log(new Date().getTime(), "Associations List queryDocs");
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
    /// Custom - Collection - selector --

    /// Custom - Collection - sort
    switch (this.props.sortOrder) {
      case "name":
        if (this.props.sortOrderDsc) {
          this.props.CollectionList.sort((a, b) => {
            const _a = _.get(a, "kana") || "追" + _.get(a, "name"); // UNICODE 8FFD
            const _b = _.get(b, "kana") || "追" + _.get(b, "name"); // UNICODE 8FFD
            return _a < _b ? -1 : _a > _b ? 1 : 0;
          });
        } else {
          this.props.CollectionList.sort((a, b) => {
            const _a = _.get(a, "kana") || "追" + _.get(a, "name"); // UNICODE 8FFD
            const _b = _.get(b, "kana") || "追" + _.get(b, "name"); // UNICODE 8FFD
            return _a < _b ? 1 : _a > _b ? -1 : 0;
          });
        }
        break;
      case "modifiedAt":
        if (this.props.sortOrderDsc) {
          this.props.CollectionList.sort((a, b) => {
            return a.modifiedAt < b.modifiedAt ? -1 : 1;
          });
        } else {
          this.props.CollectionList.sort((a, b) => {
            return a.modifiedAt > b.modifiedAt ? -1 : 1;
          });
        }
        break;
    }
    /// Custom - Collection - sort --

    /// Custom - Collection - query
    this.listCursor = mingo.find(this.props.CollectionList, query);
    this.state.listItems = [];
    this.state.hasMore = true;
    this.state.dataLength = 0;
    this.state.listCursorCount = this.listCursor.count();
    this.listCursor = mingo.find(this.props.CollectionList, query);
    setTimeout(() => this.fetchMoreData());
    /// Custom - Collection - query --
  }

  /**
   *
   *
   * @memberof _MapsSP_Associations_List
   */
  clear = () => {
    const selector = {
      keyword: ""
    };
    this.setState({
      selector: selector
    });
  };

  /// Custom - InfiniteScroll
  /**
   *
   *
   * @memberof _MapsSP_Associations_List
   */
  fetchMoreData = () => {
    console.log(new Date().getTime(), "Associations List fetchMoreData");
    const start = new Date().getTime();

    let count = 100;
    if (this.state.listItems.length < this.listLastPage) {
      count = this.listLastPage;
    }
    console.log("Associations fetchMoreData count", count);

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
      const kana = doc.kana || " ";
      listItems.push([
        kana.slice(0, 1),
        displayAssociation(
          doc,
          0,
          this.props.history,
          this.detailPath + doc._id,
          this.props.showTelephone
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
      "Associations List fetchMoreData end",
      end - start
    );
  };
  /// Custom - InfiniteScroll --

  /* global item */

  /**
   *
   *
   * @returns
   * @memberof _MapsSP_Associations_List
   */
  toggleShowSortOrder = () => {
    this.setState({ showSortOrder: !this.state.showSortOrder });
  };

  /**
   *
   *
   * @memberof _MapsSP_Associations_List
   */
  updateSelectorString = str => {
    this.setState({ selectgorString: str });
  };

  /**
   *
   *
   * @memberof _MapsSP_Consumers_List
   */
  debouncedOnScroll = () => {
    this.saveScrollPos();
  };

  /* global index */

  /**
   *
   *
   * @returns
   * @memberof _MapsSP_Associations_List
   */
  render() {
    console.log(new Date().getTime(), "Associations List render");
    const start = new Date().getTime();

    /// Custom - Collection - subscribe
    if (this.props.loading) {
      console.log(new Date().getTime(), "Associations List render loading...");
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
              <span className="font-color">
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
        {/* 件数エリア start */}

        <Segment
          style={{
            margin: 0,
            padding: 0,
            overflow: "auto",
            borderRadius: "0px"
          }}
        >
          {/* あいうえお start */}
          <InfiniteScroll
            ref={this.myRef}
            dataLength={this.state.dataLength}
            next={this.fetchMoreData}
            hasMore={this.state.hasMore}
            loader={<h4>Loading...</h4>}
            height={this.window_innerHeight - 180 + "px"}
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
                          <Item.Group divided>{item[1]}</Item.Group>
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
                <Segment padded className="list-display-segment">
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
      </React.Fragment>
    );
    /// Custom - Tabular - layout --

    const end = new Date().getTime();
    console.log(
      new Date().getTime(),
      "Associations List render end",
      end - start
    );

    return ret;
  }
}

/// Custom - List - tracker
export const MapsSP_Associations_List = withTracker(() => {
  /// Custom - Collection - subscribe
  const handles = [
    // eslint-disable-line no-unused-vars
    //    Meteor.subscribe(
    //      Maps_Associations_Collection._name,
    //      Session.get("Users_Groups_id")
    //    )
  ];
  const loading = handles.some(handle => !handle.ready());

  if (!loading) {
    Maps_Associations_Collection.find().fetch();
  }

  return {
    CollectionList: Maps_Associations_Collection.find({ _deleted: null }).map(
      b => {
        return b;
      }
    ),
    ComponentInfo: MapsSP_Associations_List_ComponentInfo,
    loading: loading
  };
  /// Custom - Collection - subscribe --
})(_MapsSP_Associations_List);
/// Custom - List - tracker --
