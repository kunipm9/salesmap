/// Sys - View
import React from "react";
import { withTracker } from "meteor/react-meteor-data";
/// Sys - View --

import View from "@imports/ui/crud/View";

/// Custom - LocalStorage
import { ConsumersView } from "./Consumers/View";

import { PinsView } from "./Pins/View";

import { InputHistory } from "./Bookmarks/InputHistory";
import { BookmarksView } from "./Bookmarks/View";
import { BookmarksInsert } from "./Bookmarks/Insert";
import { NavigatorInput } from "./Navigator/Input";
import { NavigatorList } from "./Navigator/List";
import { NavigatorPoint } from "./Navigator/Point";
import { Selector } from "./Selector";
/// Custom - LocalStorage --

/// Sys - Collection - insert
import { Session } from "meteor/session";
/// Sys - Collection - insert --

/// Sys - Role
import { checkSystemRole, checkAppRole } from "@imports/ui/crud/checkRole";
/// Sys - Role --

/// Application
import { MapView } from "@imports/ui/utils/MapView";
/// Application --

// import start
import { Segment } from "semantic-ui-react";
import { Grid } from "semantic-ui-react";
import { Button } from "semantic-ui-react";
import { Image } from "semantic-ui-react";
import { Input } from "semantic-ui-react";

import { MDBModalBody } from "mdbreact";
import { MDBModalW } from "../lib/MDBModalW";

import { displayTabs } from "../lib/utils";

/// Custom - Role - check permission
/**
 *
 *
 * @param {*} mode
 * @returns
 */
export const MapsSP_Maps_View_ComponentInfo = mode => {
  if (!checkAppRole("MapsSP.Consumers", mode)) {
    return null;
  }

  if (checkSystemRole()) {
    return null;
  }

  /// Application
  return { title: "MapsSP/Maps/View", path: "/MapsSP/Maps/View" };
  /// Application --
};
/// Custom - Role - check permission --

/**
 *
 *
 * @class _MapsSP_Maps_View
 * @extends {View}
 */
class _MapsSP_Maps_View extends View {
  "use strict";

  /**
   *Creates an instance of _MapsSP_Maps_View.
   * @param {*} props
   * @memberof _MapsSP_Maps_View
   */
  constructor(props) {
    console.log(new Date().getTime(), "MapsSP_Maps_View constructor");
    super(props);

    /// Custom - Role - check permission
    this.ComponentInfo = MapsSP_Maps_View_ComponentInfo;
    /// Custom - Role - check permission --

    /// Application - Map
    this.center = [139.767125, 35.681236];
    if (this.props.center) {
      this.center = this.props.center;
    }
    /// Application - Map --

    this.state = {
      showModal: false,
      showInputHistory: false,
      showBookmarksView: false,
      showBookmarksInsert: false,
      showsNavigatorInput: false,
      showsNavigatorList: false,
      showsNavigatorPoint: false,
      showsSelector: false,
      showVisitSymbol: true,
      showPinSymbol: true,
      fullScreenMode: false,
      selector: {
        keyword: "",
        createdAtKind: "",
        createdAtFrom: "",
        createdAtTo: "",
        transportationAtKind: "",
        transportationAtFrom: "",
        transportationAtTo: "",
        ranks: [],
        visits: [],
        tags: {
          or: [],
          not: [],
          and: []
        },
        lastVisits: [],
        visitStatus: [],
        pinCategorys: []
      }
    };

    this.onClickMap = this.onClickMap.bind(this);
    this.onDblClickMap = this.onDblClickMap.bind(this);

    this.myRefMap = React.createRef();
    this.myRefConsumers = React.createRef();
    this.myRefPins = React.createRef();

    this.mapExtent = {};

    this.window_innerHeight = window.innerHeight;
  }

  /**
   *
   *
   * @memberof View
   */
  componentDidMount() {
    super.componentDidMount();
    this.getSelector();
  }

  /**
   *
   *
   * @memberof View
   */
  getSelector = () => {
    const selector = Object.assign(
      this.state.selector,
      Session.get("MapsSP_Maps_Selector")
    );
    if (selector) {
      this.setState({ selector: selector });
    }
  };

  /**
   *
   *
   * @memberof View
   */
  setSelector = selector => {
    Session.set("MapsSP_Maps_Selector", selector);
    this.setState({ selector: selector });
    setTimeout(() => this.onRedrawMap(this.mapExtent), 10);
  };

  /**
   *
   *
   * @memberof _MapsSP_Maps_View
   */
  onClickMap = posWorld => {
    console.log(new Date().getTime(), "MapsSP_Maps_View onClickMap");

    this.myRefConsumers.current.onClickMap(posWorld);
  };

  /**
   *
   *
   * @memberof _MapsSP_Maps_View
   */
  onDblClickMap = posWorld => {
    console.log(new Date().getTime(), "MapsSP_Maps_View onDblClickMap");

    this.myRefPins.current.onClickMap(posWorld);
  };

  /**
   *
   *
   * @memberof _MapsSP_Maps_View
   */
  onRedrawMap = mapExtent => {
    console.log(new Date().getTime(), "MapsSP_Maps_View onRedrawMap");
    console.log("mapExtent", mapExtent);
    this.center = mapExtent.centerWorld;
    this.mapExtent = mapExtent;

    window.$GLOBAL$.__MapView__.clearLayer();

    this.myRefConsumers.current.onRedrawMap(
      mapExtent,
      this.state.selector,
      this.state.showVisitSymbol
    );
    if (this.state.showPinSymbol) {
      setTimeout(
        () =>
          this.myRefPins.current.onRedrawMap(mapExtent, this.state.selector),
        100
      );
    }
  };

  /**
   *
   *
   * @memberof _MapsSP_Maps_View
   */
  getPolygonCallback = (obj, posWorld, polygonTokyo) => {
    console.log(new Date().getTime(), "MapsSP_Maps_View getPolygonCallback");

    if (obj == "consumers") {
      this.myRefConsumers.current.getPolygonCallback(
        obj,
        posWorld,
        polygonTokyo
      );
    }
    if (obj == "pins") {
      this.myRefPins.current.getPolygonCallback(obj, posWorld, polygonTokyo);
    }
  };

  /**
   *
   *
   * @memberof _MapsSP_Maps_View
   */
  getAddressCallback = (obj, ret) => {
    console.log(
      new Date().getTime(),
      "MapsSP_Maps_View getAddressCallback",
      obj,
      ret
    );

    if (obj == "consumers") {
      this.myRefConsumers.current.getAddressCallback(obj, ret);
    }
    if (obj == "pins") {
      this.myRefPins.current.getAddressCallback(obj, ret);
    }
  };

  /**
   *
   *
   * @memberof _MapsSP_Maps_View
   */
  getAddressCallbackError = () => {};

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
  gotoMap = () => {
    this.props.history.replace("/MapsSP/Maps/View");
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
  gotoPin = () => {
    this.props.history.replace("/MapsSP/Pins/View");
  };

  /**
   *
   *
   * @memberof _MapsSP_Consumers_List
   */
  onSearchAddress = address => {
    window.$GLOBAL$.__MapView__.searchAddress(address);
  };

  /**
   *
   *
   * @memberof MapsSP_Consumers_Detail
   */
  onClickInputHistory = () => {
    this.setState({ showModal: false, showInputHistory: true });
  };

  /**
   *
   *
   * @memberof MapsSP_Consumers_Detail
   */
  toggleInputHistory = () => {
    this.setState({ showInputHistory: !this.state.showsInputHistory });
  };

  /**
   *
   *
   * @memberof MapsSP_Consumers_Detail
   */
  closeInputHistory = () => {
    this.setState({ showInputHistory: false });
  };

  /**
   *
   *
   * @memberof MapsSP_Consumers_Detail
   */
  onClickBookmarksView = () => {
    this.setState({ showModal: false, showBookmarksView: true });
  };

  /**
   *
   *
   * @memberof MapsSP_Consumers_Detail
   */
  toggleBookmarksView = () => {
    this.setState({ showBookmarksView: !this.state.showBookmarksView });
  };
  /**
   *
   *
   * @memberof MapsSP_Consumers_Detail
   */
  closeBookmarksView = () => {
    this.setState({ showBookmarksView: false, showInputHistory: false });
  };

  /**
   *
   *
   * @memberof MapsSP_Consumers_Detail
   */
  onClickBookmarksInsert = () => {
    this.setState({ showModal: false, showBookmarksInsert: true });
  };

  /**
   *
   *
   * @memberof MapsSP_Consumers_Detail
   */
  toggleBookmarksInsert = () => {
    this.setState({ showBookmarksInsert: !this.state.showBookmarksInsert });
  };

  /**
   *
   *
   * @memberof MapsSP_Consumers_Detail
   */
  closeBookmarksInsert = () => {
    this.setState({ showBookmarksInsert: false });
  };

  /**
   *
   *
   * @memberof MapsSP_Consumers_Detail
   */
  onClickNavigatorInput = () => {
    this.setState({ showModal: false, showNavigatorInput: true });
  };

  /**
   *
   *
   * @memberof MapsSP_Consumers_Detail
   */
  toggleNavigatorInput = () => {
    this.setState({ showNavigatorInput: !this.state.showNavigatorInput });
  };

  /**
   *
   *
   * @memberof MapsSP_Consumers_Detail
   */
  closeNavigatorInput = () => {
    this.setState({ showNavigatorInput: false });
  };

  /**
   *
   *
   * @memberof MapsSP_Consumers_Detail
   */
  onClickNavigatorList = () => {
    this.setState({ showModal: false, showNavigatorList: true });
  };

  /**
   *
   *
   * @memberof MapsSP_Consumers_Detail
   */
  toggleNavigatorList = () => {
    this.setState({ showNavigatorList: !this.state.showNavigatorList });
  };

  /**
   *
   *
   * @memberof MapsSP_Consumers_Detail
   */
  closeNavigatorList = () => {
    this.setState({ showNavigatorList: false });
  };

  /**
   *
   *
   * @memberof MapsSP_Consumers_Detail
   */
  onClickNavigatorPoint = () => {
    this.setState({ showModal: false, showNavigatorPoint: true });
  };

  /**
   *
   *
   * @memberof MapsSP_Consumers_Detail
   */
  toggleNavigatorPoint = () => {
    this.setState({ showNavigatorPoint: !this.state.showNavigatorPoint });
  };

  /**
   *
   *
   * @memberof MapsSP_Consumers_Detail
   */
  closeNavigatorPoint = () => {
    this.setState({ showNavigatorPoint: false });
  };

  /**
   *
   *
   * @memberof MapsSP_Consumers_Detail
   */
  onClickSelector = () => {
    this.setState({ showModal: false, showSelector: true });
  };

  /**
   *
   *
   * @memberof MapsSP_Consumers_Detail
   */
  toggleSelector = () => {
    this.setState({ showSelector: !this.state.showSelector });
  };

  /**
   *
   *
   * @memberof MapsSP_Consumers_Detail
   */
  closeSelector = () => {
    this.setState({ showSelector: false });
  };

  /**
   *
   *
   * @memberof Selector
   */
  onClickPinSymbol = () => {
    this.setState({
      showPinSymbol: !this.state.showPinSymbol,
      showModal: false
    });
    setTimeout(() => this.onRedrawMap(this.mapExtent), 10);
  };

  /**
   *
   *
   * @memberof Selector
   */
  onClickVisitSymbol = () => {
    this.setState({
      showVisitSymbol: !this.state.showVisitSymbol,
      showModal: false
    });
    setTimeout(() => this.onRedrawMap(this.mapExtent), 10);
  };

  /// Custom - View - layout
  /**
   *
   *
   * @returns
   * @memberof _MapsSP_Maps_View
   */
  render() {
    console.log(new Date().getTime(), "MapsSP_Maps_View render");

    /// Custom - Collection - subscribe
    //    if (this.props.loading) {
    //      return <span />;
    //    }
    /// Custom - Collection - subscribe --

    return (
      <React.Fragment>
        <Segment
          style={{
            marginBottom: "0px",
            border: "none",
            padding: "0px",
            height: "4px",
            backgroundColor: "#2e3d51"
          }}
        ></Segment>

        {/* 検索ボックス start */}
        {
          <If condition={!this.state.fullScreenMode}>
            <Segment
              style={{
                padding: "5px 14px",
                marginBottom: "0px",
                width: "90%",
                marginLeft: "18px",
                top: "14px",
                position: "fixed",
                zIndex: 1
              }}
            >
              <Input
                onClick={this.onClickInputHistory}
                className="font-color font-family"
                inverted
                placeholder="検索とブックマーク"
                style={{ width: "100%" }}
              />
            </Segment>
          </If>
        }
        {/* 検索ボックス end */}

        <MapView
          ref={this.myRefMap}
          style={{ width: "100%", height: this.window_innerHeight - 4 + "px" }}
          center={this.center}
          onClickMap={this.onClickMap}
          onDblClickMap={this.onDblClickMap}
          onRedrawMap={this.onRedrawMap}
          getAddressCallback={this.getAddressCallback}
          getPolygonCallback={this.getPolygonCallback}
          getAddressCallbackError={this.getAddressCallbackError}
        />

        {/* 下部ボタン start */}
        {
          <If condition={!this.state.fullScreenMode}>
            <Segment basic className="fotter-area">
              {displayTabs(this, 2)}
            </Segment>
          </If>
        }
        {/* 下部ボタン end */}

        {/* 矢印ボタン start */}
        {
          <If condition={!this.state.fullScreenMode}>
            <Button
              onClick={() => {
                this.setState({ fullScreenMode: true });
              }}
              size="huge"
              className="map-bottom-btn"
            >
              <Image src="/smsk-front/↓↓.svg" />
            </Button>
          </If>
        }
        {
          <If condition={this.state.fullScreenMode}>
            <Button
              onClick={() => {
                this.setState({ fullScreenMode: false });
              }}
              size="huge"
              className="map-bottom-btn2"
            >
              <Image src="/smsk-front/↑↑.svg" />
            </Button>
          </If>
        }
        {/* 矢印ボタン end */}

        {/* フローティングボタン start */}
        <Button
          circular
          size="big"
          style={{
            position: "fixed",
            bottom: this.state.fullScreenMode ? "195px" : "255px",
            right: "6px",
            backgroundColor: "transparent",
            padding: "0px"
          }}
        >
          <Image src="/smsk-front/現在地ON.svg" />
        </Button>

        <Button
          onClick={this.onClickNavigatorList}
          circular
          size="big"
          style={{
            position: "fixed",
            bottom: this.state.fullScreenMode ? "120px" : "180px",
            right: "6px",
            backgroundColor: "transparent",
            padding: "0px"
          }}
        >
          <Image src="/smsk-front/ルート.svg" />
        </Button>

        {/* モーダル start */}
        <Button
          onClick={() => this.setState({ showModal: true })}
          className="floating-btn"
          style={{
            bottom: this.state.fullScreenMode ? "40px" : "100px"
          }}
        >
          {/* <Image src={window.$GLOBAL$.__SVG__["フローティングアイコン"]} /> */}
          <Image src="/smsk-front/フローティングアイコン.svg" />
        </Button>

        <MDBModalW
          isOpen={this.state.showModal}
          toggle={() => this.setState({ showModal: true })}
          fullHeight
          size="large"
          className="m-0 p-0"
          id="modal-black"
        >
          <Grid
            className="right aligned"
            style={{
              width: "100%",
              position: "fixed",
              right: "9px",
              bottom: this.state.fullScreenMode ? "67px" : "127px"
            }}
          >
            <Grid.Row style={{ paddingBottom: "10px" }}>
              <Grid.Column>
                <p className="font-family right aligned floatingmenu-p">
                  PDF出力
                  <Image
                    className="floatingmenu-img"
                    src="/smsk-front/export_PDF.svg"
                  />
                </p>
              </Grid.Column>
            </Grid.Row>

            <Grid.Row style={{ paddingBottom: "10px" }}>
              <Grid.Column>
                <p
                  onClick={this.onClickBookmarksView}
                  className="font-family right aligned floatingmenu-p"
                >
                  ブックマーク
                  <Image
                    className="floatingmenu-img"
                    src={window.$GLOBAL$.__SVG__["bookmark"]}
                  />
                </p>
              </Grid.Column>
            </Grid.Row>

            <Grid.Row style={{ paddingBottom: "10px" }}>
              <Grid.Column>
                <p
                  onClick={this.onClickVisitSymbol}
                  className="font-family right aligned floatingmenu-p"
                >
                  訪問
                  <Image
                    className="floatingmenu-img"
                    src={
                      this.state.showVisitSymbol
                        ? window.$GLOBAL$.__SVG__["houmon_ON"]
                        : window.$GLOBAL$.__SVG__["houmon_OFF"]
                    }
                  />
                </p>
              </Grid.Column>
            </Grid.Row>

            <Grid.Row style={{ paddingBottom: "10px" }}>
              <Grid.Column>
                <p
                  onClick={this.onClickPinSymbol}
                  className="font-family right aligned floatingmenu-p"
                >
                  ピン
                  <Image
                    className="floatingmenu-img"
                    src={
                      this.state.showPinSymbol
                        ? window.$GLOBAL$.__SVG__["pin_ON"]
                        : window.$GLOBAL$.__SVG__["pin_OFF"]
                    }
                  />
                </p>
              </Grid.Column>
            </Grid.Row>

            <Grid.Row style={{ paddingBottom: "10px" }}>
              <Grid.Column>
                <p
                  onClick={this.onClickSelector}
                  className="font-family right aligned floatingmenu-p"
                >
                  絞り込み
                  <Image
                    className="floatingmenu-img"
                    src={window.$GLOBAL$.__SVG__["sort"]}
                  />
                </p>
              </Grid.Column>
            </Grid.Row>

            <Grid.Row style={{ paddingBottom: "5px", height: "75px" }}>
              <Grid.Column>
                <Image
                  onClick={() => this.setState({ showModal: false })}
                  src="/smsk-front/閉じる.svg"
                  style={{
                    float: "right",
                    bottom: "15px",
                    left: "6px"
                  }}
                />
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </MDBModalW>
        {/* モーダル end */}

        <MDBModalW
          size="large"
          isOpen={this.state.showInputHistory}
          toggle={this.toggleInputHistory}
          className="m-0 p-0"
        >
          <MDBModalBody className="m-0 p-0">
            <InputHistory
              close={this.closeInputHistory}
              onSearchAddress={this.onSearchAddress}
              onClickBookmarksView={this.onClickBookmarksView}
            />
          </MDBModalBody>
        </MDBModalW>

        <MDBModalW
          size="large"
          isOpen={this.state.showBookmarksView}
          toggle={this.toggleBookmarksView}
          className="m-0 p-0"
        >
          <MDBModalBody className="m-0 p-0">
            <BookmarksView close={this.closeBookmarksView} />
          </MDBModalBody>
        </MDBModalW>

        <MDBModalW
          size="large"
          isOpen={this.state.showBookmarksInsert}
          toggle={this.toggleBookmarksInsert}
          className="m-0 p-0 pinmodal-style"
        >
          <BookmarksInsert close={this.closeBookmarksInsert} />
        </MDBModalW>

        <MDBModalW
          size="large"
          isOpen={this.state.showNavigatorList}
          toggle={this.toggleNavigatorList}
          className="m-0 p-0"
        >
          <MDBModalBody className="m-0 p-0">
            <NavigatorList close={this.closeNavigatorList} />
          </MDBModalBody>
        </MDBModalW>

        <MDBModalW
          size="large"
          isOpen={this.state.showNavigatorInput}
          toggle={this.toggleNavigatorInput}
          className="m-0 p-0"
        >
          <MDBModalBody className="m-0 p-0">
            <NavigatorInput close={this.closeNavigatorInput} />
          </MDBModalBody>
        </MDBModalW>

        <MDBModalW
          size="large"
          isOpen={this.state.showNavigatorPoint}
          toggle={this.toggleNavigatorPoint}
          className="m-0 p-0"
        >
          <MDBModalBody className="m-0 p-0">
            <NavigatorPoint close={this.closeNavigatorPoint} />
          </MDBModalBody>
        </MDBModalW>

        <MDBModalW
          size="large"
          isOpen={this.state.showSelector}
          toggle={this.toggleSelector}
          id="map34-modal"
        >
          <MDBModalBody id="map34-content1">
            <Selector
              selector={this.state.selector}
              setSelector={this.setSelector}
              close={this.closeSelector}
            />
          </MDBModalBody>
        </MDBModalW>

        <ConsumersView
          selector={this.state.selector}
          ref={this.myRefConsumers}
        />

        <PinsView selector={this.state.selector} ref={this.myRefPins} />
      </React.Fragment>
    );
  }
  /// Custom - View - layout --
}

/// Custom - View - tracker
export const MapsSP_Maps_View = withTracker(props => {
  /// Custom - Collection - subscribe

  let center = null;
  if (props && props.match && props.match.params && props.match.params.center) {
    center = props.match.params.center.split(",");
    if (center.length == 2) {
      center[0] = Number(center[0]);
      center[1] = Number(center[1]);
    } else {
      center = null;
    }
  }

  return {
    ComponentInfo: MapsSP_Maps_View_ComponentInfo,
    center: center
  };
  /// Custom - Collection - subscribe --
})(_MapsSP_Maps_View);
/// Custom - View - tracker --
