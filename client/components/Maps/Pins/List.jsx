/// Sys - Tabular
import React from "react";
import { ListLocalCollection } from "@imports/ui/crud/ListLocalCollection";
import { displayTitle } from "@imports/api/lib/CollectionUtils";
import { UnsavedIndicator } from "@imports/ui/crud/ListLocalCollection";
import { withTracker } from "meteor/react-meteor-data";
import InfiniteScroll from "react-infinite-scroll-component";
import mingo from "mingo";
require("jquery.nicescroll");
/// Sys - Tabular --

/// Custom - AutoForm - collection
import { Maps_Pins_Collection } from "@imports/api/Maps/Pins_Collection";
console.assert(Maps_Pins_Collection, "Maps_Pins_Collection is undefined.");
/// Custom - AutoForm - collection --

/// Custom - LocalStorage
import { Maps_PinsSum_Collection } from "@imports/api/Maps/PinsSum_Collection";
/// Custom - LocalStorage --

/// Custom - Tabular - insert button
import { Maps_Pins_Insert_ComponentInfo } from "./Insert";
console.assert(
  Maps_Pins_Insert_ComponentInfo,
  "Maps_Pins_Insert_ComponentInfo is undefined."
);
/// Custom - Tabular - insert button --

/// Sys - Role
import { checkSystemRole, checkAppRole } from "@imports/ui/crud/checkRole";
/// Sys - Role --

/// Custom - Role - check permission
/**
 *
 *
 * @param {*} mode
 * @returns
 */
export const Maps_Pins_List_ComponentInfo = mode => {
  if (!checkAppRole("Maps.Pins", mode)) {
    return null;
  }

  if (checkSystemRole()) {
    return null;
  }

  return { title: "Maps/Pins/List", path: "/Maps/Pins/List" };
};
/// Custom - Role - check permission --

/**
 *
 *
 * @export
 * @class _Maps_Pins_List
 * @extends {ListLocalCollection}
 */
export class _Maps_Pins_List extends ListLocalCollection {
  "use strict";

  /**
   *Creates an instance of _Maps_Pins_List.
   * @param {*} props
   * @memberof _Maps_Pins_List
   */
  constructor(props) {
    super(props);

    /// Custom - Tabular - link button
    this.updatePath = "/Maps/Pins/Update/";
    /// Custom - Tabular - link button --

    /// Custom - Role - check permission
    this.ComponentInfo = Maps_Pins_List_ComponentInfo;
    this.Insert_ComponentInfo = Maps_Pins_Insert_ComponentInfo;
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

    /// Custom - Collection - selector
    this.state.selector = {};
    this.listCursor = null;
    /// Custom - Collection - selector --

    this.fetchMoreData = this.fetchMoreData.bind(this);
    this.queryDocs = this.queryDocs.bind(this);

    this.postConstructor();
  }

  /**
   *
   *
   * @memberof _Maps_Pins_List
   */
  queryDocs() {
    /// Custom - Collection - selector
    const query = {};

    console.log("List render query", query);
    /// Custom - Collection - selector --

    /// Custom - Collection - sort
    this.CollectionList.sort((a, b) => {
      return a.title < b.title ? 1 : -1;
    });
    /// Custom - Collection - sort --

    /// Custom - Collection - query
    this.listCursor = mingo.find(this.CollectionList, query);
    this.state.listItems = [];
    this.state.hasMore = true;
    this.state.dataLength = 0;
    this.fetchMoreData();
    /// Custom - Collection - query --
  }

  /// Custom - InfiniteScroll
  /**
   *
   *
   * @memberof _Maps_Pins_List
   */
  fetchMoreData = () => {
    console.log(new Date().getTime(), "List fetchMoreData");
    const start = new Date().getTime();

    let count = 100;
    if (this.state.listItems.length < this.listLastPage) {
      count = this.listLastPage;
    }
    console.log("fetchMoreData count", count);

    // eslint-disable-next-line no-constant-condition
    while (true) {
      count--;
      if (count < 0) {
        break;
      }

      if (!this.listCursor || !this.listCursor.hasNext()) {
        this.state.hasMore = false;
        break;
      }

      const doc = this.listCursor.next();
      this.state.listItems.push(
        <div key={doc._id}>
          {this.state.listItems.length + 1}:
          <span
            dangerouslySetInnerHTML={{
              __html: displayTitle(doc._deleted, doc.title)
            }}
          />
          <br />
          {this.UpdateButton(doc)}
          <hr />
        </div>
      );
    }

    this.setState({
      hasMore: this.state.hasMore,
      listItems: this.state.listItems,
      dataLength: this.state.listItems.length
    });

    const end = new Date().getTime();
    console.log(new Date().getTime(), "List fetchMoreData end", end - start);
  };
  /// Custom - InfiniteScroll --

  /* global item */

  /**
   *
   *
   * @returns
   * @memberof _Maps_Pins_List
   */
  render() {
    console.log(new Date().getTime(), "List render", this.state.selector);

    /// Custom - Tabular - layout
    return (
      <React.Fragment>
        {this.InsertButtons(Maps_Pins_Insert_ComponentInfo("create"))}

        <UnsavedIndicator collectionName={this.Collection._name} />

        {"現在:" + this.state.listItems.length + " records."}
        {this.ShowNormalSwitch()}

        <InfiniteScroll
          ref={this.myRef}
          dataLength={this.state.dataLength}
          next={this.fetchMoreData}
          hasMore={this.state.hasMore}
          loader={<h4>Loading...</h4>}
          height={(window.innerHeight - 262) + "px"}
          endMessage={
            <p style={{ textAlign: "center" }}>
              <b>Yay! You have seen it all</b>
            </p>
          }
        >
          {
            <For each="item" index="index" of={this.state.listItems}>
              {item}
            </For>
          }
        </InfiniteScroll>
      </React.Fragment>
    );
    /// Custom - Tabular - layout --
  }
}

/// Custom - List - tracker
export const Maps_Pins_List = withTracker(() => {
  /// Custom - Collection - subscribe
  // eslint-disable-next-line no-unused-vars
  const handles = [];
  const loading = false;

  return {
    loading: loading,
    ComponentInfo: Maps_Pins_List_ComponentInfo
  };
  /// Custom - Collection - subscribe --
})(_Maps_Pins_List);
/// Custom - List - tracker --
