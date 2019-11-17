/// Sys - AutoForm
import { Session } from "meteor/session";
import React from "react";
import AutoForm from "uniforms/AutoForm";
import AutoFields from "@imports/ui/uniforms-material/AutoFields";
import AutoField from "@imports/ui/uniforms-material/AutoField";
import ListFieldStyled from "@imports/ui/uniforms-material/styled/ListField";
import ListItemFieldStyled from "@imports/ui/uniforms-material/styled/ListItemField";
import ReadonlyIdField from "@imports/ui/uniforms-material/styled/ReadonlyIdField";
import { ListAddFieldCustom } from "@imports/ui/uniforms-material/styled/ListAddFieldCustom";
import SubmitField from "@imports/ui/uniforms/SubmitField";
import ErrorsField from "@imports/ui/uniforms-material/ErrorsField";
import Update from "@imports/ui/crud/Update";
/// Sys - AutoForm --

import _ from "lodash";
import { setCurrentFormName, getField } from "@imports/api/lib/CollectionUtils";
import { Sel_Representative } from "./Sel_Representative";

// import start
import { Segment } from "semantic-ui-react";
import { Grid } from "semantic-ui-react";
import { Header } from "semantic-ui-react";
import { Item } from "semantic-ui-react";

import { Button } from "semantic-ui-react";
import { Image } from "semantic-ui-react";

import { MDBModalBody } from "mdbreact";
import { MDBModalW } from "../lib/MDBModalW";

/// Custom - AutoForm - collection
import { Maps_Associations_Collection } from "@imports/api/Maps/Associations_Collection";
console.assert(
  Maps_Associations_Collection,
  "Maps_Associations_Collection is undefined."
);

import { Maps_Consumers_Collection } from "@imports/api/Maps/Consumers_Collection";
console.assert(
  Maps_Consumers_Collection,
  "Maps_Consumers_Collection is undefined."
);
/// Custom - AutoForm - collection --

/// Sys - Network
import { Random } from "meteor/random";
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
export const MapsSP_Associations_Update_ComponentInfo = mode => {
  if (!checkAppRole("MapsSP.Companys", mode)) {
    return null;
  }

  if (checkSystemRole()) {
    return null;
  }

  return {
    title: "MapsSP/Associations/Update",
    path: "/MapsSP/Associations/Update"
  };
};
/// Custom - Role - check permission --

/**
 *
 *
 * @export
 * @class Edit
 * @extends {Update}
 */
export class Edit extends Update {
  "use strict";

  /**
   *Creates an instance of Edit.
   * @param {*} props
   * @memberof Edit
   */
  constructor(props) {
    super(props);

    if (!props) {
      return;
    }

    /// Custom - Role - check permission
    this.ComponentInfo = MapsSP_Associations_Update_ComponentInfo;
    /// Custom - Role - check permission --

    /// Custom - AutoForm - rebuild field
    this.Collection = Maps_Associations_Collection;
    this.Form_name = this.Collection._name;
    /// Custom - AutoForm - rebuild field --

    /// Custom - LocalStorage
    /// Custom - AutoForm - rebuild field
    this.Consumers_Collection = {
      _name: "Maps_Consumers",
      docs: {},
      simpleSchema: Maps_Consumers_Collection.simpleSchema(),
      dispTitle: Maps_Consumers_Collection.dispTitle
    };
    /// Custom - AutoForm - rebuild field --

    /// Sys - AutoForm - rebuild field !!!!!!!!!!
    this.postConstructor();
    /// Sys - AutoForm - rebuild field !!!!!!!!!! --

    this.submit = this.submit.bind(this);
    this.securityCheck = this.securityCheck.bind(this);

    this.showSel_Representative = false;

    /// Sys - AutoForm - rebuild field
    this.postConstructor();
    this.state.disabled = false;
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
   * @memberof Edit
   */
  onClickSel_Representative = () => {
    this.setState({ showSel_Representative: true });
  };

  /**
   *
   *
   * @memberof Edit
   */
  toggleSel_Representative = () => {
    this.setState({
      showSel_Representative: !this.state.showSel_Representative
    });
  };

  /**
   *
   *
   * @memberof Edit
   */
  closeSel_Representative = () => {
    this.setState({ showSel_Representative: false });
  };

  /**
   *
   *
   * @memberof Edit
   */
  updateDoc = (doc, updateList) => {
    for (let i in updateList) {
      _.set(this.props.doc, updateList[i], _.get(doc, updateList[i]));

      setTimeout(() => {
        setCurrentFormName(this.Form_name);
        const field = getField(updateList[i]);
        const value = _.get(doc, updateList[i]);
        field.onChange(value);
      }, 100 * (i + 1));
    }
  };

  /**
   *
   *
   * @memberof Edit
   */
  securityCheck() {
    if (this.ComponentInfo) {
      if (!this.ComponentInfo("update")) {
        console.error(`Security check.`);
        this.props.closeEdit();
      }
    }
  }

  /// Application - Save
  /**
   *
   *
   * @param {*} doc
   * @memberof Edit
   */
  submit(doc) {
    /// Sys - AutoForm - update
    const Users_Groups_id = Session.get("Users_Groups_id");

    console.assert(
      this.ComponentInfo("update"),
      "ComponentInfo('update') is undefined"
    );

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
        this.props.closeEdit
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
        this.props.closeEdit
      );
    }
    /// Sys - AutoForm - update --

    Bert.alert({
      type: "success",
      hideDelay: 10000,
      message: "情報を更新しました"
    });
  }
  /// Application - Save --

  /**
   *
   *
   * @returns
   * @memberof Edit
   */
  render() {
    if (!this.props.doc || !this.props.doc._id) {
      return <React.Fragment />;
    }

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
          {/* Link start */}
          <Segment
            style={{ border: "none", marginBottom: "0px", borderRadius: "0px" }}
          >
            <Grid centered className="center aligned content">
              <Grid.Row centered>
                <Grid.Column width={2}>
                  <Button onClick={this.props.closeEdit} className="close-area">
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
                  ></Header>
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </Segment>
          {/* Link end */}

          {/* スクロールエリア start */}
          <Segment
            className="scroll-area"
            style={{ height: this.window_innerHeight - 0 + "px" }}
          >
            <Segment padded className="map8-area">
              <AutoField name="name" />
              <AutoField name="kana" />

              <ReadonlyIdField
                name="representative.Maps_Consumers_id"
                collection={this.Consumers_Collection}
              />
              <ListAddFieldCustom onClick={this.onClickSel_Representative} />

              <ListFieldStyled name="contact.tels">
                <ListItemFieldStyled name="$">
                  <AutoField name="tel" />
                </ListItemFieldStyled>
              </ListFieldStyled>

              <AutoField name="url" />

              <AutoFields
                fields={simpleSchema._schemaKeys.filter(f =>
                  f.startsWith("residenceAddress.address.")
                )}
              />

              <ErrorsField />

              {/* 下部エリア start */}
              <Item className="footer-padding">
                <Grid.Row>
                  <Grid.Column
                    width={16}
                    className="centerd content editinfo-fotter-style"
                  >
                    <SubmitField
                      inputClassName="btn font-family editinfo-fotter-btn fotter-btn-style centered"
                      value="追加"
                    />
                  </Grid.Column>
                </Grid.Row>
              </Item>
              {/* 下部エリア end */}
            </Segment>
          </Segment>
          {/* スクロールエリア end */}
        </AutoForm>

        <MDBModalW
          size="large"
          isOpen={this.state.showSel_Representative}
          toggle={this.toggleSel_Representative}
          className="m-0 p-0"
          animation="left"
        >
          <MDBModalBody className="m-0 p-0">
            <Sel_Representative
              searchPlaceholder="代表者を検索"
              closeSel_Base={this.closeSel_Representative}
              doc={this.state.doc}
              updateDoc={this.updateDoc}
              onClickAdd_Base={() => {}}
            />
          </MDBModalBody>
        </MDBModalW>
      </React.Fragment>
    );
    /// Sys - AutoForm - layout --
  }
}
