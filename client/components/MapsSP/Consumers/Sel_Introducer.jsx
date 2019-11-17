/// Sys - Tabular
import React from "react";
require("jquery.nicescroll");
import _ from "lodash";
import { Sel_BaseNoHist } from "../lib/Sel_BaseNoHist";
/// Sys - Tabular --

/// Custom - AutoForm - collection
import { Maps_Consumers_Collection } from "@imports/api/Maps/Consumers_Collection";
console.assert(
  Maps_Consumers_Collection,
  "Maps_Consumers_Collection is undefined."
);
/// Custom - AutoForm - collection --

import { MapsSP_Consumers_Detail_ComponentInfo } from "./Detail";

// import start
import { Grid } from "semantic-ui-react";
import { Item } from "semantic-ui-react";

import { Button } from "semantic-ui-react";
import { Input } from "semantic-ui-react";
import { Image } from "semantic-ui-react";
// import end
import { MDBModalBody } from "mdbreact";
import { MDBModalW } from "../lib/MDBModalW";

import { getImageLink } from "../lib/utils";

export class Sel_Introducer extends Sel_BaseNoHist {
  "use strict";

  /**
   *Creates an instance of _Maps_Consumers_List.
   * @param {*} props
   * @memberof _Sel_Introducer
   */
  constructor(props) {
    super(props);

    /// Custom - Role - check permission
    this.ComponentInfo = MapsSP_Consumers_Detail_ComponentInfo;
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
      selectDoc: this.props.newDoc || {},
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
    this.labelAddButton = "紹介者を新規入力";
  }

  /**
   *
   *
   * @memberof _Sel_Introducer
   */
  componentDidMount() {
    console.log(
      new Date().getTime(),
      "List componentDidMount",
      this.Collection._name
    );

    const tmp = _.get(this.props.doc, "introducers") || [];
    const excludeList = tmp.map(t => t.introducer.Maps_Consumers_id);
    excludeList.push(this.props.doc._id);

    this.Collection.docs = window.$GLOBAL$.Collection[this.Collection._name];
    this.CollectionList = [];
    for (let key in this.Collection.docs) {
      if (excludeList.indexOf(key) == -1) {
        this.CollectionList.push(this.Collection.docs[key]);
      }
    }

    this.CollectionList.sort((a, b) => {
      const _a = _.get(a, "identity.kana") || "追" + _.get(a, "identity.name"); // UNICODE 8FFD
      const _b = _.get(b, "identity.kana") || "追" + _.get(b, "identity.name"); // UNICODE 8FFD
      return _a < _b ? -1 : _a > _b ? 1 : 0;
    });

    this.Collection.len = Object.keys(this.Collection.docs).length;

    this.queryDocs();
  }

  /**
   *
   *
   * @memberof _Sel_Introducer
   */
  queryDocs = () => {
    this.queryDocsCommon("identity.kana");
  };

  /**
   *
   *
   * @memberof _Sel_Introducer
   */
  onClickConfirm = () => {
    console.log(new Date().getTime(), "Sel_Introducer onClickConfirm");

    const doc = this.props.doc;

    if (!doc.introducers) {
      doc.introducers = [];
    }
    if (this.state.selectDoc._id) {
      doc.introducers.push({
        introducer: {
          Maps_Consumers_id: this.state.selectDoc._id,
          relationship: this.state.relationship
        }
      });
    }

    this.props.updateDoc(doc, [
      "introducers",
      `introducers.${doc.introducers.length - 1}.introducer.Maps_Consumers_id`,
      `introducers.${doc.introducers.length - 1}.introducer.relationship`
    ]);
    this.props.closeSel_Base();
  };

  /**
   *
   *
   * @memberof Sel_Introducer
   */
  toggleConfirm = () => {
    this.setState({ showConfirm: !this.state.showConfirm });
  };

  /**
   *
   *
   * @memberof Sel_Introducer
   */
  closeConfirm = () => {
    this.setState({ showConfirm: false });
  };

  /// Custom - InfiniteScroll
  /**
   *
   *
   * @memberof _Sel_Introducer
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
   * @memberof Sel_Introducer
   */
  onClickSelectConfirm = () => {
    if (this.state.selectDoc._id) {
      this.setState({ showConfirm: true });
    }
  };

  /**
   *
   *
   * @memberof Sel_Introducer
   */
  onChangeIntroducerRelationship = () => {
    this.setState({ relationship: event.target.value });
  };

  /**
   *
   *
   * @memberof Sel_Introducer
   */
  displayConfirmModal = () => {
    return (
      <MDBModalW
        size="large"
        isOpen={this.state.showConfirm}
        toggle={this.toggleConfirm}
        close={this.closeConfirm}
        className="pinmodal-style2"
        id="modal-white"
      >
        <MDBModalBody>
          <p
            className="font-family bookmodal-font"
            id="modal-padding"
            style={{ textAlign: "center", border: "none", fontWeight: "bold" }}
          >
            紹介者を追加しますか？
          </p>
        </MDBModalBody>
        <MDBModalBody id="modal-padding" className="selfamily-modal">
          <Grid>
            <Grid.Row style={{ padding: "14px" }}>
              <Image
                src={getImageLink(this.state.selectDoc)}
                size="small"
                centered
                style={{
                  width: "35px",
                  marginLeft: "0px",
                  marginRight: "10px"
                }}
              />
              <p
                className="font-family bookmodal-font"
                style={{ marginTop: "auto", marginBottom: "auto" }}
              >
                {_.get(this.state.selectDoc, "identity.name")}
              </p>
            </Grid.Row>
          </Grid>
        </MDBModalBody>
        <MDBModalBody id="modal-padding">
          <Grid>
            <Grid.Row>
              <Input
                onChange={this.onChangeIntroducerRelationship}
                transparent
                placeholder="紹介者との関係を入力"
                size="big"
                className="pinmodal-input"
                style={{ margin: "auto", marginTop: "10px" }}
              />
            </Grid.Row>
          </Grid>
        </MDBModalBody>
        <MDBModalBody id="modal-padding3">
          <Grid>
            <Grid.Row className="modal-padding2">
              <Grid.Column width={8} className="bookmodal-btn-style">
                <Button
                  onClick={this.closeConfirm}
                  className="font-famiy bookmodal-btn modal-no"
                  style={{ fontWeight: "normal" }}
                >
                  キャンセル
                </Button>
              </Grid.Column>
              <Grid.Column width={8} className="bookmodal-btn-style">
                <Button
                  onClick={this.onClickConfirm}
                  className="font-famiy bookmodal-btn modal-yes"
                >
                  OK
                </Button>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </MDBModalBody>
      </MDBModalW>
    );
  };

  /**
   *
   *
   * @memberof _Sel_Introducer
   */
  fetchMoreData = () => {
    this.fetchMoreDataCommon("identity.kana");
  };
  /// Custom - InfiniteScroll --

  /**
   *
   *
   * @returns
   * @memberof _Sel_Introducer
   */
  displayTab2Elem = doc => {
    return doc.identity.name;
  };

  /**
   *
   *
   * @returns
   * @memberof _Sel_Introducer
   */
  displayTab2 = () => {
    return this.displayTab2Common("MapsSP_Consumers_Search_Introducer");
  };
}
