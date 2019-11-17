/// Sys - AutoForm
import { Session } from "meteor/session";
import React from "react";
import AutoForm from "uniforms/AutoForm";
import AutoField from "@imports/ui/uniforms-material/AutoField";
import { ListAddFieldCustom } from "@imports/ui/uniforms-material/styled/ListAddFieldCustom";
import ListFieldWithoutAdd from "@imports/ui/uniforms-material/styled/ListFieldWithoutAdd";
import ListItemFieldStyled from "@imports/ui/uniforms-material/styled/ListItemField";
import SubmitField from "@imports/ui/uniforms/SubmitField";
import ErrorsField from "@imports/ui/uniforms-material/ErrorsField";
import Update from "@imports/ui/crud/Update";
/// Sys - AutoForm --

import _ from "lodash";
import { Detail_Images } from "./Detail_Images";

// import start
import { Segment } from "semantic-ui-react";
import { Grid } from "semantic-ui-react";
import { Header } from "semantic-ui-react";
import { Item } from "semantic-ui-react";

import { Button } from "semantic-ui-react";
import { Image } from "semantic-ui-react";
import { MDBModalBody } from "mdbreact";
import { MDBModalW } from "../../lib/MDBModalW";

/// Custom - AutoForm - collection
import { Maps_Pins_Collection } from "@imports/api/Maps/Pins_Collection";
console.assert(Maps_Pins_Collection, "Maps_Pins_Collection is undefined.");
/// Custom - AutoForm - collection --

/// Custom - LocalStorage
import { Maps_PinsSum_Collection } from "@imports/api/Maps/PinsSum_Collection";
/// Custom - LocalStorage --

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
export const MapsSP_Pins_Update_ComponentInfo = mode => {
  if (!checkAppRole("MapsSP.Pins", mode)) {
    return null;
  }

  if (checkSystemRole()) {
    return null;
  }

  return { title: "MapsSP/Pins/Update", path: "/MapsSP/Pins/Update" };
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
    this.ComponentInfo = MapsSP_Pins_Update_ComponentInfo;
    /// Custom - Role - check permission --

    /// Custom - LocalStorage
    /// Custom - AutoForm - rebuild field
    this.Collection = {
      _name: "Maps_Pins",
      docs: {},
      simpleSchema: Maps_Pins_Collection.simpleSchema(),
      dispTitle: Maps_Pins_Collection.dispTitle
    };
    this.Form_name = this.Collection._name;
    /// Custom - AutoForm - rebuild field --
    this.SumCollection = Maps_PinsSum_Collection;
    /** @type {any[]} */
    this.CollectionList = [];
    /// Custom - LocalStorage --

    /// Sys - AutoForm - rebuild field !!!!!!!!!!
    this.postConstructor();
    /// Sys - AutoForm - rebuild field !!!!!!!!!! --

    this.state.showDetail_Images = false;

    this.state.doc = this.props.doc;
    _.set(this.state.doc, "staff", Meteor.user().profile.username);

    if (!this.state.doc.executedAt) {
      this.state.doc.executedAt = new Date().getTime();
    }

    if (!this.state.doc._id) {
      _.set(this.state.doc, "title", "");
      _.set(this.state.doc, "residenceAddress.address", this.props.address);
      _.set(this.state.doc, "residenceAddress.location", this.props.location);
    }

    if (!this.state.doc.cat1) {
      this.state.doc.cat1 = Session.get("MapsSP.Maps.Pins.Editor.cat1");
      this.state.doc.cat2 = Session.get("MapsSP.Maps.Pins.Editor.cat2");
    }

    this.state.imageDoc = {
      _id: _.get(this.props.doc, "_id"),
      images: _.get(this.props.doc, "images")
    };

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
   * @memberof Update
   */
  UNSAFE_componentWillReceiveProps(nextProps) {
    _.set(this.state.doc, "residenceAddress.address", nextProps.address);
    _.set(this.state.doc, "residenceAddress.location", nextProps.location);
    this.setState({ doc: this.state.doc });
  }

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
      // Pin No.
      let lastNo = 0;
      Object.keys(window.$GLOBAL$.Collection[this.Collection._name]).map(
        _id => {
          const p = window.$GLOBAL$.Collection[this.Collection._name][_id];
          lastNo = lastNo < p.no ? p.no : lastNo;
        }
      );
      lastNo++;
      doc.no = lastNo;

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

    /// Custom - localCollection - update
    window.$GLOBAL$.Collection[this.Collection._name][doc._id] = doc;
    /// Custom - localCollection - update --

    Session.setPersistent("MapsSP.Maps.Pins.Editor.cat1", doc.cat1);
    Session.setPersistent("MapsSP.Maps.Pins.Editor.cat2", doc.cat2);

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
   * @memberof MapsSP_Pins_Detail
   */
  toggleImages = () => {
    this.setState({ showDetail_Images: !this.state.showDetail_Images });
  };

  /**
   *
   *
   * @memberof MapsSP_Pins_Detail
   */
  closeDetail_Images = () => {
    this.setState({ showDetail_Images: false });
  };

  /**
   *
   *
   * @memberof MapsSP_Pins_Detail
   */
  updateImageDoc = doc => {
    this.setState({ imageDoc: doc });
  };

  /**
   *
   *
   * @returns
   * @memberof Edit
   */
  render() {
    if (!this.props.doc) {
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
          model={this.state.doc}
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
                    <Image src={window.$GLOBAL$.__SVG__["×"]} />
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
              <AutoField name="cat1" />
              <AutoField name="cat2" />
              <AutoField name="num" />
              <AutoField name="executedAt" />
              <AutoField name="staff" />
              <AutoField name="memo" />

              <ListFieldWithoutAdd name="images">
                <ListItemFieldStyled name="$">
                  <AutoField name="Images_id" />
                </ListItemFieldStyled>
              </ListFieldWithoutAdd>
              <ListAddFieldCustom
                onClick={() => this.setState({ showDetail_Images: true })}
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
                      disabled={!_.get(this.props, "location")}
                      inputClassName="btn font-family editinfo-fotter-btn fotter-btn-style centered"
                      value="登録"
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
          isOpen={this.state.showDetail_Images}
          toggle={this.toggleImages}
          className="m-0 p-0"
        >
          <MDBModalBody className="m-0 p-0">
            <Detail_Images
              closeDetail_Images={this.closeDetail_Images}
              doc={this.state.imageDoc}
              updateDoc={this.updateDoc}
              updateImageDoc={this.updateImageDoc}
            />
          </MDBModalBody>
        </MDBModalW>
      </React.Fragment>
    );
    /// Sys - AutoForm - layout --
  }
}
