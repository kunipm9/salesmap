import React from "react";
import { Session } from "meteor/session";
import moment from "moment";
moment.locale("ja");
import _ from "lodash";

import {
  Segment,
  Grid,
  Button,
  Item,
  Input,
  TextArea,
  Image,
  Label
} from "semantic-ui-react";

import { MDBModalBody } from "mdbreact";
import { MDBModalW } from "../../lib/MDBModalW";

import { MapsSP_Maps_View_ComponentInfo } from "../View";

/// Custom - AutoForm - collection
import { Maps_Consumers_Collection } from "@imports/api/Maps/Consumers_Collection";
console.assert(
  Maps_Consumers_Collection,
  "Maps_Consumers_Collection is undefined."
);
import { Maps_ConsumersSum_Collection } from "@imports/api/Maps/ConsumersSum_Collection";

import { Maps_Ranks_Collection } from "@imports/api/Maps/Ranks_Collection";
console.assert(Maps_Ranks_Collection, "Maps_Ranks_Collection is undefined.");
/// Custom - AutoForm - collection --

/// Sys - Network
import { Random } from "meteor/random";
import { Persister } from "@imports/api/lib/persist-method";
/// Sys - Network --

import { getImageLink } from "../../lib/utils";
import { getTagName } from "../../lib/Tags/utils";

export class Maps_Consumers_View_Edit extends React.Component {
  "use strict";

  constructor(props) {
    console.log(new Date().getTime(), "ConsumersLocalCollection constructor");
    super(props);

    /// Custom - Role - check permission
    this.ComponentInfo = MapsSP_Maps_View_ComponentInfo;
    /// Custom - Role - check permission --

    /// Custom - LocalStorage
    /// Custom - AutoForm - rebuild field
    this.Collection = {
      _name: "Maps_Consumers",
      docs: {},
      simpleSchema: Maps_Consumers_Collection.simpleSchema(),
      dispTitle: Maps_Consumers_Collection.dispTitle
    };
    this.Form_name = this.Collection._name;
    /// Custom - AutoForm - rebuild field --
    this.SumCollection = Maps_ConsumersSum_Collection;
    /** @type {any[]} */
    this.CollectionList = [];
    /// Custom - LocalStorage --

    this.state = {
      doc: {},
      tags: [],
      rank: "0",
      visit: null,
      familyPrimary: false,
      inputDetail: false,
      inputCommunicationsMemo: "",
      inputCommunicationsPetition: "",
      inputMemo: "",
      inputFamilys: [],
      inputDetailAddressBuilding: "",
      inputDetailAddressRoomNo: "",
      inputDetailAddressShopName: "",
      expandCommunication: false,
      showDelTagConfirm: false,
      delTag: [0, 0, 0, 0]
    };
    this.ranks = [];
    this.rankRow = [];

    const rankRec = Maps_Ranks_Collection.findOne();
    if (rankRec && rankRec.ranks) {
      this.ranks = rankRec.ranks;
    }
    this.rankRow = [];
    let rankRowElem0 = {};
    let rankRowElem1 = {};
    let rankRowElem2 = {};
    let rankColNo = 0;
    for (let i = 0; i < this.ranks.length && i < 11; i++) {
      if (this.ranks[i] && this.ranks[i].rank) {
        const rankTmp = this.ranks[i];
        rankTmp.id = i;
        switch (rankColNo) {
          case 0:
            rankRowElem0 = rankTmp;
            rankColNo = 1;
            break;
          case 1:
            rankRowElem1 = rankTmp;
            rankColNo = 2;
            break;
          case 2:
            rankRowElem2 = rankTmp;
            rankColNo = 0;
            this.rankRow.push([rankRowElem0, rankRowElem1, rankRowElem2]);
            rankRowElem0 = {};
            rankRowElem1 = {};
            rankRowElem2 = {};
            break;
        }
      }
    }
    if (rankRowElem0.rank || rankRowElem1.rank || rankRowElem2.rank) {
      this.rankRow.push([rankRowElem0, rankRowElem1, rankRowElem2]);
    }

    this.setup(this.props);

    this.window_innerHeight = window.innerHeight;
  }

  /**
   *
   *
   * @memberof Maps_Consumers_View_Edit
   */
  componentDidMount() {
    this.setup(this.props);
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (this.state.doc._id != nextProps.doc._id) {
      this.setup(nextProps);
    }
    return true;
  }

  setup = props => {
    if (!props.doc) {
      return;
    }

    this.state.doc = props.doc;

    const doc = props.doc;
    if (!doc.identity) {
      doc.identity = {};
    }
    if (!doc.tags) {
      doc.tags = [];
    }
    if (!doc.familys) {
      doc.familys = [];
    }
    if (!doc.communications) {
      doc.communications = [];
    }
    if (!doc.residenceAddress) {
      doc.residenceAddress = {};
    }
    if (!doc.residenceAddress.address) {
      doc.residenceAddress.address = {};
    }

    console.log("ssssssssssssssssssssssssss", doc);

    this.setState({
      doc: doc,
      tags: doc.tags || [],
      rank: doc.rank,
      visit: null,
      familyPrimary: doc.familyPrimary,
      inputDetail: false,
      inputMemo: doc.memo || "",
      inputFamilys: [],
      inputDetailAddressBuilding: _.get(
        doc,
        "residenceAddress.address.addressBuilding"
      ),
      inputDetailAddressRoomNo: _.get(
        doc,
        "residenceAddress.address.addressRoomNo"
      )
    });
  };

  addFamilyComplete = () => {};

  /// Application - Save
  /**
   *
   *
   * @param {*} doc
   * @memberof Add_Family
   */
  submitFamily = rec => {
    const doc = {
      identity: {
        name: rec.name,
        kana: rec.kana
      },
      familys: [],
      familyPrimary: rec.familyPrimary,
      tags: [],
      communications: [],
      residenceAddress: {
        address:
          _.get(this.props, "clickedPoint.address") ||
          _.get(doc, "residenceAddress.address"),
        location: _.get(this.props, "clickedPoint.location")
      }
    };

    _.set(
      doc,
      "residenceAddress.address.addressBuilding",
      this.state.inputDetailAddressBuilding
    );
    _.set(
      doc,
      "residenceAddress.address.addressRoomNo",
      this.state.inputDetailAddressRoomNo
    );

    /// Sys - AutoForm - update
    const Users_Groups_id = Session.get("Users_Groups_id");

    console.assert(
      this.ComponentInfo("update"),
      "ComponentInfo('update') is undefined"
    );

    doc._id = Random.id(15);

    this.Collection.simpleSchema.clean(doc);

    Persister.call(
      this.Form_name + ".insert",
      Users_Groups_id,
      doc,
      /// Sys - ApplicationError - init
      {
        methodCall: "create",
        proc: this.ComponentInfo("create").title,
        record: this.Collection.dispTitle(doc),
        callAt: Date.now()
      },
      /// Sys - ApplicationError - init --
      this.addFamilyComplete
    );
    /// Sys - AutoForm - update --

    window.$GLOBAL$.Collection[this.Collection._name][doc._id] = doc;

    this.props.addDocIds(doc._id);

    return doc._id;
  };
  /// Application - Save --

  /// Application - Save
  /**
   *
   *
   * @param {*} doc
   * @memberof Edit_Info
   */
  submit = () => {
    const doc = this.state.doc;

    doc.rank = this.state.rank;
    if (
      this.state.visit ||
      this.state.inputCommunicationsMemo ||
      this.state.inputCommunicationsPetition
    ) {
      doc.communications.push({
        communication: {
          staff: Meteor.user().profile.username,
          type: this.state.visit,
          memo: this.state.inputCommunicationsMemo,
          petition: this.state.inputCommunicationsPetition,
          modifiedAt: new Date().getTime()
        }
      });
    }

    for (let i = 0; i < this.state.inputFamilys.length; i++) {
      doc.familys.push({
        family: {
          Maps_Consumers_id: this.submitFamily(this.state.inputFamilys[i]),
          relationship: this.state.inputFamilys[i].relationship
        }
      });
    }

    _.set(doc, "tags", this.state.tags);
    _.set(doc, "memo", this.state.inputMemo);
    _.set(
      doc,
      "residenceAddress.address.addressBuilding",
      this.state.inputDetailAddressBuilding
    );
    _.set(
      doc,
      "residenceAddress.address.addressRoomNo",
      this.state.inputDetailAddressRoomNo
    );

    /// Sys - AutoForm - update
    const Users_Groups_id = Session.get("Users_Groups_id");

    console.assert(
      this.ComponentInfo("update"),
      "ComponentInfo('update') is undefined"
    );

    this.Collection.simpleSchema.clean(doc);

    if (doc._id) {
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
        this.props.closeEdit_Info
      );
    } else {
      doc._id = Random.id(15);
      Persister.call(
        this.Form_name + ".insert",
        Users_Groups_id,
        doc,
        /// Sys - ApplicationError - init
        {
          methodCall: "create",
          proc: this.ComponentInfo("create").title,
          record: this.Collection.dispTitle(doc),
          callAt: Date.now()
        },
        /// Sys - ApplicationError - init --
        this.props.closeEdit_Info
      );
    }
    /// Sys - AutoForm - update --

    /// Custom - localCollection - update
    window.$GLOBAL$.Collection[this.Collection._name][doc._id] = doc;
    /// Custom - localCollection - update --

    this.props.modifyDocIds(doc._id);

    Bert.alert({
      type: "success",
      hideDelay: 10000,
      message: "情報を更新しました"
    });
  };
  /// Application - Save --

  /**
   *
   *
   * @memberof MapsSP_Consumers_Detail
   */
  onClickSel_Tags = () => {
    this.setState({ showSel_Tags: true });
  };

  /**
   *
   *
   * @memberof MapsSP_Consumers_Detail
   */
  toggleTags = () => {
    this.setState({ showSel_Tags: !this.state.showSel_Tags });
  };

  /**
   *
   *
   * @memberof MapsSP_Consumers_Detail
   */
  closeSel_Tags = () => {
    this.setState({ showSel_Tags: false });
  };

  /**
   *
   *
   * @memberof MapsSP_Consumers_Detail
   */
  addTags = tags => {
    this.state.doc.tags = tags;
    this.setState({ tags: tags, doc: this.state.doc });
  };

  /**
   *
   *
   * @memberof Maps_Consumers_View_Edit
   */
  onClickDeleteTagConfirm = tag => {
    this.setState({ delTag: tag, showDelTagConfirm: true });
  };

  /**
   *
   *
   * @memberof Maps_Consumers_View_Edit
   */
  onClickDeleteTag = () => {
    console.log("onClickDeleteTag", this.state.delTag);
    const tags2 = this.state.tags.filter(t => t[0] != this.state.delTag[0]);
    this.setState({ tags: tags2, showDelTagConfirm: false });
  };

  /**
   *
   *
   * @memberof Maps_Consumers_View_Edit
   */
  getCommunicationColor = type => {
    switch (type) {
      case "meet":
        return "label-honnin";
      case "absences":
        return "label-rusu";
      case "athome":
        return "label-zaitaku";
      case "visit":
        return "label-menkai";
    }
  };

  /**
   *
   *
   * @memberof Maps_Consumers_View_Edit
   */
  getCommunicationLabel = type => {
    switch (type) {
      case "meet":
        return "本人";
      case "absences":
        return "留守";
      case "athome":
        return "在宅";
      case "visit":
        return "面会";
    }
  };

  /**
   *
   *
   * @memberof Maps_Consumers_View_Edit
   */
  getRankColor = _id => {
    if (this.state.rank == _id) {
      return "active";
    } else {
      return "";
    }
  };

  /**
   *
   *
   * @param {*} rank
   * @returns
   * @memberof SelectorRanks
   */
  getRankBackgroundColor = _id => {
    if (this.state.rank == _id) {
      const rank = this.ranks[_id] || {};
      if (!rank) {
        return "white";
      }
      return rank.color;
    }
    return "white";
  };

  /**
   *
   *
   * @memberof Maps_Consumers_View_Edit
   */
  onClickRank = _id => {
    if (this.state.rank == _id) {
      this.setState({ rank: null });
    } else {
      this.setState({ rank: _id });
    }
  };

  /**
   *
   *
   * @param {*} _id
   * @returns
   * @memberof SelectorRanks
   */
  getVisitColor = _id => {
    if (this.state.visit == _id) {
      return "active";
    } else {
      return "";
    }
  };

  /**
   *
   */
  onClickVisit = _id => {
    console.log("click this.state.visit", this.state.visit);
    if (this.state.visit == _id) {
      this.setState({ visit: null });
    } else {
      this.setState({ visit: _id });
    }
  };

  /**
   *
   *
   * @memberof Maps_Consumers_View_Edit
   */
  onClickInputDetail = () => {
    this.setState({ inputDetail: !this.state.inputDetail });
  };

  /**
   *
   *
   * @memberof Maps_Consumers_View_Edit
   */
  onChangeInputFamilyName = (index, event) => {
    const inputFamilys = Object.assign([], this.state.inputFamilys);
    inputFamilys[index].name = event.target.value;
    this.setState({ inputFamilys: inputFamilys });
  };

  /**
   *
   *
   * @memberof Maps_Consumers_View_Edit
   */
  onChangeInputFamilyKana = (index, event) => {
    const inputFamilys = Object.assign([], this.state.inputFamilys);
    inputFamilys[index].kana = event.target.value;
    this.setState({ inputFamilys: inputFamilys });
  };

  /**
   *
   *
   * @memberof Maps_Consumers_View_Edit
   */
  onChangeInputFamilyRelationship = (index, event) => {
    const inputFamilys = Object.assign([], this.state.inputFamilys);
    inputFamilys[index].relationship = event.target.value;
    this.setState({ inputFamilys: inputFamilys });
  };

  /**
   *
   *
   * @memberof Maps_Consumers_View_Edit
   */
  onClickFamilyPrimary = index => {
    const inputFamilys = Object.assign([], this.state.inputFamilys);
    inputFamilys[index].familyPrimary = !inputFamilys[index].familyPrimary;
    this.setState({ familyPrimary: !this.state.familyPrimary });
  };

  /**
   *
   *
   * @memberof Maps_Consumers_View_Edit
   */
  onClickAddInputFamily = () => {
    const inputFamilys = Object.assign([], this.state.inputFamilys);
    inputFamilys.push({
      name: "",
      kana: "",
      relationship: "",
      familyPrimary: false
    });
    this.setState({ inputFamilys: inputFamilys });
  };

  /**
   *
   *
   * @memberof Maps_Consumers_View_Edit
   */
  onChangeInputDetailAddressBuilding = event => {
    this.setState({ inputDetailAddressBuilding: event.target.value });
  };

  /**
   *
   *
   * @memberof Maps_Consumers_View_Edit
   */
  onChangeInputDetailAddressRoomNo = event => {
    this.setState({ inputDetailAddressRoomNo: event.target.value });
  };

  /**
   *
   *
   * @memberof ConsumersLocalCollection
   */
  onChangeInputDetailAddressShopName = event => {
    this.setState({ inputDetailAddressShopName: event.target.value });
  };

  /**
   *
   *
   * @memberof Maps_Consumers_View_Edit
   */
  onChangeInputCommunicationsMemo = event => {
    this.setState({ inputCommunicationsMemo: event.target.value });
  };

  /**
   *
   *
   * @memberof Maps_Consumers_View_Edit
   */
  onChangeInputCommunicationsPetition = event => {
    this.setState({ inputCommunicationsPetition: event.target.value });
  };

  /**
   *
   *
   * @memberof ConsumersLocalCollection
   */
  showRoomListModal = () => {
    this.props.showRoomListModal();
  };

  /**
   *
   *
   * @memberof ConsumersLocalCollection
   */
  closeRoomListModal = () => {
    this.props.closeRoomListModal();
  };

  /**
   *
   *
   * @memberof ConsumersLocalCollection
   */
  showTagListModal = () => {
    this.props.showTagListModal(this.addTags, this.state.doc);
  };

  /* global tag */
  /* global communication */
  /* global index */
  /* global ranks */
  /* global family */

  /**
   *
   *
   * @returns
   * @memberof Maps_Consumers_View_Edit
   */
  render() {
    const doc = this.state.doc;
    const address =
      _.get(this.props, "clickedPoint.address") ||
      _.get(doc, "residenceAddress.address");

    if (!doc) {
      return <React.Fragment />;
    }

    console.log("rrrrrrrrrrrrrrrrrrrrrrrrrr", this.state);

    return (
      <React.Fragment>
        {/* スクロールエリア start */}
        <Segment
          className="scroll-area"
          style={{ maxHeight: this.window_innerHeight - 62 + "px" }}
        >
          <Segment padded className="map8-area">
            <Item.Group divided>
              <Item>
                <Grid>
                  <Grid.Row>
                    <Grid.Column width={4}>
                      <Image
                        src={getImageLink(doc)}
                        style={{ marginTop: "14px" }}
                      />
                      {/* 世帯主の場合星マークがつく */}
                      {
                        <If condition={doc.familyPrimary}>
                          <Image
                            src={window.$GLOBAL$.__SVG__["プロフ星小"]}
                            style={{
                              bottom: "21px",
                              left: "32px",
                              width: "45%"
                            }}
                          />
                        </If>
                      }
                    </Grid.Column>
                    <Grid.Column
                      width={12}
                      className="font-family font-color"
                      style={{ margin: "auto 0" }}
                    >
                      <Item.Header
                        style={{ fontSize: "18px", fontWeight: "bold" }}
                      >
                        {_.get(doc, "identity.name")}
                      </Item.Header>
                      <Item.Meta
                        style={{ margin: "2px 0 0 0", fontSize: "12px" }}
                      >
                        {_.get(doc, "identity.kana")}
                      </Item.Meta>
                    </Grid.Column>
                  </Grid.Row>
                </Grid>
              </Item>

              <Item style={{ border: "none" }}>
                <Item.Meta className="font-family map11-meta">タグ</Item.Meta>
                <Button className="map11-tag-add">
                  <Image
                    onClick={this.showTagListModal}
                    src={window.$GLOBAL$.__SVG__["新規追加"]}
                    className="map8-add"
                  />
                </Button>
                <Grid style={{ padding: "0px 14px" }}>
                  {
                    <For each="tag" index="index" of={this.state.tags}>
                      <Label
                        key={index}
                        className="font-family map11-tag-label"
                      >
                        <p className="map11-tag-p">
                          {getTagName(tag[0], tag[1], tag[2], tag[3])[1]}
                        </p>
                        <Image
                          onClick={() => this.onClickDeleteTagConfirm(tag)}
                          src={window.$GLOBAL$.__SVG__["タグ削除"]}
                          id="map11-tag-delite"
                        />
                      </Label>
                    </For>
                  }
                </Grid>
              </Item>

              <Item
                className="items-padding"
                style={{ borderTop: "solid 1px #BEBEBE" }}
              >
                <Item.Meta className="font-family map11-meta">メモ</Item.Meta>

                <TextArea
                  value={this.state.inputMemo}
                  onChange={e => {
                    this.setState({ inputMemo: e.target.value });
                  }}
                  className="font-family font-color"
                  style={{
                    listStyle: "none",
                    padding: "0px",
                    margin: "5px 0 3px",
                    fontSize: "14px",
                    border: "none"
                  }}
                />
              </Item>

              <Item
                className="items-padding"
                style={{ borderTop: "solid 1px #BEBEBE" }}
              >
                <Item.Meta
                  className="font-family map11-meta"
                  style={{ marginBottom: "12px" }}
                >
                  面会ステータス
                </Item.Meta>
                <Grid>
                  <Grid.Row style={{ paddingBottom: "5px" }}>
                    <Grid.Column width={8} style={{ paddingRight: "5px" }}>
                      <Button
                        onClick={() => this.onClickVisit("meet")}
                        className={
                          "font-family map8-status-honnin " +
                          this.getVisitColor("meet")
                        }
                      >
                        本人
                      </Button>
                    </Grid.Column>
                    <Grid.Column width={8} style={{ paddingLeft: "5px" }}>
                      <Button
                        onClick={() => this.onClickVisit("visit")}
                        className={
                          "font-family map8-status-menkai " +
                          this.getVisitColor("visit")
                        }
                      >
                        面会
                      </Button>
                    </Grid.Column>
                  </Grid.Row>
                  <Grid.Row style={{ paddingTop: "5px" }}>
                    <Grid.Column width={8} style={{ paddingRight: "5px" }}>
                      <Button
                        onClick={() => this.onClickVisit("athome")}
                        className={
                          "font-family map8-status-zaitaku " +
                          this.getVisitColor("athome")
                        }
                      >
                        在宅
                      </Button>
                    </Grid.Column>
                    <Grid.Column width={8} style={{ paddingLeft: "5px" }}>
                      <Button
                        onClick={() => this.onClickVisit("absences")}
                        className={
                          "font-family map8-status-rusu " +
                          this.getVisitColor("absences")
                        }
                      >
                        留守
                      </Button>
                    </Grid.Column>
                  </Grid.Row>
                </Grid>
                {/* ステータスクローズ状態 start */}

                {/* ステータスオープン状態 start */}
                <Grid style={{ marginTop: 0 }}>
                  <Grid.Row>
                    <Grid.Column width={13} style={{ padding: "0px" }}>
                      <ul
                        className="font-family font-color"
                        style={{
                          fontSize: "16px",
                          paddingLeft: "30px",
                          marginBottom: "15px",
                          marginTop: "7px"
                        }}
                      >
                        {
                          <For
                            each="communication"
                            index="index"
                            of={doc.communications || []}
                          >
                            {
                              <If
                                condition={
                                  communication && communication.communication
                                }
                              >
                                <li key={index} className="map8-status-li">
                                  {moment(
                                    communication.communication.modifiedAt
                                  ).format("YYYY/MM/DD")}
                                  <Label
                                    circular
                                    size="mini"
                                    id="label-padding2"
                                    className={
                                      "font-family " +
                                      this.getCommunicationColor(
                                        communication.communication.type
                                      )
                                    }
                                  >
                                    {this.getCommunicationLabel(
                                      communication.communication.type
                                    )}
                                  </Label>
                                  {
                                    <If
                                      condition={this.state.expandCommunication}
                                    >
                                      <Item style={{ marginTop: "7px" }}>
                                        <Item.Content
                                          style={{ marginBottom: "5px" }}
                                        >
                                          担当者：
                                          {communication.communication.staff}
                                        </Item.Content>
                                        <Item.Content>
                                          コメント：
                                          {communication.communication.memo}
                                        </Item.Content>
                                        <Item.Content>
                                          陳情：
                                          {communication.communication.petition}
                                        </Item.Content>
                                      </Item>
                                    </If>
                                  }
                                </li>
                              </If>
                            }
                          </For>
                        }
                      </ul>
                    </Grid.Column>
                    <Grid.Column width={3}>
                      {
                        <If condition={!this.state.expandCommunication}>
                          <Image
                            onClick={() =>
                              this.setState({ expandCommunication: true })
                            }
                            src={window.$GLOBAL$.__SVG__["＞（グレー）"]}
                            style={{
                              float: "right",
                              right: "15px",
                              position: "absolute",
                              top: "calc(50% - 12px)"
                            }}
                          />
                        </If>
                      }
                      {
                        <If condition={this.state.expandCommunication}>
                          <Image
                            onClick={() =>
                              this.setState({ expandCommunication: false })
                            }
                            src={window.$GLOBAL$.__SVG__["V（グレー）"]}
                            style={{
                              float: "right",
                              right: "15px",
                              position: "absolute",
                              top: "calc(50% - 12px)"
                            }}
                          />
                        </If>
                      }
                    </Grid.Column>
                  </Grid.Row>
                </Grid>

                {/* ステータスオープン状態 end */}
              </Item>

              <Item className="items-padding" style={{ borderTop: "none" }}>
                <Input
                  value={this.state.inputCommunicationsMemo}
                  onChange={event =>
                    this.onChangeInputCommunicationsMemo(event)
                  }
                  className="font-family map11-input-style"
                  id="map11-input"
                  inverted
                  placeholder="コメント"
                />
              </Item>

              <Item
                value={this.state.inputCommunicationsPetition}
                onChange={event =>
                  this.onChangeInputCommunicationsPetition(event)
                }
                className="items-padding"
                style={{ borderTop: "solid 1px #BEBEBE" }}
              >
                <Input
                  className="font-family map11-input-style"
                  id="map11-input"
                  inverted
                  placeholder="陳情"
                />
              </Item>

              <Item
                style={{ borderTop: "solid 1px #BEBEBE", paddingBottom: "0px" }}
              >
                <Item.Meta
                  className="font-family map11-meta"
                  style={{ marginBottom: "12px" }}
                >
                  ランク
                </Item.Meta>
                <Grid style={{ padding: "0 14px 10px" }}>
                  {
                    <For each="ranks" index="index" of={this.rankRow}>
                      <Grid.Row key={index} style={{ padding: "5px 0" }}>
                        <Grid.Column
                          width={5}
                          className="map8-rank-col"
                          style={{ padding: "0rem 0rem", marginRight: "3.5px" }}
                        >
                          {
                            <If condition={ranks[0].rank}>
                              <Button
                                onClick={() => this.onClickRank(ranks[0].id)}
                                className={
                                  "font-family map8-rank-btn " +
                                  this.getRankColor(ranks[0].id)
                                }
                                style={{
                                  backgroundColor: this.getRankBackgroundColor(
                                    ranks[0].id
                                  )
                                }}
                              >
                                {ranks[0].rank}
                              </Button>
                            </If>
                          }
                        </Grid.Column>
                        <Grid.Column
                          width={5}
                          className="map8-rank-col"
                          style={{ padding: "0rem 0rem", margin: "0 3.5px" }}
                        >
                          {
                            <If condition={ranks[1].rank}>
                              <Button
                                onClick={() => this.onClickRank(ranks[1].id)}
                                className={
                                  "font-family map8-rank-btn " +
                                  this.getRankColor(ranks[1].id)
                                }
                                style={{
                                  backgroundColor: this.getRankBackgroundColor(
                                    ranks[1].id
                                  )
                                }}
                              >
                                {ranks[1].rank}
                              </Button>
                            </If>
                          }
                        </Grid.Column>
                        <Grid.Column
                          width={5}
                          className="map8-rank-col"
                          style={{
                            padding: "0rem 0rem",
                            margin: "0 0 0 3.5px"
                          }}
                        >
                          {
                            <If condition={ranks[2].rank}>
                              <Button
                                onClick={() => this.onClickRank(ranks[2].id)}
                                className={
                                  "font-family map8-rank-btn " +
                                  this.getRankColor(ranks[2].id)
                                }
                                style={{
                                  backgroundColor: this.getRankBackgroundColor(
                                    ranks[2].id
                                  )
                                }}
                              >
                                {ranks[2].rank}
                              </Button>
                            </If>
                          }
                        </Grid.Column>
                      </Grid.Row>
                    </For>
                  }
                </Grid>
              </Item>

              <Item
                style={{
                  borderBottom: "none",
                  borderTop: "none",
                  paddingBottom: 0,
                  height: "30px"
                }}
              >
                <Item.Meta className="font-family map11-meta">
                  家族を追加
                </Item.Meta>
              </Item>

              {
                <For
                  each="family"
                  index="index"
                  of={this.state.inputFamilys || []}
                >
                  <Segment>
                    <Item
                      className="items-padding"
                      style={{
                        borderBottom: "solid 1px #BEBEBE",
                        borderTop: "none"
                      }}
                    >
                      <Input
                        value={family.name}
                        onChange={event =>
                          this.onChangeInputFamilyName(index, event)
                        }
                        className="font-family map11-input-style"
                        id="map11-input"
                        inverted
                        placeholder="名前"
                      />
                    </Item>

                    <Item
                      className="items-padding"
                      style={{
                        borderBottom: "solid 1px #BEBEBE",
                        borderTop: "none"
                      }}
                    >
                      <Input
                        value={family.kana}
                        onChange={event =>
                          this.onChangeInputFamilyKana(index, event)
                        }
                        className="font-family map11-input-style"
                        id="map11-input"
                        inverted
                        placeholder="名前カナ"
                      />
                    </Item>

                    <Item
                      className="items-padding"
                      style={{
                        borderBottom: "solid 1px #BEBEBE",
                        borderTop: "none"
                      }}
                    >
                      <Input
                        value={family.relationship}
                        onChange={event =>
                          this.onChangeInputFamilyRelationship(index, event)
                        }
                        className="font-family map11-input-style"
                        id="map11-input"
                        inverted
                        placeholder="続柄"
                      />
                    </Item>

                    <Item style={{ marginBottom: "22px" }}>
                      <p
                        onClick={() => this.onClickFamilyPrimary(index)}
                        className="font-family font-color"
                        style={{
                          display: "flex",
                          margin: "13px 0 0",
                          fontSize: "16px"
                        }}
                      >
                        {
                          <If condition={family.familyPrimary}>
                            <Image
                              src={window.$GLOBAL$.__SVG__["map11チェックon"]}
                              style={{ marginRight: "5px" }}
                            />
                          </If>
                        }
                        {
                          <If condition={!family.familyPrimary}>
                            <Image
                              src={window.$GLOBAL$.__SVG__["map11チェックoff"]}
                              style={{ marginRight: "5px" }}
                            />
                          </If>
                        }
                        世帯主に設定する
                      </p>
                    </Item>
                  </Segment>
                </For>
              }

              <Item
                style={{
                  borderBottom: "none",
                  borderTop: "none",
                  paddingTop: 0,
                  paddingBottom: 0,
                  height: "10px"
                }}
              >
                <Button className="map11-tag-add">
                  <Image
                    onClick={this.onClickAddInputFamily}
                    src={window.$GLOBAL$.__SVG__["新規追加"]}
                    className="map8-add"
                  />
                </Button>
              </Item>

              <Item
                style={{
                  padding: "0px",
                  backgroundColor: "#6a6a6ab3",
                  borderRadius: "5px",
                  marginBottom: "10px"
                }}
              >
                <Item.Header className="map8-header-item font-family map11-header-font">
                  {address.postalCode}
                  {address.prefecture}
                  {address.addressCity}
                  {address.addressTown}
                  {address.addressNumber}
                  {address.addressBuilding}
                  {address.addressRoomNo}
                  {address.shopName}
                </Item.Header>
                <Button.Group
                  style={{
                    width: "70%",
                    marginLeft: "68px",
                    paddingBottom: "10px"
                  }}
                >
                  <Button
                    onClick={this.showRoomListModal}
                    className="map11-leftbtn font-family font-color"
                    style={{ width: "49%", marginRight: "10px" }}
                  >
                    フロア情報
                  </Button>
                  {
                    <If
                      condition={
                        (_.get(this.props, "clickedPoint.rooms") || []).length
                      }
                    >
                      <Button
                        onClick={this.onClickInputDetail}
                        className={
                          "map11-rightbtn font-family font-color " +
                          (this.state.inputDetail ? "active" : "")
                        }
                      >
                        詳細入力
                      </Button>
                    </If>
                  }
                </Button.Group>
              </Item>

              {/* 詳細入力クリック時 start */}
              {
                <If condition={this.state.inputDetail}>
                  <Item className="items-padding" style={{ border: "0" }}>
                    <Input
                      value={this.state.inputDetailAddressBuilding}
                      onChange={event =>
                        this.onChangeInputDetailAddressBuilding(event)
                      }
                      className="font-family map11-input-style"
                      id="map11-input"
                      inverted
                      placeholder="建物名"
                    />
                  </Item>

                  <Item
                    className="items-padding"
                    style={{
                      borderTop: "solid 1px #BEBEBE",
                      borderBottom: "solid 1px #BEBEBE"
                    }}
                  >
                    <Input
                      value={this.state.inputDetailAddressRoomNo}
                      onChange={event =>
                        this.onChangeInputDetailAddressRoomNo(event)
                      }
                      className="font-family map11-input-style"
                      id="map11-input"
                      inverted
                      placeholder="部屋番号"
                    />
                  </Item>
                </If>
              }

              {/* 詳細入力クリック時 end */}
            </Item.Group>
          </Segment>
          <div style={{ height: "200px" }} />
        </Segment>
        {/* スクロールエリア end */}

        {/* 下部エリア start */}
        <Segment className="mapmodal-bottom-btn">
          {/* <Item className="footer-padding" style={{ border: "none" }}> */}
          <Grid>
            <Grid.Row>
              <Grid.Column
                width={16}
                className="centerd content map11-fotter-style"
              >
                <Button
                  disabled={!_.get(this.props, "clickedPoint.location")}
                  onClick={this.submit}
                  className="font-family map11-fotter-btn2 fotter-btn-style centered"
                >
                  追加
                </Button>
              </Grid.Column>
            </Grid.Row>
          </Grid>
          {/* </Item> */}
        </Segment>
        {/* 下部エリア end */}

        <MDBModalW
          size="large"
          isOpen={this.state.showDelTagConfirm}
          toggle={() => {
            this.setState({ showDelTagConfirm: !this.state.showDelTagConfirm });
          }}
          className="pinmodal-style3"
          id="modal-black"
        >
          <MDBModalBody>
            <p
              className="font-family bookmodal-font"
              id="modal-padding"
              style={{
                textAlign: "center",
                border: "none",
                fontWeight: "bold"
              }}
            >
              {
                getTagName(
                  this.state.delTag[0],
                  this.state.delTag[1],
                  this.state.delTag[2],
                  this.state.delTag[3]
                )[0]
              }
              {
                getTagName(
                  this.state.delTag[0],
                  this.state.delTag[1],
                  this.state.delTag[2],
                  this.state.delTag[3]
                )[1]
              }
              <br />
              タグを削除しますか？
            </p>
          </MDBModalBody>
          <MDBModalBody id="modal-padding3">
            <Grid>
              <Grid.Row className="modal-padding2">
                <Grid.Column width={8} className="bookmodal-btn-style">
                  <Button
                    onClick={() => {
                      this.setState({ showDelTagConfirm: false });
                    }}
                    className="font-famiy bookmodal-btn modal-no"
                    style={{ fontWeight: "normal" }}
                  >
                    キャンセル
                  </Button>
                </Grid.Column>
                <Grid.Column width={8} className="bookmodal-btn-style">
                  <Button
                    onClick={this.onClickDeleteTag}
                    className="font-famiy bookmodal-btn modal-yes"
                  >
                    OK
                  </Button>
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </MDBModalBody>
        </MDBModalW>
      </React.Fragment>
    );
  }
}
