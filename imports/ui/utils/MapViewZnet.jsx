/* global ZntMap */
/* global ZntPoint */
/* global ZntScrollLayer */
/* global ZntBldPolygonSearch */
/* global ZntBldPolygonSearchSettings */
/* global ZntBldFeatureSearch */
/* global ZntBldFeatureSearchSettings */
/* global ZntAddressMatch */
/* global ZntAddressMatchSettings */
/* global ZntBuildingSearch */
/* global ZntBuildingSearchSettings */
/* global ZntAddressStringSearch */
/* global ZntAddressStringSearchSettings */
/* global ZntAddressSearch */
/* global ZntAddressSearchSettings */

/// Custom - Map - map field
import React, { createRef } from "react";
import { Random } from "meteor/random";
import _ from "lodash";
let createjs, proj4, simpleheat; // eslint-disable-line no-unused-vars
if (Meteor.isClient) {
  createjs = require("createjs-module");
  proj4 = require("proj4");
  simpleheat = require("simpleheat");
}
/// Custom - Map - map field --

import { MDBModal, MDBModalBody } from "mdbreact";

const isMobile = true; // eslint-disable-line no-unused-vars

import { svg_list, htmlToNode, png_list } from "./svgList";

/// Custom - Map - map field
/**
 *
 *
 * @export
 * @class MapViewZnet
 * @extends {React.Component}
 */
export class MapViewZnet extends React.PureComponent {
  /**
   *Creates an instance of MapViewZnet.
   * @param {*} props
   * @memberof MapViewZnet
   */
  constructor(props) {
    super(props);

    this.state = {
      message: "",
      showMessageModal: false
    };

    this.mapRef = createRef();
    this.znetResult = null;
    this.map = null;
    this.preZoomLevel = 0;
    this.mapExtent = null;
    this.canvas = null;
    this.ctx = null;
    this.drawLimitter = [];

    this.id = Random.id(15);
    this.layer = null;

    this.loadScript = this.loadScript.bind(this);
    this.loadScriptBody = this.loadScriptBody.bind(this);
    this.login = this.login.bind(this);
    this.load = this.load.bind(this);
    this.initMap = this.initMap.bind(this);
    this.setMapExtent = this.setMapExtent.bind(this);
    this.drawMap = this.drawMap.bind(this);
    this.initLayer = this.initLayer.bind(this);
    this.clearLayer = this.clearLayer.bind(this);
    this.requestReDrawMap = this.requestReDrawMap.bind(this);
    this.scrollTo = this.scrollTo.bind(this);
    this.searchAddress = this.searchAddress.bind(this);
    this.drawHeatmap = this.drawHeatmap.bind(this);
    this.drawSymbols = this.drawSymbols.bind(this);
    this.drawSymbol = this.drawSymbol.bind(this);
    this.drawBuildings = this.drawBuildings.bind(this);
    this.drawBuildingsBody = this.drawBuildingsBody.bind(this);
    this.drawBuilding = this.drawBuilding.bind(this);
    this.drawPolygon = this.drawPolygon.bind(this);

    this.onClickMap = this.onClickMap.bind(this);
    this.onDblClickMap = this.onDblClickMap.bind(this);
    this.onRedrawMap = this.onRedrawMap.bind(this);
    this.onRedrawMapZoom = this.onRedrawMapZoom.bind(this);
    this.debouncedOnRedrawMapZoom = _.debounce(
      this.debouncedOnRedrawMapZoom.bind(this),
      300
    );

    this.isProvideBldApi = this.isProvideBldApi.bind(this);
    this.getAddressByString = this.getAddressByString.bind(this);
    this.getAddressByStringStep2 = this.getAddressByStringStep2.bind(this);
    this.getAddressByPoint = this.getAddressByPoint.bind(this);
    this.getAddressByPointStep2 = this.getAddressByPointStep2.bind(this);
    this.getAddressByPointStep3A = this.getAddressByPointStep3A.bind(this);
    this.getAddressByPointStep3B = this.getAddressByPointStep3B.bind(this);
    this.getAddressByPointStep4 = this.getAddressByPointStep4.bind(this);
    this.getAddressByPointStep5 = this.getAddressByPointStep5.bind(this);

    this.getCenterPos = this.getCenterPos.bind(this);
    this.getZoomLevel = this.getZoomLevel.bind(this);
    this.setZoomLevel = this.setZoomLevel.bind(this);

    proj4.defs([
      [
        "EPSG:4301", //東京測地系/日本測地系 SRID=4301
        "+proj=longlat +ellps=bessel +towgs84=-146.414,507.337,680.507,0,0,0,0 +no_defs"
      ]
    ]);

    this.img_list = [];
    Object.keys(png_list).map(p => {
      const img = new Image();
      img.src = png_list[p];
      this.img_list[p] = img;
    });

    window.$GLOBAL$.__MapView__ = this;
  }

  /**
   *
   *
   * @returns
   * @memberof MapViewZnet
   */
  isProvideBldApi() {
    return false;
  }

  /**
   *
   *
   * @memberof MapViewZnet
   */
  loadScript() {
    console.log(new Date().getTime(), "MapViewZnet loadScript");

    const loaderNode = document.getElementById("map-loader");
    const iframe = document.createElement("IFRAME");
    loaderNode.appendChild(iframe);
    const doc = frames[frames.length - 1].document;

    doc.write = url2 => {
      url2 = url2.replace("<script type='text/javascript' src='", "");
      url2 = url2.replace("about", "https");
      url2 = url2.replace("' ></script>", "");

      loaderNode.removeChild(loaderNode.firstChild);
      this.loadScriptBody(url2);
    };

    const url =
      "https://lab.zapi.znet-town.net/znettown/api/loadapi.php?enc=utf8&cnt=1&mobile=2";
    const script = doc.createElement("script");
    script.setAttribute("src", url);
    doc.body.appendChild(script);

    this.setState({ message: "Loading Script" });
  }

  /**
   *
   *
   * @param {*} url
   * @memberof MapViewZnet
   */
  loadScriptBody(url) {
    console.log(new Date().getTime(), "MapViewZnet loadScriptBody", url);

    window.ZntAuth = null;

    const script = document.createElement("script");
    script.setAttribute("src", url);
    script.setAttribute("id", "MapViewZnetLoadScriptBody");
    script.addEventListener("load", () => {
      this.setState({ message: "Loading Script finished" });

      //console.log("window.ZntAuth", window.ZntAuth);
      //console.log("window.ZntMap", window.ZntMap);
      //console.log("window.ZntMapOptions", window.ZntMapOptions);
      //console.log("window.ZntPoint", window.ZntPoint);
      //console.log("window.ZntSize", window.ZntSize);
      //console.log("window.ZntAuth.getStatus()", window.ZntAuth.getStatus());
      //console.log("window", window);

      const element = document.getElementById("MapViewZnetLoadScriptBody");
      element.parentNode.removeChild(element);

      this.initMap();
    });
    document.body.appendChild(script);
  }

  /**
   *
   *
   * @memberof MapViewZnet
   */
  login() {
    console.log(
      new Date().getTime(),
      "MapViewZnet login ---------------------------"
    );

    const cid = "20090563";
    const uid = "xjtb8kfs";
    const pwd = "msvusxdu";

    this.setState({ message: "Login..." });

    window.ZntAuth.addEventListener("login", result => {
      window.ZntAuth.clearEventListeners("login");
      console.log("login", result);

      if (result == "10100000") {
        this.setState({ message: "Login OK" });

        //console.log("window.ZntAuth", window.ZntAuth);
        //console.log("window.ZntMap", window.ZntMap);
        //console.log("window.ZntMapOptions", window.ZntMapOptions);
        //console.log("window.ZntPoint", window.ZntPoint);
        //console.log("window.ZntSize", window.ZntSize);
        //console.log("window.ZntAuth.getStatus()", window.ZntAuth.getStatus());
        //console.log("window", window);

        if (window.ZntAuth.getStatus() == window.ZntAuth.STATUS_LOGIN) {
          console.log("window.ZntAuth LOGIN initMap");
          this.initMap();
        }

        if (
          window.ZntAuth.getStatus() == window.ZntAuth.STATUS_LOGIN_PROGRESS
        ) {
          setTimeout(() => {
            if (window.ZntAuth.getStatus() == window.ZntAuth.STATUS_LOGIN) {
              console.log("window.ZntAuth PROGRESS initMap");
              this.initMap();
            }
          }, 1000);
        }

        if (window.ZntAuth.getStatus() == window.ZntAuth.STATUS_LOGOUT) {
          window.ZntAuth = null;
          setTimeout(() => {
            console.log("window.ZntAuth LOGOUT initMap");
            this.initMap();
          }, 3000);
        }
      } else {
        this.setState({
          message: "Login NG" + " " + result,
          showMessageModal: true
        });
      }
    });

    window.ZntAuth.login(cid, uid, pwd);
  }

  /**
   *
   *
   * @memberof MapViewZnet
   */
  load() {
    console.log(new Date().getTime(), "MapViewZnet load");

    window.ZntAuth.addEventListener("load", result => {
      window.ZntAuth.clearEventListeners("load");
      console.log("load", result);

      //console.log("window.ZntAuth", window.ZntAuth);
      //console.log("window.ZntMap", window.ZntMap);
      //console.log("window.ZntMapOptions", window.ZntMapOptions);
      //console.log("window.ZntPoint", window.ZntPoint);
      //console.log("window.ZntSize", window.ZntSize);
      //console.log("window.ZntAuth.getStatus()", window.ZntAuth.getStatus());
      //console.log("window", window);

      if (result == "19100000" || result == "19110003") {
        console.log("load initMap");
        this.initMap();
      }
    });

    window.ZntAuth.loadAPI();
  }

  /**
   *
   *
   * @returns
   * @memberof MapViewZnet
   */
  initMap() {
    console.log(new Date().getTime(), "MapViewZnet initMap");

    if (!window.ZntAuth) {
      console.log("initMap ! window.ZntAuth");
      this.loadScript();
      return;
    }

    if (window.ZntAuth.getStatus() == window.ZntAuth.STATUS_LOGOUT) {
      console.log(
        "initMap window.ZntAuth.getStatus() == window.ZntAuth.STATUS_LOGOUT"
      );
      this.login();
      return;
    }

    this.setState({ message: "Already Logined" });

    if (!window.ZntMap) {
      console.log("initMap ! window.ZntMap");
      this.load();
      return;
    }

    if (!this.map) {
      console.log("initMap ! this.map");
      this.map = new window.ZntMap();
    }

    this.drawMap();
  }

  /**
   *
   *
   * @returns
   * @memberof MapViewZnet
   */
  setMapExtent() {
    console.log(new Date().getTime(), "MapViewZnet setMapExtent");
    this.mapExtent = this.map.getExtent();
    console.assert(this.mapExtent, "this.mapExtent is null");

    if (!this.mapExtent) {
      console.log(
        new Date().getTime(),
        "MapViewZnet setMapExtent ! this.mapExtent return"
      );
      return;
    }

    this.mapExtent.maxTokyo = this.mapExtent.max;
    this.mapExtent.minTokyo = this.mapExtent.min;
    const wmin = this.tokyo2world([
      this.mapExtent.minTokyo.x,
      this.mapExtent.minTokyo.y
    ]);
    const wmax = this.tokyo2world([
      this.mapExtent.maxTokyo.x,
      this.mapExtent.maxTokyo.y
    ]);
    this.mapExtent.maxWorld = { x: wmax[0], y: wmax[1] };
    this.mapExtent.minWorld = { x: wmin[0], y: wmin[1] };
    this.mapExtent.width = this.width;
    this.mapExtent.height = this.height;
  }

  /**
   *
   *
   * @returns
   * @memberof MapViewZnet
   */
  drawMap() {
    console.log(new Date().getTime(), "MapViewZnet drawMap");

    const container = $("#" + this.id)[0];
    if (!container) {
      return;
    }

    const opts = new window.ZntMapOptions();

    const centerPos = this.world2tokyo(this.props.center);
    opts.initPos = new window.ZntPoint(centerPos[0], centerPos[1]);

    this.width = container.clientWidth;
    this.height = container.clientHeight;
    opts.size = new window.ZntSize(this.width, this.height);

    opts.initZoomLevel = 14;
    opts.scrollButton = false;
    opts.zoomBar = true;
    //  opts.zoomBar = false;
    opts.pinchZoom = true;
    opts.dblclickScroll = false;
    opts.scaleBar = false;
    opts.centerMark = false;

    this.map.initialize(container, opts);

    this.map.clearEventListeners("click");
    this.map.clearEventListeners("dblclick");
    this.map.clearEventListeners("scrollend");
    this.map.clearEventListeners("zoomend");

    this.map.addEventListener("click", this.onClickMap);
    this.map.addEventListener("dblclick", this.onDblClickMap);
    this.map.addEventListener("scrollend", this.onRedrawMap);
    this.map.addEventListener("zoomend", this.onRedrawMapZoom);

    this.setMapExtent();

    setTimeout(() => {
      this.initLayer();
      this.onRedrawMap();
    }, 300);
  }

  /**
   *
   *
   * @param {number[]} posTokyo
   * @returns
   * @memberof MapViewZnet
   */
  tokyo2world(posTokyo) {
    console.assert(posTokyo, "posTokyo is null");

    const ret = proj4("EPSG:4301", "EPSG:4326", [
      posTokyo[0] / 3600000,
      posTokyo[1] / 3600000
    ]);
    return ret;
  }

  /**
   *
   *
   * @param {number[]} posWorld
   * @returns
   * @memberof MapViewZnet
   */
  world2tokyo(posWorld) {
    console.assert(posWorld, "posWorld is null");

    let ret = proj4("EPSG:4326", "EPSG:4301", posWorld);
    ret = [Math.round(ret[0] * 3600000), Math.round(ret[1] * 3600000)];
    return ret;
  }

  /**
   *
   *
   * @param {number[]} posTokyo
   * @returns
   * @memberof MapViewZnet
   */
  tokyo2view(posTokyo) {
    const tw = this.mapExtent.maxTokyo.x - this.mapExtent.minTokyo.x;
    const th = this.mapExtent.maxTokyo.y - this.mapExtent.minTokyo.y;

    const tdx = posTokyo[0] - this.mapExtent.minTokyo.x;
    const tdy = this.mapExtent.maxTokyo.y - posTokyo[1];
    const rx = Math.ceil((tdx / tw) * this.mapExtent.width);
    const ry = Math.ceil((tdy / th) * this.mapExtent.height);
    return [rx, ry];
  }

  /**
   *
   *
   * @param {number[]} posWorld
   * @returns
   * @memberof MapViewLeaflet
   */
  world2view(posWorld) {
    const tw = this.mapExtent.maxWorld.x - this.mapExtent.minWorld.x;
    const th = this.mapExtent.maxWorld.y - this.mapExtent.minWorld.y;

    const tdx = posWorld[0] - this.mapExtent.minWorld.x;
    const tdy = this.mapExtent.maxWorld.y - posWorld[1];
    const rx = Math.ceil((tdx / tw) * this.mapExtent.width);
    const ry = Math.ceil((tdy / th) * this.mapExtent.height);
    return [rx, ry];
  }

  /**
   *
   *
   * @returns
   * @memberof MapViewZnet
   */
  clearLayer() {
    console.log(new Date().getTime(), "MapViewZnet clearLayer");

    if (!this.layer) {
      console.log(
        new Date().getTime(),
        "MapViewZnet clearLayer ! this.layer return"
      );
      return;
    }

    this.setMapExtent();
    if (!this.mapExtent) {
      console.log(
        new Date().getTime(),
        "MapViewZnet clearLayer ! this.mapExtent return"
      );
      return;
    }

    const orgPoint = this.map.viewToLatlon(new ZntPoint(0, 0));
    this.layer.moveElement(this.canvas, orgPoint);

    this.ctx.globalAlpha = 1;
    this.ctx.clearRect(0, 0, this.mapExtent.width, this.mapExtent.height);

    while (this.svg.firstChild) {
      this.svg.removeChild(this.svg.firstChild);
    }
  }

  /**
   *
   *
   * @returns
   * @memberof MapViewZnet
   */
  initLayer() {
    console.log(new Date().getTime(), "MapViewZnet initLayer");

    if (!this.mapExtent) {
      console.log(
        new Date().getTime(),
        "MapViewZnet initLayer ! this.mapExtent return"
      );
      return;
    }

    this.layer = new ZntScrollLayer();
    this.layer.setVisible(true);
    this.map.addCustomLayer(ZntMap.CLAYER_SCROLL, this.layer);

    this.layer2 = new ZntScrollLayer();
    this.layer2.setVisible(true);
    this.map.addCustomLayer(ZntMap.CLAYER_SCROLL, this.layer2);

    this.canvas = document.createElement("canvas");
    this.canvas.style["pointer-events"] = "none";
    this.canvas.width = this.mapExtent.width;
    this.canvas.height = this.mapExtent.height;

    const orgPoint = this.map.viewToLatlon(new ZntPoint(0, 0));
    this.layer.addElement(this.canvas, orgPoint);

    this.ctx = this.canvas.getContext("2d");
    this.ctx.clearRect(0, 0, this.mapExtent.width, this.mapExtent.height);

    this.simpleheat = simpleheat(this.canvas);

    this.svg = document.createElement("div");
    this.svg.style["pointer-events"] = "none";
    this.svg.width = this.mapExtent.width;
    this.svg.height = this.mapExtent.height;
    this.layer2.addElement(this.svg, orgPoint);
  }

  /**
   *
   *
   * @memberof MapViewZnet
   */
  requestReDrawMap() {
    this.onRedrawMap();
  }

  /**
   *
   *
   * @param {number[]} posWorld
   * @memberof MapViewZnet
   */
  scrollTo(posWorld) {
    console.log(new Date().getTime(), "MapViewZnet scrollTo", posWorld);
    console.assert(posWorld, "posWorld is null");

    if (this.map) {
      const posTokyo = this.world2tokyo(posWorld);
      this.map.scrollTo(new ZntPoint(posTokyo[0], posTokyo[1]));
      //    } else {
      //      setTimeout(() => {
      //        this.scrollTo(posWorld);
      //      }, 500);
    }
  }

  /**
   *
   *
   * @param {string} address
   * @memberof MapViewZnet
   */
  searchAddress(address) {
    console.log(new Date().getTime(), "MapViewZnet searchAddress", address);
    console.assert(address, "address is null");

    if (this.map) {
      const sear = new ZntAddressSearch();
      const opts = new ZntAddressSearchSettings();
      opts.freeWord = address;
      sear.addEventListener("receive", receive => {
        console.log("ZntAddressSearch", opts, receive);
        sear.clearEventListeners("receive");
        if (_.get(receive, "result.itemsAddr")) {
          this.map.scrollTo(receive.result.itemsAddr[0].pos);
        }
      });
      sear.search(opts);
      //    } else {
      //      setTimeout(() => {
      //        this.searchAddress(address);
      //      }, 500);
    }
  }

  /**
   *
   *
   * @param {*} buildings
   * @returns
   * @memberof MapViewZnet
   */
  drawHeatmap(buildings) {
    const dataList = [];
    for (let i in buildings) {
      const polygonTokyo = buildings[i].polygon[0][0];
      const data = this.tokyo2view(polygonTokyo);
      data[2] = 1;
      dataList.push(data);
    }
    this.simpleheat.max(10);
    this.simpleheat.data(dataList).draw();
  }
  /**
   *
   *
   * @param {*} symbols
   * @returns
   * @memberof MapViewZnet
   */
  drawSymbols(symbols, dict) {
    console.log(new Date().getTime(), "MapViewZnet drawSymbols");
    console.assert(symbols, "symbols is null");
    console.assert(dict, "dict is null");

    if (!this.layer) {
      console.log(
        new Date().getTime(),
        "MapViewZnet drawSymbols ! this.layer return"
      );
      return;
    }

    this.setMapExtent();

    if (!symbols) {
      return;
    }

    this.drawLimitter = null;
    if (symbols.length > 200) {
      this.drawLimitter = [];
    }

    const targetSymbols = [];
    const symbolsLen = symbols.length;
    for (let i = 0; i < symbolsLen; i++) {
      let p = this.world2view(symbols[i].posWorld);
      const pp = "*" + Math.ceil(p[0] / 4) + ":" + Math.ceil(p[1] / 4);
      if (this.drawLimitter) {
        if (this.drawLimitter[pp]) {
          continue;
        }
        this.drawLimitter[pp] = 1;
      }

      symbols.pos = p;
      targetSymbols.push(symbols[i]);
    }

    const objectNum = targetSymbols.length;
    for (let i = 0; i < objectNum; i++) {
      this.drawSymbol(targetSymbols[i], objectNum, dict);
    }
    console.log(new Date().getTime(), "MapViewZnet drawSymbols end");
  }

  /**
   *
   *
   * @param {*} symbol
   * @returns
   * @memberof MapViewZnet
   */
  drawSymbol(symbol, objectNum, dict) {
    if (!symbol) {
      return;
    }
    if (!symbol.symbol) {
      symbol.symbol = "attention";
    }

    let p = symbol.pos;
    if (!p) {
      p = this.world2view(symbol.posWorld);
    }

    switch (symbol.flag) {
      case "0":
        if (objectNum > 100) {
          p[0] -= 16;
          p[1] -= 32;
          if (symbol.id && dict[symbol.id] && dict[symbol.id].image) {
            let img = dict[symbol.id].image;
            this.ctx.drawImage(img, p[0], p[1]);
          } else if (this.img_list[symbol.id]) {
            this.ctx.drawImage(this.img_list[symbol.id], p[0], p[1]);
          } else {
            this.ctx.drawImage(this.img_list["attention"], p[0], p[1], 30, 45);
          }
        } else {
          p[0] -= this.layer.layerLeftTop.x;
          p[1] -= this.layer.layerLeftTop.y;
          p[0] -= 16;
          p[1] -= 32;

          const reg = new RegExp("_SYMBOL_", "g");
          const tmp = svg_list[symbol.symbol].svg.replace(reg, symbol.text);
          const svg_visit = htmlToNode(tmp);
          svg_visit.style.setProperty("position", "absolute");
          svg_visit.style.setProperty("left", p[0] + "px");
          svg_visit.style.setProperty("top", p[1] + "px");
          svg_visit.style.setProperty("width", svg_list[symbol.symbol].width);
          let colorElem = svg_visit.querySelector("#color");
          if (!colorElem) {
            colorElem = svg_visit.querySelector(
              "#svg_" + symbol.symbol + "-color"
            );
          }
          colorElem.style.setProperty("fill", symbol.color);
          this.svg.appendChild(svg_visit);
        }

        break;

      case "1":
        if (objectNum > 100) {
        } else {
          p[0] -= this.layer.layerLeftTop.x;
          p[1] -= this.layer.layerLeftTop.y;
          p[0] -= 16;
          p[1] -= 32;

          const reg = new RegExp("_SYMBOL_", "g");
          const tmp = svg_list[symbol.symbol].svg.replace(reg, symbol.text);
          const svg_visit = htmlToNode(tmp);
          svg_visit.style.setProperty("position", "absolute");
          svg_visit.style.setProperty("left", p[0] + "px");
          svg_visit.style.setProperty("top", p[1] + "px");
          svg_visit.style.setProperty("width", svg_list[symbol.symbol].width);
          let colorElem = svg_visit.querySelector("#color");
          if (!colorElem) {
            colorElem = svg_visit.querySelector(
              "#svg_" + symbol.symbol + "-color"
            );
          }
          colorElem.style.setProperty("fill", symbol.color);
          this.svg.appendChild(svg_visit);
        }

        break;

      case "p":
        this.ctx.drawImage(this.img_list["attention"], p[0], p[1], 30, 45);
        break;
    }
  }

  /**
   *
   *
   * @param {*} buildings
   * @returns
   * @memberof MapViewZnet
   */
  drawBuildings(buildings) {
    console.assert(buildings, "buildings is null");

    if (!this.layer) {
      console.log(
        new Date().getTime(),
        "MapViewZnet drawBuildings ! this.layer return"
      );
      return;
    }

    const orgPoint = this.map.viewToLatlon(new ZntPoint(0, 0));
    this.layer.moveElement(this.canvas, orgPoint);

    setTimeout(() => {
      this.drawBuildingsBody(buildings);
    });
  }

  /**
   *
   *
   * @param {*} buildings
   * @returns
   * @memberof MapViewZnet
   */
  drawBuildingsBody(buildings) {
    console.log(new Date().getTime(), "MapViewZnet drawBuildings");
    console.assert(buildings, "buildings is null");

    this.setMapExtent();

    if (!buildings) {
      return;
    }

    this.drawLimitter = null;
    if (buildings.length > 5000) {
      this.drawLimitter = [];
    }

    for (let i = 0; i < buildings.length; i++) {
      this.drawBuilding(buildings[i]);
    }
    console.log(new Date().getTime(), "MapViewZnet drawBuildings end");
  }

  /**
   *
   *
   * @param {*} building
   * @returns
   * @memberof MapViewZnet
   */
  drawBuilding(building) {
    if (!building) {
      return;
    }
    if (!building.polygon) {
      return;
    }

    for (let i = 0; i < building.polygon.length; i++) {
      this.drawPolygon(building.polygon[i], building.flag, building.color);
    }
  }

  /**
   *
   *
   * @param {number[]} polygonTokyo
   * @param {boolean} flag
   * @returns
   * @memberof MapViewZnet
   */
  drawPolygon(polygonTokyo, flag, color) {
    if (!polygonTokyo || !polygonTokyo.length) {
      return;
    }

    let p = this.tokyo2view(polygonTokyo[0]);

    const pp = "*" + Math.ceil(p[0] / 2) + ":" + Math.ceil(p[1] / 2);
    if (this.drawLimitter) {
      if (this.drawLimitter[pp]) {
        return;
      }
      this.drawLimitter[pp] = 1;
    }

    switch (flag) {
      case "1":
        this.ctx.globalAlpha = 0.5;
        this.ctx.beginPath();
        this.ctx.fillStyle = color;
        this.ctx.lineWidth = 1;
        this.ctx.moveTo(p[0], p[1]);
        for (let i = 1; i < polygonTokyo.length; i++) {
          p = this.tokyo2view(polygonTokyo[i]);
          this.ctx.lineTo(p[0], p[1]);
        }
        this.ctx.closePath();
        this.ctx.fill();
        this.ctx.globalAlpha = 1;
        break;

      case "2":
        this.ctx.globalAlpha = 0.5;
        this.ctx.beginPath();
        this.ctx.fillStyle = color;
        this.ctx.lineWidth = 1;
        this.ctx.moveTo(p[0], p[1]);
        for (let i = 1; i < polygonTokyo.length; i++) {
          p = this.tokyo2view(polygonTokyo[i]);
          this.ctx.lineTo(p[0], p[1]);
        }
        this.ctx.closePath();
        this.ctx.fill();
        this.ctx.globalAlpha = 1;

        p = this.tokyo2view(polygonTokyo[0]);
        this.ctx.beginPath();
        this.ctx.strokeStyle = "rgb(255, 255, 0)";
        this.ctx.lineWidth = 3;
        this.ctx.moveTo(p[0], p[1]);
        for (let i = 1; i < polygonTokyo.length; i++) {
          p = this.tokyo2view(polygonTokyo[i]);
          this.ctx.lineTo(p[0], p[1]);
        }
        this.ctx.closePath();
        this.ctx.stroke();
        break;

      case "p":
        this.ctx.beginPath();
        this.ctx.strokeStyle = "rgb(200, 0, 0)";
        this.ctx.lineWidth = 4;
        this.ctx.moveTo(p[0], p[1]);
        for (let i = 1; i < polygonTokyo.length; i++) {
          p = this.tokyo2view(polygonTokyo[i]);
          this.ctx.lineTo(p[0], p[1]);
        }
        this.ctx.closePath();
        this.ctx.stroke();
        break;
    }
  }

  /// Sys - Map - Address
  /**
   *
   *
   * @param {*} obj
   * @param {string} addressString
   * @param {string} name
   * @memberof MapViewZnet
   */
  getAddressByString(obj, addressString, name) {
    console.log(
      new Date().getTime(),
      "MapViewZnet getAddressByString",
      addressString,
      name
    );
    console.assert(addressString, "addressString is null");

    const sear = new ZntAddressMatch();
    const opts = new ZntAddressMatchSettings();
    opts.freeWord = addressString;
    opts.separateAddr = true;
    sear.addEventListener("receive", receive => {
      console.log("ZntAddressMatch", opts, receive);

      sear.clearEventListeners("receive");

      if (receive && receive.result && receive.result.status == "33400000") {
        // eslint-disable-line no-empty
      } else {
        this.props.getAddressCallbackError(obj);
        return;
      }
      const sear2 = new ZntBuildingSearch();
      const opts2 = new ZntBuildingSearchSettings();
      opts2.addrCode = receive.result.addrCode;
      opts2.freeWord = "|";
      opts2.type = "1111";
      opts2.bekki = false;
      opts2.matchRule = 2;
      opts2.startPos = 1;
      opts2.maxCount = 500;
      sear2.addEventListener("receive", receive2 => {
        console.log("ZntBuildingSearch", opts2, receive2);

        sear2.clearEventListeners("receive");

        if (
          receive2 &&
          receive2.result &&
          receive2.result.status == "31200000"
        ) {
          // eslint-disable-line no-empty
        } else {
          this.props.getAddressCallbackError(obj);
          return;
        }

        this.getAddressByStringStep2(
          obj,
          receive.result,
          receive2.result,
          name
        );
      });

      sear2.search(opts2);
    });

    sear.search(opts);
  }

  /**
   *
   *
   * @param {*} addrParts
   * @param {boolean} flag
   * @returns
   * @memberof MapViewZnet
   */
  genAddress(addrParts, flag) {
    if (!flag) {
      const ret = {
        prefecture: "",
        addressCity: "",
        addressTown1: "",
        addressTown2: "",
        addressTown: "",
        addressNumber: ""
      };
      return ret;
    }

    const prefecture = addrParts[0] || "";
    const addressCity = addrParts[1] || "";
    const addressTown1 = addrParts[2] || "";
    const addressTown2 = addrParts[3] || "";
    let tmp = [];
    if (addrParts[4]) {
      tmp.push(addrParts[4]);
    }
    if (addrParts[5]) {
      tmp.push(addrParts[5]);
    }
    if (addrParts[6]) {
      tmp.push(addrParts[6]);
    }
    const addressNumber = tmp.join("-");
    const ret = {
      prefecture: prefecture,
      addressCity: addressCity,
      addressTown1: addressTown1,
      addressTown2: addressTown2,
      addressTown: addressTown1 + addressTown2,
      addressNumber: addressNumber
    };
    return ret;
  }

  /**
   *
   *
   * @param {*} obj
   * @param {*} result
   * @param {*} result2
   * @param {*} name
   * @memberof MapViewZnet
   */
  getAddressByStringStep2(obj, result, result2, name) {
    console.log(
      new Date().getTime(),
      "MapViewZnet getAddressByStringStep2",
      result,
      result2,
      name
    );
    console.assert(result, "result is null");
    console.assert(result2, "result2 is null");

    // 地点
    const pos = this.tokyo2world([result.pos.x, result.pos.y]);

    const items = [];
    for (let i = 0; i < result2.items.length; i++) {
      const posWorld = this.tokyo2world([
        result2.items[i].pos.x,
        result2.items[i].pos.y
      ]);
      if (!name) {
        items.push({
          address: result2.items[i].address,
          name: result2.items[i].name1,
          pos: posWorld
        });
      } else {
        if (
          name.indexOf(result2.items[i].name1) >= 0 ||
          result2.items[i].name1.indexOf(name) >= 0
        ) {
          items.push({
            address: result2.items[i].address,
            name: result2.items[i].name1,
            pos: posWorld
          });
        }
      }
    }

    if (result.compFlg) {
      // 氏名指定無し
      if (!name) {
        // 対象表札１件
        if (items.length == 1) {
          this.getAddressByPoint(123, items[0].pos);

          // 対象表札無し
        } else if (items.length == 0) {
          this.getAddressByPoint(123, pos);

          // 対象表札複数
        } else {
          this.scrollTo(pos);

          const addrParts = result.address.split("|");
          const address = this.genAddress(addrParts, result.addrFlg);

          const rooms = [{ roomNo: "", lastName: "", shopName: "" }];

          this.getAddressByPointStep4(
            obj,
            address,
            null,
            rooms,
            "複数の表札があります"
          );
        }
        // 氏名を含む対象表札を検索
      } else {
        // 氏名を含む対象表札有り
        if (items.length == 1) {
          this.getAddressByPoint(123, items[0].pos);

          // 氏名を含む対象表札が無い
        } else if (items.length == 0) {
          this.scrollTo(pos);

          const addrParts = result.address.split("|");
          const address = this.genAddress(addrParts, result.addrFlg);

          const rooms = [{ roomNo: "", lastName: "", shopName: "" }];

          this.getAddressByPointStep4(
            obj,
            address,
            null,
            rooms,
            "一致する表札がありません"
          );
        } else {
          this.scrollTo(pos);

          const addrParts = result.address.split("|");
          const address = this.genAddress(addrParts, result.addrFlg);

          const rooms = [{ roomNo: "", lastName: "", shopName: "" }];

          this.getAddressByPointStep4(
            obj,
            address,
            null,
            rooms,
            "複数の表札があります"
          );
        }
      }
      // 一致住所無し
    } else {
      this.scrollTo(pos);

      const addrParts = result.address.split("|");
      const address = this.genAddress(addrParts, result.addrFlg);

      const rooms = [{ roomNo: "", lastName: "", shopName: "" }];

      this.getAddressByPointStep4(
        obj,
        address,
        null,
        rooms,
        "一致する表札がありません"
      );
    }
  }

  /**
   *
   *
   * @param {*} obj
   * @param {number[]} posWorld
   * @memberof MapViewZnet
   */
  getAddressByPoint(obj, posWorld) {
    console.log(
      new Date().getTime(),
      "MapViewZnet getAddressByPoint",
      obj,
      posWorld
    );
    console.assert(posWorld, "posWorld is null");

    // 地点に対する建物形状を取得
    const posTokyo = this.world2tokyo(posWorld);
    const sear = new ZntBldPolygonSearch();
    const opts = new ZntBldPolygonSearchSettings();
    opts.pos = new ZntPoint(posTokyo[0], posTokyo[1]);

    sear.addEventListener("receive", receive => {
      console.log("ZntBldPolygonSearch", opts, receive);

      sear.clearEventListeners("receive");

      if (
        receive &&
        receive.result &&
        receive.result.status == "20300000" &&
        receive.result.polygonCount > 0
      ) {
        // eslint-disable-line no-empty
      } else {
        // 建物が存在しないとき、暫定的なマークを生成
        var box_w = 300 / 3;
        var box_h = 250 / 3;
        const polygonTokyo = [];
        for (var i = 0; i < 12; i++) {
          var r = (3.1416 * 2 * i) / 12;
          var box_xp = Math.sin(r);
          var box_yp = Math.cos(r);
          polygonTokyo.push([
            Math.floor(posTokyo[0] + box_w * box_xp),
            Math.floor(posTokyo[1] + box_h * box_yp)
          ]);
        }
        let polygonTokyoList = [polygonTokyo];

        const location = {
          pos: { type: "Point", coordinates: posWorld },
          shape: { type: "building", polygonTokyo: polygonTokyoList }
        };

        //        this.scrollTo(posWorld);

        this.props.getPolygonCallback(obj, posWorld, polygonTokyoList);

        this.getAddressByPointStep2(obj, posWorld, location);
        return;
      }

      const polygonTokyoList = [];
      for (let i = 0; i < receive.result.polygons.length; i++) {
        const polygonTokyo = receive.result.polygons[i].coords.map(coord => {
          return [coord.x, coord.y];
        });
        polygonTokyoList.push(polygonTokyo);
      }
      const posTokyo0 = _.meanBy(polygonTokyoList[0], p => p[0]);
      const posTokyo1 = _.meanBy(polygonTokyoList[0], p => p[1]);
      const posWorldRet = this.tokyo2world([posTokyo0, posTokyo1]);

      const location = {
        pos: { type: "Point", coordinates: posWorldRet },
        shape: { type: "building", polygonTokyo: polygonTokyoList }
      };

      //      this.scrollTo(posWorldRet);

      this.props.getPolygonCallback(obj, posWorld, polygonTokyoList);

      this.getAddressByPointStep2(obj, posWorld, location);
    });

    sear.search(opts);
  }

  /**
   *
   *
   * @param {string} name
   * @returns
   * @memberof MapViewZnet
   */
  isShopName(name) {
    if (
      name.indexOf("(") >= 0 ||
      name.indexOf("（") >= 0 ||
      name.indexOf("㈱") >= 0 ||
      name.indexOf("㈲") >= 0 ||
      name.indexOf("事務所") >= 0 ||
      name.indexOf("法人") >= 0 ||
      name.indexOf("商店") >= 0 ||
      name.indexOf("商会") >= 0 ||
      name.indexOf("店") >= 0 ||
      name.indexOf("会社") >= 0 ||
      name.indexOf("Ｉｎｃ") >= 0 ||
      name.indexOf("ｉｎｃ．") >= 0 ||
      name.indexOf("組合") >= 0 ||
      name.indexOf("管理") >= 0 ||
      name.indexOf("オフィス") >= 0 ||
      name.indexOf("本店") >= 0 ||
      name.indexOf("支店") >= 0 ||
      name.indexOf("コープ") >= 0 ||
      name.indexOf("学院") >= 0 ||
      name.indexOf("教室") >= 0 ||
      name.indexOf("塾") >= 0 ||
      name.indexOf("会話") >= 0 ||
      name.indexOf("大学") >= 0 ||
      name.indexOf("高校") >= 0 ||
      name.indexOf("中学") >= 0 ||
      name.indexOf("学校") >= 0 ||
      name.indexOf("幼稚園") >= 0 ||
      name.indexOf("保育園") >= 0 ||
      name.indexOf("外科") >= 0 ||
      name.indexOf("内科") >= 0 ||
      name.indexOf("小児科") >= 0 ||
      name.indexOf("耳鼻科") >= 0 ||
      name.indexOf("眼科") >= 0 ||
      name.indexOf("歯科") >= 0 ||
      name.indexOf("医療") >= 0 ||
      name.indexOf("診療") >= 0 ||
      name.indexOf("クリニック") >= 0 ||
      name.indexOf("工業") >= 0 ||
      name.indexOf("商業") >= 0 ||
      name.indexOf("プロダクション") >= 0 ||
      name.indexOf("美容") >= 0 ||
      name.indexOf("宴会") >= 0 ||
      name.indexOf("待合") >= 0 ||
      name.indexOf("スタジオ") >= 0 ||
      name.indexOf("クラブ") >= 0 ||
      name.indexOf("カフェ") >= 0 ||
      name.indexOf("センター") >= 0 ||
      name.indexOf("ホテル") >= 0 ||
      name.indexOf("中華") >= 0 ||
      name.indexOf("料理") >= 0 ||
      name.indexOf("レストラン") >= 0 ||
      name.indexOf("すし") == 0 ||
      name.endsWith("寺") ||
      name.endsWith("神社")
    ) {
      return true;
    }

    return false;
  }

  /**
   *
   *
   * @param {string} name
   * @param {number} bekkiLen
   * @returns
   * @memberof MapViewZnet
   */
  isOther(name, bekkiLen) {
    if (bekkiLen > 0 && name.length >= 5) {
      return true;
    }

    if (name.length >= 8) {
      return true;
    }

    return false;
  }

  /**
   *
   *
   * @param {string} name
   * @returns
   * @memberof MapViewZnet
   */
  isBuildingName(name) {
    if (
      name.indexOf("ハイツ") >= 0 ||
      name.indexOf("ハウス") >= 0 ||
      name.indexOf("ハイム") >= 0 ||
      name.indexOf("アパート") >= 0 ||
      name.indexOf("マンション") >= 0 ||
      name.indexOf("メゾン") >= 0 ||
      name.indexOf("コーポ") >= 0 ||
      name.indexOf("レジデンス") >= 0 ||
      name.indexOf("アネックス") >= 0 ||
      name.indexOf("番館") >= 0 ||
      name.indexOf("号棟") >= 0 ||
      name.indexOf("宿舎") >= 0 ||
      name.endsWith("ビル") ||
      name.endsWith("荘") ||
      name.indexOf("ピア") >= 0 ||
      name.indexOf("アーバン") >= 0 ||
      name.indexOf("ザ・") >= 0 ||
      name.indexOf("コート") >= 0 ||
      name.indexOf("カーサ") >= 0 ||
      name.indexOf("リバーサイド") >= 0
    ) {
      return true;
    }
    return false;
  }

  /**
   *
   *
   * @param {*} obj
   * @param {number[]} posWorld
   * @param {*} location
   * @memberof MapViewZnet
   */
  getAddressByPointStep2(obj, posWorld, location) {
    console.log(
      new Date().getTime(),
      "MapViewZnet getAddressByPointStep2",
      posWorld,
      location
    );
    console.assert(posWorld, "posWorld is null");
    console.assert(location, "location is null");

    // 地点に対する建物情報を取得
    const posTokyo = this.world2tokyo(posWorld);
    const sear = new ZntBldFeatureSearch();
    const opts = new ZntBldFeatureSearchSettings();
    opts.pos = new ZntPoint(posTokyo[0], posTokyo[1]);

    sear.addEventListener("receive", receive => {
      console.log("ZntBldFeatureSearch", opts.pos, receive);

      sear.clearEventListeners("receive");

      if (receive && receive.result && receive.result.status == "31300000") {
        // eslint-disable-line no-empty
      } else {
        this.getAddressByPointStep3B(obj, posWorld, location);
        return;
      }

      ////////
      let buildingName = "";
      let lastName = [];
      let shopName = [];
      const rooms = [];

      // 基本
      for (var i = 0; i < receive.result.itemsKihon.length; i++) {
        const name = receive.result.itemsKihon[i].name1;

        if (this.isShopName(name)) {
          shopName.push(name);
        } else if (this.isBuildingName(name)) {
          buildingName = name;
        } else if (this.isOther(name, receive.result.itemsBekki.length)) {
          buildingName = name;
        } else {
          lastName.push(name);
        }
      }
      if (
        receive.result.itemsBekki.length == 0 ||
        lastName.length ||
        shopName.length
      ) {
        rooms.push({
          roomNo: "",
          lastName: lastName.join(", "),
          shopName: shopName.join(", ")
        });
      }

      // 別記
      for (let i = 0; i < receive.result.itemsBekki.length; i++) {
        const itemsBekki = receive.result.itemsBekki[i];
        let roomNo = itemsBekki.roomNumber;
        if (itemsBekki.floorType == "F" && itemsBekki.floor) {
          roomNo += "(" + itemsBekki.floor + "階)";
        }
        const name = itemsBekki.name2;

        if (rooms.filter(room => room.tmp == `${roomNo}:${name}`).length) {
          continue;
        }

        if (this.isShopName(name)) {
          rooms.push({
            roomNo: roomNo,
            lastName: "",
            shopName: name,
            tmp: `${roomNo}:${name}`
          });
        } else if (this.isOther(name, 999)) {
          rooms.push({
            roomNo: roomNo,
            lastName: "",
            shopName: name,
            tmp: `${roomNo}:${name}`
          });
        } else {
          rooms.push({
            roomNo: roomNo,
            lastName: name,
            shopName: "",
            tmp: `${roomNo}:${name}`
          });
        }
      }

      this.getAddressByPointStep3A(
        obj,
        receive.result.address,
        posWorld,
        location,
        buildingName,
        rooms
      );
    });

    sear.search(opts);
  }

  /**
   *
   *
   * @param {*} obj
   * @param {string} freeWord
   * @param {number[]} posWorld
   * @param {*} location
   * @param {string} buildingName
   * @param {*} rooms
   * @memberof MapViewZnet
   */
  getAddressByPointStep3A(
    obj,
    freeWord,
    posWorld,
    location,
    buildingName,
    rooms
  ) {
    console.log(
      new Date().getTime(),
      "MapViewZnet getAddressByPointStep3A",
      freeWord,
      posWorld,
      location,
      buildingName,
      rooms
    );
    console.assert(freeWord, "freeWord is null");
    console.assert(posWorld, "posWorld is null");
    console.assert(location, "location is null");
    console.assert(buildingName, "buildingName is null");

    // 住所マッチング
    const sear = new ZntAddressMatch();
    const opts = new ZntAddressMatchSettings();
    opts.freeWord = freeWord;
    opts.separateAddr = true;
    sear.addEventListener("receive", receive => {
      console.log("ZntAddressMatch", opts, receive);

      sear.clearEventListeners("receive");

      if (receive && receive.result && receive.result.status == "33400000") {
        // eslint-disable-line no-empty
      } else {
        this.props.getAddressCallbackError(obj);
        return;
      }

      const addrParts = receive.result.address.split("|");
      const address = this.genAddress(addrParts, true);
      address.buildingName = buildingName;

      this.getAddressByPointStep4(obj, address, location, rooms, "");
    });
    sear.search(opts);
  }

  /**
   *
   *
   * @param {*} obj
   * @param {number[]} posWorld
   * @param {*} location
   * @memberof MapViewZnet
   */
  getAddressByPointStep3B(obj, posWorld, location) {
    console.log(
      new Date().getTime(),
      "MapViewZnet getAddressByPointStep3B",
      posWorld,
      location
    );
    console.assert(posWorld, "posWorld is null");
    console.assert(location, "location is null");

    const posTokyo = this.world2tokyo(posWorld);

    // 住所経緯度検索
    const sear = new ZntAddressStringSearch();
    const opts = new ZntAddressStringSearchSettings();
    opts.pos = new ZntPoint(posTokyo[0], posTokyo[1]);
    opts.matchLv = 6;
    sear.addEventListener("receive", receive => {
      console.log("ZntAddressStringSearch", opts, receive);

      if (receive && receive.result && receive.result.status == "30400000") {
        // eslint-disable-line no-empty
      } else {
        this.props.getAddressCallbackError(obj);
        return;
      }

      const addrParts = receive.result.addrParts;
      const address = this.genAddress(addrParts, true);
      address.buildingName = "";

      const rooms = [{ roomNo: "", lastName: "", shopName: "" }];

      this.getAddressByPointStep4(obj, address, location, rooms, "");
    });
    sear.search(opts);
  }

  /**
   *
   *
   * @param {*} obj
   * @param {*} address
   * @param {*} location
   * @param {*} rooms
   * @param {*} message
   * @memberof MapViewZnet
   */
  getAddressByPointStep4(obj, address, location, rooms, message) {
    console.log(
      new Date().getTime(),
      "MapViewZnet getAddressByPointStep4",
      address,
      location,
      rooms,
      message
    );
    console.assert(address, "address is null");
    console.assert(location, "location is null");
    console.assert(rooms, "rooms is null");

    this.getAddressByPointStep5(obj, address, location, rooms, message);

    const prefecture = address.prefecture;
    const address1 = address.addressCity;
    const address2 = address.addressTown1;

    console.log(
      `http://api.thni.net/jzip/X0401/JSONP/J/${prefecture}/${address1}/${address2}.js`
    );
    $.ajax({
      type: "get",
      cache: false,
      url: `http://api.thni.net/jzip/X0401/JSONP/J/${prefecture}/${address1}/${address2}.js`,
      crossDomain: true,
      dataType: "jsonp",
      jsonpCallback: "KenSearchValue",
      success: resp => {
        address.postalCode = resp.zipcode;
        this.getAddressByPointStep5(obj, address, location, rooms, message);
      }
    });
  }

  /**
   *
   *
   * @param {*} obj
   * @param {*} address
   * @param {*} location
   * @param {*} rooms
   * @param {*} message
   * @memberof MapViewZnet
   */
  getAddressByPointStep5(obj, address, location, rooms, message) {
    console.log(
      new Date().getTime(),
      "MapViewZnet getAddressByPointStep4",
      address,
      location,
      rooms,
      message
    );
    console.assert(address, "address is null");
    console.assert(location, "location is null");
    console.assert(rooms, "rooms is null");
    this.props.getAddressCallback(obj, {
      address: address,
      location: location,
      rooms: rooms,
      message: message
    });
  }
  /// Sys - Map - Address --

  /**
   *
   *
   * @memberof MapViewLeaflet
   */
  isNearby = (pos1, pos2, distancePix) => {
    if (!pos1 || !pos2) {
      return false;
    }
    const view1 = this.world2view(pos1);
    const view2 = this.world2view(pos2);
    const distance = Math.sqrt(
      Math.pow(view1[0] - view2[0], 2) + Math.pow(view1[1] - view2[1], 2)
    );
    if (distancePix > distance) {
      return true;
    }
    return false;
  };

  /**
   *
   *
   * @memberof MapViewLeaflet
   */
  getCenterPos() {
    const posTokyo = this.map.getCenterPos();
    const posWorld = this.tokyo2world([posTokyo.x, posTokyo.y]);
    return posWorld;
  }

  /**
   *
   *
   * @memberof MapViewLeaflet
   */
  getZoomLevel() {
    return this.map.getZoomLevel();
  }

  /**
   *
   *
   * @memberof MapViewLeaflet
   */
  setZoomLevel(zoomLevel) {
    this.map.zoomTo(zoomLevel);
  }

  /**
   *
   *
   * @param {*} e
   * @memberof MapViewZnet
   */
  onClickMap(e) {
    console.log(new Date().getTime(), "MapViewZnet onClickMap");
    console.assert(e, "e is null");

    const posWorld = this.tokyo2world([e.pos.x, e.pos.y]);
    this.props.onClickMap([posWorld[0], posWorld[1]]);
    console.log(
      "onClickMap ==========================",
      e.pos,
      posWorld,
      this.mapExtent
    );
  }

  /**
   *
   *
   * @param {*} e
   * @memberof MapViewZnet
   */
  onDblClickMap(e) {
    console.log(new Date().getTime(), "MapViewZnet onDblClickMap");
    console.assert(e, "e is null");

    const posWorld = this.tokyo2world([e.pos.x, e.pos.y]);
    this.props.onDblClickMap([posWorld[0], posWorld[1]]);
    console.log(
      "onDblClickMap ==========================",
      e.pos,
      posWorld,
      this.mapExtent
    );
  }

  onRedrawMapZoom(event) {
    this.debouncedOnRedrawMapZoom();
  }

  /**
   *
   *
   * @memberof MapViewZnet
   */
  debouncedOnRedrawMapZoom() {
    console.log(new Date().getTime(), "MapViewZnet onRedrawMapZoom");

    this.map.removeCustomLayer(this.layer2);
    this.layer2 = new ZntScrollLayer();
    this.layer2.setVisible(true);
    this.map.addCustomLayer(ZntMap.CLAYER_SCROLL, this.layer2);

    this.svg = document.createElement("div");
    this.svg.style["pointer-events"] = "none";
    this.svg.width = this.mapExtent.width;
    this.svg.height = this.mapExtent.height;
    const orgPoint = this.map.viewToLatlon(new ZntPoint(0, 0));
    this.layer2.addElement(this.svg, orgPoint);

    if (this.map.getZoomLevel() >= 12 && this.preZoomLevel < 12) {
      setTimeout(() => {
        this.onRedrawMap();
      }, 500);
    } else {
      setTimeout(() => {
        this.onRedrawMap();
      }, 16);
    }
    this.preZoomLevel = this.map.getZoomLevel();
  }

  /**
   *
   *
   * @returns
   * @memberof MapViewZnet
   */
  onRedrawMap() {
    console.log(new Date().getTime(), "MapViewZnet onRedrawMap");

    console.log("map ==============", this.map);

    if (!this.mapExtent) {
      console.log(
        new Date().getTime(),
        "MapViewZnet onRedrawMap ! this.mapExtent return"
      );
      return;
    }

    this.setMapExtent();
    this.props.onRedrawMap(this.mapExtent);
  }

  /**
   *
   *
   * @memberof MapViewZnet
   */
  componentDidMount() {
    console.log(new Date().getTime(), "MapViewZnet componentDidMount");
    this.initMap();
  }

  /**
   *
   *
   * @memberof MapViewZnet
   */
  componentWillUnmount() {
    console.log(new Date().getTime(), "MapViewZnet componentWillUnmount");
    if (window.ZntAuth) {
      console.log(
        new Date().getTime(),
        "MapViewZnet logout ---------------------------"
      );
      //      window.ZntAuth.logout();
    }
  }

  /**
   *
   *
   * @returns
   * @memberof MapViewZnet
   */
  render() {
    console.log(new Date().getTime(), "MapViewZnet render");

    return (
      <React.Fragment>
        <section>
          <div id={this.id} className="map-container" style={this.props.style}>
            {this.props.children}
          </div>
          <div id="map-loader" />
          {this.state.message}
        </section>
        <MDBModal
          isOpen={this.state.showMessageModal}
          toggle={() => this.setState({ showMessageModal: false })}
          className="pinmodal-style"
        >
          <MDBModalBody>{this.state.message}</MDBModalBody>
        </MDBModal>
      </React.Fragment>
    );
  }
}
