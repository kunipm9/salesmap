/// Sys - AutoForm
import React from "react";
import AutoForm from "uniforms-bootstrap4/AutoForm";
import AutoFields from "@imports/ui/uniforms/AutoFields";
import ErrorsField from "uniforms-bootstrap4/ErrorsField";
import SubmitField from "@imports/ui/uniforms/SubmitField";
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

// import start
import { Segment } from "semantic-ui-react";

import { Button } from "semantic-ui-react";
import { Icon } from "semantic-ui-react";

// 足りなければ、import 文を追加

// import end

export class Detail_Images extends Update {
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
    this.Form_name = this.Collection._name + "_ext_Image";
    /// Custom - AutoForm - rebuild field --
    this.SumCollection = Maps_ConsumersSum_Collection;
    /** @type {any[]} */
    this.CollectionList = [];
    /// Custom - LocalStorage --

    this.state.doc = this.props.doc;

    /// Sys - AutoForm - rebuild field !!!!!!!!!!
    this.postConstructor();
    /// Sys - AutoForm - rebuild field !!!!!!!!!! --

    this.submit = this.submit.bind(this);
    this.securityCheck = this.securityCheck.bind(this);

    /// Sys - AutoForm - rebuild field
    this.postConstructor();
    /// Sys - AutoForm - rebuild field --
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
   * @returns
   * @memberof Update
   */
  componentWillUnmount() {}

  /**
   *
   *
   * @memberof Add_Family
   */
  securityCheck() {
    if (this.ComponentInfo) {
      if (!this.ComponentInfo("update")) {
        console.error(`Security check.`);
        this.props.closeDetail_Images();
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
    this.props.updateDoc(doc, [
      "images",
      `images.${doc.images.length - 1}.Images_id`
    ]);
    this.props.updateImageDoc(doc);
    this.props.closeDetail_Images();
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
          model={this.state.doc}
          placeholder={true}
          disabled={false}
          showInlineError={true}
        >
          {/* Link start */}
          <Segment style={{ border: "none", marginBottom: "0px" }}>
            <Button
              onClick={this.props.closeDetail_Images}
              className="button-return font-color"
            >
              <Icon name="chevron left" size="big" />
            </Button>
            <SubmitField
              floated="right"
              style={{
                color: "#52a8ff",
                backgroundColor: "white",
                padding: "11px"
              }}
              value="保存"
            />
          </Segment>
          {/* Link end */}

          {/* 詳細 start */}
          <Segment>
            <AutoFields fields={["images"]} />
            <ErrorsField />
          </Segment>
          {/* 詳細 end */}
        </AutoForm>
      </React.Fragment>
    );
    /// Sys - AutoForm - layout --
  }
}
