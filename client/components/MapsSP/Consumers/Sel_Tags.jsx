import React from "react";
import { Session } from "meteor/session";

/// Custom - AutoForm - collection
import { Maps_Consumers_Collection } from "@imports/api/Maps/Consumers_Collection";
console.assert(
  Maps_Consumers_Collection,
  "Maps_Consumers_Collection is undefined."
);
/// Custom - AutoForm - collection --

/// Sys - Network
import { Persister } from "@imports/api/lib/persist-method";
/// Sys - Network --

import { MapsSP_Consumers_Detail_ComponentInfo } from "./Detail";

import { Tags_List } from "../lib/Tags/List";
import { Tags_ListSearch } from "../lib/Tags/ListSearch";

import { SelectorTagsConf } from "./SelectorTagsConf";

// import start
import { Segment } from "semantic-ui-react";
import { Grid } from "semantic-ui-react";

import { Button } from "semantic-ui-react";
import { Input } from "semantic-ui-react";
import { Image } from "semantic-ui-react";
// import end

import { MDBModalW } from "../lib/MDBModalW";

export class Sel_Tags extends React.Component {
  "use strict";
  constructor(props) {
    super(props);

    /// Custom - Role - check permission
    this.ComponentInfo = MapsSP_Consumers_Detail_ComponentInfo;
    /// Custom - Role - check permission --

    /// Custom - LocalStorage
    /// Custom - AutoForm - rebuild field
    this.Collection = {
      _name: "Maps_Consumers",
      docs: {},
      simpleSchema: Maps_Consumers_Collection.simpleSchema(),
      dispTitle: Maps_Consumers_Collection.dispTitle
    };
    /// Custom - AutoForm - rebuild field --

    this.Form_name = this.Collection._name;
    this.CollectionList = [];
    /// Custom - LocalStorage --

    this.state = {
      searchKeyword: "",
      selectedTags: this.props.doc.tags || [],
      showSelectorTagsConf: false,
      showListSearchModal: false
    };
  }

  onChangeSearchKeyword = event => {
    this.setState({ searchKeyword: event.target.value });
  };

  onKeyDownKeyword = event => {
    const ENTER = 13;
    if (event.keyCode == ENTER) {
      this.setState({ showListSearchModal: true });
    }
  };

  onClickClear = () => {
    this.setState({ selectedTags: [] });
  };

  /**
   *
   *
   * @memberof _Sel_Family
   */
  onClickCommit = selectedTags => {
    this.setState({ selectedTags: selectedTags });

    const doc = this.props.doc;
    doc.tags = selectedTags;

    /// Sys - AutoForm - update
    const Users_Groups_id = Session.get("Users_Groups_id");

    console.assert(
      this.ComponentInfo("update"),
      "ComponentInfo('update') is undefined"
    );

    Persister.call(
      this.Form_name + ".update",
      Users_Groups_id,
      doc._id,
      doc,
      /// Sys - ApplicationError - init
      {
        methodCall: "update",
        proc: this.ComponentInfo("update").title,
        record: this.Collection.dispTitle(doc),
        callAt: Date.now()
      },
      this.props.close
      /// Sys - ApplicationError - init --
    );
    /// Sys - AutoForm - update --

    this.props.updateDoc(doc);
    window.$GLOBAL$.Collection[this.Collection._name][doc._id] = doc;
  };

  render() {
    return (
      <>
        {/* 詳細 start */}
        <Segment className="header-line" />
        <Segment className="link-area2" inverted>
          <Grid>
            <Grid.Row>
              <Grid.Column
                onClick={this.props.close}
                width={2}
                className="return-area"
              >
                <Button className="button-return return-padding">
                  <Image src={window.$GLOBAL$.__SVG__["戻る"]} />
                </Button>
              </Grid.Column>
              <Grid.Column
                width={5}
                style={{ padding: "9px 0 0", right: "14px" }}
              >
                <p
                  className="font-family"
                  style={{ color: "#767676", lineHeight: "25px" }}
                >
                  東森友暉
                </p>
              </Grid.Column>
              <Grid.Column width={8} style={{ padding: "0px", right: "22px" }}>
                <Input
                  onChange={this.onChangeSearchKeyword}
                  onKeyDown={this.onKeyDownKeyword}
                  value={this.state.searchKeyword}
                  icon="search"
                  iconPosition="left"
                  inverted
                  placeholder="タグを検索"
                  className="font-family form-height"
                  style={{
                    width: "100%",
                    border: "solid 1px #d6d6d6",
                    marginLeft: "5px",
                    top: "3px"
                  }}
                />
                <Image
                  src={window.$GLOBAL$.__SVG__["虫メガネ"]}
                  style={{
                    left: "12px",
                    bottom: "27px",
                    width: "25.795px"
                  }}
                />
                <Image
                  onClick={() => {
                    this.setState({ searchKeyword: "" });
                  }}
                  src={window.$GLOBAL$.__SVG__["×ボタン（タグで絞り込む1）"]}
                  style={{ position: "absolute", right: "4px", bottom: "6px" }}
                />
              </Grid.Column>
            </Grid.Row>
            <Grid.Row
              onClick={() => {
                this.setState({ showSelectorTagsConf: true });
              }}
              style={{ padding: "0px", bottom: "1px", left: "230px" }}
            >
              <span
                className="font-family font-color"
                style={{ display: "flex" }}
              >
                {this.state.selectedTags.length}
              </span>
              <span
                className="font-family font-color"
                style={{ display: "flex" }}
              >
                件のタグを選択中
                <Image
                  src="/smsk-front/tag1.png"
                  style={{ marginLeft: "4px", bottom: "1.4px" }}
                />
              </span>
            </Grid.Row>
          </Grid>
        </Segment>
        {/* 詳細 end */}

        <Tags_List
          modHeight={135}
          showCreateButton={true}
          selectedTags={this.state.selectedTags}
          updateSelectedTagsTemporary={selectedTags => {
            this.setState({ selectedTags: selectedTags });
          }}
          updateSelectedTags={selectedTags => {
            this.onClickCommit(selectedTags);
          }}
        />

        <MDBModalW
          size="fluid"
          isOpen={this.state.showSelectorTagsConf}
          toggle={() => {
            this.setState({ showSelectorTagsConf: false });
          }}
          className="m-0 p-0"
          animation="left"
        >
          <SelectorTagsConf
            close={() => {
              this.setState({ showSelectorTagsConf: false });
            }}
            selectedTags={this.state.selectedTags}
          />
        </MDBModalW>

        <MDBModalW
          size="fluid"
          isOpen={this.state.showListSearchModal}
          toggle={() => {
            this.setState({ showListSearchModal: false });
          }}
          className="m-0 p-0"
          animation="left"
        >
          <Tags_ListSearch
            close={() => {
              this.setState({ showListSearchModal: false });
            }}
            searchKeyword={this.state.searchKeyword}
            selectedTags={this.state.selectedTags}
            updateSelectedTags={selectedTags => {
              this.setState({ selectedTags: selectedTags });
            }}
          />
        </MDBModalW>
      </>
    );
  }
}
