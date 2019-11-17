import React from "react";
import { Session } from "meteor/session";
import { withTracker } from "meteor/react-meteor-data";
import { Image, Segment, Grid, Header, Label } from "semantic-ui-react";
import styled from "styled-components";
import moment from "moment";
moment.locale("ja");

/// Sys - LocalStorage
import { localCollection_ComponentDidMount } from "@imports/api/lib/localCollection";
import { localCollection_ComponentWillUnmount } from "@imports/api/lib/localCollection";
/// Sys - LocalStorage --

import { displayTabs } from "../lib/utils";

import { Edit_Feedback } from "../List/HamburgerMenu/Edit_Feedback";
import { View_Office } from "../List/HamburgerMenu/View_Office";
import { View_AccountList } from "../List/HamburgerMenu/View_AccountList";
import { View_Whatsnew } from "../List/HamburgerMenu/View_Whatsnew";
import { View_Setting } from "../List/HamburgerMenu/View_Setting";

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

export class _MapsSP_Home_View extends React.Component {
  /**
   * @param {*} props
   * @memberof MapsSP_Home_View
   */
  constructor(props) {
    super(props);

    this.state = {
      consumersNum: 0,
      newConsumersNum: 0,
      showHamburgerMenu: false,
      showView_Whatsnew: false,
      showView_AccountList: false,
      showView_Office: false,
      showView_Setting: false,
      showEdit_Feedback: false,
      showEdit_Info: false,
      showHeader: true,
      showMessageModal: true,
      message: "データロード中..."
    };

    /// Custom - LocalStorage
    this.Collection = {
      _name: "Maps_Consumers",
      docs: {},
      simpleSchema: Maps_Consumers_Collection.simpleSchema(),
      dispTitle: Maps_Consumers_Collection.dispTitle
    };
    /// Custom - LocalStorage --

    this.window_innerHeight = window.innerHeight;
  }

  /**
   * @param {*} props
   * @memberof MapsSP_Home_View
   */
  loadData = () => {
    const now = new Date().getTime();
    const w1 = new Date(
      moment(now)
        .subtract(1, "weeks")
        .toISOString()
    );
    const collection = window.$GLOBAL$.Collection["Maps_Consumers"];
    const keys = Object.keys(window.$GLOBAL$.Collection["Maps_Consumers"]);
    let newConsumersNum = 0;
    for (let key of keys) {
      if (collection[key].createdAt > w1) {
        newConsumersNum++;
      }
    }

    this.setState({
      showMessageModal: false,
      consumersNum: keys.length,
      newConsumersNum: newConsumersNum
    });
  };

  /**
   *
   *
   * @memberof MapsView
   */
  componentDidMount() {
    console.log(new Date().getTime(), "MapsView componentDidMount");

    /// Sys - LocalStorage
    localCollection_ComponentDidMount(this);
    /// Sys - LocalStorage --

    /// Custom - LocalStorage - update
    this.localCollection_redrawProc = this.loadData;
    /// Custom - LocalStorage - update --
  }

  /**
   *
   *
   * @memberof MapsView
   */
  componentWillUnmount() {
    console.log(new Date().getTime(), "MapsView componentWillUnmount");

    /// Sys - LocalStorage
    localCollection_ComponentWillUnmount(this);
    /// Sys - LocalStorage --
  }

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

  render() {
    /// Custom - Collection - subscribe
    if (this.props.loading) {
      return <span />;
    }
    /// Custom - Collection - subscribe --

    return (
      <React.Fragment>
        <Segment
          inverted
          style={{
            backgroundColor: "#2e3d51",
            borderRadius: 0,
            marginBottom: "0px",
            padding: "10px 14px",
            height: "60.8px"
          }}
        >
          <Grid centered className="center aligned content">
            <Grid.Column
              width={2}
              style={{ padding: "0px", top: "9px", left: "7px" }}
            >
              {/* <Button
                
                style={{
                  backgroundColor: "transparent",
                  margin: "6px 0 0 5px",
                  padding: "0"
                }}
              > */}
              <Image
                onClick={this.onClickShowHamburgerMenu}
                src={window.$GLOBAL$.__SVG__["ハンバーガーメニュー"]}
                style={{ top: "15px", left: "6px" }}
              />
              {/* </Button> */}
            </Grid.Column>
            <Grid.Column width={12}>
              <Header
                as="h2"
                className="font-family"
                style={{
                  fontSize: "18px",
                  color: "white",
                  width: "128px",
                  height: "36px"
                }}
              >
                <Image
                  src="/smsk-front/アートボード.svg"
                  style={{ width: "100%", margin: "8px 10px 6px" }}
                />
              </Header>
            </Grid.Column>
            <Grid.Column width={2}></Grid.Column>
          </Grid>
        </Segment>
        <div
          style={{
            padding: "17px 14px",
            backgroundColor: "white",
            overflow: "auto",
            fontFamily: "ヒラギノ角ゴ ProN",
            height: this.window_innerHeight - 134 + "px"
          }}
        >
          <GreyBoxWrapper>
            <GreyBox>
              <GreyBoxTitle>登録者数</GreyBoxTitle>
              <GreyBoxContentLayout>
                <GreyBoxNumber>{this.state.consumersNum || 0}</GreyBoxNumber>
                <GreyBoxUnit>人</GreyBoxUnit>
                <GreyBoxCounter>+{this.state.newConsumersNum}</GreyBoxCounter>
              </GreyBoxContentLayout>
            </GreyBox>
            <GreyBox>
              <GreyBoxTitle>企業</GreyBoxTitle>
              <GreyBoxContentLayout>
                <GreyBoxNumber>{this.props.companyNum || 0}</GreyBoxNumber>
                <GreyBoxUnit>社</GreyBoxUnit>
              </GreyBoxContentLayout>
            </GreyBox>
            <GreyBox>
              <GreyBoxTitle>団体</GreyBoxTitle>
              <GreyBoxContentLayout>
                <GreyBoxNumber>{this.props.associationNum || 0}</GreyBoxNumber>
                <GreyBoxUnit>組</GreyBoxUnit>
              </GreyBoxContentLayout>
            </GreyBox>
          </GreyBoxWrapper>
          <TipsLayout>
            <SectionTitle>TIPS</SectionTitle>
            <TipsCard>
              <TipsCardText>
                ピンを自陣営と対立陣営とで色分けすることで地域の特性を知ることができます。
              </TipsCardText>
            </TipsCard>
          </TipsLayout>
          <ReminderLayout className="haribote">
            <SectionTitle>リマインダー</SectionTitle>
            <Reminder backgroundColor={"#3A639A"}>
              <ReminderDate>2019/5/13</ReminderDate>
              <ReminderCountWrapper>
                <ReminderCount>3</ReminderCount>
                <ReminderUnit>件</ReminderUnit>
                <Image src="/smsk-front/→ホーム.svg" />
              </ReminderCountWrapper>
            </Reminder>

            {/* リマインダーcloseの状態 start */}
            {/* <Reminder backgroundColor={'#4372B1'}>
          <ReminderDate>2019/5/12</ReminderDate>
          <ReminderCountWrapper>
            <ReminderCount>3</ReminderCount>
            <ReminderUnit>件</ReminderUnit>
            <Image src="/smsk-front/→ホーム.svg" />
          </ReminderCountWrapper>
        </Reminder> */}
            {/* リマインダーcloseの状態 end */}

            {/* リマインダーopenの状態 start */}
            <ReminderOpen backgroundColor={"#4372B1"}>
              <Reminder2>
                <ReminderDate>2019/5/12</ReminderDate>
                <ReminderCountWrapper>
                  <ReminderCount>3</ReminderCount>
                  <ReminderUnit2>件</ReminderUnit2>
                  <Image src="/smsk-front/Vリマインダー.svg" />
                </ReminderCountWrapper>
              </Reminder2>
              <ReminderListWrapper>
                <ReminderList>
                  <ReminderName>東森友暉</ReminderName>
                  <ReminderDetail>様の誕生日です。</ReminderDetail>
                </ReminderList>
                <ReminderList>
                  <ReminderName>西田和子</ReminderName>
                  <ReminderDetail>様の誕生日です。</ReminderDetail>
                </ReminderList>
                <ReminderList>
                  <ReminderName>北野愛美</ReminderName>
                  <ReminderDetail>様の物故日(2018/5/13)です。</ReminderDetail>
                </ReminderList>
              </ReminderListWrapper>
            </ReminderOpen>
            {/* リマインダーopenの状態 end */}

            <Reminder3 backgroundColor={"#4B7FC6"}>
              <ReminderDate>2019/5/11</ReminderDate>
              <ReminderCountWrapper>
                <ReminderCount>3</ReminderCount>
                <ReminderUnit>件</ReminderUnit>
                <Image src="/smsk-front/→ホーム.svg" />
              </ReminderCountWrapper>
            </Reminder3>
            <ReminderMore>もっと見る</ReminderMore>
          </ReminderLayout>
          <CalendarLayout className="haribote">
            <SectionTitle>活動カレンダー</SectionTitle>
            <Image
              src="/smsk-front/カレンダーロック.svg"
              style={{ margin: "auto" }}
            />
          </CalendarLayout>
        </div>

        {/* 下部ボタン start */}
        <Segment className="fotter-area">{displayTabs(this, 0)}</Segment>
        {/* 下部ボタン end */}

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
          isOpen={this.state.showMessageModal}
          toggle={() => this.setState({ showMessageModal: false })}
          className="pinmodal-style"
        >
          <MDBModalBody>{this.state.message}</MDBModalBody>
        </MDBModalW>
      </React.Fragment>
    );
  }
}

/// Custom - List - tracker
export const MapsSP_Home_View = withTracker(() => {
  /// Custom - Collection - subscribe
  const handles = [
    // eslint-disable-line no-unused-vars
    //    Meteor.subscribe(
    //      Maps_Companys_Collection._name,
    //      Session.get("Users_Groups_id")
    //    ),
    //    Meteor.subscribe(
    //      Maps_Associations_Collection._name,
    //      Session.get("Users_Groups_id")
    //    )
  ];
  const loading = handles.some(handle => !handle.ready());

  if (!loading) {
    Maps_Companys_Collection.find().fetch();
    Maps_Associations_Collection.find().fetch();
  }

  console.log("MapsSP_Home_View = withTracker ---------------------------");
  return {
    companyNum: Maps_Companys_Collection.find({ _deleted: null }).map(b => {
      return b;
    }).length,
    associationNum: Maps_Associations_Collection.find({ _deleted: null }).map(
      b => {
        return b;
      }
    ).length,
    loading: loading
  };
  /// Custom - Collection - subscribe --
})(_MapsSP_Home_View);
/// Custom - List - tracker --

const GreyBoxWrapper = styled.div({
  display: "flex",
  justifyContent: "center",
  marginBottom: "19px"
});

const GreyBox = styled.div({
  width: "100%",
  padding: "9px",
  backgroundColor: "#f0f0f0",
  marginRight: "5px",
  ":&last-child": {
    marginRight: 0
  }
});

const GreyBoxTitle = styled.div({
  color: "#707070",
  fontSize: "12px",
  margin: "3px"
});

const GreyBoxContentLayout = styled.div({
  display: "flex"
});

const GreyBoxNumber = styled.div({
  color: "#707070",
  fontSize: "20px",
  fontWeight: "bold",
  lineHeight: 1
});

const GreyBoxUnit = styled.div({
  display: "flex",
  alignItems: "flex-end",
  color: "#707070",
  fontSize: "12px",
  lineHeight: 1
});

const GreyBoxCounter = styled.div({
  marginLeft: "20px",
  color: "#3bb1dd",
  fontSize: "12px"
});

const SectionTitle = styled.div({
  color: "#707070",
  fontSize: "12px",
  fontWeight: "bold",
  marginBottom: "3px"
});

const TipsLayout = styled.div({
  marginBottom: "10px"
});

const TipsCard = styled.div({
  backgroundColor: "#6596b9",
  borderRadius: "12px",
  padding: "12px 20px 7px",
  height: "65px"
});

const TipsCardText = styled.div({
  color: "#fff",
  fontSize: "13px",
  fontWeight: "bold",
  marginBottom: "3px"
});

const ReminderLayout = styled.div({
  marginBottom: "22px"
});

const Reminder = styled.div(props => ({
  display: "flex",
  backgroundColor: props.backgroundColor,
  borderRadius: "12px",
  borderBottomLeftRadius: "initial",
  borderBottomRightRadius: "initial",
  border: "solid 3px #fff",
  padding: "11px 10px 10px 20px",
  height: "48px",
  justifyContent: "space-between",
  "&:nth-child(n+3)": {
    marginTop: "-6px"
  },
  "&:last-child": {
    borderRadius: "12px"
  }
}));

const Reminder2 = styled.div(props => ({
  display: "flex",
  backgroundColor: props.backgroundColor,
  borderRadius: "12px",
  borderBottomLeftRadius: "initial",
  borderBottomRightRadius: "initial",
  justifyContent: "space-between",
  "&:nth-child(n+3)": {
    marginTop: "-6px"
  },
  "&:last-child": {
    borderRadius: "12px"
  }
}));

const ReminderDate = styled.div({
  color: "#fff",
  fontWeight: "bold",
  fontSize: "14px"
});

const ReminderCountWrapper = styled.div({
  display: "flex"
});

const ReminderCount = styled.div({
  color: "#fff",
  fontSize: "14px",
  fontWeight: "bold"
});

const ReminderUnit = styled.div({
  display: "flex",
  alignItems: "flex-end",
  color: "#fff",
  fontSize: "11px",
  lineHeight: 2.1,
  marginRight: "38px"
});

const ReminderUnit2 = styled.div({
  display: "flex",
  alignItems: "flex-end",
  color: "#fff",
  fontSize: "11px",
  lineHeight: 1.9,
  marginRight: "33px"
});

const ReminderOpen = styled.div(props => ({
  backgroundColor: props.backgroundColor,
  borderRadius: "12px",
  borderBottomLeftRadius: "initial",
  borderBottomRightRadius: "initial",
  border: "solid 3px #fff",
  padding: "11px 10px 10px 20px",
  justifyContent: "space-between",
  "&:nth-child(n+3)": {
    marginTop: "-6px"
  },
  "&:last-child": {
    borderRadius: "12px"
  }
}));

const ReminderListWrapper = styled.div({});

const ReminderList = styled.div({
  display: "flex",
  padding: "10px 0px"
});

const ReminderName = styled.div({
  color: "white",
  fontWeight: "bold",
  borderBottom: "solid 1px white",
  marginRight: "10px"
});

const ReminderDetail = styled.div({
  color: "white"
});

const Reminder3 = styled.div(props => ({
  display: "flex",
  backgroundColor: props.backgroundColor,
  borderRadius: "12px",
  border: "solid 3px #fff",
  padding: "11px 10px 10px 20px",
  height: "48px",
  justifyContent: "space-between",
  "&:nth-child(n+3)": {
    marginTop: "-6px"
  },
  "&:last-child": {
    borderRadius: "12px"
  }
}));

const ReminderMore = styled.div({
  display: "flex",
  justifyContent: "flex-end",
  color: "#707070",
  fontSize: "12px"
});

const CalendarLayout = styled.div({
  marginBottom: "3px"
});
