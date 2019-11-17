/// Sys - Tabular
import React from "react";
import { Session } from "meteor/session";
import { withTracker } from "meteor/react-meteor-data";
require("jquery.nicescroll");
import _ from "lodash";
import { Sel_Base } from "../lib/Sel_Base";
/// Sys - Tabular --

/// Custom - AutoForm - collection
import { Maps_Associations_Collection } from "@imports/api/Maps/Associations_Collection";
console.assert(
  Maps_Associations_Collection,
  "Maps_Associations_Collection is undefined."
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

export class _Sel_Association extends Sel_Base {
  "use strict";

  /**
   *Creates an instance of _Maps_Associations_List.
   * @param {*} props
   * @memberof _Sel_Association
   */
  constructor(props) {
    super(props);

    /// Custom - Role - check permission
    this.ComponentInfo = MapsSP_Consumers_Detail_ComponentInfo;
    /// Custom - Role - check permission --

    /// Custom - LocalStorage
    /// Custom - AutoForm - rebuild field
    this.Collection = {
      _name: "Maps_Associations",
      docs: {},
      simpleSchema: Maps_Associations_Collection.simpleSchema(),
      dispTitle: Maps_Associations_Collection.dispTitle
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

    this.labelAddButton = "団体を新規入力";
  }

  /**
   *
   *
   * @memberof _Sel_Association
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
   * @memberof _Sel_Association
   */
  queryDocs = () => {
    this.queryDocsCommon("kana");
  };

  /**
   *
   *
   * @memberof _Sel_Association
   */
  onClickConfirm = () => {
    console.log(new Date().getTime(), "Sel_Association onClickConfirm");

    const doc = this.props.doc;

    if (!doc.associations) {
      doc.associations = [];
    }
    if (this.state.selectDoc._id) {
      doc.associations.push({
        association: {
          Maps_Association_id: this.state.selectDoc._id,
          title: this.state.title
        }
      });
    }

    this.props.updateDoc(doc, [
      "associations",
      `associations.${doc.associations.length -
        1}.association.Maps_Association_id`
    ]);
    this.props.closeSel_Base();

    let _ids = Session.get("MapsSP_Consumers_Search_Association") || [];
    _ids.push(this.state.selectDoc._id);
    _ids = _.uniq(_ids);
    Session.set("MapsSP_Consumers_Search_Association", _ids);
  };
  /// Application - Save --

  /**
   *
   *
   * @memberof _Sel_Association
   */
  onClickSelectConfirm = () => {
    if (this.state.selectDoc._id) {
      this.setState({ showConfirm: true });
    }
  };

  /**
   *
   *
   * @memberof _Sel_Association
   */
  onClickDelHist = _id => {
    console.log(new Date().getTime(), "Sel_Association onClickDelHist");

    let _ids = Session.get("MapsSP_Consumers_Search_Association") || [];
    _ids = _ids.filter(i => i != _id);
    _ids = _.uniq(_ids);
    Session.set("MapsSP_Consumers_Search_Association", _ids);
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
   * @memberof _Sel_Association
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
            所属団体を追加しますか？
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
   * @memberof _Sel_Association
   */
  fetchMoreElem = doc => {
    return (
      <React.Fragment>
        <Item.Header
          as="a"
          className="font-association"
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
   * @memberof _Sel_Association
   */
  fetchMoreData = () => {
    this.fetchMoreDataCommon("kana");
  };
  /// Custom - InfiniteScroll --

  /**
   *
   *
   * @returns
   * @memberof _Sel_Association
   */
  displayTab2Elem = doc => {
    return doc.name;
  };

  /**
   *
   *
   * @returns
   * @memberof _Sel_Association
   */
  displayTab2 = () => {
    return this.displayTab2Common("MapsSP_Consumers_Search_Association");
  };
}

/// Custom - List - tracker
export const Sel_Association = withTracker(props => {
  /// Custom - Collection - subscribe
  const handles = [
    // eslint-disable-line no-unused-vars
    Meteor.subscribe(
      Maps_Associations_Collection._name,
      Session.get("Users_Groups_id")
    )
  ];
  const loading = handles.some(handle => !handle.ready());

  if (!loading) {
    Maps_Associations_Collection.find().fetch();
  }

  const tmp = _.get(props.doc, "associations") || [];
  const excludeList = tmp.map(t => t.association.Maps_Association_id);

  return {
    CollectionList: Maps_Associations_Collection.find({ _deleted: null })
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
})(_Sel_Association);
/// Custom - List - tracker --
