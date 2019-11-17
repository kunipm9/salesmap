/// Sys - Tabular
import React from "react";
import { Session } from "meteor/session";
/// Sys - Tabular --

/// Sys - Role
import { checkSystemRole, checkAppRole } from "@imports/ui/crud/checkRole";
/// Sys - Role --

import { List } from "./List";
import { Edit_Category } from "./Edit_Category";

// import start
import { Segment } from "semantic-ui-react";
import { Grid } from "semantic-ui-react";

import { Header } from "semantic-ui-react";

import { Tab } from "semantic-ui-react";
import { Image } from "semantic-ui-react";
import { Button } from "semantic-ui-react";
import { Label } from "semantic-ui-react";

import { Edit_Feedback } from "../List/HamburgerMenu/Edit_Feedback";
import { View_Office } from "../List/HamburgerMenu/View_Office";
import { View_AccountList } from "../List/HamburgerMenu/View_AccountList";
import { View_Whatsnew } from "../List/HamburgerMenu/View_Whatsnew";
import { View_Setting } from "../List/HamburgerMenu/View_Setting";

import { MDBModalBody } from "mdbreact";
import { MDBModalW } from "../lib/MDBModalW";

// import end

import { displayTabs } from "../lib/utils";

/// Custom - Role - check permission
/**
 *
 *
 * @param {*} mode
 * @returns
 */
export const MapsSP_Pins_View_ComponentInfo = mode => {
  if (!checkAppRole("MapsSP.Pins", mode)) {
    return null;
  }

  if (checkSystemRole()) {
    return null;
  }

  return { title: "MapsSP/Pins/View", path: "/MapsSP/Pins/View" };
};

/// Custom - Role - check permission --
export class MapsSP_Pins_View extends React.Component {
  "use strict";

  /**
   *Creates an instance of MapsSP_Consumers_Detail.
   * @param {*} props
   * @memberof MapsSP_List_List
   */
  constructor(props) {
    super(props);

    this.state = {
      showHamburgerMenu: false,
      showView_Whatsnew: false,
      showView_AccountList: false,
      showView_Office: false,
      showView_Setting: false,
      showEdit_Feedback: false,
      showEdit_Info: false,
      showHeader: true
    };

    this.window_innerHeight = window.innerHeight;
  }

  /**
   *
   *
   * @memberof MapsSP_Pins_View
   */
  Tab1 = () => {
    return (
      <React.Fragment>
        <List history={this.props.history} />
      </React.Fragment>
    );
  };

  /**
   *
   *
   * @memberof MapsSP_Pins_View
   */
  Tab2 = () => {
    return (
      <React.Fragment>
        <Edit_Category />
      </React.Fragment>
    );
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
    Session.set("MapsSP_List_Tabs_tabsKey", 1);
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
   * @returns
   * @memberof MapsSP_Pins_View
   */
  render() {
    const panes = [
      {
        menuItem: "登録ピン一覧",
        render: () => (
          <Tab.Pane
            attached={false}
            style={{ padding: 0, marginTop: "0px", border: "none" }}
          >
            <this.Tab1 />
          </Tab.Pane>
        )
      },
      {
        menuItem: "フォルダ管理",
        render: () => (
          <Tab.Pane
            attached={false}
            style={{ padding: 0, marginTop: "0px", border: "none" }}
          >
            <this.Tab2 />
          </Tab.Pane>
        )
      }
    ];
    /// Custom - Tabular - layout
    const ret = (
      <React.Fragment>
        {/* ヘッダー start */}
        <Segment
          inverted
          style={{
            marginBottom: "0px",
            backgroundColor: "#2A3F54",
            height: "60.8px",
            borderBottom: "solid 1px #ddddde",
            borderRadius: "0"
          }}
        >
          <Grid centered className="center aligned content">
            <Grid.Column width={3} style={{ left: "-35px", top: "6px" }}>
              <Button
                style={{
                  backgroundColor: "transparent",
                  padding: "0"
                }}
              >
                <Image
                  onClick={this.onClickShowHamburgerMenu}
                  src={window.$GLOBAL$.__SVG__["ハンバーガーメニュー"]}
                />
              </Button>
            </Grid.Column>
            <Grid.Column
              width={10}
              style={{ display: "flex", left: "25px", top: "4px" }}
            >
              <Image src={window.$GLOBAL$.__SVG__["ピン-6"]} />
              <Header
                as="h2"
                className="font-family header-icon-label"
                style={{ color: "white" }}
              >
                ピン
              </Header>
            </Grid.Column>
          </Grid>
        </Segment>
        {/* ヘッダー end */}

        {/* 詳細 start */}
        <Segment
          inverted
          style={{
            backgroundColor: "#efefef",
            marginBottom: "0px",
            marginTop: "0px",
            padding: "0px"
          }}
        >
          <Tab
            menu={{
              secondary: true,
              pointing: true,
              style: {
                marginBottom: "0px",
                height: "52px",
                backgroundColor: "white"
              }
            }}
            panes={panes}
            defaultActiveIndex={0}
            style={{ padding: 0 }}
            className="tab3div"
          />
        </Segment>
        {/* 詳細 end */}

        {/* 下部ボタン start */}
        <Segment className="fotter-area">{displayTabs(this, 3)}</Segment>
        {/* 下部ボタン end */}
        {/* 詳細 end */}

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
      </React.Fragment>
    );
    /// Custom - Tabular - layout --
    return ret;
  }
}
