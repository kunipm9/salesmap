/// Sys - AutoForm - map field
import React, { createRef } from "react";
import { Random } from "meteor/random";
let Leaflet; // eslint-disable-line no-unused-vars
let Map, Marker; // eslint-disable-line no-unused-vars
let TileLayer;
let CanvasLayer;
let DivLayer;
let createjs, proj4, simpleheat; // eslint-disable-line no-unused-vars
if (Meteor.isClient) {
  Leaflet = require("leaflet");
  Map = new require("react-leaflet").Map;
  TileLayer = new require("react-leaflet").TileLayer;
  CanvasLayer = require("react-leaflet-canvas-layer");
  DivLayer = require("react-leaflet-div-layer");
  createjs = require("createjs-module");
  proj4 = require("proj4");
  simpleheat = require("simpleheat");
}
const classifyPoint = require("robust-point-in-polygon");
/// Sys - AutoForm - map field --

import { svg_list, htmlToNode, png_list } from "./svgList";

/// Sys - AutoForm - map field
/**
 *
 *
 * @export
 * @class MapViewLeaflet
 * @extends {React.Component}
 */
export class MapViewLeaflet extends React.PureComponent {
  /**
   *Creates an instance of MapViewLeaflet.
   * @param {*} props
   * @memberof MapViewLeaflet
   */
  constructor(props) {
    super(props);
    this.state = {
      center: this.props.center,
      zoom: 18
    };
    this.mapRef = createRef();
    this.mapExtent = {
      min: { x: 0, y: 0 },
      max: { x: 0, y: 0 }
    };

    this.id = Random.id(15);
    this.ctx = null;
    this.drawLimitter = [];

    this.clearLayer = this.clearLayer.bind(this);
    this.reDrawLayer = this.reDrawLayer.bind(this);
    this.reDrawDivLayer = this.reDrawDivLayer.bind(this);
    this.scrollTo = this.scrollTo.bind(this);
    this.searchAddress = this.searchAddress.bind(this);
    this.requestReDrawMap = this.requestReDrawMap.bind(this);
    this.drawHeatmap = this.drawHeatmap.bind(this);
    this.drawSymbols = this.drawSymbols.bind(this);
    this.drawSymbol = this.drawSymbol.bind(this);
    this.drawBuildings = this.drawBuildings.bind(this);
    this.drawBuilding = this.drawBuilding.bind(this);

    this.onClickMap = this.onClickMap.bind(this);
    this.onDblClickMap = this.onDblClickMap.bind(this);
    this.onRedrawMap = this.onRedrawMap.bind(this);

    this.isProvideBldApi = this.isProvideBldApi.bind(this);
    this.getAddressByString = this.getAddressByString.bind(this);
    this.getAddressByPoint = this.getAddressByPoint.bind(this);
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

    setTimeout(() => this.requestReDrawMap(), 200);
  }

  /**
   *
   *
   * @returns
   * @memberof MapViewLeaflet
   */
  isProvideBldApi() {
    return false;
  }

  /**
   *
   *
   * @param {number[]} posTokyo
   * @returns
   * @memberof MapViewLeaflet
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
   * @memberof MapViewLeaflet
   */
  clearLayer() {
    console.log(new Date().getTime(), "MapViewLeaflet clearLayer");
    this.ctx.globalAlpha = 1;
    this.ctx.clearRect(0, 0, this.mapExtent.width, this.mapExtent.height);

    while (this.svg.firstChild) {
      this.svg.removeChild(this.svg.firstChild);
    }
  }

  /**
   *
   *
   * @param {number[]} posWorld
   * @returns
   * @memberof MapViewLeaflet
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
   * @param {*} info
   * @memberof MapViewLeaflet
   */
  reDrawDivLayer(info) {
    this.svg = info.div;
  }

  /**
   *
   *
   * @param {*} info
   * @returns
   * @memberof MapViewLeaflet
   */
  reDrawLayer(info) {
    console.log(new Date().getTime(), "MapViewLeaflet reDrawLayer", info);
    console.assert(info, "info is null");

    if (
      this.mapExtent &&
      this.mapExtent.min.x == info.bounds._southWest.lng &&
      this.mapExtent.min.y == info.bounds._southWest.lat &&
      this.mapExtent.max.x == info.bounds._northEast.lng &&
      this.mapExtent.max.y == info.bounds._northEast.lat
    ) {
      console.log(new Date().getTime(), "MapViewLeaflet reDrawLayer cancel");
      return;
    }

    const minTokyo = this.world2tokyo([
      info.bounds._southWest.lng,
      info.bounds._southWest.lat
    ]);
    const maxTokyo = this.world2tokyo([
      info.bounds._northEast.lng,
      info.bounds._northEast.lat
    ]);
    this.mapExtent = {
      min: { x: info.bounds._southWest.lng, y: info.bounds._southWest.lat },
      max: { x: info.bounds._northEast.lng, y: info.bounds._northEast.lat },
      minWorld: {
        x: info.bounds._southWest.lng,
        y: info.bounds._southWest.lat
      },
      maxWorld: {
        x: info.bounds._northEast.lng,
        y: info.bounds._northEast.lat
      },
      minTokyo: { x: minTokyo[0], y: minTokyo[1] },
      maxTokyo: { x: maxTokyo[0], y: maxTokyo[1] },
      centerWorld: { x: info.center.lng, y: info.center.lat },
      zoom: info.zoom
    };

    this.mapExtent.width = info.size.x;
    this.mapExtent.height = info.size.y;

    this.ctx = info.canvas.getContext("2d");
    this.ctx.clearRect(0, 0, this.mapExtent.width, this.mapExtent.height);

    this.simpleheat = simpleheat(info.canvas);

    this.clearLayer();
    setTimeout(() => {
      this.onRedrawMap();
    }, 10);
  }

  /**
   *
   *
   * @memberof MapViewLeaflet
   */
  requestReDrawMap() {
    this.clearLayer();
    setTimeout(() => {
      this.onRedrawMap();
    }, 10);
  }

  /**
   *
   *
   * @param {number[]} posWorld
   * @memberof MapViewLeaflet
   */
  scrollTo(posWorld) {
    console.log("scrollTo", posWorld);

    console.assert(posWorld, "posWorld is null");

    this.setState({ center: posWorld });
    /*
    if (this.mapExtent.centerWorld) {
    console.log(posWorld, "posWorld 1", posWorld);
      this.map.panTo(posWorld);
    } else {
      setTimeout(() => {
    console.log(posWorld, "posWorld 2", posWorld);
        this.scrollTo(posWorld);
      }, 500);
    }
*/
  }

  /**
   *
   *
   * @param {string} address
   * @memberof MapViewLeaflet
   */
  searchAddress(address) {}

  /**
   *
   *
   * @param {*} buildings
   * @returns
   * @memberof MapViewLeaflet
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
   * @memberof MapViewLeaflet
   */
  drawSymbols(symbols, dict) {
    console.log(new Date().getTime(), "MapViewLeaflet drawSymbols");
    console.assert(symbols, "symbols is null");
    console.assert(dict, "dict is null");

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
    console.log(new Date().getTime(), "MapViewLeaflet drawSymbols end");
  }

  /**
   *
   *
   * @param {number[]} posTokyo
   * @param {boolean} flag
   * @returns
   * @memberof MapViewLeaflet
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
   * @memberof MapViewLeaflet
   */
  drawBuildings(buildings) {
    console.log(new Date().getTime(), "MapViewLeaflet drawBuildings");
    console.log("drawBuildings =========================================");

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
  }

  /**
   *
   *
   * @param {*} building
   * @returns
   * @memberof MapViewLeaflet
   */
  drawBuilding(building) {
    if (!building) {
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
   * @memberof MapViewLeaflet
   */
  drawPolygon(polygonTokyo, flag, color) {
    if (!polygonTokyo || !polygonTokyo.length) {
      return;
    }
    console.log("drawPolygon ==========", polygonTokyo, flag, color);

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
   * @memberof MapViewLeaflet
   */
  // eslint-disable-next-line no-unused-vars
  getAddressByString(obj, addressString, name) {
    console.log(new Date().getTime(), "MapViewLeaflet getAddressByString");
  }

  /**
   *
   *
   * @param {string} name
   * @returns
   * @memberof MapViewLeaflet
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
   * @param {*} obj
   * @param {number[]} posWorld
   * @param {*} aroundDocs
   * @memberof MapViewLeaflet
   */
  getAddressByPoint(obj, posWorld, aroundDocs) {
    console.log(
      new Date().getTime(),
      "MapViewLeaflet getAddressByPoint",
      obj,
      posWorld,
      aroundDocs
    );
    console.assert(posWorld, "posWorld is null");

    const data = {
      appid: "OY1oDxsr",
      output: "json",
      lat: posWorld[1],
      lon: posWorld[0],
      callback: "callback"
    };
    const REVERSE_GEOCODER_URL =
      "https://map.yahooapis.jp/geoapi/V1/reverseGeoCoder";
    $.ajax({
      type: "get",
      cache: false,
      url: REVERSE_GEOCODER_URL,
      dataType: "jsonp",
      data: data,
      jsonpCallback: "callback",
      success: resp => {
        console.log(REVERSE_GEOCODER_URL, posWorld, resp);

        if (
          resp.Feature.length == 0 ||
          !resp.Feature[0].Property ||
          !resp.Feature[0].Property.AddressElement
        ) {
          return;
        }

        // 住所情報
        const addrParts = resp.Feature[0].Property.AddressElement;
        let prefecture = "";
        let addressCity = "";
        let addressTown1 = "";
        let addressTown2 = "";
        if (addrParts[0]) {
          prefecture = addrParts[0].Name;
        }
        if (addrParts[1]) {
          addressCity = addrParts[1].Name;
        }
        if (addrParts[2]) {
          addressTown1 = addrParts[2].Name;
        }
        if (addrParts[3]) {
          addressTown2 = addrParts[3].Name;
        }
        let tmp = [];
        if (addrParts[4]) {
          tmp.push(addrParts[4].Name);
        }
        if (addrParts[5]) {
          tmp.push(addrParts[5].Name);
        }
        if (addrParts[6]) {
          tmp.push(addrParts[6].Name);
        }
        const addressNumber = tmp.join("-");

        const address = {
          prefecture: prefecture,
          addressCity: addressCity,
          addressTown1: addressTown1,
          addressTown2: addressTown2,
          addressTown: addressTown1 + addressTown2,
          addressNumber: addressNumber,
          buildingName: ""
        };

        // 建物情報
        let rooms = [{ roomNo: "", lastName: "", shopName: "" }];
        if (
          resp.Feature[0].Property.Building &&
          resp.Feature[0].Property.Building.length
        ) {
          const name = resp.Feature[0].Property.Building[0].Name;
          if (this.isShopName(name)) {
            rooms = [{ roomNo: "", lastName: "", shopName: name }];
          } else {
            address.buildingName = name;

            rooms = [{ roomNo: "", lastName: "", shopName: "" }];
          }
        }

        // 位置
        const posTmp = resp.Feature[0].Geometry.Coordinates.split(",");
        let pos = [parseFloat(posTmp[0]), parseFloat(posTmp[1])];

        // 建物形状
        const posTokyo = this.world2tokyo(pos);
        let polygonTokyoList = [];

        // 建物形状を登録済みDocsの中から探す
        if (aroundDocs) {
          for (let idx in aroundDocs) {
            // 指定地点をPolygonが含むか？
            const polygonTokyo =
              aroundDocs[idx].residenceAddress.location.shape.polygonTokyo;
            for (let p in polygonTokyo) {
              if (classifyPoint(polygonTokyo[p], posTokyo) != 1) {
                polygonTokyoList =
                  aroundDocs[idx].residenceAddress.location.shape.polygonTokyo;
                break;
              }
            }
          }
        }

        // 登録済みのDocsにも存在しない場合は、暫定的な形状を生成
        if (polygonTokyoList.length == 0) {
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
          polygonTokyoList = [polygonTokyo];
        }

        // location
        const location = {
          pos: { type: "Point", coordinates: pos },
          shape: { type: "building", polygonTokyo: polygonTokyoList }
        };

        this.props.getPolygonCallback(obj, pos, polygonTokyoList);

        this.getAddressByPointStep4(obj, address, location, rooms, "");
      },
      error: resp => {
        console.log(REVERSE_GEOCODER_URL, "ERROR", resp);
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
   * @memberof MapViewLeaflet
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
   * @memberof MapViewLeaflet
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
    return [this.mapExtent.centerWorld.x, this.mapExtent.centerWorld.y];
  }

  /**
   *
   *
   * @memberof MapViewLeaflet
   */
  getZoomLevel() {
    return this.mapExtent.zoom;
  }

  /**
   *
   *
   * @memberof MapViewLeaflet
   */
  setZoomLevel(zoomLevel) {
    console.log("setZoomLevel", zoomLevel);

    this.setState({ zoom: zoomLevel });
  }

  /**
   *
   *
   * @param {*} e
   * @memberof MapViewLeaflet
   */
  onClickMap(e) {
    console.log(new Date().getTime(), "MapViewLeaflet onClickMap", e);
    console.assert(e, "e is null");

    this.props.onClickMap([e.latlng.lng, e.latlng.lat]);
  }

  /**
   *
   *
   * @param {*} e
   * @memberof MapViewLeaflet
   */
  onDblClickMap(e) {
    console.log(new Date().getTime(), "MapViewLeaflet onDblClickMap");
    console.assert(e, "e is null");

    this.props.onDblClickMap([e.latlng.lng, e.latlng.lat]);
  }

  /**
   *
   *
   * @memberof MapViewLeaflet
   */
  onRedrawMap() {
    console.log(new Date().getTime(), "MapViewLeaflet onRedrawMap");
    this.props.onRedrawMap(this.mapExtent);
  }

  /**
   *
   *
   * @returns
   * @memberof MapViewLeaflet
   */
  render() {
    console.log(new Date().getTime(), "MapViewLeaflet render");

    console.log("==================================", this.state);

    if (!this.props.center) {
      return <section />;
    }

    return (
      <section>
        <Map
          style={this.props.style}
          center={{ lng: this.state.center[0], lat: this.state.center[1] }}
          zoom={this.state.zoom}
          length={4}
          onClick={this.onClickMap}
        >
          <DivLayer drawMethod={this.reDrawDivLayer} />
          <CanvasLayer drawMethod={this.reDrawLayer} />
          <TileLayer
            attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url="http://tile.openstreetmap.jp/{z}/{x}/{y}.png"
          />
          {this.props.children}
        </Map>
      </section>
    );
  }
}
