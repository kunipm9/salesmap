/// Sys - View
import React from "react";
import _ from "lodash";
/// Sys - View --

import View from "@imports/ui/crud/View";

/// Application
import { MapView } from "@imports/ui/utils/MapView";
/// Application --

// import start
import { Segment } from "semantic-ui-react";

import { Header } from "semantic-ui-react";
import { Grid } from "semantic-ui-react";
import { Button } from "semantic-ui-react";
import { Image } from "semantic-ui-react";

/**
 *
 *
 * @class _MapsSP_Consumers_View
 * @extends {View}
 */
export class Detail_Map extends View {
  "use strict";

  /**
   *Creates an instance of _MapsSP_Consumers_View.
   * @param {*} props
   * @memberof _MapsSP_Consumers_View
   */
  constructor(props) {
    console.log(new Date().getTime(), "MapsSP_Consumers_View constructor");
    super(props);

    /// Application - Map
    this.center = [139.767125, 35.681236];
    /// Application - Map --

    this.myRefMap = React.createRef();

    this.pathPolygonTokyo = "residenceAddress.location.shape.polygonTokyo";
    this.pathCoordinates = "residenceAddress.location.pos.coordinates";

    this.window_innerHeight = window.innerHeight;
  }

  /**
   *
   *
   * @memberof _MapsSP_Consumers_View
   */
  onClickMap = () => {
    let center = _.get(this.props.doc, this.pathCoordinates);
    this.props.history.replace(
      "/MapsSP/Maps/ViewPos/" + center[0] + "," + center[1]
    );
  };

  /**
   *
   *
   * @memberof _MapsSP_Consumers_View
   */
  onRedrawMap = mapExtent => {
    console.log(new Date().getTime(), "View onRedrawMap");
    console.assert(mapExtent, "mapExtent is null");

    this.mapExtent = mapExtent;

    this.shapesTokyo = [];
    this.shapesTokyo.push({
      polygon: _.get(this.props.doc, this.pathPolygonTokyo),
      flag: "p"
    });

    window.$GLOBAL$.__MapView__.clearLayer();
    window.$GLOBAL$.__MapView__.drawBuildings(this.shapesTokyo);
  };

  /**
   *
   *
   * @memberof _MapsSP_Consumers_View
   */
  getPolygonCallback = () => {};

  /**
   *
   *
   * @memberof _MapsSP_Consumers_View
   */
  getAddressCallback = () => {};

  /**
   *
   *
   * @memberof _MapsSP_Consumers_View
   */
  getAddressCallbackError = () => {};

  /// Custom - View - layout
  /**
   *
   *
   * @returns
   * @memberof _MapsSP_Consumers_View
   */
  render() {
    console.log(new Date().getTime(), "MapsSP_Consumers_View render");

    let center = _.get(this.props.doc, this.pathCoordinates);
    if (!center) {
      center = this.center;
    }

    return (
      <React.Fragment>
        {/* Link start */}
        <Segment className="header-line" />
        <Segment className="link-area5">
          <Grid centered className="center aligned content">
            <Grid.Row className="header-row">
              <Grid.Column width={2}>
                <Button
                  onClick={this.props.closeDetail_Map}
                  className="close-area"
                >
                  <Image src={window.$GLOBAL$.__SVG__["戻る"]} />
                </Button>
              </Grid.Column>
              <Grid.Column width={14} className="center aligned content header">
                <Header as="h2" className="font-color font-family header-font">
                  地図
                </Header>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Segment>
        {/* Link end */}

        {/* 詳細 start */}
        <Segment style={{ margin: 0, padding: 0 }}>
          <MapView
            ref={this.myRefMap}
            style={{
              width: "100%",
              height: this.window_innerHeight - 60 + "px"
            }}
            center={center}
            onClickMap={this.onClickMap}
            onRedrawMap={this.onRedrawMap}
            getAddressCallback={this.getAddressCallback}
            getPolygonCallback={this.getPolygonCallback}
            getAddressCallbackError={this.getAddressCallbackError}
          />
        </Segment>
        {/* 詳細 end */}
      </React.Fragment>
    );
  }
  /// Custom - View - layout --
}
