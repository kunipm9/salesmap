/// Sys - Tabular
import React from "react";
import _ from "lodash";
/// Sys - Tabular --

import { Maps_Consumers_getCommunicationTypeLabel } from "@imports/api/Maps/Consumers_Collection";

import moment from "moment";
moment.locale("ja");

// import start
import { Grid } from "semantic-ui-react";
import { Item } from "semantic-ui-react";
import { Label } from "semantic-ui-react";
import { Button } from "semantic-ui-react";
import { Image } from "semantic-ui-react";
// import end

const rankCvIndex = id => {
  const ranks = window.$GLOBAL$.__ConsumersView__.ranks;
  if (ranks[id]) {
    return id;
  }
  for (let i = 0; i < ranks.length; i++) {
    if (ranks[i] && ranks[i].rank == id) {
      return i;
    }
  }
  return 10;
};

export const getRankTitle = rank => {
  const ranks = window.$GLOBAL$.__ConsumersView__.ranks;
  return ranks[rankCvIndex(rank)].rank;
};

export const getRankColor = rank => {
  const ranks = window.$GLOBAL$.__ConsumersView__.ranks;
  return ranks[rankCvIndex(rank)].color;
};

/* global index */
/* global tel */

export function displayConsumer(
  saveScrollPos,
  doc,
  idx,
  history,
  updatePath,
  showTelephone,
  paddingSortName
) {
  if (!doc) {
    return <React.Fragment />;
  }

  let showTelephoneLink = false;
  let showTelephoneIcon = false;
  if (showTelephone) {
    if (_.get(doc, "contact.tels") && doc.contact.tels.length == 1) {
      showTelephoneLink = true;
    }
    if (_.get(doc, "contact.tels") && doc.contact.tels.length > 1) {
      showTelephoneIcon = true;
    }
  }

  const { tlabel, color } = Maps_Consumers_getCommunicationTypeLabel(
    doc.communicationsLast
  );
  const comTlabel = tlabel;
  const comColor = color;
  let comModifiedAt = "";
  if (doc.communicationsLast) {
    comModifiedAt = moment(doc.communicationsLast.modifiedAt).format(
      "YYYY/MM/DD"
    );
  }

  return (
    <React.Fragment key={doc._id}>
      <Item>
        <Grid>
          <Grid.Row
            className="list-row"
            style={{ paddingTop: "0.5rem", paddingBottom: "0.5rem" }}
          >
            <Grid.Column
              width={13}
              className={idx == 0 ? "item-margin-top" : ""}
              onClick={() => {
                if (saveScrollPos) {
                  saveScrollPos();
                }
                history.push(updatePath);
              }}
            >
              <Item.Header as="a" className="font-family list-header">
                {_.get(doc, "identity.name") || "(なし)"}
                <Label
                  size="mini"
                  id="label-s"
                  className="font-family"
                  style={{ backgroundColor: getRankColor(doc.rank) }}
                >
                  {getRankTitle(doc.rank)}
                </Label>
              </Item.Header>
              <Item.Meta className="meta font-color font-family list-meta1">
                {
                  <If
                    condition={
                      doc.residenceAddress && doc.residenceAddress.address
                    }
                  >
                    {doc.residenceAddress.address.addressTown}
                    {doc.residenceAddress.address.addressNumber}
                    {doc.residenceAddress.address.addressBuilding}
                    {doc.residenceAddress.address.addressRoomNo}
                  </If>
                }
              </Item.Meta>
              {
                <If condition={doc.communicationsLast}>
                  <Item.Meta className="meta font-color font-family list-meta2">
                    最終訪問日: {comModifiedAt}({doc.communicationsLast.staff})
                    <Label
                      circular
                      size="mini"
                      style={{
                        marginLeft: "8px",
                        backgroundColor: comColor,
                        color: "white",
                        position: "relative",
                        top: "-2px"
                      }}
                    >
                      {comTlabel}
                    </Label>
                  </Item.Meta>
                </If>
              }
              <Item.Meta className="meta font-color font-family list-meta3">
                紹介人数: {(_.get(doc, "introductions") || []).length}人
              </Item.Meta>
            </Grid.Column>

            <Grid.Column width={3} className="middle aligned content tel">
              <Button className="tel-btn">
                {
                  <If condition={showTelephoneLink}>
                    <Image
                      src={window.$GLOBAL$.__SVG__["通話アイコン"]}
                      href={"tel:" + doc.contact.tels[0].tel}
                    />
                  </If>
                }
                {
                  <If condition={showTelephoneIcon}>
                    <Image
                      src={window.$GLOBAL$.__SVG__["通話アイコン"]}
                      onClick={() => {
                        showTelephone(doc);
                      }}
                    />
                  </If>
                }
                {
                  <If condition={!showTelephoneLink && !showTelephoneIcon}>
                    <Image src={window.$GLOBAL$.__SVG__["通話アイコン-1"]} />
                  </If>
                }
              </Button>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Item>
    </React.Fragment>
  );
}

export const getConsumerName = _id => {
  const consumer = window.$GLOBAL$.Collection["Maps_Consumers"][_id];
  if (consumer) {
    return _.get(consumer, "identity.name") || "";
  } else {
    return "";
  }
};

export const getConsumerDetail = _id => {
  const doc = window.$GLOBAL$.Collection["Maps_Consumers"][_id];
  if (doc) {
    return (
      <span>
        {
          <If condition={doc.residenceAddress && doc.residenceAddress.address}>
            <div>
              {doc.residenceAddress.address.prefecture}
              {doc.residenceAddress.address.addressCity}
              {doc.residenceAddress.address.addressTown}
              {doc.residenceAddress.address.addressNumber}
              {doc.residenceAddress.address.addressBuilding}
              {doc.residenceAddress.address.addressRoomNo}
            </div>
          </If>
        }
        {
          <If condition={doc.contact && doc.contact.tels}>
            {
              <For each="tel" index="index" of={doc.contact.tels}>
                <div key={index}>
                  <a href={"tel:" + tel.tel}> {tel.tel} </a>
                </div>
              </For>
            }
          </If>
        }
      </span>
    );
  } else {
    return "";
  }
};
