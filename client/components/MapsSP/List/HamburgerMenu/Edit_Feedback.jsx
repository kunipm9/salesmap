//TODO logic

/// Sys - AutoForm
import { Session } from "meteor/session";
import React from "react";
/// Sys - AutoForm --

import {
  Segment,
  Grid,
  Button,
  Image,
  Header,
  TextArea,
  Form
} from "semantic-ui-react";
/// Application

import { MapsSP_Consumers_Detail_ComponentInfo } from "./../../Consumers/Detail";

/// Custom - AutoForm - collection
import { Maps_Companys_Collection } from "@imports/api/Maps/Companys_Collection";
console.assert(
  Maps_Companys_Collection,
  "Maps_Consumers_Collection is undefined."
);
/// Custom - AutoForm - collection --

/// Sys - Network
import { Random } from "meteor/random";
import { Persister } from "@imports/api/lib/persist-method";
/// Sys - Network --

/**
 *
 *
 * @export
 * @class Edit_Feedback
 * @extends {Update}
 */
export class Edit_Feedback extends React.Component {
  "use strict";

  /**
   *Creates an instance of Edit_Feedback.
   * @param {*} props
   * @memberof Edit_Feedback
   */
  constructor(props) {
    super(props);

    if (!props) {
      return;
    }

    /// Custom - Role - check permission
    this.ComponentInfo = MapsSP_Consumers_Detail_ComponentInfo;
    /// Custom - Role - check permission --

    /// Custom - AutoForm - rebuild field
    this.Collection = {
      _name: "Maps_Companys",
      docs: {},
      simpleSchema: Maps_Companys_Collection.simpleSchema(),
      dispTitle: Maps_Companys_Collection.dispTitle
    };
    this.Form_name = this.Collection._name;
    /// Custom - AutoForm - rebuild field --

    this.submit = this.submit.bind(this);
  }

  /// Application - Save
  /**
   *
   *
   * @param {*} doc
   * @memberof Edit_Feedback
   */
  submit(doc) {
    console.log(new Date().getTime(), "Edit_Feedback submit");
    /// Sys - AutoForm - update
    const Users_Groups_id = Session.get("Users_Groups_id");

    console.assert(
      this.ComponentInfo("update"),
      "ComponentInfo('update') is undefined"
    );

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
      this.close
    );
    /// Sys - AutoForm - update --
  }
  /// Application - Save --

  /**
   *
   *
   * @returns
   * @memberof Edit_Feedback
   */
  render() {
    console.log(new Date().getTime(), "Edit_Feedback render");

    return (
      <React.Fragment>
        {/* Link start */}
        <Segment className="header-line" />
        <Segment className="link-area5">
          <Grid centered className="center aligned content">
            <Grid.Row className="header-row">
              <Grid.Column width={2}>
                <Button onClick={this.props.close} className="close-area">
                  <Image src={window.$GLOBAL$.__SVG__["戻る"]} />
                </Button>
              </Grid.Column>
              <Grid.Column width={14} className="center aligned content header">
                <Header as="h2" className="font-color font-family header-font">
                  ご意見フォーム
                </Header>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Segment>
        {/* Link end */}

        <Segment padded className="map8-area" style={{ height: "91.5vh" }}>
          {/* テキストエリア start */}
          <Header
            className="font-color font-family"
            style={{ fontSize: "16px", paddingBottom: "14px" }}
          >
            更なるサービス向上のため、ご意見を募集しております。
          </Header>
          <Form>
            <TextArea style={{ minHeight: "300px" }} />
          </Form>
          {/* テキストエリア end */}

          {/* 下部エリア start */}
          <Grid.Row>
            <Grid.Column
              width={16}
              className="right aligned content fam-fotter-style"
            >
              <Button className="font-family fam-fotter-btn fotter-btn-style haribote">
                送信
              </Button>
            </Grid.Column>
          </Grid.Row>
          {/* 下部エリア end */}
        </Segment>
      </React.Fragment>
    );
  }
}
