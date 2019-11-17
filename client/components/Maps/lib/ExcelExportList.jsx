/// Sys - Tabular
import React from "react";
import { ListLocalCollection } from "@imports/ui/crud/ListLocalCollection";
import { displayTitle } from "@imports/api/lib/CollectionUtils";
import { UnsavedIndicator } from "@imports/ui/crud/ListLocalCollection";
import InfiniteScroll from "react-infinite-scroll-component";
import mingo from "mingo";
require("jquery.nicescroll");
/// Sys - Tabular --

/// Sys - Excel
const XLSX = require("xlsx");
/// Sys - Excel --

/// Application
import { MDBBtn } from "mdbreact";
import _ from "lodash";
/// Application --

/**
 *
 *
 * @export
 * @class _Maps_Consumers_ExcelExportList
 * @extends {ListLocalCollection}
 */
export class ExcelExportList extends ListLocalCollection {
  "use strict";

  /**
   *Creates an instance of _Maps_Consumers_ExcelExportList.
   * @param {*} props
   * @memberof _Maps_Consumers_ExcelExportList
   */
  constructor(props) {
    super(props);

    /// Custom - Collection - selector
    this.state.selector = {
      name: "",
      address: "",
      tags: {
        or: [],
        not: [],
        and: []
      }
    };
    this.listCursor = null;
    /// Custom - Collection - selector --

    this.query = {};

    this.fetchMoreData = this.fetchMoreData.bind(this);
    this.queryDocs = this.queryDocs.bind(this);
    this.download = this.download.bind(this);
  }

  /**
   *
   *
   * @param {*} kind
   * @memberof _Maps_Consumers_ExcelExportList
   */
  download(kind) {
    const docs = [];
    const cursor = mingo.find(this.CollectionList, this.query);
    while (cursor.hasNext()) {
      const docOrg = cursor.next();
      const doc = [];

      for (let c in this.fieldDefList) {
        if (this.fieldDefList[c].fsel[kind]) {
          const fieldName = this.fieldDefList[c].fieldName;
          doc.push(_.get(docOrg, fieldName, ""));
        }
      }
      docs.push(doc);
    }

    const headingTitle = [];
    const headingFieldName = [];
    for (let c in this.fieldDefList) {
      if (this.fieldDefList[c].fsel[kind]) {
        headingTitle.push(this.fieldDefList[c].title);
        headingFieldName.push(this.fieldDefList[c].fieldName);
      }
    }

    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.aoa_to_sheet([headingTitle]);
    XLSX.utils.sheet_add_aoa(worksheet, docs, { origin: -1 });
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    XLSX.writeFile(workbook, this.excelTitleList[kind] + ".xlsx");
  }

  /// Custom - InfiniteScroll
  /**
   *
   *
   * @memberof _Maps_Consumers_ExcelExportList
   */
  fetchMoreData = () => {
    console.log(new Date().getTime(), "ExcelExportList fetchMoreData");
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
    console.log(
      new Date().getTime(),
      "ExcelExportList fetchMoreData end",
      end - start
    );
  };
  /// Custom - InfiniteScroll --

  /* global item */

  /**
   *
   *
   * @returns
   * @memberof _Maps_Consumers_ExcelExportList
   */
  render() {
    console.log(new Date().getTime(), "ExcelExportList render");
    const start = new Date().getTime();

    /// Custom - Tabular - layout
    const ret = (
      <React.Fragment>
        <this.List_Selector
          updateSelector={this.updateSelector}
          value={this.state.selector}
        />

        {"現在:" + this.state.listItems.length + " records."}
        {this.ShowNormalSwitch()}

        <UnsavedIndicator collectionName={this.Collection._name} />

        <MDBBtn
          color="info"
          onClick={() => {
            this.download("postcard");
          }}
          className="btnfont"
        >
          ダウンロード
        </MDBBtn>

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
    console.log(
      new Date().getTime(),
      "ExcelExportList render end",
      end - start
    );

    return ret;
  }
}
