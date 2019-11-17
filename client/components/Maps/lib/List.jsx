/// Sys - Tabular
import React from "react";
import { ListLocalCollection } from "@imports/ui/crud/ListLocalCollection";
import { displayTitle } from "@imports/api/lib/CollectionUtils";
import { UnsavedIndicator } from "@imports/ui/crud/ListLocalCollection";
import InfiniteScroll from "react-infinite-scroll-component";
require("jquery.nicescroll");
/// Sys - Tabular --

export class Maps_List extends ListLocalCollection {
  "use strict";

  /**
   *Creates an instance of _Maps_Consumers_List.
   * @param {*} props
   * @memberof _Maps_Consumers_List
   */
  constructor(props) {
    super(props);

    this.fetchMoreData = this.fetchMoreData.bind(this);
    this.queryDocs = this.queryDocs.bind(this);
  }

  /// Custom - InfiniteScroll
  /**
   *
   *
   * @memberof _Maps_Consumers_List
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
        console.log(new Date().getTime(), "List fetchMoreData this.state.hasMore = false");
        this.state.hasMore = false;
        break;
      }

      const doc = this.listCursor.next();
      this.state.listItems.push(
        <div key={doc._id}>
          {this.state.listItems.length + 1}:
          <span
            dangerouslySetInnerHTML={{
              __html: displayTitle(doc._deleted, doc.identity.name)
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
   * @memberof _Maps_Consumers_List
   */
  render() {
    console.log(new Date().getTime(), "List render");
    const start = new Date().getTime();

    /// Custom - Tabular - layout
    const ret = (
      <React.Fragment>
        {this.InsertButtons(this.Insert_ComponentInfo("create"))}

        <this.List_Selector
          updateSelector={this.updateSelector}
          value={this.state.selector}
        />

        {"現在:" + this.state.listItems.length + " records."}
        {this.ShowNormalSwitch()}

        <UnsavedIndicator collectionName={this.Collection._name} />

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

    const end = new Date().getTime();
    console.log(new Date().getTime(), "List render end", end - start);

    return ret;
  }
}
