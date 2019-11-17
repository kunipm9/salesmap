/// Sys - Tabular
import React from "react";
require("jquery.nicescroll");
import _ from "lodash";
import { Sel_BaseNoHist } from "../lib/Sel_BaseNoHist";
/// Sys - Tabular --

import mingo from "mingo";
const moji = require("moji");

/// Custom - AutoForm - collection
import { Maps_Consumers_Collection } from "@imports/api/Maps/Consumers_Collection";
console.assert(
  Maps_Consumers_Collection,
  "Maps_Consumers_Collection is undefined."
);
/// Custom - AutoForm - collection --

import { MapsSP_Associations_Detail_ComponentInfo } from "./Detail";

// import start
import { Item } from "semantic-ui-react";
// import end

export class Sel_Representative extends Sel_BaseNoHist {
  "use strict";

  /**
   *Creates an instance of _Maps_Consumers_List.
   * @param {*} props
   * @memberof _Sel_Representative
   */
  constructor(props) {
    super(props);

    /// Custom - Role - check permission
    this.ComponentInfo = MapsSP_Associations_Detail_ComponentInfo;
    /// Custom - Role - check permission --

    /// Custom - LocalStorage
    /// Custom - AutoForm - rebuild field
    this.Collection = {
      _name: "Maps_Consumers",
      docs: {},
      simpleSchema: Maps_Consumers_Collection.simpleSchema(),
      dispTitle: Maps_Consumers_Collection.dispTitle
    };
    /// Custom - AutoForm - rebuild field --

    this.Form_name = this.Collection._name;
    this.CollectionList = [];
    /// Custom - LocalStorage --

    /// Custom - Collection - selector
    this.state = {
      keyword: "",
      listItems: [],
      hasMore: false,
      selectDoc: {},
      relationship: "",
      componentUpdater: 0,
      showConfirm: false
    };

    this.listCursorCount = 0;
    this.listCursor = null;
    /// Custom - Collection - selector --

    /// Custom - Tabular - condition
    this.onSearchKeyword = this.onSearchKeyword.bind(this);
    this.debouncedOnSearchKeyword = _.debounce(
      this.debouncedOnSearchKeyword.bind(this),
      1000
    );

    this.myRef = React.createRef();
    this.labelAddButton = null;
  }

  /**
   *
   *
   * @memberof _Sel_Representative
   */
  componentDidMount() {
    console.log(
      new Date().getTime(),
      "List componentDidMount",
      this.Collection._name
    );

    this.Collection.docs = window.$GLOBAL$.Collection[this.Collection._name];
    this.CollectionList = [];
    for (let key in this.Collection.docs) {
      this.CollectionList.push(this.Collection.docs[key]);
    }
    this.Collection.len = Object.keys(this.Collection.docs).length;

    this.queryDocs();
  }

  /**
   *
   *
   * @memberof _Sel_Representative
   */
  queryDocs = () => {
    this.queryDocsCommon("identity.name");
  };

  /**
   *
   *
   * @memberof Sel_Base
   */
  queryDocsCommon(sortKey) {
    /// Custom - Collection - selector
    const query = {};

    query["_deleted"] = null;

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

    /// Custom - Collection - sort
    this.CollectionList.sort((a, b) => {
      return _.get(a, sortKey) < _.get(b, sortKey) ? 1 : -1;
    });
    /// Custom - Collection - sort --

    /// Custom - Collection - query
    this.listCursor = mingo.find(this.CollectionList, query);
    this.setState({ listItems: [] });
    this.setState({ hasMore: true });
    this.setState({ dataLength: 0 });
    this.setState({ listCursorCount: this.listCursor.count() });
    this.listCursor = mingo.find(this.CollectionList, query);
    this.fetchMoreData();
    /// Custom - Collection - query --
  }

  /**
   *
   *
   * @memberof _Sel_Representative
   */
  onClickConfirm = () => {
    console.log(new Date().getTime(), "Sel_Representative onClickConfirm");

    const doc = this.props.doc;

    if (!doc.representative) {
      doc.representative = {};
    }
    if (this.state.selectDoc._id) {
      doc.representative.Maps_Consumers_id = this.state.selectDoc._id;
    }

    this.props.updateDoc(doc, [`representative.Maps_Consumers_id`]);
    this.props.closeSel_Base();
  };

  /// Custom - InfiniteScroll
  /**
   *
   *
   * @memberof _Sel_Representative
   */
  fetchMoreElem = doc => {
    return (
      <React.Fragment>
        <Item.Header as="a" className="font-family list-header">
          {_.get(doc, "identity.name")}
        </Item.Header>
        <Item.Meta className="font-color font-family list-meta1">
          {
            <If
              condition={doc.residenceAddress && doc.residenceAddress.address}
            >
              {doc.residenceAddress.address.addressTown}
              {doc.residenceAddress.address.addressNumber}
              {doc.residenceAddress.address.addressBuilding}
              {doc.residenceAddress.address.addressRoomNo}
            </If>
          }
        </Item.Meta>
      </React.Fragment>
    );
  };

  /**
   *
   *
   * @memberof Sel_Representative
   */
  onClickSelectConfirm = () => {
    this.onClickConfirm();
  };

  /**
   *
   *
   * @memberof _Sel_Representative
   */
  fetchMoreData = () => {
    this.fetchMoreDataCommon("identity.name");
  };
  /// Custom - InfiniteScroll --

  /**
   *
   *
   * @returns
   * @memberof _Sel_Representative
   */
  displayTab2Elem = doc => {
    return doc.identity.name;
  };

  /**
   *
   *
   * @returns
   * @memberof _Sel_Representative
   */
  displayTab2 = () => {
    return this.displayTab2Common("MapsSP_Consumers_Search_Representative");
  };

  displayConfirmModal = () => {
    return <React.Fragment />;
  };
}
