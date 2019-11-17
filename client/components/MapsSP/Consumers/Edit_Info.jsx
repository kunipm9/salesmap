/// Sys - AutoForm
import { Session } from "meteor/session";
import React from "react";
import AutoForm from "uniforms/AutoForm";
import AutoFields from "@imports/ui/uniforms-material/AutoFields";
import AutoField from "@imports/ui/uniforms-material/AutoField";
import ListFieldStyled from "@imports/ui/uniforms-material/styled/ListField";
import { ListAddFieldCustom } from "@imports/ui/uniforms-material/styled/ListAddFieldCustom";
import ListFieldWithoutAdd from "@imports/ui/uniforms-material/styled/ListFieldWithoutAdd";
import ListItemFieldStyled from "@imports/ui/uniforms-material/styled/ListItemField";
import ReadonlyField from "@imports/ui/uniforms-material/styled/ReadonlyField";
import ReadonlyIdField from "@imports/ui/uniforms-material/styled/ReadonlyIdField";
import ReadonlyPlainField from "@imports/ui/uniforms-material/styled/ReadonlyPlainField";
import SubmitField from "@imports/ui/uniforms/SubmitField";
import ErrorsField from "@imports/ui/uniforms-material/ErrorsField";
import TextField from "@imports/ui/uniforms/TextField";
import BoolField from "@imports/ui/uniforms/styled/BoolField";
import Update from "@imports/ui/crud/Update";
/// Sys - AutoForm --

import _ from "lodash";
import { Sel_Company } from "./Sel_Company";
import { Add_Company } from "./Add_Company";
import { Sel_Association } from "./Sel_Association";
import { Add_Association } from "./Add_Association";
import { Sel_Introducer } from "./Sel_Introducer";
import { Add_Introducer } from "./Add_Introducer";
import { Sel_Introduction } from "./Sel_Introduction";
import { Add_Introduction } from "./Add_Introduction";
import { Add_GetDonation } from "./Add_GetDonation";
import { Add_GetGift } from "./Add_GetGift";
import { Detail_Images } from "./Detail_Images";
import { setCurrentFormName, getField } from "@imports/api/lib/CollectionUtils";

// import start
import { Segment } from "semantic-ui-react";
import { Grid } from "semantic-ui-react";
import { Header } from "semantic-ui-react";
import { Item } from "semantic-ui-react";

import { Button } from "semantic-ui-react";
import { Image } from "semantic-ui-react";
import { Dropdown } from "semantic-ui-react";

import { MDBModalBody } from "mdbreact";
import { MDBModalW } from "../lib/MDBModalW";

/// Custom - AutoForm - collection
import { Maps_Consumers_Collection } from "@imports/api/Maps/Consumers_Collection";
console.assert(
  Maps_Consumers_Collection,
  "Maps_Consumers_Collection is undefined."
);
import { Maps_Companys_Collection } from "@imports/api/Maps/Companys_Collection";
console.assert(
  Maps_Companys_Collection,
  "Maps_Companys_Collection is undefined."
);
import { Maps_Associations_Collection } from "@imports/api/Maps/Associations_Collection";
console.assert(
  Maps_Associations_Collection,
  "Maps_Associations_Collection is undefined."
);
/// Custom - AutoForm - collection --

/// Custom - LocalStorage
import { Maps_ConsumersSum_Collection } from "@imports/api/Maps/ConsumersSum_Collection";
/// Custom - LocalStorage --

/// Sys - Network
import { Random } from "meteor/random";
import { Persister } from "@imports/api/lib/persist-method";
/// Sys - Network --

/// Sys - Role
import { checkSystemRole, checkAppRole } from "@imports/ui/crud/checkRole";
/// Sys - Role --

import { getImageLink } from "../lib/utils";

/// Custom - Role - check permission
/**
 *
 *
 * @param {*} mode
 * @returns
 */
export const MapsSP_Consumers_Update_ComponentInfo = mode => {
  if (!checkAppRole("MapsSP.Consumers", mode)) {
    return null;
  }

  if (checkSystemRole()) {
    return null;
  }

  return { title: "MapsSP/Consumers/Update", path: "/MapsSP/Consumers/Update" };
};
/// Custom - Role - check permission --

/**
 *
 *
 * @export
 * @class Edit_Info
 * @extends {Update}
 */
export class Edit_Info extends Update {
  "use strict";

  /**
   *Creates an instance of Edit_Info.
   * @param {*} props
   * @memberof Edit_Info
   */
  constructor(props) {
    super(props);

    if (!props) {
      return;
    }

    /// Custom - Role - check permission
    this.ComponentInfo = MapsSP_Consumers_Update_ComponentInfo;
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

    this.state.showSel_Company = false;
    this.state.showAdd_Company = false;
    this.state.showSel_Association = false;
    this.state.showAdd_Association = false;
    this.state.showSel_Introducer = false;
    this.state.showSel_Introduction = false;
    this.state.showAdd_GetDonation = false;
    this.state.showAdd_GetGift = false;
    this.state.showDetail_Images = false;

    this.state.doc = _.cloneDeep(this.props.doc);
    if (!this.state.doc.identity) {
      this.state.doc.identity = {
        name: "",
        kana: "",
        sex: "male"
      };
    }
    if (!this.state.doc.contact) {
      this.state.doc.contact = {};
    }
    if (!this.state.doc.contact.tels) {
      this.state.doc.contact.tels = [];
    }
    if (this.state.doc.contact.tels.length == 0) {
      this.state.doc.contact.tels.push({ tel: "" });
    }
    if (!this.state.doc.contact.faxs) {
      this.state.doc.contact.faxs = [];
    }
    if (this.state.doc.contact.faxs.length == 0) {
      this.state.doc.contact.faxs.push({ fax: "" });
    }
    if (!this.state.doc.contact.emails) {
      this.state.doc.contact.emails = [];
    }
    if (this.state.doc.contact.emails.length == 0) {
      this.state.doc.contact.emails.push({ address: "" });
    }

    this.state.rank = this.props.doc.rank;
    this.state.familyPrimary = this.props.doc.familyPrimary;
    this.state.imageDoc = {
      _id: _.get(this.props.doc, "_id"),
      images: _.get(this.props.doc, "images")
    };
    this.state.newDocCompany = {};
    this.state.newDocAssociation = {};
    this.state.newDocIntroducer = {};
    this.state.newDocIntroduction = {};

    this.submit = this.submit.bind(this);
    this.securityCheck = this.securityCheck.bind(this);

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
   * @memberof Edit_Info
   */
  securityCheck() {
    if (this.ComponentInfo) {
      if (!this.ComponentInfo("update")) {
        console.error(`Security check.`);
        this.props.closeEdit_Info();
      }
    }
  }

  /// Application - Save
  /**
   *
   *
   * @param {*} doc
   * @memberof Edit_Info
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
    this.props.updateDoc(doc);
    /// Custom - localCollection - update --

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
   * @memberof MapsSP_Consumers_Detail
   */
  onClickSel_Company = () => {
    this.setState({ showSel_Company: true });
  };

  /**
   *
   *
   * @memberof MapsSP_Consumers_Detail
   */
  toggleSel_Company = () => {
    this.setState({ showSel_Company: !this.state.showSel_Company });
  };

  /**
   *
   *
   * @memberof MapsSP_Consumers_Detail
   */
  closeSel_Company = () => {
    this.setState({ showSel_Company: false, newDocCompany: {} });
  };

  /**
   *
   *
   * @memberof MapsSP_Consumers_Detail
   */
  onClickAdd_Company = () => {
    this.setState({ showSel_Company: false, showAdd_Company: true });
  };

  /**
   *
   *
   * @memberof MapsSP_Consumers_Detail
   */
  toggleAdd_Company = () => {
    this.setState({ showAdd_Company: !this.state.showAdd_Company });
  };

  /**
   *
   *
   * @memberof MapsSP_Consumers_Detail
   */
  closeAdd_Company = newDoc => {
    this.setState({
      showAdd_Company: false,
      showSel_Company: true,
      newDocCompany: newDoc
    });
  };

  /**
   *
   *
   * @memberof MapsSP_Consumers_Detail
   */
  onClickSel_Association = () => {
    this.setState({ showSel_Association: true });
  };

  /**
   *
   *
   * @memberof MapsSP_Consumers_Detail
   */
  toggleSel_Association = () => {
    this.setState({ showSel_Association: !this.state.showSel_Association });
  };

  /**
   *
   *
   * @memberof MapsSP_Consumers_Detail
   */
  closeSel_Association = () => {
    this.setState({ showSel_Association: false, newDocAssociation: {} });
  };

  /**
   *
   *
   * @memberof MapsSP_Consumers_Detail
   */
  onClickAdd_Association = () => {
    this.setState({ showSel_Association: false, showAdd_Association: true });
  };

  /**
   *
   *
   * @memberof MapsSP_Consumers_Detail
   */
  toggleAdd_Association = () => {
    this.setState({ showAdd_Association: !this.state.showAdd_Association });
  };

  /**
   *
   *
   * @memberof MapsSP_Consumers_Detail
   */
  closeAdd_Association = newDoc => {
    this.setState({
      showAdd_Association: false,
      showSel_Association: true,
      newDocAssociation: newDoc
    });
  };

  /**
   *
   *
   * @memberof MapsSP_Consumers_Detail
   */
  onClickSel_Introducer = () => {
    this.setState({ showSel_Introducer: true });
  };

  /**
   *
   *
   * @memberof MapsSP_Consumers_Detail
   */
  toggleSel_Introducer = () => {
    this.setState({ showSel_Introducer: !this.state.showSel_Introducer });
  };

  /**
   *
   *
   * @memberof MapsSP_Consumers_Detail
   */
  closeSel_Introducer = () => {
    this.setState({ showSel_Introducer: false, newDocIntroducer: {} });
  };

  /**
   *
   *
   * @memberof MapsSP_Consumers_Detail
   */
  onClickAdd_Introducer = () => {
    this.setState({ showSel_Introducer: false, showAdd_Introducer: true });
  };

  /**
   *
   *
   * @memberof MapsSP_Consumers_Detail
   */
  toggleAdd_Introducer = () => {
    this.setState({ showAdd_Introducer: !this.state.showAdd_Introducer });
  };

  /**
   *
   *
   * @memberof MapsSP_Consumers_Detail
   */
  closeAdd_Introducer = newDoc => {
    this.setState({
      showAdd_Introducer: false,
      showSel_Introducer: true,
      newDocIntroducer: newDoc
    });
  };

  /**
   *
   *
   * @memberof MapsSP_Consumers_Detail
   */
  onClickSel_Introduction = () => {
    this.setState({ showSel_Introduction: true });
  };

  /**
   *
   *
   * @memberof MapsSP_Consumers_Detail
   */
  toggleSel_Introduction = () => {
    this.setState({ showSel_Introduction: !this.state.showSel_Introduction });
  };

  /**
   *
   *
   * @memberof MapsSP_Consumers_Detail
   */
  closeSel_Introduction = () => {
    this.setState({ showSel_Introduction: false, newDocIntroduction: {} });
  };

  /**
   *
   *
   * @memberof MapsSP_Consumers_Detail
   */
  onClickAdd_Introduction = () => {
    this.setState({ showSel_Introduction: false, showAdd_Introduction: true });
  };

  /**
   *
   *
   * @memberof MapsSP_Consumers_Detail
   */
  toggleAdd_Introduction = () => {
    this.setState({ showAdd_Introduction: !this.state.showAdd_Introduction });
  };

  /**
   *
   *
   * @memberof MapsSP_Consumers_Detail
   */
  closeAdd_Introduction = newDoc => {
    this.setState({
      showAdd_Introduction: false,
      showSel_Introduction: true,
      newDocIntroduction: newDoc
    });
  };

  /**
   *
   *
   * @memberof MapsSP_Consumers_Detail
   */
  onClickAdd_GetDonation = () => {
    this.setState({ showAdd_GetDonation: true });
  };

  /**
   *
   *
   * @memberof MapsSP_Consumers_Detail
   */
  toggleAdd_GetDonation = () => {
    this.setState({ showAdd_GetDonation: !this.state.showAdd_GetDonation });
  };

  /**
   *
   *
   * @memberof MapsSP_Consumers_Detail
   */
  closeAdd_GetDonation = () => {
    this.setState({ showAdd_GetDonation: false });
  };

  /**
   *
   *
   * @memberof MapsSP_Consumers_Detail
   */
  onClickAdd_GetGift = () => {
    this.setState({ showAdd_GetGift: true });
  };

  /**
   *
   *
   * @memberof MapsSP_Consumers_Detail
   */
  toggleAdd_GetGift = () => {
    this.setState({ showAdd_GetGift: !this.state.showAdd_GetGift });
  };

  /**
   *
   *
   * @memberof MapsSP_Consumers_Detail
   */
  closeAdd_GetGift = () => {
    this.setState({ showAdd_GetGift: false });
  };

  /**
   *
   *
   * @memberof MapsSP_Consumers_Detail
   */
  toggleImages = () => {
    this.setState({ showDetail_Images: !this.state.showDetail_Images });
  };

  /**
   *
   *
   * @memberof MapsSP_Consumers_Detail
   */
  closeDetail_Images = () => {
    this.setState({ showDetail_Images: false });
  };

  /**
   *
   *
   * @memberof Sel_Family
   */
  onClickFamilyPrimary = () => {
    this.state.doc.familyPrimary = !this.state.familyPrimary;
    this.updateDoc(this.state.doc, ["familyPrimary"]);
    this.setState({ familyPrimary: this.state.doc.familyPrimary });
  };

  /**
   *
   *
   * @memberof Sel_Family
   */
  onChangeRank = (e, { name, value }) => {
    this.state.doc.rank = value;
    this.updateDoc(this.state.doc, ["rank"]);
    this.setState({ rank: this.state.doc.rank });
  };

  /**
   *
   *
   * @memberof MapsSP_Consumers_Detail
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
   * @memberof MapsSP_Consumers_Detail
   */
  updateImageDoc = doc => {
    this.setState({ imageDoc: doc });
  };

  /**
   *
   *
   * @returns
   * @memberof Edit_Info
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
                  <Button
                    onClick={this.props.closeEdit_Info}
                    className="close-area"
                  >
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
            style={{ height: this.window_innerHeight - 67 + "px" }}
          >
            <Segment padded className="map8-area">
              <Item>
                <Grid
                  centered
                  className="center aligned content"
                  style={{ height: "230px" }}
                >
                  <Grid.Row
                    centered
                    style={{
                      paddingBottom: "0px",
                      height: "144px",
                      marginBottom: "10px"
                    }}
                  >
                    <Grid.Column>
                      <Image
                        onClick={() => {
                          this.setState({ showDetail_Images: true });
                        }}
                        src={getImageLink(
                          this.state.imageDoc,
                          _.get(this.state.doc, "identity.sex") == "male"
                            ? window.$GLOBAL$.__SVG__["登録アカウント一覧用プロフアイコン"]
                            : window.$GLOBAL$.__SVG__["個人（女性）"]
                        )}
                        size="small"
                        centered
                        style={{
                          width: "90px"
                        }}
                      />
                      <Image
                        src={window.$GLOBAL$.__SVG__["プロフカメラ"]}
                        style={{
                          bottom: "49px",
                          left: "187px"
                        }}
                      />
                      <Dropdown
                        placeholder="ランク"
                        selection
                        style={{
                          marginTop: "10px",
                          marginLeft: "93px",
                          minWidth: "160px",
                          bottom: "43px"
                        }}
                        id="rank-dropdown"
                        value={this.state.rank}
                        onChange={this.onChangeRank}
                        options={window.$GLOBAL$.__ConsumersView__.ranks
                          .map((r, i) => {
                            if (r) {
                              r.id = i;
                            }
                            return r;
                          })
                          .filter(r => r && r.rank)
                          .map(r => {
                            console.log(
                              "Dropdown",
                              Number(this.state.doc.rank)
                            );
                            return {
                              text: r.rank,
                              value: String(r.id),
                              key: String(r.id)
                            };
                          })}
                      />
                    </Grid.Column>
                  </Grid.Row>
                  <Grid.Row
                    onClick={this.onClickFamilyPrimary}
                    style={{ marginTop: "25px", bottom: "17px" }}
                  >
                    <Image
                      src={
                        this.state.familyPrimary
                          ? window.$GLOBAL$.__SVG__["ブクマチェックon"]
                          : window.$GLOBAL$.__SVG__["ブクマチェックoff"]
                      }
                      style={{ marginLeft: "5px", marginRight: "15px" }}
                    />
                    <p className="font-family bookmodal-font">家主に設定する</p>
                  </Grid.Row>
                </Grid>
              </Item>

              <AutoField name="identity.name" />

              <AutoField name="identity.kana" />

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

              <ListFieldStyled name="contact.emails">
                <ListItemFieldStyled name="$">
                  <AutoField name="address" />
                </ListItemFieldStyled>
              </ListFieldStyled>

              <AutoField name="identity.sex" />

              <AutoField name="identity.birthDay" />

              <AutoField name="identity.age" />

              <ListFieldWithoutAdd name="getDonations">
                <ListItemFieldStyled name="$">
                  <span>・</span>
                  <ReadonlyPlainField name="donation.amount" />
                  <span>円&nbsp;(</span>
                  <ReadonlyPlainField name="donation.modifiedAt" />
                  <span>
                    )<br />
                    &nbsp;&nbsp;&nbsp;→
                  </span>
                  <ReadonlyPlainField name="donation.memo" />
                </ListItemFieldStyled>
              </ListFieldWithoutAdd>
              <ListAddFieldCustom onClick={this.onClickAdd_GetDonation} />

              <ListFieldWithoutAdd name="getGifts">
                <ListItemFieldStyled name="$">
                  <span>・</span>
                  <ReadonlyPlainField name="gift.itemName" />
                  <span>&nbsp;(</span>
                  <ReadonlyPlainField name="gift.modifiedAt" />
                  <span>
                    )<br />
                    &nbsp;&nbsp;&nbsp;→
                  </span>
                  <ReadonlyPlainField name="gift.memo" />
                </ListItemFieldStyled>
              </ListFieldWithoutAdd>
              <ListAddFieldCustom onClick={this.onClickAdd_GetGift} />

              <ListFieldWithoutAdd name="introducers">
                <ListItemFieldStyled name="$">
                  <ReadonlyIdField
                    name="introducer.Maps_Consumers_id"
                    collection={this.Collection}
                  />
                  <span>&nbsp;&nbsp;(関係 : </span>
                  <ReadonlyField name="introducer.relationship" />
                  <span>)</span>
                </ListItemFieldStyled>
              </ListFieldWithoutAdd>
              <ListAddFieldCustom onClick={this.onClickSel_Introducer} />

              <ListFieldWithoutAdd name="introductions">
                <ListItemFieldStyled name="$">
                  <ReadonlyIdField
                    name="introduction.Maps_Consumers_id"
                    collection={this.Collection}
                  />
                  <span>&nbsp;&nbsp;(関係 : </span>
                  <ReadonlyField name="introduction.relationship" />
                  <span>)</span>
                </ListItemFieldStyled>
              </ListFieldWithoutAdd>
              <ListAddFieldCustom onClick={this.onClickSel_Introduction} />

              <ListFieldWithoutAdd name="companys">
                <ListItemFieldStyled name="$">
                  <ReadonlyIdField
                    name="company.Maps_Company_id"
                    collection={Maps_Companys_Collection}
                  />
                  <span>
                    <br />
                  </span>
                  <ReadonlyField name="company.title" />
                </ListItemFieldStyled>
              </ListFieldWithoutAdd>
              <ListAddFieldCustom onClick={this.onClickSel_Company} />

              <ListFieldWithoutAdd name="associations">
                <ListItemFieldStyled name="$">
                  <ReadonlyIdField
                    name="association.Maps_Association_id"
                    collection={Maps_Associations_Collection}
                  />
                  <span>
                    <br />
                  </span>
                  <ReadonlyField name="association.title" />
                </ListItemFieldStyled>
              </ListFieldWithoutAdd>
              <ListAddFieldCustom onClick={this.onClickSel_Association} />

              <AutoField name="mailDestination" />

              <AutoField name="identity.dateOfDeath" />

              <div style={{ display: "none" }}>
                <AutoField name="images" />
                <TextField name="rank" />
                <BoolField name="familyPrimary" />
              </div>

              <ErrorsField />
            </Segment>
          </Segment>
          {/* スクロールエリア end */}

          {/* 下部エリア start */}
          <Segment
            basic
            className="center aligned content fam-fotter-area"
            style={{ zIndex: "2" }}
          >
            <Grid>
              <Grid.Row>
                <Grid.Column
                  width={16}
                  className="aligned content fam-fotter-style"
                  style={{ marginTop: "16px" }}
                >
                  <SubmitField
                    inputClassName="btn font-family editinfo-fotter-btn fotter-btn-style centered"
                    value="追加"
                  />
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </Segment>
          {/* 下部エリア end */}
        </AutoForm>

        <MDBModalW
          size="large"
          isOpen={this.state.showSel_Company}
          toggle={this.toggleSel_Company}
          className="m-0 p-0"
          animation="left"
        >
          <MDBModalBody className="m-0 p-0">
            <Sel_Company
              searchPlaceholder="企業名を検索"
              onClickAdd_Base={this.onClickAdd_Company}
              closeSel_Base={this.closeSel_Company}
              doc={this.state.doc}
              newDoc={this.state.newDocCompany}
              updateDoc={this.updateDoc}
            />
          </MDBModalBody>
        </MDBModalW>

        <MDBModalW
          size="large"
          isOpen={this.state.showAdd_Company}
          toggle={this.toggleAdd_Company}
          className="m-0 p-0"
          animation="left"
        >
          <MDBModalBody className="m-0 p-0">
            <Add_Company
              title="企業を追加"
              close={id => this.closeAdd_Company(id)}
            />
          </MDBModalBody>
        </MDBModalW>

        <MDBModalW
          size="large"
          isOpen={this.state.showSel_Association}
          toggle={this.toggleSel_Association}
          className="m-0 p-0"
          animation="left"
        >
          <MDBModalBody className="m-0 p-0">
            <Sel_Association
              searchPlaceholder="団体名を検索"
              onClickAdd_Base={this.onClickAdd_Association}
              closeSel_Base={this.closeSel_Association}
              doc={this.state.doc}
              newDoc={this.state.newDocAssociation}
              updateDoc={this.updateDoc}
            />
          </MDBModalBody>
        </MDBModalW>

        <MDBModalW
          size="large"
          isOpen={this.state.showAdd_Association}
          toggle={this.toggleAdd_Association}
          className="m-0 p-0"
          animation="left"
        >
          <MDBModalBody className="m-0 p-0">
            <Add_Association
              title="団体を追加"
              close={id => this.closeAdd_Association(id)}
            />
          </MDBModalBody>
        </MDBModalW>

        <MDBModalW
          size="large"
          isOpen={this.state.showSel_Introducer}
          toggle={this.toggleSel_Introducer}
          className="m-0 p-0"
          animation="left"
        >
          <MDBModalBody className="m-0 p-0">
            <Sel_Introducer
              searchPlaceholder="名前を検索"
              onClickAdd_Base={this.onClickAdd_Introducer}
              closeSel_Base={this.closeSel_Introducer}
              doc={this.state.doc}
              newDoc={this.state.newDocIntroducer}
              updateDoc={this.updateDoc}
            />
          </MDBModalBody>
        </MDBModalW>

        <MDBModalW
          size="large"
          isOpen={this.state.showAdd_Introducer}
          toggle={this.toggleAdd_Introducer}
          className="m-0 p-0"
          animation="left"
        >
          <MDBModalBody className="m-0 p-0">
            <Add_Introducer
              title="紹介した人を追加"
              close={doc => this.closeAdd_Introducer(doc)}
            />
          </MDBModalBody>
        </MDBModalW>

        <MDBModalW
          size="large"
          isOpen={this.state.showSel_Introduction}
          toggle={this.toggleSel_Introduction}
          className="m-0 p-0"
          animation="left"
        >
          <MDBModalBody className="m-0 p-0">
            <Sel_Introduction
              searchPlaceholder="名前を検索"
              onClickAdd_Base={this.onClickAdd_Introduction}
              closeSel_Base={this.closeSel_Introduction}
              doc={this.state.doc}
              newDoc={this.state.newDocIntroduction}
              updateDoc={this.updateDoc}
            />
          </MDBModalBody>
        </MDBModalW>

        <MDBModalW
          size="large"
          isOpen={this.state.showAdd_Introduction}
          toggle={this.toggleAdd_Introduction}
          className="m-0 p-0"
          animation="left"
        >
          <MDBModalBody className="m-0 p-0">
            <Add_Introduction
              title="紹介された人を追加"
              close={doc => this.closeAdd_Introduction(doc)}
            />
          </MDBModalBody>
        </MDBModalW>

        <MDBModalW
          size="large"
          isOpen={this.state.showAdd_GetDonation}
          toggle={this.toggleAdd_GetDonation}
          className="m-0 p-0"
          animation="left"
        >
          <MDBModalBody className="m-0 p-0">
            <Add_GetDonation
              title="献金を追加"
              close={this.closeAdd_GetDonation}
              doc={this.state.doc}
              updateDoc={this.updateDoc}
            />
          </MDBModalBody>
        </MDBModalW>

        <MDBModalW
          size="large"
          isOpen={this.state.showAdd_GetGift}
          toggle={this.toggleAdd_GetGift}
          className="m-0 p-0"
          animation="left"
        >
          <MDBModalBody className="m-0 p-0">
            <Add_GetGift
              title="頂き物を追加"
              close={this.closeAdd_GetGift}
              doc={this.state.doc}
              updateDoc={this.updateDoc}
            />
          </MDBModalBody>
        </MDBModalW>

        <MDBModalW
          size="large"
          isOpen={this.state.showDetail_Images}
          toggle={this.toggleImages}
          className="m-0 p-0"
          animation="left"
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
