/// Sys - Tabular
import React from "react";
import { Session } from "meteor/session";
import Carousel from "nuka-carousel";
import _ from "lodash";
/// Sys - Tabular --

/// Custom - Collection - selector
import { List_Selector } from "../Consumers/List_Selector";
/// Custom - Collection - selector --

/// Sys - Role
import { checkSystemRole, checkAppRole } from "@imports/ui/crud/checkRole";
/// Sys - Role --

import { MapsSP_Consumers_List } from "../Consumers/List";
import { MapsSP_Companys_List } from "../Companys/List";
import { MapsSP_Associations_List } from "../Associations/List";

import { Edit_Feedback } from "./HamburgerMenu/Edit_Feedback";
import { View_Office } from "./HamburgerMenu/View_Office";
import { View_AccountList } from "./HamburgerMenu/View_AccountList";
import { View_Whatsnew } from "./HamburgerMenu/View_Whatsnew";
import { View_Setting } from "./HamburgerMenu/View_Setting";

import { View_Tags } from "./View_Tags";
import { View_Ranks } from "./View_Ranks";
import { View_TagSetting } from "./View_TagSetting";

import { Edit_Info } from "../Consumers/Edit_Info";

// import start
import { Segment } from "semantic-ui-react";
import { Grid } from "semantic-ui-react";

import { Header } from "semantic-ui-react";

import { Label } from "semantic-ui-react";
import { Button } from "semantic-ui-react";
import { Icon } from "semantic-ui-react";
import { Image } from "semantic-ui-react";
import { Input } from "semantic-ui-react";
import { Container } from "semantic-ui-react";

import { MDBModalHeader, MDBModalBody } from "mdbreact";
import { MDBModalW } from "../lib/MDBModalW";

import { displayTabs } from "../lib/utils";
// import end

/// Custom - Role - check permission
/**
 *
 *
 * @param {*} mode
 * @returns
 */
export const MapsSP_List_List_ComponentInfo = mode => {
  if (!checkAppRole("MapsSP.List", mode)) {
    return null;
  }

  if (checkSystemRole()) {
    return null;
  }

  return { title: "MapsSP/List/List", path: "/MapsSP/List/List" };
};

/// Custom - Role - check permission --
export class MapsSP_List_List extends React.Component {
  "use strict";

  /**
   *Creates an instance of MapsSP_Consumers_Detail.
   * @param {*} props
   * @memberof MapsSP_List_List
   */
  constructor(props) {
    console.log(new Date().getTime(), "List List constructor");
    super(props);

    const activeTabKey = Session.get("MapsSP_List_Tabs_tabsKey");
    let keyword = "";
    switch (activeTabKey) {
      case 0:
        keyword = Session.get("MapsSP_Associations_SearchKeyword") || "";
        break;
      case 1:
        keyword = Session.get("MapsSP_Consumers_SearchKeyword") || "";
        break;
      case 2:
        keyword = Session.get("MapsSP_Companys_SearchKeyword") || "";
        break;
    }

    this.state = {
      keyword: keyword,
      showSelectorCondition: false,
      activeTabKey: activeTabKey,
      tabsClassName: "",
      showTelephone: false,
      telephoneList: [],
      showSortOrder: false,
      sortOrder: Session.get("MapsSP.List.List.sortOrder") || "name",
      sortOrderDsc: Session.get("MapsSP.List.List.sortOrderDsc") || false,
      showHamburgerMenu: false,
      showView_Whatsnew: false,
      showView_AccountList: false,
      showView_Office: false,
      showView_Setting: false,
      showEdit_Feedback: false,
      showView_Tags: false,
      showView_Ranks: false,
      showView_TagSetting: false,
      showEdit_Info: false,
      showHeader: true,
      showListSelector: false,
      showSearchInput: true
    };

    /// Custom - Tabular - condition
    this.onSearchKeyword = this.onSearchKeyword.bind(this);
    this.debouncedOnSearchKeyword = _.debounce(
      this.debouncedOnSearchKeyword.bind(this),
      1000
    );
    /// Custom - Tabular - condition --

    this.myRefAssociationsList = React.createRef();
    this.myRefConsumersList = React.createRef();
    this.myRefCompanysList = React.createRef();
    this.childAssociationsList = null;
    this.childConsumersList = null;
    this.childCompanysList = null;

    this.window_innerHeight = window.innerHeight;
  }

  /**
   *
   *
   * @memberof List
   */
  componentDidMount() {
    console.log(
      new Date().getTime(),
      "List componentDidMount"
    );

    setTimeout(() => {
      this.setShowSearchInput();
    }, 30);
  }

  /**
   *
   *
   * @memberof MapsSP_List_List
   */
  setShowSearchInput = () => {
    let scrollTop = 0;
    switch (this.state.activeTabKey) {
      case 0:
        scrollTop = this.childAssociationsList.myRef.current.el.scrollTop;
        break;
      case 1:
        scrollTop = this.childConsumersList.myRef.current.el.scrollTop;
        break;
      case 2:
        scrollTop = this.childCompanysList.myRef.current.el.scrollTop;
        break;
    }

    if (scrollTop < 10) {
      this.setState({ showSearchInput: true });
    } else {
      this.setState({ showSearchInput: false });
    }
  }

  /**
   *
   *
   * @memberof MapsSP_List_List
   */
  clearSelectorCondition = () => {
    this.setState({ showSelectorCondition: false, keyword: "" });
    this.childConsumersList.clearCondition();
  };

  /**
   *
   *
   * @param {*} event
   * @memberof MapsSP_List_List
   */
  onSearchKeyword(event) {
    this.debouncedOnSearchKeyword(event.target.value);
    this.setState({ keyword: event.target.value });
  }

  /**
   *
   *
   * @param {*} value
   * @memberof MapsSP_List_List
   */
  debouncedOnSearchKeyword(keyword) {
    switch (this.state.activeTabKey) {
      case 0:
        this.childAssociationsList.searchByKeyword(keyword);
        break;
      case 1:
        this.childConsumersList.searchByKeyword(keyword);
        break;
      case 2:
        this.childCompanysList.searchByKeyword(keyword);
        break;
    }
  }

  /**
   *
   *
   * @memberof MapsSP_List_List
   */
  setSearchKeyword = keyword => {
    this.setState({ keyword: keyword || "" });
  };

  /**
   *
   *
   * @memberof MapsSP_List_List
   */
  showListSelector = () => {
    this.setState({ showHeader: false });
    this.setState({ showListSelector: true });
  };

  /**
   *
   *
   * @memberof MapsSP_List_List
   */
  closeListSelector = () => {
    this.setState({ showListSelector: false });
    this.setState({ showHeader: true });
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
   * @memberof MapsSP_List_List
   */
  closeModal = () => {
    this.setState({ showModal: false });
  };

  /**
   *
   *
   * @returns
   * @memberof MapsSP_List_List
   */
  toggleSortOrder = () => {
    this.setState({ showSortOrder: !this.state.showSortOrder });
  };

  /**
   *
   *
   * @memberof MapsSP_List_List
   */
  showSortOrder = show => {
    this.setState({ showSortOrder: show });
  };

  /**
   *
   *
   * @returns
   * @memberof MapsSP_List_List
   */
  toggleTelephone = () => {
    this.setState({ showTelephone: !this.state.showTelephone });
  };

  /**
   *
   *
   * @memberof MapsSP_List_List
   */
  showTelephone = doc => {
    const telephoneList = [];
    this.setState({ telephoneList: telephoneList });
    if (!doc || !doc.contact || !doc.contact.tels) {
      return;
    }
    for (let i in doc.contact.tels) {
      telephoneList.push(doc.contact.tels[i].tel);
    }
    this.setState({ showTelephone: true, telephoneList: telephoneList });
  };

  /**
   *
   *
   * @memberof MapsSP_List_List
   */
  setSortOrder = sortOrder => {
    if (sortOrder == this.state.sortOrder) {
      this.setState({
        sortOrderDsc: !this.state.sortOrderDsc
      });
      Session.set("MapsSP.List.List.sortOrderDsc", !this.state.sortOrderDsc);
      this.showSortOrder(false);
    } else {
      this.setState({
        sortOrder: sortOrder,
        sortOrderDsc: true
      });
      Session.set("MapsSP.List.List.sortOrder", sortOrder);
      Session.set("MapsSP.List.List.sortOrderDsc", true);
      this.showSortOrder(false);
    }
  };

  /**
   *
   *
   * @memberof MapsSP_List_List
   */
  onClickShowHamburgerMenu = () => {
    this.setState({ showHamburgerMenu: true });
  };

  /**
   *
   *
   * @returns
   * @memberof MapsSP_List_List
   */
  toggleHamburgerMenu = () => {
    this.setState({ showHamburgerMenu: !this.state.showHamburgerMenu });
  };

  /**
   *
   *
   * @memberof MapsSP_List_List
   */
  closeHamburgerMenu = () => {
    this.setState({ showHamburgerMenu: false });
  };

  /**
   *
   *
   * @memberof MapsSP_List_List
   */
  onClickShowEdit_Feedback = () => {
    this.setState({ showEdit_Feedback: true });
  };

  /**
   *
   *
   * @returns
   * @memberof MapsSP_List_List
   */
  toggleEdit_Feedback = () => {
    this.setState({ showEdit_Feedback: !this.state.showEdit_Feedback });
  };

  /**
   *
   *
   * @memberof MapsSP_List_List
   */
  closeEdit_Feedback = () => {
    this.setState({ showEdit_Feedback: false });
  };

  /**
   *
   *
   * @memberof MapsSP_List_List
   */
  onClickShowView_Office = () => {
    this.setState({ showView_Office: true });
  };

  /**
   *
   *
   * @returns
   * @memberof MapsSP_List_List
   */
  toggleView_Office = () => {
    this.setState({ showView_Office: !this.state.showView_Office });
  };

  /**
   *
   *
   * @memberof MapsSP_List_List
   */
  closeView_Office = () => {
    this.setState({ showView_Office: false });
  };

  /**
   *
   *
   * @memberof MapsSP_List_List
   */
  onClickShowView_AccountList = () => {
    this.setState({ showView_AccountList: true });
  };

  /**
   *
   *
   * @returns
   * @memberof MapsSP_List_List
   */
  toggleView_AccountList = () => {
    this.setState({ showView_AccountList: !this.state.showView_AccountList });
  };

  /**
   *
   *
   * @memberof MapsSP_List_List
   */
  closeView_AccountList = () => {
    this.setState({ showView_AccountList: false });
  };

  /**
   *
   *
   * @memberof MapsSP_List_List
   */
  onClickShowView_Whatsnew = () => {
    this.setState({ showView_Whatsnew: true });
  };

  /**
   *
   *
   * @returns
   * @memberof MapsSP_List_List
   */
  toggleView_Whatsnew = () => {
    this.setState({ showView_Whatsnew: !this.state.showView_Whatsnew });
  };

  /**
   *
   *
   * @memberof MapsSP_List_List
   */
  closeView_Whatsnew = () => {
    this.setState({ showView_Whatsnew: false });
  };

  /**
   *
   *
   * @memberof MapsSP_List_List
   */
  onClickShowView_Setting = () => {
    this.setState({ showView_Setting: true });
  };

  /**
   *
   *
   * @returns
   * @memberof MapsSP_List_List
   */
  toggleView_Setting = () => {
    this.setState({ showView_Setting: !this.state.showView_Setting });
  };

  /**
   *
   *
   * @memberof MapsSP_List_List
   */
  closeView_Setting = () => {
    this.setState({ showView_Setting: false });
  };

  /**
   *
   *
   * @memberof _MapsSP_Consumers_List
   */
  openView_Tags = () => {
    this.closeModal();
    this.setState({ showView_Tags: true });
  };

  /**
   *
   *
   * @memberof MapsSP_Consumers_Detail
   */
  toggleView_Tags = () => {
    this.setState({ showView_Tags: !this.state.showView_Tags });
  };

  /**
   *
   *
   * @memberof MapsSP_Consumers_Detail
   */
  closeView_Tags = () => {
    this.setState({ showView_Tags: false });
  };

  /**
   *
   *
   * @memberof _MapsSP_Consumers_List
   */
  openView_Ranks = () => {
    this.closeModal();
    this.setState({ showView_Ranks: true });
  };

  /**
   *
   *
   * @memberof MapsSP_Consumers_Detail
   */
  toggleView_Ranks = () => {
    this.setState({ showView_Ranks: !this.state.showView_Ranks });
  };

  /**
   *
   *
   * @memberof MapsSP_Consumers_Detail
   */
  closeView_Ranks = () => {
    this.setState({ showView_Ranks: false });
  };

  /**
   *
   *
   * @memberof _MapsSP_Consumers_List
   */
  openView_TagSetting = () => {
    this.closeModal();
    this.setState({ showView_TagSetting: true });
  };

  /**
   *
   *
   * @memberof MapsSP_Consumers_Detail
   */
  toggleView_TagSetting = () => {
    this.setState({ showView_TagSetting: !this.state.showView_TagSetting });
  };

  /**
   *
   *
   * @memberof MapsSP_Consumers_Detail
   */
  closeView_TagSetting = () => {
    this.setState({ showView_TagSetting: false });
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
   * @memberof _MapsSP_List_List
   */
  openView_Export = () => {
    this.closeModal();
    this.setState({ showView_Export: true });
  };

  /**
   *
   *
   * @memberof MapsSP_List_List
   */
  toggleView_Export = () => {
    this.setState({ showView_Export: !this.state.showView_Export });
  };

  /**
   *
   *
   * @memberof MapsSP_List_List
   */
  closeView_Export = () => {
    this.setState({ showView_Export: false });
  };

  /**
   *
   *
   * @memberof MapsSP_Consumers_Detail
   */
  updateDoc = () => {};

  /**
   *
   *
   * @memberof MapsSP_List_List
   */
  onChangeTabs = activeTabKey => {
    let keyword = "";
    switch (activeTabKey) {
      case 0:
        keyword = Session.get("MapsSP_Associations_SearchKeyword", "");
        break;
      case 1:
        keyword = Session.get("MapsSP_Consumers_SearchKeyword", "");
        break;
      case 2:
        keyword = Session.get("MapsSP_Companys_SearchKeyword", "");
        break;
    }
    this.setState({ activeTabKey: activeTabKey, keyword: keyword });
    Session.set("MapsSP_List_Tabs_tabsKey", activeTabKey);

    setTimeout(() => {
      this.setShowSearchInput();
    }, 30);
  };

  /**
   *
   *
   * @memberof _MapsSP_Consumers_List
   */
  updateSelectorString = str => {
    this.setState({
      showSelectorCondition: true,
      selectgorString: str,
      showHeader: true
    });
  };

  /**
   *
   *
   * @memberof _MapsSP_Consumers_List
   */
  gotoHome = () => {
    this.props.history.replace("/MapsSP/Home/View");
  };

  /**
   *
   *
   * @memberof _MapsSP_Consumers_List
   */
  gotoList = () => {
    this.props.history.replace("/MapsSP/List/List");
  };

  /**
   *
   *
   * @memberof _MapsSP_Consumers_List
   */
  gotoMap = () => {
    this.props.history.replace("/MapsSP/Maps/View");
  };

  /**
   *
   *
   * @memberof _MapsSP_Consumers_List
   */
  gotoPin = () => {
    this.props.history.replace("/MapsSP/Pins/View");
  };

  /**
   *
   *
   * @memberof _MapsSP_Consumers_List
   */
  gotoMapWithSelector = () => {
    const selector = this.childConsumersList.getSelector();
    Session.set("MapsSP_Maps_Selector", selector);
    const mapUrl = this.childConsumersList.getMapUrl();
    this.props.history.replace(mapUrl);
  };

  /**
   *
   *
   * @memberof _MapsSP_Consumers_List
   */
  addConsumer = () => {
    this.closeModal();
    this.setState({ showEdit_Info: true });
  };

  /**
   *
   *
   * @memberof _MapsSP_Consumers_List
   */
  setParentAssociationsList = (child) => {
    this.childAssociationsList = child;
  };

  /**
   *
   *
   * @memberof _MapsSP_Consumers_List
   */
  setParentConsumersList = (child) => {
    this.childConsumersList = child;
  };

  /**
   *
   *
   * @memberof _MapsSP_Consumers_List
   */
  setParentCompanysList = (child) => {
    this.childCompanysList = child;
  };

  /**
   *
   *
   * @memberof _MapsSP_Consumers_List
   */
   showSearchInput = (showSearchInput) => {
    this.setState({ showSearchInput: showSearchInput });
   };

  /**
   *
   *
   * @memberof _MapsSP_Consumers_List
   */
  displayTopTabElem = (activeTabKey, label, id_label, active) => {
    return (
      <Grid.Column width={4}>
        <Label
          onClick={() => {
            this.setState({ activeTabKey: activeTabKey });
          }}
          id={id_label}
          className="font-family"
          style={
            active
              ? {
                  color: "white",
                  border: "solid 1px #5BB0ED"
                }
              : { color: "#B9B9B9" }
          }
        >
          {label}
        </Label>
      </Grid.Column>
    );
  };

  /**
   *
   *
   * @memberof _MapsSP_Consumers_List
   */
  displayTopTabs = activeTabKey => {
    switch (activeTabKey) {
      case 0:
        return (
          <Segment inverted className="header-1a">
            <Grid centered className="center aligned content">
              <Grid.Row style={{ paddingTop: "0px" }}>
                <Label.Group circular style={{ display: "flex" }}>
                  {this.displayTopTabElem(
                    0,
                    "団体名簿",
                    "header-label-1",
                    true
                  )}
                  {this.displayTopTabElem(
                    1,
                    "個人名簿",
                    "header-label-2",
                    false
                  )}
                  {this.displayTopTabElem(
                    2,
                    "企業名簿",
                    "header-label-3",
                    false
                  )}
                </Label.Group>
              </Grid.Row>
            </Grid>
          </Segment>
        );
      case 1:
        return (
          <Segment inverted className="header-1a">
            <Grid centered className="center aligned content">
              <Grid.Row style={{ paddingTop: "0px" }}>
                <Label.Group circular style={{ display: "flex" }}>
                  {this.displayTopTabElem(
                    0,
                    "団体名簿",
                    "header-label-1",
                    false
                  )}
                  {this.displayTopTabElem(
                    1,
                    "個人名簿",
                    "header-label-2",
                    true
                  )}
                  {this.displayTopTabElem(
                    2,
                    "企業名簿",
                    "header-label-3",
                    false
                  )}
                </Label.Group>
              </Grid.Row>
            </Grid>
          </Segment>
        );
      default:
        return (
          <Segment inverted className="header-1a">
            <Grid centered className="center aligned content">
              <Grid.Row style={{ paddingTop: "0px" }}>
                <Label.Group circular style={{ display: "flex" }}>
                  {this.displayTopTabElem(
                    0,
                    "団体名簿",
                    "header-label-1",
                    false
                  )}
                  {this.displayTopTabElem(
                    1,
                    "個人名簿",
                    "header-label-2",
                    false
                  )}
                  {this.displayTopTabElem(
                    2,
                    "企業名簿",
                    "header-label-3",
                    true
                  )}
                </Label.Group>
              </Grid.Row>
            </Grid>
          </Segment>
        );
    }
  };

  /* global index */
  /* global tel */

  /**
   *
   *
   * @returns
   * @memberof MapsSP_List_List
   */
  render() {
    console.log(new Date().getTime(), "List List render");

    /// Custom - Tabular - layout
    const ret = (
      <React.Fragment>
        {
          <If condition={this.state.showSelectorCondition == false}>
            {/* 検索ボックス start */}
            <If condition={this.state.showHeader}>
              <Segment
                inverted
                className="header-1"
                style={{
                  marginBottom: 0,
                  borderBottomWidth: 0,
                  height: this.state.showSearchInput ? "68px" : "0",
                  paddingTop: this.state.showSearchInput ? "14px" : "0px",
                  paddingBottom: this.state.showSearchInput ? "14px" : "0px",
                  transition: "all 0.2s"
                }}
              >
                <Grid
                  centered
                  className="center aligned content"
                  style={{
                    height: this.state.showSearchInput ? "68px" : "0",
                    transition: "all 0.2s"
                  }}
                >
                  {
                    <If condition={this.state.activeTabKey == 0}>
                      <Grid.Row>
                        <Grid.Column width={2} style={{ padding: "0px" }}>
                          <Image
                            src="/smsk-front/ハンバーガーメニュー.svg"
                            style={{ top: "8px" }}
                          />
                        </Grid.Column>
                        <Grid.Column width={13} style={{ padding: "0px" }}>
                          <Input
                            onChange={this.onSearchKeyword}
                            value={this.state.keyword}
                            icon="search"
                            className="font-color font-family form-height"
                            iconPosition="left"
                            inverted
                            placeholder="名前、住所、キーワード"
                            style={{ width: "100%", fontSize: "12px" }}
                          />
                          <Image
                            src={window.$GLOBAL$.__SVG__["虫メガネ"]}
                            style={{
                              width: "25.795px",
                              bottom: "30px",
                              left: "4px"
                            }}
                          />
                          <Image
                            onClick={() => {
                              this.setState({ keyword: "" });
                              this.debouncedOnSearchKeyword("");
                            }}
                            src={
                              window.$GLOBAL$.__SVG__[
                                "×ボタン（タグで絞り込む1）"
                              ]
                            }
                            style={{
                              position: "absolute",
                              right: "10px",
                              bottom: "12px",
                              display: this.state.showSearchInput ? "block" : "none",
                            }}
                          />
                        </Grid.Column>
                      </Grid.Row>
                    </If>
                  }

                  {
                    <If condition={this.state.activeTabKey == 1}>
                      <Grid.Row>
                        <Grid.Column width={2} style={{ padding: "0px" }}>
                          <Image
                            onClick={this.onClickShowHamburgerMenu}
                            src={
                              window.$GLOBAL$.__SVG__["ハンバーガーメニュー"]
                            }
                            style={{ top: "8px" }}
                          />
                        </Grid.Column>
                        <Grid.Column width={11} style={{ padding: "0px" }}>
                          <Input
                            onChange={this.onSearchKeyword}
                            value={this.state.keyword}
                            icon="search"
                            className="font-color font-family form-height"
                            iconPosition="left"
                            inverted
                            placeholder="名前、住所、キーワード"
                            style={{ width: "96%", fontSize: "12px" }}
                          />
                          <Image
                            src={window.$GLOBAL$.__SVG__["虫メガネ"]}
                            style={{
                              width: "25.795px",
                              bottom: "30px",
                              left: "4px"
                            }}
                          />
                          <Image
                            onClick={() => {
                              this.setState({ keyword: "" });
                              this.debouncedOnSearchKeyword("");
                            }}
                            src={
                              window.$GLOBAL$.__SVG__[
                                "×ボタン（タグで絞り込む1）"
                              ]
                            }
                            style={{
                              position: "absolute",
                              right: "16px",
                              bottom: "12px",
                              display: this.state.showSearchInput ? "block" : "none",
                            }}
                          />
                        </Grid.Column>
                        <Grid.Column width={2} style={{ padding: "0px" }}>
                          <Image
                            onClick={this.showListSelector}
                            src={window.$GLOBAL$.__SVG__["詳細検索＞"]}
                          />
                        </Grid.Column>
                      </Grid.Row>
                    </If>
                  }

                  {
                    <If condition={this.state.activeTabKey == 2}>
                      <Grid.Row>
                        <Grid.Column width={2} style={{ padding: "0px" }}>
                          <Image
                            onClick={this.onClickShowHamburgerMenu}
                            src="/smsk-front/ハンバーガーメニュー.svg"
                            style={{ top: "8px" }}
                          />
                        </Grid.Column>
                        <Grid.Column width={13} style={{ padding: "0px" }}>
                          <Input
                            onChange={this.onSearchKeyword}
                            value={this.state.keyword}
                            icon="search"
                            className="font-color font-family form-height"
                            iconPosition="left"
                            inverted
                            placeholder="名前、住所、キーワード"
                            style={{ width: "100%", fontSize: "12px" }}
                          />
                          <Image
                            src={window.$GLOBAL$.__SVG__["虫メガネ"]}
                            style={{
                              width: "25.795px",
                              bottom: "30px",
                              left: "4px"
                            }}
                          />
                          <Image
                            onClick={() => {
                              this.setState({ keyword: "" });
                              this.debouncedOnSearchKeyword("");
                            }}
                            src={
                              window.$GLOBAL$.__SVG__[
                                "×ボタン（タグで絞り込む1）"
                              ]
                            }
                            style={{
                              position: "absolute",
                              right: "10px",
                              bottom: "12px",
                              display: this.state.showSearchInput ? "block" : "none",
                            }}
                          />
                        </Grid.Column>
                      </Grid.Row>
                    </If>
                  }
                </Grid>
              </Segment>

              {this.displayTopTabs(this.state.activeTabKey)}
            </If>

            <Carousel
              className="slider-fullheight"
              slideIndex={this.state.activeTabKey}
              afterSlide={slideIndex => this.onChangeTabs(slideIndex)}
              withoutControls={true}
              wrapAround={true}
            >
              <div>
                <MapsSP_Associations_List
                  ref={this.myRefAssociationsList}
                  history={this.props.history}
                  showSortOrder={this.showSortOrder}
                  showTelephone={this.showTelephone}
                  sortOrder={this.state.sortOrder}
                  sortOrderDsc={this.state.sortOrderDsc}
                  setSearchKeyword={this.setSearchKeyword}
                  showSearchInput={this.showSearchInput}
                  setParent={this.setParentAssociationsList}
                />
              </div>
              <div>
                <MapsSP_Consumers_List
                  ref={this.myRefConsumersList}
                  history={this.props.history}
                  showSortOrder={this.showSortOrder}
                  showTelephone={this.showTelephone}
                  sortOrder={this.state.sortOrder}
                  sortOrderDsc={this.state.sortOrderDsc}
                  setSearchKeyword={this.setSearchKeyword}
                  updateSelectorString={this.updateSelectorString}
                  showSearchInput={this.showSearchInput}
                  setParent={this.setParentConsumersList}
                />
              </div>
              <div>
                <MapsSP_Companys_List
                  ref={this.myRefCompanysList}
                  history={this.props.history}
                  showSortOrder={this.showSortOrder}
                  showTelephone={this.showTelephone}
                  sortOrder={this.state.sortOrder}
                  sortOrderDsc={this.state.sortOrderDsc}
                  setSearchKeyword={this.setSearchKeyword}
                  showSearchInput={this.showSearchInput}
                  setParent={this.setParentCompanysList}
                />
              </div>
            </Carousel>
            {/* 検索ボックス end */}
          </If>
        }

        {
          <If condition={this.state.showSelectorCondition}>
            <Segment
              style={{
                marginBottom: "0px",
                border: "none",
                padding: "0px",
                height: "4px",
                backgroundColor: "#2e3d51",
                borderRadius: "0px"
              }}
            />
            {/* Link start */}
            <Segment
              style={{
                marginBottom: "0px",
                border: "none",
                marginTop: "0px",
                borderRadius: "0px"
              }}
            >
              <Grid
                centered
                className="center aligned content"
                style={{ height: "63px" }}
              >
                <Grid.Row
                  centered
                  style={{
                    borderBottom: "solid 1px #F5F5F5",
                    paddingTop: "9px"
                  }}
                >
                  <Grid.Column width={4}>
                    <Button
                      onClick={this.clearSelectorCondition}
                      className="button-return font-color"
                    >
                      <Image src={window.$GLOBAL$.__SVG__["戻る"]} />
                    </Button>
                  </Grid.Column>
                  <Grid.Column
                    width={10}
                    className="center aligned content"
                    style={{ paddingTop: "14px" }}
                  >
                    <Header
                      as="h2"
                      className="font-color font-family"
                      style={{ fontSize: "18px" }}
                    >
                      検索結果
                    </Header>
                  </Grid.Column>
                  <Grid.Column width={2}></Grid.Column>
                </Grid.Row>
              </Grid>
            </Segment>
            {/* Link end */}

            {/* 検索条件 start */}
            <Segment className="search-conditions-box">
              <Grid>
                <Grid.Row>
                  <Grid.Column
                    width={12}
                    style={{ paddingRight: "0px", paddingLeft: "0px" }}
                  >
                    <Container className="search-conditions font-family">
                      <p className="search-conditions-clamp">
                        {this.state.selectgorString}
                      </p>
                    </Container>
                  </Grid.Column>
                  {/* width: '130px',  */}
                  <Grid.Column
                    width={4}
                    style={{
                      paddingLeft: "0px",
                      paddingRight: "0px",
                      marginTop: "12px",
                      marginBottom: "12px"
                    }}
                  >
                    <Button
                      onClick={this.showListSelector}
                      style={{
                        paddingLeft: "9px",
                        paddingRight: "9px",
                        fontSize: "13px",
                        paddingTop: "12px",
                        paddingBottom: "12px",
                        borderRadius: "8px",
                        backgroundColor: "#3a7cac",
                        color: "white",
                        opacity: "1"
                      }}
                    >
                      <Icon name="search" />
                      条件変更
                    </Button>
                  </Grid.Column>
                </Grid.Row>
              </Grid>
            </Segment>
            {/* 検索条件 end */}

            <MapsSP_Consumers_List
              ref={this.myRefConsumersList}
              history={this.props.history}
              showSortOrder={this.showSortOrder}
              showTelephone={this.showTelephone}
              sortOrder={this.state.sortOrder}
              sortOrderDsc={this.state.sortOrderDsc}
              setSearchKeyword={this.setSearchKeyword}
              updateSelectorString={this.updateSelectorString}
              showSearchInput={this.showSearchInput}
              setParent={this.setParentConsumersList}
            />
          </If>
        }

        {/* 下部ボタン start */}
        {
          <If condition={this.state.showHeader}>
            <Segment
              className="fotter-area"
              style={{ position: "absolute", bottom: "0px" }}
            >
              {displayTabs(this, 1)}
            </Segment>
          </If>
        }
        {/* 下部ボタン end */}

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

        <MDBModalW
          isOpen={this.state.showSortOrder}
          toggle={this.toggleSortOrder}
          className="pinmodal-style2"
          id="modal-white"
        >
          <MDBModalHeader>ソート</MDBModalHeader>
          <MDBModalBody>
            {
              <If condition={this.state.activeTabKey == 0}>
                <p>
                  <Button
                    onClick={() => {
                      this.setSortOrder("name");
                    }}
                    className="font-color font-family"
                    style={{
                      width: "100%",
                      marginBottom: 0,
                      padding: "15px 21px"
                    }}
                  >
                    名前順
                  </Button>
                </p>
                <p>
                  <Button
                    onClick={() => {
                      this.setSortOrder("modifiedAt");
                    }}
                    className="font-color font-family"
                    style={{
                      width: "100%",
                      marginBottom: 0,
                      padding: "15px 21px"
                    }}
                  >
                    更新日順
                  </Button>
                </p>
              </If>
            }

            {
              <If condition={this.state.activeTabKey == 1}>
                <p>
                  <Button
                    onClick={() => {
                      this.setSortOrder("name");
                    }}
                    className="font-color font-family"
                    style={{
                      width: "100%",
                      marginBottom: 0,
                      padding: "15px 21px"
                    }}
                  >
                    名前順
                  </Button>
                </p>
                <p>
                  <Button
                    onClick={() => {
                      this.setSortOrder("introduceNum");
                    }}
                    className="font-color font-family"
                    style={{
                      width: "100%",
                      marginBottom: 0,
                      padding: "15px 21px"
                    }}
                  >
                    紹介者数
                  </Button>
                </p>
                <p>
                  <Button
                    onClick={() => {
                      this.setSortOrder("visitAt");
                    }}
                    className="font-color font-family"
                    style={{
                      width: "100%",
                      marginBottom: 0,
                      padding: "15px 21px"
                    }}
                  >
                    最終訪問日
                  </Button>
                </p>
                <p>
                  <Button
                    onClick={() => {
                      this.setSortOrder("createdAt");
                    }}
                    className="font-color font-family"
                    style={{
                      width: "100%",
                      marginBottom: 0,
                      padding: "15px 21px"
                    }}
                  >
                    名簿登録日
                  </Button>
                </p>
                <p>
                  <Button
                    onClick={() => {
                      this.setSortOrder("modifiedAt");
                    }}
                    className="font-color font-family"
                    style={{
                      width: "100%",
                      marginBottom: 0,
                      padding: "15px 21px"
                    }}
                  >
                    最終更新日
                  </Button>
                </p>
              </If>
            }

            {
              <If condition={this.state.activeTabKey == 2}>
                <p>
                  <Button
                    onClick={() => {
                      this.setSortOrder("name");
                    }}
                    className="font-color font-family"
                    style={{
                      width: "100%",
                      marginBottom: 0,
                      padding: "15px 21px"
                    }}
                  >
                    名前順
                  </Button>
                </p>
                <p>
                  <Button
                    onClick={() => {
                      this.setSortOrder("modifiedAt");
                    }}
                    className="font-color font-family"
                    style={{
                      width: "100%",
                      marginBottom: 0,
                      padding: "15px 21px"
                    }}
                  >
                    更新日順
                  </Button>
                </p>
              </If>
            }
          </MDBModalBody>
        </MDBModalW>

        <MDBModalW
          isOpen={this.state.showHamburgerMenu}
          toggle={this.toggleHamburgerMenu}
          fullHeight
          size="large"
          className="m-0 p-0 hamburger-width"
          id="modal-black"
          animation="left"
        >
          <MDBModalBody
            style={{
              width: "calc(100vw - 80px)",
              height: this.window_innerHeight - 0 + "px",
              float: "left",
              padding: "0px",
              borderRadius: "0px",
              border: "none",
              marginTop: "0px"
            }}
          >
            <Image
              onClick={this.closeHamburgerMenu}
              src={window.$GLOBAL$.__SVG__["閉じるmenu"]}
              id="menu-close"
            />

            <MDBModalBody id="menu-logo">
              <Image
                src={window.$GLOBAL$.__SVG__["スマ選ロゴネイビー"]}
                id="menu-logo-margin"
              />
            </MDBModalBody>
            <MDBModalBody id="menu-main">
              <li
                onClick={this.onClickShowView_Whatsnew}
                className="font-family font-color"
                style={{
                  display: "flex",
                  padding: "20px 0px",
                  fontSize: "16px"
                }}
              >
                <Image
                  src={window.$GLOBAL$.__SVG__["おしらせ"]}
                  style={{ marginRight: "20px" }}
                />
                お知らせ
                <Label circular color="red" size="mini" id="notice">
                  4
                </Label>
              </li>
              <li
                className="font-family font-color"
                style={{
                  display: "flex",
                  padding: "20px 0px",
                  fontSize: "16px"
                }}
              >
                <Image
                  src={window.$GLOBAL$.__SVG__["地図落とし"]}
                  style={{ marginRight: "20px" }}
                />
                地図落とし
              </li>
              <li
                onClick={this.onClickShowView_Office}
                className="font-family font-color"
                style={{
                  display: "flex",
                  padding: "20px 0px",
                  fontSize: "16px"
                }}
              >
                <Image
                  src={window.$GLOBAL$.__SVG__["事務所設定"]}
                  style={{ marginRight: "20px" }}
                />
                事務所設定
              </li>
              <li
                onClick={this.onClickShowView_AccountList}
                className="font-family font-color"
                style={{
                  display: "flex",
                  padding: "20px 0px",
                  fontSize: "16px"
                }}
              >
                <Image
                  src={window.$GLOBAL$.__SVG__["アカウント設定"]}
                  style={{ marginRight: "20px" }}
                />
                アカウント設定
              </li>
              <li
                onClick={this.onClickShowView_Setting}
                className="font-family font-color"
                style={{
                  display: "flex",
                  padding: "20px 0px",
                  fontSize: "16px"
                }}
              >
                <Image
                  src={window.$GLOBAL$.__SVG__["その他設定"]}
                  style={{ marginRight: "20px" }}
                />
                その他設定
              </li>
              <li
                onClick={this.onClickShowEdit_Feedback}
                className="font-family font-color"
                style={{
                  display: "flex",
                  padding: "20px 0px",
                  fontSize: "16px"
                }}
              >
                <Image
                  src={window.$GLOBAL$.__SVG__["ご意見フォーム"]}
                  style={{ marginRight: "20px" }}
                />
                ご意見フォーム
              </li>
              <li
                onClick={() => {
                  location.reload();
                }}
                className="font-family font-color"
                style={{
                  display: "flex",
                  padding: "20px 0px",
                  fontSize: "16px"
                }}
              >
                <Image
                  src={window.$GLOBAL$.__SVG__["その他設定"]}
                  style={{ marginRight: "20px" }}
                />
                ブラウザリフレッシュ
              </li>
            </MDBModalBody>
            <MDBModalBody id="menu-bottom">
              <li
                className="font-family font-color"
                style={{
                  display: "flex",
                  fontSize: "16px",
                  padding: "14px",
                  bottom: "0px"
                }}
              >
                <Image
                  src={window.$GLOBAL$.__SVG__["ログアウト"]}
                  style={{ marginRight: "20px" }}
                />
                ログアウト
              </li>
            </MDBModalBody>
          </MDBModalBody>
        </MDBModalW>

        <MDBModalW
          isOpen={this.state.showEdit_Feedback}
          toggle={this.toggleEdit_Feedback}
          fullHeight
          size="large"
          className="m-0 p-0"
          animation="left"
        >
          <Edit_Feedback close={this.closeEdit_Feedback} />
        </MDBModalW>

        <MDBModalW
          isOpen={this.state.showView_Office}
          toggle={this.toggleView_Office}
          fullHeight
          size="large"
          className="m-0 p-0"
          animation="left"
        >
          <View_Office close={this.closeView_Office} />
        </MDBModalW>

        <MDBModalW
          isOpen={this.state.showView_AccountList}
          toggle={this.toggleView_AccountList}
          fullHeight
          size="large"
          className="m-0 p-0"
          animation="left"
        >
          <View_AccountList close={this.closeView_AccountList} />
        </MDBModalW>

        <MDBModalW
          isOpen={this.state.showView_Whatsnew}
          toggle={this.toggleView_Whatsnew}
          fullHeight
          size="large"
          className="m-0 p-0"
          animation="left"
        >
          <View_Whatsnew close={this.closeView_Whatsnew} />
        </MDBModalW>

        <MDBModalW
          isOpen={this.state.showView_Setting}
          toggle={this.toggleView_Setting}
          fullHeight
          size="large"
          className="m-0 p-0"
          animation="left"
        >
          <View_Setting close={this.closeView_Setting} />
        </MDBModalW>

        <MDBModalW
          size="large"
          isOpen={this.state.showView_Tags}
          toggle={this.toggleView_Tags}
          className="m-0 p-0"
          animation="left"
        >
          <MDBModalBody className="m-0 p-0">
            <View_Tags close={this.closeView_Tags} />
          </MDBModalBody>
        </MDBModalW>

        <MDBModalW
          size="large"
          isOpen={this.state.showView_Ranks}
          toggle={this.toggleView_Ranks}
          className="m-0 p-0"
          animation="left"
        >
          <MDBModalBody className="m-0 p-0">
            <View_Ranks close={this.closeView_Ranks} />
          </MDBModalBody>
        </MDBModalW>

        <MDBModalW
          size="large"
          isOpen={this.state.showView_TagSetting}
          toggle={this.toggleView_TagSetting}
          className="m-0 p-0"
          animation="left"
        >
          <MDBModalBody className="m-0 p-0">
            <View_TagSetting close={this.closeView_TagSetting} />
          </MDBModalBody>
        </MDBModalW>

        {/* モーダル start */}

        {
          <If condition={this.state.activeTabKey == 1 && this.state.showHeader}>
            <Button
              onClick={() => this.setState({ showModal: true })}
              circular
              size="big"
              className="floating-btn"
            >
              {/* <Image src={window.$GLOBAL$.__SVG__["フローティングアイコン"]} /> */}
              <Image src="/smsk-front/フローティングアイコン.svg" />
            </Button>
          </If>
        }

        <MDBModalW
          isOpen={this.state.showModal}
          toggle={this.toggleModal}
          fullHeight
          size="large"
          className="m-0 p-0"
          id="modal-black"
        >
          <Grid className="right aligned floating-style">
            {/* <Grid.Row style={{ paddingBottom: "5px" }}>
              <Grid.Column>
                <p className="font-family right aligned floatingmenu-p">
                  リストTOPに戻る
                  <Image
                    className="floatingmenu-img"
                    src="/smsk-front/リストTOP.svg"
                  />
                </p>
              </Grid.Column>
            </Grid.Row> */}

            <Grid.Row
              className="responsive-floating"
              style={{ paddingBottom: "0px" }}
            >
              <Grid.Column>
                <p
                  className="font-family right aligned floatingmenu-p haribote"
                  // onClick={this.openView_Export}
                >
                  エクスポート
                  <Image
                    className="floatingmenu-img"
                    src={window.$GLOBAL$.__SVG__["export"]}
                  />
                </p>
              </Grid.Column>
            </Grid.Row>

            <Grid.Row
              className="responsive-floating"
              style={{ paddingBottom: "0px" }}
            >
              <Grid.Column>
                <p className="font-family right aligned floatingmenu-p haribote">
                  宛名ラベル作成
                  <Image
                    className="floatingmenu-img"
                    src={window.$GLOBAL$.__SVG__["label"]}
                  />
                </p>
              </Grid.Column>
            </Grid.Row>

            <Grid.Row
              className="responsive-floating"
              style={{ paddingBottom: "0px" }}
            >
              <Grid.Column>
                <p
                  onClick={this.openView_Ranks}
                  className="font-family right aligned floatingmenu-p"
                >
                  ランク
                  <Image
                    className="floatingmenu-img"
                    src={window.$GLOBAL$.__SVG__["rank"]}
                  />
                </p>
              </Grid.Column>
            </Grid.Row>

            <Grid.Row
              className="responsive-floating"
              style={{ paddingBottom: "0px" }}
            >
              <Grid.Column>
                <p
                  onClick={this.openView_Tags}
                  className="font-family right aligned floatingmenu-p"
                >
                  タグ一覧
                  <Image
                    className="floatingmenu-img"
                    src={window.$GLOBAL$.__SVG__["tag2"]}
                  />
                </p>
              </Grid.Column>
            </Grid.Row>

            <Grid.Row
              className="responsive-floating"
              style={{ paddingBottom: "0px" }}
            >
              <Grid.Column>
                <p
                  // onClick={this.openView_TagSetting}
                  className="font-family right aligned floatingmenu-p haribote"
                >
                  タグ一括設定
                  <Image
                    className="floatingmenu-img"
                    src={window.$GLOBAL$.__SVG__["tag_setting"]}
                  />
                </p>
              </Grid.Column>
            </Grid.Row>

            <Grid.Row
              className="responsive-floating"
              style={{ paddingBottom: "0px" }}
            >
              <Grid.Column>
                <p
                  onClick={this.gotoMapWithSelector}
                  className="font-family right aligned floatingmenu-p"
                >
                  地図で表示
                  <Image
                    className="floatingmenu-img"
                    src={window.$GLOBAL$.__SVG__["map2"]}
                  />
                </p>
              </Grid.Column>
            </Grid.Row>

            <Grid.Row
              className="responsive-floating"
              style={{ paddingBottom: "0px" }}
            >
              <Grid.Column>
                <p
                  onClick={this.addConsumer}
                  className="font-family right aligned floatingmenu-p"
                >
                  新規追加
                  <Image
                    className="floatingmenu-img"
                    src={window.$GLOBAL$.__SVG__["add"]}
                  />
                </p>
              </Grid.Column>
            </Grid.Row>

            <Grid.Row style={{ paddingBottom: "0px", height: "75px" }}>
              <Grid.Column>
                <Image
                  onClick={() => this.setState({ showModal: false })}
                  // src={window.$GLOBAL$.__SVG__["閉じる"]}
                  src="/smsk-front/閉じる.svg"
                  style={{
                    float: "right",
                    bottom: "10px",
                    left: "6px"
                  }}
                />
              </Grid.Column>
            </Grid.Row>
          </Grid>
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
              doc={{}}
              updateDoc={this.updateDoc}
            />
          </MDBModalBody>
        </MDBModalW>

        <MDBModalW
          isOpen={this.state.showView_Export}
          toggle={this.toggleView_Export}
          fullHeight
          size="large"
          className="m-0 p-0"
          id="modal-black"
          animation="left"
        >
          <Grid className="right aligned floating-style">
            <Grid.Row style={{ paddingBottom: "50px" }}>
              <Grid.Column>
                <p
                  className="font-family right aligned floatingmenu-p"
                  style={{ filter: "grayscale(1)" }}
                >
                  エクスポート
                  <Image
                    className="floatingmenu-img"
                    src={window.$GLOBAL$.__SVG__["export"]}
                  />
                </p>
              </Grid.Column>
            </Grid.Row>

            <Grid.Row style={{ paddingBottom: "50px" }}>
              <Grid.Column>
                <p
                  onClick={this.openView_Tags}
                  className="font-family right aligned floatingmenu-p"
                  style={{ filter: "grayscale(1)" }}
                >
                  CSV出力
                  <Image
                    className="floatingmenu-img"
                    src={window.$GLOBAL$.__SVG__["export_CSV"]}
                  />
                </p>
              </Grid.Column>
            </Grid.Row>

            <Grid.Row style={{ paddingBottom: "10px" }}>
              <Grid.Column>
                <p
                  className="font-family right aligned floatingmenu-p"
                  style={{ filter: "grayscale(1)" }}
                >
                  PDF出力
                  <Image
                    className="floatingmenu-img"
                    src={window.$GLOBAL$.__SVG__["export_PDF"]}
                  />
                </p>
              </Grid.Column>
            </Grid.Row>

            <Grid.Row style={{ paddingBottom: "0px", height: "75px" }}>
              <Grid.Column>
                <Image
                  onClick={() =>
                    this.setState({ showView_Export: false, showModal: true })
                  }
                  // src={window.$GLOBAL$.__SVG__["閉じる"]}
                  src="/smsk-front/閉じる.svg"
                  style={{
                    float: "right",
                    bottom: "10px",
                    left: "6px"
                  }}
                />
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </MDBModalW>

        {
          <If condition={this.childConsumersList}>
            <MDBModalW
              size="large"
              isOpen={this.state.showListSelector}
              className="m-0 p-0"
              animation="left"
              style={{
                height: "100vh"
              }}
            >
              <MDBModalBody className="m-0 p-0">
                <List_Selector
                  updateSelector={
                    this.childConsumersList.updateSelector
                  }
                  updateSelectors={
                    this.childConsumersList.updateSelectors
                  }
                  updateSelectorString={this.updateSelectorString}
                  closeListSelector={this.closeListSelector}
                  value={this.childConsumersList.state.selector}
                />
              </MDBModalBody>
            </MDBModalW>
          </If>
        }

        {/* モーダル end */}
      </React.Fragment>
    );
    /// Custom - Tabular - layout --

    return ret;
  }
}
