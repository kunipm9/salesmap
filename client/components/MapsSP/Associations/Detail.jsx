/// Sys - AutoForm
import { Session } from "meteor/session";
import React from "react";
import Update from "@imports/ui/crud/Update";
import { withTracker } from "meteor/react-meteor-data";
/// Sys - AutoForm --

import mingo from "mingo";
import moment from "moment";
moment.locale("ja");

import { displayConsumer } from "../Consumers/utils";
import { getConsumerName } from "../Consumers/utils";
import { getConsumerDetail } from "../Consumers/utils";
import { Edit } from "./Edit";
import { Detail_Map } from "./Detail_Map";

// import start
import { Segment } from "semantic-ui-react";
import { Grid } from "semantic-ui-react";
import { Item } from "semantic-ui-react";

import { Button } from "semantic-ui-react";
import { Image } from "semantic-ui-react";

import { Tab } from "semantic-ui-react";
import { Form, TextArea } from "semantic-ui-react";

import { MDBModalHeader, MDBModalBody } from "mdbreact";
import { MDBModalW } from "../lib/MDBModalW";

import Collapsible from "react-collapsible";

import {
  displayField,
  displayListField,
  displayValueField
} from "../lib/utils";

/// Custom - AutoForm - collection
import { Maps_Associations_Collection } from "@imports/api/Maps/Associations_Collection";
console.assert(
  Maps_Associations_Collection,
  "Maps_Associations_Collection is undefined."
);
/// Custom - AutoForm - collection --

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
export const MapsSP_Associations_Detail_ComponentInfo = mode => {
  if (!checkAppRole("MapsSP.Companys", mode)) {
    return null;
  }

  if (checkSystemRole()) {
    return null;
  }

  return {
    title: "MapsSP/Associations/Detail",
    path: "/MapsSP/Associations/Detail"
  };
};
/// Custom - Role - check permission --

/**
 *
 *
 * @export
 * @class Maps_Associations_View_Detail
 * @extends {Detail}
 */
export class _MapsSP_Associations_Detail extends Update {
  "use strict";

  /**
   *Creates an instance of Maps_Associations_View_Detail.
   * @param {*} props
   * @memberof Maps_Associations_View_Detail
   */
  constructor(props) {
    super(props);
    console.log("constructro", props);
    if (!props) {
      return;
    }

    /// Custom - Tabular - link button
    this.detailPath = "/MapsSP/Associations/Detail/";
    this.detailPathConsumer = "/MapsSP/Consumers/Detail/";
    /// Custom - Tabular - link button --

    /// Custom - Role - check permission
    this.ComponentInfo = MapsSP_Associations_Detail_ComponentInfo;
    /// Custom - Role - check permission --

    /// Custom - AutoForm - rebuild field
    this.Collection = Maps_Associations_Collection;
    this.Form_name = this.Collection._name;
    /// Custom - AutoForm - rebuild field --

    /// Sys - AutoForm - rebuild field !!!!!!!!!!
    this.postConstructor();
    /// Sys - AutoForm - rebuild field !!!!!!!!!! --

    this.submit = this.submit.bind(this);

    this.state.showDetail_Map = false;
    this.state.showEdit = false;
    this.state.enableEdit_Memo = false;

    this.state.showTelephone = false;
    this.state.telephoneList = [];

    this.state.tabsKey = "1";

    if (typeof this.Collection.simpleSchema == "function") {
      this.simpleSchema = this.Collection.simpleSchema();
    } else {
      this.simpleSchema = this.Collection.simpleSchema;
    }

    this.refMemoInput = React.createRef();
    this.state.memoInput = this.props.doc.memo;

    /// Sys - AutoForm - rebuild field
    this.postConstructor();
    /// Sys - AutoForm - rebuild field --

    this.window_innerHeight = window.innerHeight;
  }

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

    Bert.alert({
      type: "success",
      hideDelay: 10000,
      message: "情報を更新しました"
    });
  }
  /// Application - Save --

  /* global index */
  /* global consumer */

  /**
   *
   *
   * @memberof MapsSP_Associations_Detail
   */
  displayTab1 = () => {
    this.onChangeTabs("1");
    const doc = this.props.doc;

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
          {displayValueField(
            this.simpleSchema,
            doc,
            "representative.Maps_Consumers_id",
            (schema, _value) => (
              <Collapsible
                trigger={
                  <span
                    onClick={() => {
                      this.props.history.push(this.detailPathConsumer + _value);
                    }}
                    style={{ color: "cornflowerblue" }}
                  >
                    {getConsumerName(_value)}
                  </span>
                }
              >
                <span>{getConsumerDetail(_value)}</span>
              </Collapsible>
            )
          )}

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

          {displayValueField(
            this.simpleSchema,
            doc,
            "url",
            (schema, _value) => (
              <a href={_value} target="_blank">
                {_value}
              </a>
            )
          )}
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

    return (
      <React.Fragment>
        {/* スクロールエリア start */}
        <Segment
          style={{
            margin: 0,
            padding: "14px",
            overflow: "auto",
            height: this.window_innerHeight - 235 + "px"
          }}
        >
          {
            <For each="consumer" index="index" of={this.props.consumers}>
              <Item.Group key={index} divided>
                {/* 個人 start */}
                {displayConsumer(
                  null,
                  consumer,
                  index,
                  this.props.history,
                  this.detailPathConsumer + consumer._id,
                  true
                )}
                {/* 個人 end */}
              </Item.Group>
            </For>
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
  displayTab3 = () => {
    this.onChangeTabs("3");

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
            height: this.window_innerHeight - 256 + "px"
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
                height: this.window_innerHeight - 256 + "px"
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
  toggleEdit = () => {
    this.setState({ showEdit: !this.state.showEdit_Info });
  };

  /**
   *
   *
   * @memberof MapsSP_Consumers_Detail
   */
  closeEdit = () => {
    this.setState({ showEdit: false });
  };

  /**
   *
   *
   * @memberof MapsSP_Consumers_Detail
   */
  toggleTelephone = () => {
    this.setState({ showTelephone: !this.state.showTelephone });
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
  displayTagNum = num => {
    if (num) {
      return `(${num})`;
    } else {
      return "";
    }
  };

  /* global tel */

  /**
   *
   *
   * @returns
   * @memberof Maps_Associations_View_Insert
   */
  render() {
    if (this.props.loading) {
      return <React.Fragment />;
    }

    if (!this.props.doc || !this.props.doc._id) {
      this.props.history.replace("/MapsSP/Associations/List");
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
        menuItem: `構成員 ${this.displayTagNum(this.props.consumersNum)}`,
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
        menuItem: "メモ",
        render: () => (
          <Tab.Pane
            attached={false}
            style={{ padding: 0, margin: 0, border: "none" }}
          >
            <this.displayTab3 />
          </Tab.Pane>
        )
      }
    ];

    /// Sys - AutoForm - layout
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
                onClick={() => this.setState({ showEdit: true })}
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
            <If condition={this.state.tabsKey == "3"}>
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
        <Segment style={{ border: "none", margin: "0px", paddingTop: "0px" }}>
          <Grid centered className="center aligned content">
            <Grid.Column style={{ margin: "40px 0px 40px 20px" }}>
              <Item.Header as="a" className="font-family detail-header">
                {this.props.doc.name}
              </Item.Header>
              <Item.Meta className="font-family font-color detail-meta">
                {this.props.doc.kana}
              </Item.Meta>
            </Grid.Column>
          </Grid>
        </Segment>
        {/* 詳細 end */}

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
            />
          </MDBModalBody>
        </MDBModalW>

        <MDBModalW
          size="large"
          isOpen={this.state.showEdit}
          toggle={this.toggleEdit}
          className="m-0 p-0"
          animation="left"
        >
          <MDBModalBody className="m-0 p-0">
            <Edit closeEdit={this.closeEdit} doc={this.state.doc} />
          </MDBModalBody>
        </MDBModalW>

        <MDBModalW
          isOpen={this.state.showTelephone}
          toggle={this.toggleTelephone}
          className="pinmodal-style"
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
      </React.Fragment>
    );
    /// Sys - AutoForm - layout --
  }
}
/// Custom - View - tracker
/**
 *
 **/
export const MapsSP_Associations_Detail = withTracker(arg => {
  //TODO
  if (!arg) {
    return;
  }

  /// Custom - Collection - subscribe
  const handles = [
    //    Meteor.subscribe(
    //      Maps_Associations_Collection._name,
    //      Session.get("Users_Groups_id")
    //    )
  ];
  const loading = handles.some(handle => !handle.ready());

  if (loading) {
    return {
      loading: loading,
      doc: {},
      ComponentInfo: MapsSP_Associations_Detail_ComponentInfo
    };
  }
  /// Custom - Collection - subscribe --

  const doc = Maps_Associations_Collection.findOne({
    _id: arg.match.params._id
  });
  if (!doc) {
    this.props.history.goBack();
  }

  if (!doc.residenceAddress) {
    doc.residenceAddress = {};
  }

  let consumers = [];
  if (doc && doc._id) {
    /// Custom - AutoForm - rebuild field
    const Collection_Consumers = {
      _name: "Maps_Consumers",
      docs: {},
      simpleSchema: Maps_Consumers_Collection.simpleSchema(),
      dispTitle: Maps_Consumers_Collection.dispTitle
    };
    /// Custom - AutoForm - rebuild field --

    const docs = window.$GLOBAL$.Collection[Collection_Consumers._name];
    const Collection_ConsumersList = [];
    for (let key in docs) {
      Collection_ConsumersList.push(docs[key]);
    }

    const query = {
      "associations.association.Maps_Association_id": arg.match.params._id
    };
    consumers = mingo
      .find(Collection_ConsumersList, query)
      .limit(100)
      .map(doc => doc);
  }

  return {
    loading: loading,
    doc: doc,
    consumers: consumers,
    consumersNum: consumers.length,
    ComponentInfo: MapsSP_Associations_Detail_ComponentInfo
  };
})(_MapsSP_Associations_Detail);
/// Custom - View - tracker --
