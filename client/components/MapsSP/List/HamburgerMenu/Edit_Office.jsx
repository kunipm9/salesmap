//TODO logic
/// Sys - AutoForm
import { withTracker } from "meteor/react-meteor-data";
import React from "react";
import AutoForm from "uniforms-bootstrap4/AutoForm";
import AutoFields from "@imports/ui/uniforms-material/AutoFields";
import AutoField from "@imports/ui/uniforms-material/AutoField";
import ListFieldStyled from "@imports/ui/uniforms-material/styled/ListField";
import ListItemFieldStyled from "@imports/ui/uniforms-material/styled/ListItemField";
import ErrorsField from "uniforms-bootstrap4/ErrorsField";
import SubmitField from "@imports/ui/uniforms/SubmitField";
import Edit from "@imports/ui/crud/Edit";
/// Sys - AutoForm --

import { MapsSP_Consumers_Detail_ComponentInfo } from "./../../Consumers/Detail";

/// Custom - AutoForm - collection
import { Maps_Offices_Collection } from "@imports/api/Maps/Offices_Collection";
console.assert(
  Maps_Offices_Collection,
  "Maps_Consumers_Collection is undefined."
);
/// Custom - AutoForm - collection --

import { Segment, Grid, Button, Header, Image } from "semantic-ui-react";

/**
 *
 *
 * @export
 * @class Edit_Office
 * @extends {Update}
 */
class _Edit_Office extends Edit {
  "use strict";

  /**
   *Creates an instance of Edit_Office.
   * @param {*} props
   * @memberof Edit_Office
   */
  constructor(props) {
    super(props);

    this.state.doc = props.doc;

    /// Custom - Role - check permission
    this.ComponentInfo = MapsSP_Consumers_Detail_ComponentInfo;
    /// Custom - Role - check permission --

    /// Custom - AutoForm - rebuild field
    this.Collection = Maps_Offices_Collection;
    this.Form_name = this.Collection._name;
    /// Custom - AutoForm - rebuild field --

    /// Application - AutoForm - initial value
    this.initialValue = {};
    /// Application - AutoForm - initial value --

    /// Custom - AutoForm - single record
    this.singleRecordKey = {};
    /// Custom - AutoForm - single record --

    /// Sys - AutoForm - rebuild field
    this.postConstructor();
    /// Sys - AutoForm - rebuild field --

    this.window_innerHeight = window.innerHeight;
  }

  /**
   *
   *
   * @returns
   * @memberof Edit_Office
   */
  submit = doc => {
    super.submit(doc, this.props.close);
  };

  /**
   *
   *
   * @returns
   * @memberof Edit_Office
   */
  render() {
    console.log(new Date().getTime(), "Edit_Office render");

    /// Custom - Collection - subscribe
    if (this.props.loading) {
      return <span />;
    }
    /// Custom - Collection - subscribe --

    let simpleSchema;
    if (typeof this.Collection.simpleSchema == "function") {
      simpleSchema = this.Collection.simpleSchema();
    } else {
      simpleSchema = this.Collection.simpleSchema;
    }

    return this.renderWrapper(
      simpleSchema,
      this.state.doc,
      "事務所情報設定",
      <React.Fragment>
        <AutoField name="name" />
        <AutoField name="kana" />

        <AutoFields
          fields={simpleSchema._schemaKeys.filter(f =>
            f.startsWith("residenceAddress.address.")
          )}
        />

        <ListFieldStyled name="contact.tels">
          <ListItemFieldStyled name="$">
            <AutoField name="tel" />
          </ListItemFieldStyled>
        </ListFieldStyled>

        <ListFieldStyled name="contact.faxs">
          <ListItemFieldStyled name="$">
            <AutoField name="fax" />
          </ListItemFieldStyled>
        </ListFieldStyled>

        <AutoFields fields={["url"]} />

        <ErrorsField />
      </React.Fragment>
    );
  }

  /**
   *
   *
   * @returns
   * @memberof Add_Base
   */
  renderWrapper(simpleSchema, model, title, form) {
    /// Sys - AutoForm - layout
    return (
      <React.Fragment>
        <AutoForm
          schema={simpleSchema}
          ref={ref => this.ready(ref)}
          onChange={this.change}
          onSubmit={this.submit}
          model={model}
          placeholder={true}
          disabled={false}
          showInlineError={true}
        >
          {/* Link start */}
          <Segment className="header-line" />
          <Segment className="link-area5">
            <Grid centered className="center aligned content">
              <Grid.Row className="header-row">
                <Grid.Column width={2}>
                  <Button onClick={this.props.close} className="close-area">
                    <Image src="/smsk-front/×.svg" />
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
                    {title}
                  </Header>
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </Segment>
          {/* Link end */}

          {/* 詳細 start */}
          <Segment
            style={{
              border: "none",
              margin: "0px",
              paddingTop: "0px",
              overflow: "auto",
              height: this.window_innerHeight - 80 + "px"
            }}
          >
            {form}
            <div style={{ height: "100px" }} />
          </Segment>
          {/* 詳細 end */}

          {/* 下部エリア start */}
          <Segment basic className="center aligned content fam-fotter-area">
            <Grid>
              <Grid.Row>
                <Grid.Column
                  width={16}
                  className="aligned content fam-fotter-style"
                  style={{ marginTop: "16px" }}
                >
                  <SubmitField
                    inputClassName="btn font-family editinfo-fotter-btn fotter-btn-style centered"
                    onClick={this.onClickSubmit}
                    value="保存"
                  />
                </Grid.Column>
              </Grid.Row>
            </Grid>
            <div style={{ height: "200px" }} />
          </Segment>
          {/* 下部エリア end */}
        </AutoForm>
      </React.Fragment>
    );
    /// Sys - AutoForm - layout --
  }
}

/// Custom - View - tracker
export const Edit_Office = withTracker(() => {
  /// Custom - Collection - subscribe
  const handles = [
    //    Meteor.subscribe(
    //      Maps_Offices_Collection._name,
    //      Session.get("Users_Groups_id")
    //    )
  ];
  const loading = handles.some(handle => !handle.ready());
  console.log(new Date().getTime(), "Edit_Offices loading", loading);

  const doc = Maps_Offices_Collection.findOne({ _deleted: null }) || {};

  return {
    ComponentInfo: MapsSP_Consumers_Detail_ComponentInfo,
    doc: doc,
    loading: loading
  };
  /// Custom - Collection - subscribe --
})(_Edit_Office);
/// Custom - View - tracker --
