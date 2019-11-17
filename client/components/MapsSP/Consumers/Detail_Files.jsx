/// Sys - AutoForm
import { Session } from "meteor/session";
import React from "react";
import AutoForm from "uniforms-bootstrap4/AutoForm";
import AutoFields from "@imports/ui/uniforms/AutoFields";
import ErrorsField from "uniforms-bootstrap4/ErrorsField";
import Update from "@imports/ui/crud/Update";
/// Sys - AutoForm --

import { MapsSP_Consumers_Detail_ComponentInfo } from "./Detail";

/// Custom - AutoForm - collection
import { Maps_Consumers_Collection } from "@imports/api/Maps/Consumers_Collection";
console.assert(
  Maps_Consumers_Collection,
  "Maps_Consumers_Collection is undefined."
);
/// Custom - AutoForm - collection --

/// Custom - LocalStorage
import { Maps_ConsumersSum_Collection } from "@imports/api/Maps/ConsumersSum_Collection";
/// Custom - LocalStorage --

/// Sys - Network
import { Persister } from "@imports/api/lib/persist-method";
/// Sys - Network --

// import start
import { Segment } from "semantic-ui-react";
import { Grid } from "semantic-ui-react";
import { Header } from "semantic-ui-react";

import { Button } from "semantic-ui-react";
import { Image } from "semantic-ui-react";

// 足りなければ、import 文を追加

// import end

export class Detail_Files extends Update {
  "use strict";

  constructor(props) {
    super(props);

    if (!props) {
      return;
    }

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
    this.securityCheck = this.securityCheck.bind(this);

    /// Sys - AutoForm - rebuild field
    this.postConstructor();
    /// Sys - AutoForm - rebuild field --

    this.window_innerHeight = window.innerHeight;
  }

  /**
   *
   *
   * @returns
   * @memberof Update
   */
  componentDidMount() {
    /// Custom - Role - check permission
    this.securityCheck();
    /// Custom - Role - check permission --
  }

  /**
   *
   *
   * @memberof Add_Family
   */
  securityCheck() {
    if (this.ComponentInfo) {
      if (!this.ComponentInfo("update")) {
        console.error(`Security check.`);
        this.props.closeDetail_Files();
      }
    }
  }

  /**
   *
   *
   * @param {*} doc
   * @memberof Add_Family
   */
  submit(doc) {
    console.log("Details_Files", doc);
    /// Sys - AutoForm - update
    const Users_Groups_id = Session.get("Users_Groups_id");

    console.assert(
      this.ComponentInfo("update"),
      "ComponentInfo('update') is undefined"
    );

    doc.images = doc.images.filter(i => i.Images_id);

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
      this.props.closeDetail_Files
    );
    /// Sys - AutoForm - update --

    window.$GLOBAL$.Collection[this.Collection._name][doc._id] = doc;
    this.props.updateDoc(doc);
  }

  /**
   *
   *
   * @returns
   * @memberof Add_Family
   */
  render() {
    let simpleSchema;
    if (typeof this.Collection.simpleSchema == "function") {
      simpleSchema = this.Collection.simpleSchema();
    } else {
      simpleSchema = this.Collection.simpleSchema;
    }

    /// Sys - AutoForm - layout
    return (
      <React.Fragment>
        <AutoForm
          schema={simpleSchema}
          ref={ref => this.ready(ref)}
          onChange={this.change}
          onSubmit={this.submit}
          model={this.props.doc}
          placeholder={true}
          disabled={false}
          showInlineError={true}
        >
          <Segment className="header-line" />
          <Segment className="link-area5">
            <Grid centered className="center aligned content">
              <Grid.Row className="header-row">
                <Grid.Column width={2}>
                  <Button
                    onClick={this.props.closeDetail_Files}
                    className="close-area"
                  >
                    <Image src={window.$GLOBAL$.__SVG__["戻る"]} />
                  </Button>
                </Grid.Column>
                <Grid.Column
                  width={14}
                  className="center aligned content header"
                >
                  <Header
                    as="h2"
                    className="font-color font-family header-font"
                  >
                    ファイル一覧
                  </Header>
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </Segment>
          {/* Link end */}

          {/* 詳細 start */}
          <Segment
            className="haribote disabled"
            style={{
              marginTop: "0px",
              height: this.window_innerHeight - 0 + "px"
            }}
          >
            <AutoFields fields={["files"]} />
            <ErrorsField />
          </Segment>
          {/* 詳細 end */}
        </AutoForm>
      </React.Fragment>
    );
    /// Sys - AutoForm - layout --
  }
}
