/// Sys - Tabular
import React from "react";
import _ from "lodash";
/// Sys - Tabular --

import moment from "moment";
moment.locale("ja");

import { Maps_Companys_Collection } from "@imports/api/Maps/Companys_Collection";
console.assert(
  Maps_Companys_Collection,
  "Maps_Companys_Collection is undefined."
);

// import start
import { Grid } from "semantic-ui-react";
import { Item } from "semantic-ui-react";
import { Image } from "semantic-ui-react";
import { Button } from "semantic-ui-react";
// import end

export function displayCompany(doc, idx, history, updatePath, showTelephone) {
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

  return (
    <React.Fragment key={doc._id}>
      <Item>
        <Grid>
          <Grid.Row>
            <Grid.Column
              width={13}
              className={idx == 0 ? "item-margin-top" : ""}
              onClick={() => {
                history.push(updatePath);
              }}
            >
              <Item.Header as="a" className="font-family list-header">
                {doc.name}
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
            </Grid.Column>

            <Grid.Column
              width={3}
              className="middle aligned content tel"
              style={{ paddingLeft: "0px" }}
            >
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

export const getCompanyName = _id => {
  const company = Maps_Companys_Collection.findOne({ _id: _id });
  if (company) {
    return company.name;
  } else {
    return "";
  }
};

/* global index */
/* global tel */

export const getCompanyDetail = _id => {
  const doc = Maps_Companys_Collection.findOne({ _id: _id });
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
