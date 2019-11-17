import React from "react";

import { Segment } from "semantic-ui-react";
import { Item } from "semantic-ui-react";
import { Label } from "semantic-ui-react";
import { Button } from "semantic-ui-react";
import { Image } from "semantic-ui-react";

import moment from "moment";
moment.locale("ja");
import _ from "lodash";

/// Custom - AutoForm - collection
import { Images_Collection } from "@imports/api/lib/Images_Collection";
/// Custom - AutoForm - collection --

/* global index */

/**
 *
 *
 */
export const displaySimpleField = (simpleSchema, doc, fieldName) => {
  const schema = simpleSchema._schema[fieldName];
  const label =
    _.get(schema, "uniforms.label") || _.get(schema, "label") || fieldName;
  const type = _.get(schema, "type.name");
  let options = _.get(schema, "uniforms.options");
  const _value = _.get(doc, fieldName);
  let value = "";
  switch (type) {
    case "String":
      value = _value;
      if (options) {
        if (typeof options == "function") {
          options = options({});
        }
        options.forEach(o => {
          if (o.value == _value) value = o.label;
        });
      }
      break;
    case "Date":
      if (_value) {
        value = moment(_value).format("YYYY/MM/DD");
      }
      break;
    case "Number":
      if (_value) {
        value = _value;
      }
      break;
  }

  return (
    <Segment
      padded
      style={{
        margin: "0",
        paddingLeft: "1.5em",
        paddingRight: "1.5em",
        paddingTop: "0.5em",
        paddingBottom: "0.5em",
        border: "none",
        minHeight: "61px"
      }}
    >
      <Label
        attached="top"
        className="font-family"
        style={{
          fontSize: "12px",
          backgroundColor: "transparent",
          paddingTop: "5px",
          paddinBottom: "5px",
          color: "#adadad"
        }}
      >
        {label}
      </Label>
      <Item
        className="font-family"
        style={{ color: "#707070", padding: "5px 0px", fontSize: "15px" }}
      >
        <Item.Meta>{value}</Item.Meta>
      </Item>
    </Segment>
  );
};

/**
 *
 *
 */
export const displayField = (
  simpleSchema,
  doc,
  fieldName,
  elemListMeta,
  elemListContent
) => {
  const schema = simpleSchema._schema[fieldName];
  const label =
    _.get(schema, "uniforms.label") || _.get(schema, "label") || fieldName;

  let valueItem = elemListMeta
    .map(f => (f.slice(0, 1) == "#" ? f.slice(1) : _.get(doc, f)))
    .join(" ")
    .replace("  ", "");
  let valueContent = elemListContent
    .map(f => (f.slice(0, 1) == "#" ? f.slice(1) : _.get(doc, f)))
    .join(" ")
    .replace("  ", "");

  return (
    <Segment
      padded
      style={{
        margin: "0",
        paddingLeft: "1.5em",
        paddingRight: "1.5em",
        paddingTop: "0.5em",
        paddingBottom: "0.5em",
        border: "none",
        minHeight: "61px"
      }}
    >
      <Label
        attached="top"
        className="font-family"
        style={{
          fontSize: "12px",
          backgroundColor: "transparent",
          paddingTop: "5px",
          paddinBottom: "5px",
          color: "#adadad"
        }}
      >
        {label}
      </Label>
      <Item
        className="font-family"
        style={{ color: "#707070", padding: "5px 0px", fontSize: "15px" }}
      >
        <Item.Meta>{valueItem}</Item.Meta>
        <Item.Content>{valueContent}</Item.Content>
      </Item>
    </Segment>
  );
};

/**
 *
 *
 */
export const displayValueField = (simpleSchema, doc, fieldName, elem) => {
  const schema = simpleSchema._schema[fieldName];
  const label =
    _.get(schema, "uniforms.label") || _.get(schema, "label") || fieldName;
  const _value = _.get(doc, fieldName);

  return (
    <Segment
      padded
      style={{
        margin: "0",
        paddingLeft: "1.5em",
        paddingRight: "1.5em",
        paddingTop: "0.5em",
        paddingBottom: "0.5em",
        border: "none",
        minHeight: "61px"
      }}
    >
      <Label
        attached="top"
        className="font-family"
        style={{
          fontSize: "12px",
          backgroundColor: "transparent",
          paddingTop: "5px",
          paddinBottom: "5px",
          color: "#adadad"
        }}
      >
        {label}
      </Label>
      <Item
        className="font-family"
        style={{ color: "#707070", padding: "5px 0px", fontSize: "15px" }}
      >
        <Item.Meta>{elem(schema, _value)}</Item.Meta>
      </Item>
    </Segment>
  );
};

/**
 *
 *
 */
export const displayListField = (simpleSchema, doc, fieldName, elem) => {
  const schema = simpleSchema._schema[fieldName];
  const label =
    _.get(schema, "uniforms.label") || _.get(schema, "label") || fieldName;
  const _value = _.get(doc, fieldName) || [];

  return (
    <Segment
      padded
      style={{
        margin: "0",
        paddingLeft: "1.5em",
        paddingRight: "1.5em",
        paddingTop: "0.5em",
        paddingBottom: "0.5em",
        border: "none",
        minHeight: "61px"
      }}
    >
      <Label
        attached="top"
        className="font-family"
        style={{
          fontSize: "12px",
          backgroundColor: "transparent",
          paddingTop: "5px",
          paddinBottom: "5px",
          color: "#adadad"
        }}
      >
        {label}
      </Label>
      <Item
        className="font-family"
        style={{ color: "#707070", padding: "5px 0px", fontSize: "15px" }}
      >
        {
          <For each="tel" index="index" of={_value}>
            {
              <If condition={index > 0}>
                <hr
                  key={"h" + index}
                  style={{ opacity: "0.2", margin: "0.5em" }}
                />
              </If>
            }
            {
              <If condition={_value[index]}>
                <Item.Meta key={index}>{elem(schema, _value[index])}</Item.Meta>
              </If>
            }
          </For>
        }
      </Item>
    </Segment>
  );
};

/**
 *
 *
 */
export const displayTabs = (self, tabNo) => {
  return (
    <>
      <Button className="fotter-btn" onClick={self.gotoHome}>
        <Image
          src={
            window.$GLOBAL$.__SVG__["ホーム" + (tabNo == "0" ? "ON" : "OFF")]
          }
          centered
        />
      </Button>
      <Button className="fotter-btn" onClick={self.gotoList}>
        <Image
          src={
            window.$GLOBAL$.__SVG__["リスト" + (tabNo == "1" ? "ON" : "OFF")]
          }
          centered
        />
      </Button>
      <Button className="fotter-btn" onClick={self.gotoMap}>
        <Image
          src={
            window.$GLOBAL$.__SVG__["マップ" + (tabNo == "2" ? "ON" : "OFF")]
          }
          centered
        />
      </Button>
      <Button className="fotter-btn" onClick={self.gotoPin}>
        <Image
          src={window.$GLOBAL$.__SVG__["ピン" + (tabNo == "3" ? "ON" : "OFF")]}
          centered
        />
      </Button>
      <Button className="fotter-btn">
        <Image
          src={
            window.$GLOBAL$.__SVG__["活動記録" + (tabNo == "4" ? "ON" : "OFF")]
          }
          centered
        />
      </Button>
    </>
  );
};

/**
 *
 *
 */
export const getImageLink = (doc, alt) => {
  if (!doc.images || doc.images.length == 0) {
    if (alt) {
      return alt;
    } else if (_.get(doc, "identity.sex") == "male") {
      return "/smsk-front/登録アカウント一覧用プロフアイコン.svg";
    } else {
      return "/smsk-front/個人（女性）.svg";
    }
  }

  const _id = doc.images[0].Images_id;
  const imgCursor = Images_Collection.findOne({ _id: _id });
  let link = "";
  if (imgCursor) {
    link = imgCursor.link();
    const p = link.indexOf("/cdn/storage");
    if (p > 0) {
      link = link.substring(p);
    }
    link = link.replace("http://localhost:3000", "");
    return link;
  }
  return "";
};
