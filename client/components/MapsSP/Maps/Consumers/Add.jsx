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

import { getTagName } from "../../lib/Tags/utils";

export class Maps_Consumers_View_Add extends React.Component {
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

    const doc = {
      identity: {
        name: "",
        kana: "",
        sex: "male"
      },
      familys: [],
      familyPrimary: false,
      tags: [],
      communications: [],
      residenceAddress: {
        address: {},
        location: {}
      }
    };

    this.state = {
      doc: doc,
      sex: "male",
      tags: [],
      rank: null,
      visit: null,
      familyPrimary: false,
      inputIdentityName: _.get(this.props.room, "lastName") || "",
      inputIdentityKana: "",
      inputDetail: false,
      inputCommunicationsMemo: "",
      inputCommunicationsPetition: "",
      inputMemo: "",
      inputFamilys: [],
      inputDetailAddressBuilding: "",
      inputDetailAddressRoomNo: _.get(this.props.room, "roomNo") || "",
      inputDetailAddressShopName: _.get(this.props.room, "shopName") || "",
      showDelTagConfirm: false,
      delTag: [0, 0, 0, 0],
      enableSubmit: false
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

    this.window_innerHeight = window.innerHeight;

    this.initProps = {
      room: {
        lastName: _.get(props.room, "lastName") || "",
        roomNo: _.get(props.room, "roomNo") || "",
        shopName: _.get(props.room, "shopName") || ""
      }
    };
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (
      (_.get(this.initProps.room, "lastName") || "") !=
        (_.get(nextProps.room, "lastName") || "") ||
      (_.get(this.initProps.room, "roomNo") || "") !=
        (_.get(nextProps.room, "roomNo") || "") ||
      (_.get(this.initProps.room, "shopName") || "") !=
        (_.get(nextProps.room, "shopName") || "")
    ) {
      this.initProps = {
        room: {
          lastName: _.get(nextProps.room, "lastName") || "",
          roomNo: _.get(nextProps.room, "roomNo") || "",
          shopName: _.get(nextProps.room, "shopName") || ""
        }
      };
      this.setup(nextProps);
    }
    return true;
  }

  setup = props => {
    const doc = {
      identity: {
        name: "",
        kana: "",
        sex: "male"
      },
      familys: [],
      familyPrimary: false,
      tags: [],
      communications: [],
      residenceAddress: {
        address: {},
        location: {}
      }
    };

    this.state = {
      doc: doc,
      sex: "",
      tags: [],
      rank: null,
      visit: null,
      familyPrimary: false,
      inputIdentityName: _.get(props.room, "lastName") || "",
      inputIdentityKana: "",
      inputDetail: false,
      inputCommunicationsMemo: "",
      inputCommunicationsPetition: "",
      inputMemo: "",
      inputFamilys: [],
      inputDetailAddressBuilding: "",
      inputDetailAddressRoomNo: _.get(props.room, "roomNo") || "",
      inputDetailAddressShopName: _.get(props.room, "shopName") || "",
      showDelTagConfirm: false,
      delTag: [0, 0, 0, 0]
    };
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
        address: this.props.clickedPoint.address,
        location: this.props.clickedPoint.location
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

    doc.identity.name = this.state.inputIdentityName;
    doc.identity.kana = this.state.inputIdentityKana;
    doc.identity.sex = this.state.sex;

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

    doc.residenceAddress.address = this.props.clickedPoint.address;
    doc.residenceAddress.location = this.props.clickedPoint.location;
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

    this.props.addDocIds(doc._id);

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

  onClickSex = _id => {
    this.setState({ sex: _id });
  };

  /**
   *
   *
   * @memberof Maps_Consumers_View_Add
   */
  getSexColor = _id => {
    if (this.state.sex == _id) {
      return "active";
    } else {
      return "";
    }
  };

  /**
   *
   *
   * @memberof Maps_Consumers_View_Add
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
   * @memberof Maps_Consumers_View_Add
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
   * @memberof Maps_Consumers_View_Add
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
   * @memberof Maps_Consumers_View_Add
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
   * @memberof Maps_Consumers_View_Add
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
   * @memberof Maps_Consumers_View_Add
   */
  onChangeInputIdentityName = event => {
    this.setState({ inputIdentityName: event.target.value });
    this.validateInput();
  };

  /**
   *
   *
   * @memberof Maps_Consumers_View_Add
   */
  onChangeInputIdentityKana = event => {
    this.setState({ inputIdentityKana: event.target.value });
    this.validateInput();
  };

  validateInput = () => {
    setTimeout(() => {
      if (this.state.inputIdentityName) {
        this.setState({ enableSubmit: true });
      } else {
        this.setState({ enableSubmit: false });
      }
    });
  };

  /**
   *
   *
   * @memberof Maps_Consumers_View_Add
   */
  onClickFamilyPrimary = () => {
    this.setState({ familyPrimary: !this.state.familyPrimary });
  };

  /**
   *
   *
   * @memberof ConsumersLocalCollection
   */
  onChangeInputDetailAddressBuilding = event => {
    this.setState({ inputDetailAddressBuilding: event.target.value });
  };

  /**
   *
   *
   * @memberof ConsumersLocalCollection
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
   * @memberof ConsumersLocalCollection
   */
  onChangeInputCommunicationsMemo = event => {
    this.setState({ inputCommunicationsMemo: event.target.value });
  };

  /**
   *
   *
   * @memberof ConsumersLocalCollection
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
  /* global index */
  /* global ranks */
  /* global family */

  /**
   *
   *
   * @returns
   * @memberof Maps_Consumers_View_Add
   */
  render() {
    const address = this.props.clickedPoint.address;

    return (
      <React.Fragment>
        {/* スクロールエリア start */}
        <Segment
          className="scroll-area"
          style={{ maxHeight: this.window_innerHeight - 62 + "px" }}
        >
          <Segment padded className="map8-area">
            <Item.Group divided>
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
                  {
                    <If
                      condition={
                        (_.get(this.props, "clickedPoint.rooms") || []).length
                      }
                    >
                      <Button
                        onClick={this.showRoomListModal}
                        className="map11-leftbtn font-family font-color"
                        style={{ width: "49%", marginRight: "10px" }}
                      >
                        フロア情報
                      </Button>
                    </If>
                  }
                  <Button
                    onClick={this.onClickInputDetail}
                    className={
                      "map11-rightbtn font-family font-color " +
                      (this.state.inputDetail ? "active" : "")
                    }
                  >
                    詳細入力
                  </Button>
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

              {/* 通常時の場合、borderTopがない */}
              <Item
                className="items-padding"
                style={{
                  borderBottom: "solid 1px #BEBEBE",
                  borderTop: "none"
                }}
              >
                <Input
                  value={this.state.inputIdentityName}
                  onChange={event => this.onChangeInputIdentityName(event)}
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
                  value={this.state.inputIdentityKana}
                  onChange={event => this.onChangeInputIdentityKana(event)}
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
                  value={this.state.inputDetailAddressShopName}
                  onChange={event =>
                    this.onChangeInputDetailAddressShopName(event)
                  }
                  className="font-family map11-input-style"
                  id="map11-input"
                  inverted
                  placeholder="法人名"
                />
              </Item>

              <Item
                style={{
                  borderBottom: "solid 1px #BEBEBE",
                  borderTop: "none"
                }}
              >
                <Item.Meta className="font-family map11-meta">属性</Item.Meta>
                <Grid.Column>
                  <Button
                    onClick={() => this.onClickSex("male")}
                    className={
                      "font-family map11-attribute " +
                      ("male" == this.state.sex ? "active" : "")
                    }
                  >
                    男性
                  </Button>
                  <Button
                    onClick={() => this.onClickSex("famale")}
                    className={
                      "font-family map11-attribute " +
                      ("famale" == this.state.sex ? "active" : "")
                    }
                  >
                    女性
                  </Button>
                  <Button
                    onClick={() => this.onClickSex("")}
                    className={
                      "font-family map11-attribute " +
                      (!this.state.sex ? "active" : "")
                    }
                  >
                    企業
                  </Button>
                </Grid.Column>

                <p
                  onClick={() => this.onClickFamilyPrimary()}
                  className="font-family font-color"
                  style={{
                    display: "flex",
                    margin: "13px 0 0",
                    fontSize: "16px"
                  }}
                >
                  {
                    <If condition={this.state.familyPrimary}>
                      <Image
                        src={window.$GLOBAL$.__SVG__["map11チェックon"]}
                        style={{ marginRight: "5px" }}
                      />
                    </If>
                  }
                  {
                    <If condition={!this.state.familyPrimary}>
                      <Image
                        src={window.$GLOBAL$.__SVG__["map11チェックoff"]}
                        style={{ marginRight: "5px" }}
                      />
                    </If>
                  }
                  世帯主に設定する
                </p>
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
              </Item>

              <Item
                className="items-padding"
                style={{
                  borderBottom: "solid 1px #BEBEBE",
                  borderTop: "none"
                }}
              >
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
                style={{
                  borderBottom: "solid 1px #BEBEBE",
                  borderTop: "none"
                }}
              >
                <Input
                  className="font-family map11-input-style"
                  id="map11-input"
                  inverted
                  placeholder="陳情"
                />
              </Item>

              <Item
                style={{
                  paddingBottom: "0px",
                  borderBottom: "none",
                  borderTop: "none"
                }}
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
                            <If condition={ranks[1].rank}>
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
                className="items-padding"
                style={{
                  borderBottom: "solid 1px #BEBEBE",
                  borderTop: "none"
                }}
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
                  disabled={!this.state.enableSubmit}
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
