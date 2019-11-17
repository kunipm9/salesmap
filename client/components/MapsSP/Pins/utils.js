/// Sys - Tabular
import React from "react";
import _ from "lodash";
/// Sys - Tabular --

import moment from "moment";
moment.locale("ja");

// import start
import { Grid } from "semantic-ui-react";
import { Item } from "semantic-ui-react";
import { Button } from "semantic-ui-react";
import { Image } from "semantic-ui-react";
// import end

/// Custom - AutoForm - collection
import { Images_Collection } from "@imports/api/lib/Images_Collection";
/// Custom - AutoForm - collection --

/**
 *
 *
 * @memberof MapsSP_Consumers_Detail
 */
const getImageLink = doc => {
  if (!doc.images || doc.images.length == 0) {
    return "https://react.semantic-ui.com/images/wireframe/image.png";
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

/**
 *
 *
 * @export
 * @param {*} saveScrollPos
 * @param {*} doc
 * @param {*} idx
 * @param {*} history
 * @param {*} updatePath
 * @returns
 */
export function displayPin(
  saveScrollPos,
  cat2Dict,
  doc,
  idx,
  history,
  updatePath,
  onClick,
  showLightBox
) {
  if (!doc) {
    return <React.Fragment />;
  }

  let title = "";
  let shorttitle = "";
  let bitmap = "";
  let svg = "";
  const cat2 = cat2Dict[doc.cat2];
  if (cat2) {
    title = cat2.title;
    shorttitle = cat2.shorttitle;
    bitmap = cat2.bitmap;
    svg = "data:image/svg+xml," + encodeURIComponent(cat2.svg);
  }

  return (
    <React.Fragment key={doc._id}>
      <Grid>
        <Grid.Row>
          <Grid.Column
            width={3}
            className="item-margin-top"
            style={{ paddingRight: 0 }}
          >
            {
              <If condition={bitmap}>
                <Image src={svg} style={{ marginLeft: "3px", width: "36px" }} />
              </If>
            }
            {
              <If condition={!bitmap}>
                <p className="font-family font-color pin-list-p">
                  {" "}
                  {shorttitle}
                </p>
              </If>
            }
          </Grid.Column>

          <Grid.Column
            onClick={() => onClick(doc._id)}
            width={8}
            className="item-margin-top"
            style={{ padding: "0px" }}
          >
            <Item.Meta className="font-color font-family pin-list-meta">
              {title} {doc.num || 0}枚
            </Item.Meta>
            <Item.Meta className="font-color font-family pin-list-meta">
              貼り付け日：{doc.executedAt ? moment(doc.executedAt).format("YYYY/MM/DD") : ""}
            </Item.Meta>
            <Item.Meta className="font-color font-family pin-list-meta">
              担当者：{doc.staff}
            </Item.Meta>

            <Item.Meta
              className="font-color font-family pin-list-meta"
              style={{ lineHeight: "16px" }}
            >
              備考：{doc.memo}
            </Item.Meta>

            <Item.Meta
              className="font-family"
              style={{ margin: "5px 0", color: "#b5b2b2", fontSize: "11px" }}
            >
              ＜ピンNo：P{doc.no}＞
            </Item.Meta>
          </Grid.Column>

          <Grid.Column
            width={5}
            className="middle aligned content item-margin-top"
          >
            {
              <If condition={!doc.images || doc.images.length == 0}>
                <div style={{ height: "66px" }} />
              </If>
            }
            {
              <If condition={doc.images && doc.images.length}>
                <Image
                  onClick={() => {
                    showLightBox(getImageLink(doc));
                  }}
                  src={getImageLink(doc)}
                  style={{ width: "80px" }}
                  size="small"
                  centered
                />
              </If>
            }
            <Button
              onClick={() => {
                const pathCoordinates =
                  "residenceAddress.location.pos.coordinates";
                let center = _.get(doc, pathCoordinates);
                history.replace(
                  "/MapsSP/Maps/ViewPos/" + center[0] + "," + center[1]
                );
              }}
              style={{ padding: "0px", backgroundColor: "transparent" }}
            >
              <Image
                src={window.$GLOBAL$.__SVG__["MAP"]}
                style={{ marginTop: "5px", marginLeft: "2px" }}
              />
            </Button>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </React.Fragment>
  );
}
