/// Sys - Tabular
import React from "react";
import { Session } from "meteor/session";
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

/// Sys - Network
import { Persister } from "@imports/api/lib/persist-method";
/// Sys - Network --

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

export class Sel_Family extends Sel_BaseNoHist {
  "use strict";

  /**
   *Creates an instance of _Maps_Consumers_List.
   * @param {*} props
   * @memberof _Sel_Family
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
      familyRelationship: "",
      familyPrimary: false,
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
    this.labelAddButton = "家族情報を新規入力";
  }

  /**
   *
   *
   * @memberof _Sel_Family
   */
  componentDidMount() {
    console.log(
      new Date().getTime(),
      "List componentDidMount",
      this.Collection._name
    );

    const tmp = _.get(this.props.doc, "familys") || [];
    const excludeList = tmp.map(t => t.family.Maps_Consumers_id);
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
   * @memberof _Sel_Family
   */
  queryDocs = () => {
    this.queryDocsCommon("identity.kana");
  };

  /**
   *
   *
   * @memberof _Sel_Family
   */
  onClickConfirm = () => {
    const doc = this.state.selectDoc;

    doc.familyRelationship = this.state.familyRelationship;
    doc.familyPrimary = this.state.familyPrimary;

    /// Sys - AutoForm - update
    const Users_Groups_id = Session.get("Users_Groups_id");

    console.assert(
      this.ComponentInfo("update"),
      "ComponentInfo('update') is undefined"
    );

    Persister.call(
      this.Form_name + ".update",
      Users_Groups_id,
      doc._id,
      doc,
      /// Sys - ApplicationError - init
      {
        methodCall: "update",
        proc: this.ComponentInfo("update").title,
        record: this.Collection.dispTitle(doc),
        callAt: Date.now()
      },
      /// Sys - ApplicationError - init --
      this.updatePrimaryDoc
    );
    /// Sys - AutoForm - update --

    window.$GLOBAL$.Collection[this.Collection._name][doc._id] = doc;
  };

  /**
   *
   *
   * @memberof _Sel_Family
   */
  updatePrimaryDoc = () => {
    const doc = this.props.doc;
    if (!doc.familys) {
      doc.familys = [];
    }
    if (this.state.selectDoc) {
      doc.familys.push({
        family: {
          Maps_Consumers_id: this.state.selectDoc._id,
          relationship: this.state.familyRelationship
        }
      });
    }

    /// Sys - AutoForm - update
    const Users_Groups_id = Session.get("Users_Groups_id");

    console.assert(
      this.ComponentInfo("update"),
      "ComponentInfo('update') is undefined"
    );

    Persister.call(
      this.Form_name + ".update",
      Users_Groups_id,
      doc._id,
      doc,
      /// Sys - ApplicationError - init
      {
        methodCall: "update",
        proc: this.ComponentInfo("update").title,
        record: this.Collection.dispTitle(doc),
        callAt: Date.now()
      },
      /// Sys - ApplicationError - init --
      this.props.closeSel_Base
    );
    /// Sys - AutoForm - update --

    window.$GLOBAL$.Collection[this.Collection._name][doc._id] = doc;
    this.props.updateDoc(doc);

    Bert.alert({
      type: "success",
      hideDelay: 10000,
      message: "情報を更新しました"
    });

    let _ids = Session.get("MapsSP_Consumers_Search_Family") || [];
    _ids.push(this.state.selectDoc._id);
    _ids = _.uniq(_ids);
    Session.set("MapsSP_Consumers_Search_Family", _ids);
  };
  /// Application - Save --

  /**
   *
   *
   * @memberof MapsSP_Consumers_Detail
   */
  toggleConfirm = () => {
    this.setState({ showConfirm: !this.state.showConfirm });
  };

  /**
   *
   *
   * @memberof MapsSP_Consumers_Detail
   */
  closeConfirm = () => {
    this.setState({ showConfirm: false });
  };

  /// Custom - InfiniteScroll
  /**
   *
   *
   * @memberof _Sel_Family
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
   * @memberof Sel_Family
   */
  onClickSelectConfirm = () => {
    if (this.state.selectDoc._id) {
      this.setState({ showConfirm: true });
    }
  };

  /**
   *
   *
   * @memberof Sel_Family
   */
  onChangeFamilyRelationship = () => {
    this.setState({ familyRelationship: event.target.value });
  };

  /**
   *
   *
   * @memberof Sel_Family
   */
  onClickFamilyPrimary = () => {
    this.setState({ familyPrimary: !this.state.familyPrimary });
  };

  /**
   *
   *
   * @memberof Sel_Family
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
            家族に追加しますか？
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
                  width: "39px",
                  marginRight: "10px",
                  marginLeft: "0px"
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
                onChange={this.onChangeFamilyRelationship}
                transparent
                placeholder="続柄を入力"
                size="big"
                className="pinmodal-input"
                style={{ margin: "auto", marginTop: "10px" }}
              />
            </Grid.Row>
            <Grid.Row
              onClick={this.onClickFamilyPrimary}
              style={{ paddingTop: "0px" }}
            >
              <Image
                src={
                  this.state.familyPrimary
                    ? window.$GLOBAL$.__SVG__["ブクマチェックon"]
                    : window.$GLOBAL$.__SVG__["ブクマチェックoff"]
                }
                style={{ marginLeft: "80px", marginRight: "15px" }}
              />
              <p className="font-family bookmodal-font">世帯主に設定する</p>
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
   * @memberof _Sel_Family
   */
  fetchMoreData = () => {
    this.fetchMoreDataCommon("identity.kana");
  };
  /// Custom - InfiniteScroll --

  /**
   *
   *
   * @returns
   * @memberof _Sel_Family
   */
  displayTab2Elem = doc => {
    return doc.identity.name;
  };

  /**
   *
   *
   * @returns
   * @memberof _Sel_Family
   */
  displayTab2 = () => {
    return this.displayTab2Common("MapsSP_Consumers_Search_Family");
  };
}
