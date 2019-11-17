/// Sys - Tabular
import React from "react";
import { Session } from "meteor/session";
import { withTracker } from "meteor/react-meteor-data";
require("jquery.nicescroll");
import _ from "lodash";
import { Sel_Base } from "../lib/Sel_Base";
/// Sys - Tabular --

/// Custom - AutoForm - collection
import { Maps_Companys_Collection } from "@imports/api/Maps/Companys_Collection";
console.assert(
  Maps_Companys_Collection,
  "Maps_Companys_Collection is undefined."
);
/// Custom - AutoForm - collection --

import { MapsSP_Consumers_Detail_ComponentInfo } from "./Detail";

// import start
import { Grid } from "semantic-ui-react";
import { Item } from "semantic-ui-react";

import { Button } from "semantic-ui-react";
import { Input } from "semantic-ui-react";
// import end
import { MDBModalBody } from "mdbreact";
import { MDBModalW } from "../lib/MDBModalW";

export class _Sel_Company extends Sel_Base {
  "use strict";

  /**
   *Creates an instance of _Maps_Companys_List.
   * @param {*} props
   * @memberof _Sel_Company
   */
  constructor(props) {
    super(props);

    /// Custom - Role - check permission
    this.ComponentInfo = MapsSP_Consumers_Detail_ComponentInfo;
    /// Custom - Role - check permission --

    /// Custom - LocalStorage
    /// Custom - AutoForm - rebuild field
    this.Collection = {
      _name: "Maps_Companys",
      docs: {},
      simpleSchema: Maps_Companys_Collection.simpleSchema(),
      dispTitle: Maps_Companys_Collection.dispTitle
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
      title: "",
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

    this.labelAddButton = "企業を新規入力";
  }

  /**
   *
   *
   * @memberof _Sel_Company
   */
  componentDidMount() {
    console.log(
      new Date().getTime(),
      "List componentDidMount",
      this.Collection._name
    );

    this.CollectionList = this.props.CollectionList;

    this.queryDocs();
  }

  /**
   *
   *
   * @memberof _Sel_Company
   */
  queryDocs = () => {
    this.queryDocsCommon("kana");
  };

  /**
   *
   *
   * @memberof _Sel_Company
   */
  onClickConfirm = () => {
    console.log(new Date().getTime(), "Sel_Company onClickConfirm");

    const doc = this.props.doc;

    if (!doc.companys) {
      doc.companys = [];
    }
    if (this.state.selectDoc._id) {
      doc.companys.push({
        company: {
          Maps_Company_id: this.state.selectDoc._id,
          title: this.state.title
        }
      });
    }

    this.props.updateDoc(doc, [
      "companys",
      `companys.${doc.companys.length - 1}.company.Maps_Company_id`
    ]);
    this.props.closeSel_Base();

    let _ids = Session.get("MapsSP_Consumers_Search_Company") || [];
    _ids.push(this.state.selectDoc._id);
    _ids = _.uniq(_ids);
    Session.set("MapsSP_Consumers_Search_Company", _ids);
  };
  /// Application - Save --

  /**
   *
   *
   * @memberof _Sel_Company
   */
  onClickSelectConfirm = () => {
    if (this.state.selectDoc._id) {
      this.setState({ showConfirm: true });
    }
  };

  /**
   *
   *
   * @memberof _Sel_Company
   */
  onClickDelHist = _id => {
    console.log(new Date().getTime(), "Sel_Company onClickDelHist");

    let _ids = Session.get("MapsSP_Consumers_Search_Company") || [];
    _ids = _ids.filter(i => i != _id);
    _ids = _.uniq(_ids);
    Session.set("MapsSP_Consumers_Search_Company", _ids);
  };

  /**
   *
   *
   * @param {*} event
   * @memberof Sel_Base
   */
  onChangeTitle = event => {
    this.setState({ title: event.target.value });
  };

  /**
   *
   *
   * @memberof _Sel_Company
   */
  displayConfirmModal = () => {
    return (
      <MDBModalW
        size="large"
        isOpen={this.state.showConfirm}
        toggle={this.toggleConfirm}
        className="pinmodal-style2"
        id="modal-white"
      >
        <MDBModalBody>
          <p
            className="font-family bookmodal-font"
            id="modal-padding"
            style={{ textAlign: "center", border: "none", fontWeight: "bold" }}
          >
            所属企業を追加しますか？
          </p>
        </MDBModalBody>
        <MDBModalBody id="modal-padding" className="selfamily-modal">
          <Grid>
            <Grid.Row style={{ padding: "14px" }}>
              <p
                className="font-family bookmodal-font"
                style={{ marginTop: "auto", marginBottom: "auto" }}
              >
                {_.get(this.state.selectDoc, "name")}
              </p>
            </Grid.Row>
          </Grid>
        </MDBModalBody>
        <MDBModalBody id="modal-padding">
          <Grid>
            <Grid.Row>
              <Input
                onChange={this.onChangeTitle}
                transparent
                placeholder="役職を入力"
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
                  onClick={() => this.setState({ showConfirm: false })}
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

  /// Custom - InfiniteScroll
  /**
   *
   *
   * @memberof _Sel_Company
   */
  fetchMoreElem = doc => {
    return (
      <React.Fragment>
        <Item.Header
          as="a"
          className="font-company"
          style={{
            fontSize: "17px",
            color: "#3C3C3C",
            fontWeight: "bold"
          }}
        >
          {doc.name}
        </Item.Header>
        <Item.Meta className="font-color font-family add-meta1">
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
   * @memberof _Sel_Company
   */
  fetchMoreData = () => {
    this.fetchMoreDataCommon("kana");
  };
  /// Custom - InfiniteScroll --

  /**
   *
   *
   * @returns
   * @memberof _Sel_Company
   */
  displayTab2Elem = doc => {
    return doc.name;
  };

  /**
   *
   *
   * @returns
   * @memberof _Sel_Company
   */
  displayTab2 = () => {
    return this.displayTab2Common("MapsSP_Consumers_Search_Company");
  };
}

/// Custom - List - tracker
export const Sel_Company = withTracker(props => {
  /// Custom - Collection - subscribe
  const handles = [
    // eslint-disable-line no-unused-vars
    Meteor.subscribe(
      Maps_Companys_Collection._name,
      Session.get("Users_Groups_id")
    )
  ];
  const loading = handles.some(handle => !handle.ready());

  if (!loading) {
    Maps_Companys_Collection.find().fetch();
  }

  const tmp = _.get(props.doc, "companys") || [];
  const excludeList = tmp.map(t => t.company.Maps_Company_id);

  return {
    CollectionList: Maps_Companys_Collection.find({ _deleted: null })
      .map(b => {
        return b;
      })
      .filter(c => excludeList.indexOf(c._id) == -1)
      .sort((a, b) => {
        const _a = _.get(a, "kana") || "追" + _.get(a, "name"); // UNICODE 8FFD
        const _b = _.get(b, "kana") || "追" + _.get(b, "name"); // UNICODE 8FFD
        return _a < _b ? -1 : _a > _b ? 1 : 0;
      }),
    loading: loading
  };
  /// Custom - Collection - subscribe --
})(_Sel_Company);
/// Custom - List - tracker --
