import React from "react";
import { Input } from "semantic-ui-react";
import { Segment, Grid, Button, Image } from "semantic-ui-react";

import { MDBModalW } from "../lib/MDBModalW";

import { Tags_List } from "../lib/Tags/List";
import { Tags_ListSearch } from "../lib/Tags/ListSearch";

import { SelectorTagsConf } from "./SelectorTagsConf";

export class SelectorTags extends React.Component {
  "use strict";
  constructor(props) {
    super(props);
    this.state = {
      searchKeyword: "",
      selectedTags: this.props.value.tags.or || [],
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

  onClickCommit = selectedTags => {
    /// Application - Search
    const tags = {
      or: [],
      not: [],
      and: []
    };
    tags.or = selectedTags;
    this.setState({ selectedTags: selectedTags });
    /// Application - Search --

    this.props.close(tags);
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
                  value={this.state.searchKeyword}
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
                <Image
                  onClick={() => {
                    this.setState({ searchKeyword: "" });
                  }}
                  src={window.$GLOBAL$.__SVG__["×ボタン（タグで絞り込む1）"]}
                  style={{ position: "absolute", right: "4px", bottom: "9px" }}
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
                件のタブを選択中
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
          modHeight={17}
          showCreateButton={false}
          selectedTags={this.state.selectedTags}
          updateSelectedTagsTemporary={selectedTags => {
            this.setState({ selectedTags: selectedTags });
          }}
          updateSelectedTags={selectedTags => this.onClickCommit(selectedTags)}
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
