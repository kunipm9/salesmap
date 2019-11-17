import React from "react";

/// Custom - AutoForm - collection
import { Maps_Consumers_Collection } from "@imports/api/Maps/Consumers_Collection";
console.assert(
  Maps_Consumers_Collection,
  "Maps_Consumers_Collection is undefined."
);
/// Custom - AutoForm - collection --

import { MapsSP_Maps_View_ComponentInfo } from "../View";

import { Tags_List } from "../../lib/Tags/List";
import { Tags_ListSearch } from "../../lib/Tags/ListSearch";

// import start
import { Segment } from "semantic-ui-react";
import { Grid } from "semantic-ui-react";

import { Button } from "semantic-ui-react";
import { Input } from "semantic-ui-react";
import { Image } from "semantic-ui-react";
// import end

import { MDBModalW } from "../../lib/MDBModalW";

export class Sel_Tags extends React.Component {
  "use strict";
  constructor(props) {
    super(props);

    console.log("Sel_Tags ========================", this.props);

    /// Custom - Role - check permission
    this.ComponentInfo = MapsSP_Maps_View_ComponentInfo;
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
    console.assert(
      this.ComponentInfo("update"),
      "ComponentInfo('update') is undefined"
    );
    console.log("onClickCommit--------------", selectedTags);
    this.setState({ selectedTags: selectedTags });
    this.props.addTags(selectedTags);
    this.props.close();
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
                width={12}
                className="center aligned content"
                style={{ padding: "0px" }}
              >
                <Input
                  onChange={this.onChangeSearchKeyword}
                  onKeyDown={this.onKeyDownKeyword}
                  icon="search"
                  iconPosition="left"
                  inverted
                  placeholder="タグを検索"
                  className="font-family form-height"
                  style={{
                    width: "100%",
                    border: "solid 1px #d6d6d6",
                    marginLeft: "5px"
                  }}
                />
              </Grid.Column>
              <Image
                src={window.$GLOBAL$.__SVG__["虫メガネ"]}
                style={{
                  left: "76px",
                  bottom: "33px",
                  width: "25.795px"
                }}
              />
            </Grid.Row>
            <Grid.Row
              style={{ padding: "0px", bottom: "26px", left: "230px" }}
            ></Grid.Row>
          </Grid>
        </Segment>
        {/* 詳細 end */}

        <Tags_List
          modHeight={210}
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
          isOpen={this.state.showListSearchModal}
          toggle={() => {
            this.setState({ showListSearchModal: false });
          }}
          className="m-0 p-0"
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
