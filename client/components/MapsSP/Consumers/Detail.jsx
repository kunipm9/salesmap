/// Sys - AutoForm
import { Session } from "meteor/session";
import React from "react";
import Update from "@imports/ui/crud/Update";
import Lightbox from "react-image-lightbox";
/// Sys - AutoForm --

import moment from "moment";
moment.locale("ja");
import _ from "lodash";

import { displayConsumer } from "./utils";
import { Sel_Tags } from "./Sel_Tags";
import { getTagName } from "../lib/Tags/utils";
import { getCompanyName } from "../Companys/utils";
import { getCompanyDetail } from "../Companys/utils";
import { getAssociationName } from "../Associations/utils";
import { getAssociationDetail } from "../Associations/utils";
import { getConsumerName } from "./utils";
import { Detail_Files } from "./Detail_Files";
import { Detail_Map } from "./Detail_Map";

import { Edit_Info } from "./Edit_Info";
import { Sel_Family } from "./Sel_Family";
import { Add_Family } from "./Add_Family";
import { Add_Communication } from "./Add_Communication";

// import start
import { Segment } from "semantic-ui-react";
import { Grid } from "semantic-ui-react";
import { Item } from "semantic-ui-react";

import { Label } from "semantic-ui-react";

import { Button } from "semantic-ui-react";
import { Image } from "semantic-ui-react";

import { Tab } from "semantic-ui-react";
import { Form, TextArea } from "semantic-ui-react";

import { MDBModalHeader, MDBModalBody } from "mdbreact";
import { MDBModalW } from "../lib/MDBModalW";

import Collapsible from "react-collapsible";

import {
  displaySimpleField,
  displayField,
  displayListField,
  displayValueField,
  getImageLink
} from "../lib/utils";

import { getRankTitle } from "./utils";

/// Custom - AutoForm - collection
import { Maps_Consumers_Collection } from "@imports/api/Maps/Consumers_Collection";
import { Maps_Consumers_getCommunicationTypeLabel } from "@imports/api/Maps/Consumers_Collection";
console.assert(
  Maps_Consumers_Collection,
  "Maps_Consumers_Collection is undefined."
);
import { Maps_Companys_Collection } from "@imports/api/Maps/Companys_Collection";
import { Maps_Associations_Collection } from "@imports/api/Maps/Associations_Collection";
/// Custom - AutoForm - collection --

/// Custom - LocalStorage
import { Maps_ConsumersSum_Collection } from "@imports/api/Maps/ConsumersSum_Collection";
/// Custom - LocalStorage --

/// Sys - Network
import { Persister } from "@imports/api/lib/persist-method";
/// Sys - Network --

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
export const MapsSP_Consumers_Detail_ComponentInfo = mode => {
  if (!checkAppRole("MapsSP.Consumers", mode)) {
    return null;
  }

  if (checkSystemRole()) {
    return null;
  }

  return { title: "MapsSP/Consumers/Detail", path: "/MapsSP/Consumers/Detail" };
};
/// Custom - Role - check permission --

/**
 *
 *
 * @export
 * @class MapsSP_Consumers_Detail
 * @extends {Detail}
 */
export class MapsSP_Consumers_Detail extends Update {
  "use strict";

  /**
   *Creates an instance of MapsSP_Consumers_Detail.
   * @param {*} props
   * @memberof MapsSP_Consumers_Detail
   */
  constructor(props) {
    super(props);

    if (!props) {
      return;
    }

    /// Custom - Tabular - link button
    this.detailPath = "/MapsSP/Consumers/Detail/";
    this.detailPathCompany = "/MapsSP/Companys/Detail/";
    this.detailPathAssociation = "/MapsSP/Association/Detail/";
    /// Custom - Tabular - link button --

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
    this.Form_name = this.Collection._name;
    /// Custom - AutoForm - rebuild field --
    this.SumCollection = Maps_ConsumersSum_Collection;
    /** @type {any[]} */
    this.CollectionList = [];
    /// Custom - LocalStorage --

    /// Sys - AutoForm - rebuild field !!!!!!!!!!
    this.postConstructor();
    /// Sys - AutoForm - rebuild field !!!!!!!!!! --

    this.submit = this.submit.bind(this);

    const doc = this.Collection.docs[this.props.match.params._id];
    if (!doc || !doc._id) {
      this.props.history.replace("/MapsSP/Consumers/List");
      return;
    }

    this.setupDoc(doc);

    this.state.showSel_Tags = false;
    this.state.showDetail_Files = false;
    this.state.showDetail_Map = false;
    this.state.showEdit_Info = false;
    this.state.showSel_Family = false;
    this.state.showAdd_Family = false;
    this.state.showAdd_Communication = false;
    this.state.enableEdit_Memo = false;
    this.state.showModal = false;

    this.state.memoInput = "";

    this.state.tabsKey = "1";

    this.state.showTelephone = false;
    this.state.telephoneList = [];

    this.state.newDocFamily = {};

    this.state.activeIndex = 0;
    this.state.showLightBox = false;

    if (typeof this.Collection.simpleSchema == "function") {
      this.simpleSchema = this.Collection.simpleSchema();
    } else {
      this.simpleSchema = this.Collection.simpleSchema;
    }

    this.refMemoInput = React.createRef();
    this.state.memoInput = this.state.doc.memo;

    /// Sys - AutoForm - rebuild field
    this.postConstructor();
    /// Sys - AutoForm - rebuild field --

    this.window_innerHeight = window.innerHeight;
  }

  /// Application - 選択ボタン
  /**
   *
   *
   * @param {*} nextProps
   * @memberof MapsSP_Consumers_Detail
   */
  UNSAFE_componentWillReceiveProps(nextProps) {
    if (!nextProps) {
      return;
    }

    const doc = this.Collection.docs[nextProps.match.params._id];
    if (!doc || !doc._id) {
      this.props.history.replace("/MapsSP/Consumers/List");
      return;
    }

    if (doc._id != this.state.doc._id) {
      this.setState({ activeIndex: 0 });
    }

    this.setupDoc(doc);
    this.setState({
      doc: this.state.doc,
      tagsNum: this.state.tagsNum,
      familysNum: this.state.familysNum,
      communicationsNum: this.state.communicationsNum
    });
  }

  /**
   *
   *
   * @param {*} doc
   * @memberof MapsSP_Consumers_Detail
   */
  setupDoc = doc => {
    if (!doc.residenceAddress) {
      doc.residenceAddress = {};
    }
    if (doc.communications) {
      doc.communications = doc.communications.filter(c =>
        _.get(c, "communication.type")
      );
    }
    // 家族の人数
    this.state.tagsNum = (_.get(doc, "tags") || []).length;
    this.state.familysNum = (_.get(doc, "familys") || []).filter(
      f => f.family.Maps_Consumers_id != doc._id
    ).length;
    this.state.communicationsNum = (_.get(doc, "communications") || []).length;
    this.state.doc = doc;
  };
  /// Application - 選択ボタン --

  /// Application - Save
  /**
   *
   *
   * @param {*} doc
   * @memberof MapsSP_Consumers_Detail
   */
  submit(doc) {
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
      this.updateCallbackPersister
    );
    /// Sys - AutoForm - update --

    /// Custom - localCollection - update
    this.Collection.docs[doc._id] = doc;
    /// Custom - localCollection - update --

    Bert.alert({
      type: "success",
      hideDelay: 10000,
      message: "情報を更新しました"
    });
  }
  /// Application - Save --

  /* global index */
  /* global family */
  /* global communication */
  /* global tag */
  /* global tel */
  /* global email */

  /**
   *
   *
   * @memberof MapsSP_Consumers_Detail
   */
  displayTab1 = () => {
    this.onChangeTabs("1");
    const doc = this.state.doc;
    console.log(
      "tab1 -----------------------------------------------------",
      doc
    );

    // 送付先
    let mailDestinationTitle = "";
    if (this.state.doc._id == this.state.doc.mailDestination) {
      mailDestinationTitle = "個人";
    }
    const mailDestinationCompany = Maps_Companys_Collection.findOne({
      _id: this.state.doc.mailDestination
    });
    if (mailDestinationCompany) {
      mailDestinationTitle = mailDestinationCompany.name;
    }
    const mailDestinationAssociation = Maps_Associations_Collection.findOne({
      _id: this.state.doc.mailDestination
    });
    if (mailDestinationAssociation) {
      mailDestinationTitle = mailDestinationAssociation.name;
    }

    return (
      <React.Fragment>
        {/* スクロールエリア start */}
        <Segment
          style={{
            margin: 0,
            padding: "14px 0",
            overflow: "auto",
            height: this.window_innerHeight - 235 + "px",
            border: "none"
          }}
        >
          {displayField(
            this.simpleSchema,
            doc,
            "residenceAddress.address",
            ["#〒", "residenceAddress.address.postalCode"],
            [
              "residenceAddress.address.prefecture",
              "residenceAddress.address.addressCity",
              "residenceAddress.address.addressTown",
              "residenceAddress.address.addressNumber",
              "residenceAddress.address.addressBuilding",
              "residenceAddress.address.addressRoomNo"
            ]
          )}
          {displayListField(
            this.simpleSchema,
            doc,
            "contact.tels",
            (schema, _value) => (
              <a
                href={"tel:" + _value.tel}
                style={{ color: "cornflowerblue" }}
              >
                {_value.tel}
              </a>
            )
          )}
          {displayListField(
            this.simpleSchema,
            doc,
            "contact.faxs",
            (schema, _value) => _value.fax
          )}
          {displayListField(
            this.simpleSchema,
            doc,
            "contact.emails",
            (schema, _value) => (
              <a href={"mailto:" + _value.address}>{_value.address}</a>
            )
          )}
          {displayValueField(
            this.simpleSchema,
            doc,
            "identity.age",
            (schema, _value) => {
              let dtBirth = "";
              let age = "";
              const birthDay = _.get(this.state.doc, "identity.birthDay");
              if (birthDay) {
                const now = new Date().getTime();
                dtBirth = moment(birthDay).format("YYYY/MM/DD");
                age = moment(now).diff(birthDay, "years");

                return (
                  <div>
                    {age}歳 &nbsp; {dtBirth}
                  </div>
                );
              } else {
                age = _.get(this.state.doc, "identity.age");

                if (age) {
                  return <div>{age}歳</div>;
                } else {
                  return <div> &nbsp; </div>;
                }
              }
            }
          )}
          {displayListField(
            this.simpleSchema,
            doc,
            "getDonations",
            (schema, _value) => (
              <div>
                ・{_value.donation.amount.toLocaleString()}円 (
                {moment(_value.donation.modifiedAt).format("YYYY/MM/DD")})<br />
                &nbsp;&nbsp;&nbsp;→{_value.donation.memo}
              </div>
            )
          )}
          {displayListField(
            this.simpleSchema,
            doc,
            "getGifts",
            (schema, _value) => (
              <div>
                ・{_value.gift.itemName} (
                {moment(_value.gift.modifiedAt).format("YYYY/MM/DD")})<br />
                &nbsp;&nbsp;&nbsp;→{_value.gift.memo}
              </div>
            )
          )}
          {displayListField(
            this.simpleSchema,
            doc,
            "introducers",
            (schema, _value) => (
              <div
                onClick={() => {
                  this.props.history.push(
                    this.detailPath + _value.introducer.Maps_Consumers_id
                  );
                }}
              >
                <span style={{ color: "cornflowerblue" }}>
                  {getConsumerName(_value.introducer.Maps_Consumers_id)}
                </span>
                <span>&nbsp;&nbsp;(関係 : </span>
                {_value.introducer.relationship}
                <span>)</span>
              </div>
            )
          )}
          {displayListField(
            this.simpleSchema,
            doc,
            "introductions",
            (schema, _value) => (
              <div
                onClick={() => {
                  this.props.history.push(
                    this.detailPath + _value.introduction.Maps_Consumers_id
                  );
                }}
              >
                <span style={{ color: "cornflowerblue" }}>
                  {getConsumerName(_value.introduction.Maps_Consumers_id)}
                </span>
                <span>&nbsp;&nbsp;(関係 : </span>
                {_value.introduction.relationship}
                <span>)</span>
              </div>
            )
          )}
          {displayListField(
            this.simpleSchema,
            doc,
            "companys",
            (schema, _value) => (
              <div>
                <Collapsible
                  trigger={
                    <span>
                      <span
                        onClick={() => {
                          this.props.history.push(
                            this.detailPathCompany +
                              _value.company.Maps_Company_id
                          );
                        }}
                        style={{ color: "cornflowerblue" }}
                      >
                        {getCompanyName(_value.company.Maps_Company_id)}
                      </span>
                      <br />
                      {_value.company.title}
                    </span>
                  }
                >
                  <span>
                    {getCompanyDetail(_value.company.Maps_Company_id)}
                  </span>
                </Collapsible>
              </div>
            )
          )}
          {displayListField(
            this.simpleSchema,
            doc,
            "associations",
            (schema, _value) => (
              <div>
                <Collapsible
                  trigger={
                    <span>
                      <span
                        onClick={() => {
                          this.props.history.push(
                            this.detailPathAssociation +
                              _value.association.Maps_Association_id
                          );
                        }}
                        style={{ color: "cornflowerblue" }}
                      >
                        {getAssociationName(
                          _value.association.Maps_Association_id
                        )}
                      </span>
                      <br />
                      {_value.association.title}
                    </span>
                  }
                >
                  <span>
                    {getAssociationDetail(
                      _value.association.Maps_Association_id
                    )}
                  </span>
                </Collapsible>
              </div>
            )
          )}
          {displayValueField(
            this.simpleSchema,
            doc,
            "mailDestination",
            (schema, _value) => (
              <div>{mailDestinationTitle}</div>
            )
          )}
          {displayValueField(
            this.simpleSchema,
            doc,
            "identity.dateOfDeath",
            (schema, _value) => {
              if (!_value) {
                return <div />;
              }

              let y = "";
              if (_value.y) {
                y = ("0000" + _value.y).slice(-4) + "年";
              }
              let m = "";
              if (_value.m) {
                m = ("00" + _value.m).slice(-2) + "月";
              }
              let d = "";
              if (_value.m) {
                d = ("00" + _value.d).slice(-2) + "日";
              }
              return (
                <div>
                  {y}
                  {m}
                  {d}
                </div>
              );
            }
          )}
          <br /> <br /> <br />
        </Segment>
        {/* スクロールエリア end */}
      </React.Fragment>
    );
  };

  /**
   *
   *
   * @memberof MapsSP_Consumers_Detail
   */
  displayTab2 = () => {
    this.onChangeTabs("2");
    const doc = this.state.doc;

    return (
      <React.Fragment>
        {/* 新規追加 start */}
        <Segment basic className="add-new" style={{ margin: "0px" }}>
          <Button
            onClick={this.onClickSel_Family}
            className="font-family add-new-btn"
            style={{
              marginTop: "4px"
            }}
          >
            <Image
              src={window.$GLOBAL$.__SVG__["新規追加"]}
              className="add-new-img"
            />
            <p className="add-new-text">新規追加</p>
          </Button>
        </Segment>
        {/* 新規追加 end */}

        {/* スクロールエリア start */}
        <Segment
          style={{
            margin: 0,
            padding: 0,
            overflow: "auto",
            height: this.window_innerHeight - 306 + "px",
            border: "none"
          }}
        >
          {
            <If condition={doc.familys}>
              {
                <For each="family" index="index" of={doc.familys}>
                  <If
                    condition={
                      family.family &&
                      family.family.Maps_Consumers_id != doc._id
                    }
                  >
                    <Segment
                      key={index}
                      padded
                      style={{
                        margin: "0",
                        paddingLeft: "1.5em",
                        paddingRight: "1.5em",
                        paddingTop: "0.5em",
                        paddingBottom: "0.5em",
                        border: "none"
                      }}
                    >
                      <Label
                        attached="top"
                        className="font-color font-family listdetail-label"
                      >
                        {family.family.relationship}
                      </Label>
                      <Item.Group divided>
                        {/* 個人 start */}
                        {displayConsumer(
                          null,
                          this.Collection.docs[family.family.Maps_Consumers_id],
                          index,
                          this.props.history,
                          this.detailPath + family.family.Maps_Consumers_id
                        )}
                        {/* 個人 end */}
                      </Item.Group>
                    </Segment>
                  </If>
                </For>
              }
            </If>
          }
        </Segment>
        {/* スクロールエリア end */}
      </React.Fragment>
    );
  };

  /**
   *
   *
   * @memberof MapsSP_Consumers_Detail
   */
  getCommunicationTypeLabel = communication => {
    const { tlabel, color } = Maps_Consumers_getCommunicationTypeLabel(
      communication
    );
    const dt1 = moment(communication.modifiedAt).format("YYYY/MM/DD");

    return (
      <Label
        attached="top"
        className="font-color font-family"
        style={{
          fontSize: "14px",
          paddingBottom: "3px",
          paddingTop: "3px",
          backgroundColor: "#f5f5f5"
        }}
      >
        {dt1}
        <Label
          circular
          size="mini"
          style={{
            marginLeft: "8px",
            backgroundColor: color,
            color: "white"
          }}
        >
          {tlabel}
        </Label>
      </Label>
    );
  };

  /**
   *
   *
   * @memberof MapsSP_Consumers_Detail
   */
  displayTab3 = () => {
    this.onChangeTabs("3");

    const tags = [];
    for (let index in this.state.doc.tags || []) {
      const tag = this.state.doc.tags[index];
      tags.push(getTagName(tag[0], tag[1], tag[2], tag[3]));
    }

    return (
      <React.Fragment>
        {/* 新規追加 start */}
        <Segment basic className="add-new" style={{ margin: "0px" }}>
          <Button
            onClick={this.onClickSel_Tags}
            className="font-family add-new-btn"
            style={{
              marginTop: "4px"
            }}
          >
            <Image
              src={window.$GLOBAL$.__SVG__["新規追加"]}
              className="add-new-img"
            />
            <p className="add-new-text">新規追加</p>
          </Button>
        </Segment>
        {/* 新規追加 end */}

        {/* スクロールエリア start */}
        <Segment
          style={{
            margin: 0,
            padding: "14px",
            overflow: "auto",
            height: this.window_innerHeight - 306 + "px",
            border: "none"
          }}
        >
          <Item.Group divided>
            {
              <For each="tag" index="index" of={tags}>
                <Item key={index} id="detail-tag">
                  <Item.Meta className="font-color font-family">
                    {tag[0]}
                  </Item.Meta>
                  <Item.Content
                    className="font-color font-family"
                    style={{ fontSize: "18px" }}
                  >
                    {tag[1]}
                  </Item.Content>
                </Item>
              </For>
            }
          </Item.Group>
        </Segment>
        {/* スクロールエリア end */}
      </React.Fragment>
    );
  };

  /**
   *
   *
   * @memberof MapsSP_Consumers_Detail
   */
  displayTab4 = () => {
    this.onChangeTabs("4");
    const doc = this.state.doc;

    return (
      <React.Fragment>
        {/* 新規追加 start */}
        <Segment basic className="add-new" style={{ margin: "0px" }}>
          <Button
            onClick={this.onClickAdd_Communication}
            className="font-family add-new-btn"
            style={{
              marginTop: "4px"
            }}
          >
            <Image
              src={window.$GLOBAL$.__SVG__["新規追加"]}
              className="add-new-img"
            />
            <p className="add-new-text">新規追加</p>
          </Button>
        </Segment>
        {/* 新規追加 end */}

        {/* スクロールエリア start */}
        <Segment
          style={{
            margin: 0,
            padding: 0,
            overflow: "auto",
            height: this.window_innerHeight - 306 + "px",
            border: "none"
          }}
        >
          {
            <If condition={doc.communications}>
              {
                <For each="communication" index="index" of={doc.communications}>
                  <If condition={communication && communication.communication}>
                    <Segment
                      key={index}
                      padded
                      style={{
                        margin: "0",
                        paddingLeft: "1.5em",
                        paddingRight: "1.5em",
                        paddingTop: "1em",
                        paddingBottom: "1em",
                        border: "none"
                      }}
                    >
                      {this.getCommunicationTypeLabel(
                        communication.communication
                      )}
                      <Item.Group divided>
                        {/* 個人 start */}
                        <Item
                          className="font-family"
                          style={{ color: "#707070" }}
                        >
                          <Item.Content>
                            担当者: {communication.communication.staff}
                          </Item.Content>
                          <Item.Content>
                            コメント: {communication.communication.memo}
                          </Item.Content>
                          <Item.Content>
                            陳情:{communication.communication.petition}
                          </Item.Content>
                        </Item>
                        {/* 個人 end */}
                      </Item.Group>
                    </Segment>
                  </If>
                </For>
              }
            </If>
          }
        </Segment>
        {/* スクロールエリア end */}
      </React.Fragment>
    );
  };

  /**
   *
   *
   * @memberof MapsSP_Consumers_Detail
   */
  displayTab5 = () => {
    this.onChangeTabs("5");

    return (
      <React.Fragment>
        {/* スクロールエリア start */}
        <Segment
          padded
          style={{
            border: "none",
            padding: "15px",
            lineHeight: "25px",
            overflow: "auto",
            height: this.window_innerHeight - 235 + "px"
          }}
          className="font-color font-family"
        >
          <Form>
            <TextArea
              value={this.state.memoInput}
              ref={this.refMemoInput}
              onChange={e => {
                if (this.state.enableEdit_Memo) {
                  this.setState({ memoInput: e.target.value });
                }
              }}
              style={{
                border: "none",
                padding: "4px",
                lineHeight: "25px",
                overflow: "auto",
                height: this.window_innerHeight - 235 + "px"
              }}
              className="font-color font-family"
            />
          </Form>
        </Segment>
        {/* スクロールエリア end */}
      </React.Fragment>
    );
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
  displayTagNum = num => {
    if (num) {
      return `(${num})`;
    } else {
      return "";
    }
  };

  /**
   *
   *
   * @memberof MapsSP_Consumers_Detail
   */
  toggleFiles = () => {
    this.setState({ showDetail_Files: !this.state.showDetail_Files });
  };

  /**
   *
   *
   * @memberof MapsSP_Consumers_Detail
   */
  closeDetail_Files = () => {
    this.setState({ showDetail_Files: false });
  };
  /**
   *
   *
   * @memberof MapsSP_Consumers_Detail
   */
  toggleFiles = () => {
    this.setState({ showDetail_Files: !this.state.showDetail_Files });
  };

  /**
   *
   *
   * @memberof MapsSP_Consumers_Detail
   */
  closeDetail_Files = () => {
    this.setState({ showDetail_Files: false });
  };

  /**
   *
   *
   * @memberof MapsSP_Consumers_Detail
   */
  updateDoc = doc => {
    this.setState({ doc: doc });
    this.setState({ tagsNum: (_.get(doc, "tags") || []).length });
    this.setState({
      familysNum: (_.get(doc, "familys") || []).filter(
        f => f.family.Maps_Consumers_id != doc._id
      ).length
    });
    this.setState({
      communicationsNum: (_.get(doc, "communications") || []).length
    });
  };

  /**
   *
   *
   * @memberof MapsSP_Consumers_Detail
   */
  toggleMap = () => {
    this.setState({ showDetail_Map: !this.state.showDetail_Map });
  };

  /**
   *
   *
   * @memberof MapsSP_Consumers_Detail
   */
  closeDetail_Map = () => {
    this.setState({ showDetail_Map: false });
  };

  /**
   *
   *
   * @memberof MapsSP_Consumers_Detail
   */
  toggleEdit_Info = () => {
    this.setState({ showEdit_Info: !this.state.showEdit_Info });
  };

  /**
   *
   *
   * @memberof MapsSP_Consumers_Detail
   */
  closeEdit_Info = () => {
    this.setState({ showEdit_Info: false });
  };

  /**
   *
   *
   * @memberof MapsSP_Consumers_Detail
   */
  onClickSel_Family = () => {
    this.setState({ showSel_Family: true });
  };

  /**
   *
   *
   * @memberof MapsSP_Consumers_Detail
   */
  toggleSel_Family = () => {
    this.setState({ showSel_Family: !this.state.showSel_Family });
  };

  /**
   *
   *
   * @memberof MapsSP_Consumers_Detail
   */
  closeSel_Family = () => {
    this.setState({ showSel_Family: false, newDocFamily: {} });
  };

  /**
   *
   *
   * @memberof MapsSP_Consumers_Detail
   */
  onClickAdd_Family = () => {
    this.setState({ showSel_Family: false, showAdd_Family: true });
  };

  /**
   *
   *
   * @memberof MapsSP_Consumers_Detail
   */
  toggleAdd_Family = () => {
    this.setState({ showAdd_Family: !this.state.showAdd_Family });
  };

  /**
   *
   *
   * @memberof MapsSP_Consumers_Detail
   */
  closeAdd_Family = newDoc => {
    this.setState({
      showAdd_Family: false,
      showSel_Family: true,
      newDocFamily: newDoc
    });
  };

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
  toggleSel_Tags = () => {
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
  onClickAdd_Communication = () => {
    this.setState({ showAdd_Communication: true });
  };

  /**
   *
   *
   * @memberof MapsSP_Consumers_Detail
   */
  toggleAdd_Communication = () => {
    this.setState({ showAdd_Communication: !this.state.showAdd_Communication });
  };

  /**
   *
   *
   * @memberof MapsSP_Consumers_Detail
   */
  closeAdd_Communication = () => {
    this.setState({ showAdd_Communication: false });
  };

  /**
   *
   *
   * @memberof MapsSP_Consumers_Detail
   */
  onClickSave_Memo = () => {
    const doc = this.state.doc;
    doc.memo = this.state.memoInput;
    this.submit(doc);

    this.setState({ enableEdit_Memo: false });
  };

  /**
   *
   *
   * @memberof MapsSP_List_List
   */

  showModal = show => {
    this.setState({ showModal: show });
  };
  /**
   *
   *
   * @returns
   * @memberof MapsSP_List_List
   */
  toggleModal = () => {
    this.setState({ showModal: !this.state.showModal });
  };

  /**
   *
   *
   * @memberof MapsSP_Consumers_Detail
   */
  onChangeTabs = key => {
    if (this.state.tabsKey != key) {
      this.setState({ tabsKey: key });
    }
  };

  /**
   *
   *
   * @memberof MapsSP_Consumers_Detail
   */
  onTabChange = (e, { activeIndex }) => this.setState({ activeIndex });

  /**
   *
   *
   * @returns
   * @memberof MapsSP_Consumers_Detail
   */
  render() {
    console.log(new Date().getTime(), "Consumers Detail render");

    if (!this.state.doc || !this.state.doc._id) {
      this.props.history.replace("/MapsSP/Consumers/List");
      return <React.Fragment />;
    }

    const panes = [
      {
        menuItem: "情報",
        render: () => (
          <Tab.Pane
            attached={false}
            style={{ padding: 0, margin: 0, border: "none" }}
          >
            <this.displayTab1 />
          </Tab.Pane>
        )
      },
      {
        menuItem: `家族 ${this.displayTagNum(this.state.familysNum)}`,
        render: () => (
          <Tab.Pane
            attached={false}
            style={{ padding: 0, margin: 0, border: "none" }}
          >
            <this.displayTab2 />
          </Tab.Pane>
        )
      },
      {
        menuItem: `タグ ${this.displayTagNum(this.state.tagsNum)}`,
        render: () => (
          <Tab.Pane
            attached={false}
            style={{ padding: 0, margin: 0, border: "none" }}
          >
            <this.displayTab3 />
          </Tab.Pane>
        )
      },
      {
        menuItem: `訪問 ${this.displayTagNum(this.state.communicationsNum)}`,
        render: () => (
          <Tab.Pane
            attached={false}
            style={{ padding: 0, margin: 0, border: "none" }}
          >
            <this.displayTab4 />
          </Tab.Pane>
        )
      },
      {
        menuItem: "メモ",
        render: () => (
          <Tab.Pane
            attached={false}
            style={{ padding: 0, margin: 0, border: "none" }}
          >
            <this.displayTab5 />
          </Tab.Pane>
        )
      }
    ];

    /// Sys - AutoForm - layout

    let showBirth = false;
    let dtBirth = "";
    let age = "";
    const birthDay = _.get(this.state.doc, "identity.birthDay");
    if (birthDay) {
      const now = new Date().getTime();
      dtBirth = moment(birthDay).format("YYYY/MM/DD");
      age = moment(now).diff(birthDay, "years");
    }

    // 享年
    let showDeath = false;

    let ageAtDeath = "";
    const deathY = _.get(this.state.doc, "identity.dateOfDeath.y");
    const deathM = _.get(this.state.doc, "identity.dateOfDeath.m");
    const deathD = _.get(this.state.doc, "identity.dateOfDeath.d");
    if (deathY || deathM || deathD) {
      showDeath = true;
    } else if (birthDay) {
      showBirth = true;
    }
    if (deathY && deathM && deathD && birthDay) {
      const deathTime = new Date(deathY, deathM - 1, deathD).getTime();
      ageAtDeath = moment(deathTime).diff(birthDay, "years");
    }

    // 物故日
    const deathArr = [];
    if (deathY) {
      deathArr.push(("0000" + deathY).slice(-4));
    }
    if (deathM) {
      deathArr.push(("00" + deathM).slice(-2));
    }
    if (deathD) {
      deathArr.push(("00" + deathD).slice(-2));
    }
    const dtDeath = deathArr.join("/");

    // floating menu
    const menuTels = [];
    const tmpTels = _.get(this.state.doc, "contact.tels") || [];
    for (let i = 0; i < 2 && i < tmpTels.length; i++) {
      menuTels.push(tmpTels[i].tel);
    }
    const menuEmails = [];
    const tmpEmails = _.get(this.state.doc, "contact.emails") || [];
    for (let i = 0; i < 2 && i < tmpEmails.length; i++) {
      menuEmails.push(tmpEmails[i].address);
    }

    return (
      <React.Fragment>
        {/* Link start */}
        <Segment style={{ border: "none", marginBottom: "0px" }}>
          <Button
            onClick={this.props.history.goBack}
            className="button-return font-color"
            style={{ marginBottom: "5px" }}
          >
            <Image src={window.$GLOBAL$.__SVG__["戻る"]} />
          </Button>
          {
            <If condition={this.state.tabsKey == "1"}>
              <Button
                onClick={() => this.setState({ showEdit_Info: true })}
                floated="right"
                style={{
                  color: "#52a8ff",
                  backgroundColor: "white",
                  padding: "11px"
                }}
              >
                編集
              </Button>
            </If>
          }

          {
            <If condition={this.state.tabsKey == "5"}>
              {
                <If condition={!this.state.enableEdit_Memo}>
                  <Button
                    onClick={() => {
                      this.setState({
                        enableEdit_Memo: true
                      });
                      this.refMemoInput.current.focus();
                    }}
                    floated="right"
                    style={{
                      color: "#52a8ff",
                      backgroundColor: "white",
                      padding: "11px"
                    }}
                  >
                    編集
                  </Button>
                </If>
              }

              {
                <If condition={this.state.enableEdit_Memo}>
                  <Button
                    onClick={this.onClickSave_Memo}
                    floated="right"
                    style={{
                      color: "#52a8ff",
                      backgroundColor: "white",
                      padding: "11px"
                    }}
                  >
                    保存
                  </Button>
                </If>
              }
            </If>
          }
        </Segment>
        {/* Link end */}

        {/* 詳細 start */}
        <Segment
          basic
          style={{
            background: "#fff",
            border: "none",
            margin: "0px",
            paddingTop: "0px",
            paddingBottom: "0px",
            height: "130px"
          }}
        >
          <Grid centered className="center aligned content">
            <Grid.Column width={6} style={{ padding: "6px 0px 0px" }}>
              <Image
                onClick={() => {
                  this.setState({ showLightBox: true });
                }}
                src={getImageLink(this.state.doc)}
                size="small"
                centered
                style={{ width: "35%", marginBottom: "5px" }}
              />
              {
                <If condition={this.state.doc.familyPrimary}>
                  <Image
                    src={window.$GLOBAL$.__SVG__["プロフ星小"]}
                    style={{
                      bottom: "22px",
                      left: "84px",
                      width: "16p"
                    }}
                  />
                </If>
              }
              <p
                as="a"
                className="font-family"
                style={{
                  fontSize: "18px",
                  color: "#3C3C3C",
                  fontWeight: "bold",
                  textAlign: "center",
                  margin: "6px 0px 0px 0px"
                }}
              >
                {_.get(this.state.doc, "identity.name") || "(なし)"}
              </p>
              <p
                className="font-color font-family"
                style={{
                  fontSize: "11px",
                  textAlign: "center",
                  margin: "0px"
                }}
              >
                {" "}
                {_.get(this.state.doc, "identity.kana") || "(なし)"}
              </p>
            </Grid.Column>
            <Grid.Column width={10} style={{ padding: "0px 0px" }}>
              <Grid.Row
                style={{
                  margin: "0px",
                  width: "229px",
                  height: "58px",
                  borderBottom: "solid 1px #e4e4e5"
                }}
              >
                <Grid.Column width={3} className="userinfo-col">
                  <p className="font-family font-color userinfo-font1">
                    {getRankTitle(this.state.doc.rank)}
                  </p>
                  <p className="font-family font-color userinfo-font2">
                    ランク
                  </p>
                </Grid.Column>
                <Grid.Column width={3} className="userinfo-col">
                  <p className="font-family font-color userinfo-font1">
                    {(_.get(this.state.doc, "introductions") || []).length}
                  </p>
                  <p className="font-family font-color userinfo-font2">
                    紹介された人
                  </p>
                </Grid.Column>
                <Grid.Column width={3} className="userinfo-col">
                  <p className="font-family font-color userinfo-font1">
                    {(_.get(this.state.doc, "introducers") || []).length}
                  </p>
                  <p className="font-family font-color userinfo-font2">
                    紹介した人
                  </p>
                </Grid.Column>
              </Grid.Row>
              <Grid.Row
                style={{
                  width: "229px",
                  margin: "9px 0 0",
                  fontSize: "13px"
                }}
              >
                {
                  <If condition={showBirth}>
                    <p
                      className="font-family font-color"
                      style={{ margin: "auto" }}
                    >
                      誕生日: {dtBirth}
                    </p>
                    <p className="font-family font-color">({age}歳)</p>
                  </If>
                }
                {
                  <If condition={showDeath}>
                    <p
                      className="font-family font-color"
                      style={{ margin: "auto" }}
                    >
                      ご逝去: {dtDeath}
                    </p>
                    {
                      <If condition={ageAtDeath}>
                        <p className="font-family font-color">
                          (享年{ageAtDeath}歳)
                        </p>
                      </If>
                    }
                  </If>
                }
              </Grid.Row>
            </Grid.Column>
          </Grid>
        </Segment>

        <Tab
          menu={{
            secondary: true,
            pointing: true,
            style: {
              marginBottom: "0px",
              backgroundColor: "white",
              paddingTop: "0"
            }
          }}
          activeIndex={this.state.activeIndex}
          onTabChange={this.onTabChange}
          panes={panes}
          style={{ padding: 0 }}
          className="tab3div"
        />

        <div style={{ zIndex: 100 }}>
          <Button
            onClick={() => this.setState({ showModal: true })}
            circular
            size="big"
            className="floating-btn2"
          >
            {/* <Image src={window.$GLOBAL$.__SVG__["フローティングアイコン"]} /> */}
            <Image src="/smsk-front/フローティングアイコン.svg" />
          </Button>
        </div>

        {/* 詳細 end */}

        {/* モーダル start */}

        <MDBModalW
          isOpen={this.state.showModal}
          toggle={this.toggleModal}
          fullHeight
          size="large"
          className="m-0 p-0"
          id="modal-black"
        >
          <Grid
            className="right aligned"
            style={{
              width: "100%",
              position: "fixed",
              right: "12px",
              bottom: "59px"
            }}
          >
            <Grid.Row style={{ paddingBottom: "5px" }}>
              <Grid.Column>
                <p
                  onClick={() => {
                    this.setState({
                      showDetail_Files: true,
                      showModal: false
                    });
                  }}
                  className="font-family right aligned floatingmenu-p"
                >
                  ファイル一覧
                  <Image
                    className="floatingmenu-img"
                    style={{ bottom: "2px" }}
                    src={window.$GLOBAL$.__SVG__["ファイル"]}
                  />
                </p>
              </Grid.Column>
            </Grid.Row>

            <Grid.Row style={{ paddingBottom: "5px" }}>
              <Grid.Column>
                <p
                  onClick={() => {
                    this.setState({ showDetail_Map: true, showModal: false });
                  }}
                  className="font-family right aligned floatingmenu-p"
                >
                  位置情報を確認
                  <Image
                    className="floatingmenu-img"
                    style={{ bottom: "2px" }}
                    src={window.$GLOBAL$.__SVG__["位置情報"]}
                  />
                </p>
              </Grid.Column>
            </Grid.Row>

            {
              <For each="tel" index="index" of={menuTels}>
                <Grid.Row key={index} style={{ paddingBottom: "5px" }}>
                  <Grid.Column>
                    <a href={"tel:" + tel}>
                      <p className="font-family right aligned floatingmenu-p">
                        {tel}
                        <Image
                          onClick={this.addConsumer}
                          className="floatingmenu-img"
                          style={{ bottom: "2px" }}
                          src={window.$GLOBAL$.__SVG__["電話"]}
                        />
                      </p>
                    </a>
                  </Grid.Column>
                </Grid.Row>
              </For>
            }

            {
              <For each="email" index="index" of={menuEmails}>
                <Grid.Row key={index} style={{ paddingBottom: "5px" }}>
                  <Grid.Column>
                    <a href={"mailto:" + email}>
                      <p className="font-family right aligned floatingmenu-p">
                        {email}
                        <Image
                          onClick={this.addConsumer}
                          className="floatingmenu-img"
                          style={{ bottom: "2px" }}
                          src={window.$GLOBAL$.__SVG__["メール"]}
                        />
                      </p>
                    </a>
                  </Grid.Column>
                </Grid.Row>
              </For>
            }

            <Grid.Row style={{ paddingBottom: "5px", height: "75px" }}>
              <Grid.Column>
                <Image
                  onClick={() => this.setState({ showModal: false })}
                  src="/smsk-front/閉じる.svg"
                  style={{
                    float: "right",
                    bottom: "9px",
                    left: "10px"
                  }}
                />
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </MDBModalW>

        {/* モーダル end */}

        <MDBModalW
          size="large"
          isOpen={this.state.showDetail_Map}
          toggle={this.toggleMap}
          className="m-0 p-0"
          animation="left"
        >
          <MDBModalBody className="m-0 p-0">
            <Detail_Map
              closeDetail_Map={this.closeDetail_Map}
              doc={this.state.doc}
              updateDoc={this.updateDoc}
              history={this.props.history}
            />
          </MDBModalBody>
        </MDBModalW>

        <MDBModalW
          size="large"
          isOpen={this.state.showSel_Tags}
          toggle={this.toggleTags}
          className="m-0 p-0"
          animation="left"
        >
          <MDBModalBody className="m-0 p-0">
            <Sel_Tags
              close={this.closeSel_Tags}
              doc={this.state.doc}
              updateDoc={this.updateDoc}
            />
          </MDBModalBody>
        </MDBModalW>

        <MDBModalW
          size="large"
          isOpen={this.state.showDetail_Files}
          toggle={this.toggleFiles}
          className="m-0 p-0"
          animation="left"
        >
          <MDBModalBody className="m-0 p-0">
            <Detail_Files
              closeDetail_Files={this.closeDetail_Files}
              doc={this.state.doc}
              updateDoc={this.updateDoc}
            />
          </MDBModalBody>
        </MDBModalW>

        <MDBModalW
          size="large"
          isOpen={this.state.showEdit_Info}
          toggle={this.toggleEdit_Info}
          className="m-0 p-0"
          animation="left"
        >
          <MDBModalBody className="m-0 p-0">
            <Edit_Info
              closeEdit_Info={this.closeEdit_Info}
              doc={this.state.doc}
              updateDoc={this.updateDoc}
            />
          </MDBModalBody>
        </MDBModalW>

        <MDBModalW
          size="fluid"
          isOpen={this.state.showSel_Family}
          toggle={this.toggleSel_Family}
          className="m-0 p-0"
          animation="left"
        >
          <MDBModalBody className="m-0 p-0">
            <Sel_Family
              searchPlaceholder="名前を検索"
              onClickAdd_Base={this.onClickAdd_Family}
              closeSel_Base={this.closeSel_Family}
              doc={this.state.doc}
              newDoc={this.state.newDocFamily}
              updateDoc={this.updateDoc}
            />
          </MDBModalBody>
        </MDBModalW>

        <MDBModalW
          size="fluid"
          isOpen={this.state.showAdd_Family}
          toggle={this.toggleAdd_Family}
          className="m-0 p-0"
          animation="left"
        >
          <MDBModalBody className="m-0 p-0">
            <Add_Family
              title="家族を追加"
              doc={this.state.doc}
              close={doc => this.closeAdd_Family(doc)}
            />
          </MDBModalBody>
        </MDBModalW>

        <MDBModalW
          size="fluid"
          isOpen={this.state.showAdd_Communication}
          toggle={this.toggleAdd_Communication}
          className="m-0 p-0"
          animation="left"
        >
          <MDBModalBody className="m-0 p-0">
            <Add_Communication
              title="訪問を追加"
              close={this.closeAdd_Communication}
              doc={this.state.doc}
              updateDoc={this.updateDoc}
            />
          </MDBModalBody>
        </MDBModalW>

        <MDBModalW
          isOpen={this.state.showTelephone}
          toggle={() =>
            this.setState({ showTelephone: !this.state.showTelephone })
          }
          className="pinmodal-style"
          animation="left"
        >
          <MDBModalHeader>発信</MDBModalHeader>
          <MDBModalBody>
            {
              <For each="tel" index="index" of={this.state.telephoneList}>
                <p key={index}>
                  <a
                    href={"tel:" + tel}
                    className="ui button font-color font-family"
                    style={{
                      width: "100%",
                      marginBottom: "20px",
                      padding: "15px 21px"
                    }}
                  >
                    {tel}
                  </a>
                </p>
              </For>
            }
          </MDBModalBody>
        </MDBModalW>

        {
          <If condition={this.state.showLightBox}>
            <Lightbox
              mainSrc={getImageLink(this.state.doc)}
              onCloseRequest={() => this.setState({ showLightBox: false })}
            />
          </If>
        }
      </React.Fragment>
    );
    /// Sys - AutoForm - layout --
  }
}
