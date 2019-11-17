import React from "react";
import connectField from "uniforms/connectField";
import wrapField from "uniforms-bootstrap4/wrapField";

/// Custom - Application
import { Maps_Tags_Collection } from "@imports/api/Maps/Tags_Collection";
console.assert(Maps_Tags_Collection, "Maps_Tags_Collection is undefined.");
/// Custom - Application --

/// Custom - Layout
import { MDBBtn } from "mdbreact";
import { MDBChip } from "mdbreact";
/// Custom - Layout --

/**
 *
 *
 * @class MapTag
 * @extends {React.Component}
 */
class MapTag extends React.Component {
  /**
   *Creates an instance of MapTag.
   * @param {*} props
   * @memberof MapTag
   */
  constructor(props) {
    super(props);
    this.state = {
      activeTagCat1: null,
      activeTagCat2: null,
      tagList: []
    };

    this.tagCat1List = Maps_Tags_Collection.find({ _deleted: null }).map(
      cat1 => cat1
    );

    if (this.tagCat1List.length > 0) {
      this.state.activeTagCat1 = this.tagCat1List[0];

      const tagCat1Cat2List = this.tagCat1List.filter(cat1 => {
        return cat1._id == this.state.activeTagCat1._id;
      });
      if (tagCat1Cat2List.length > 0) {
        this.state.activeTagCat2 = tagCat1Cat2List[0].cat2[0];
      }
    }

    this.valuePre = [];
  }

  /**
   *
   *
   * @param {*} nextProps
   * @returns
   * @memberof MapTag
   */
  UNSAFE_componentWillReceiveProps(nextProps) {
    if (JSON.stringify(this.valuePre) == JSON.stringify(nextProps.value)) {
      return;
    }

    this.valuePre = nextProps.value;

    const tagList = [];
    for (let cat1 of this.tagCat1List) {
      for (let cat2 of cat1.cat2) {
        for (let item of cat2.items) {
          if (nextProps.value.indexOf(item.id) >= 0) {
            tagList.push(item);
          }
        }
      }
    }
    this.setState({
      tagList: tagList
    });
  }

  /**
   *
   *
   * @memberof MapTag
   */
  handleTagCat1 = cat1 => () => {
    if (this.state.activeTagCat1 !== cat1) {
      const tagCat1Cat2List = this.tagCat1List.filter(_cat1 => {
        return _cat1._id == cat1._id;
      });
      if (tagCat1Cat2List.length > 0) {
        this.setState({
          activeTagCat1: cat1,
          activeTagCat2: tagCat1Cat2List[0].cat2[0]
        });
      }
    }
  };

  /**
   *
   *
   * @memberof MapTag
   */
  handleTagCat2 = cat2 => () => {
    if (this.state.activeTagCat2 !== cat2) {
      this.setState({
        activeTagCat2: cat2
      });
    }
  };

  /**
   *
   *
   * @memberof MapTag
   */
  handleTagItem = item => () => {
    this.state.tagList.push(item),
      this.props.onChange(this.state.tagList.map(tag => tag.id));
    this.setState({
      tagList: this.state.tagList
    });
  };

  /**
   *
   *
   * @memberof MapTag
   */
  handleTagClose = _item => () => {
    const tagList = this.state.tagList.filter(item => _item.id != item.id);
    this.props.onChange(tagList.map(tag => tag.id));
    this.setState({
      tagList: tagList
    });
  };

  /* global index */
  /* global cat1 */
  /* global cat2 */
  /* global item */

  /**
   *
   *
   * @returns
   * @memberof MapTag
   */
  render() {
    if (this.props.disabled) {
      return (
        <React.Fragment>
          {
            <For each="item" index="index" of={this.state.tagList}>
              <MDBChip
                key={index}
                waves
                close
                bgColor="indigo lighten-4"
                handleClose={this.handleTagClose(item)}
                style={{ marginBottom: 0 }}
              >
                {item.title}
              </MDBChip>
            </For>
          }
        </React.Fragment>
      );
    }

    /// Custom - Tabular - layout
    let tagCat2List = [];
    let tagCat2ItemList = [];
    let tagItemList = [];
    const tagCat1Cat2List = this.tagCat1List.filter(cat1 => {
      return cat1._id == this.state.activeTagCat1._id;
    });
    if (tagCat1Cat2List.length > 0) {
      tagCat2List = tagCat1Cat2List[0].cat2;
      if (tagCat2List.length > 0) {
        tagCat2ItemList = tagCat2List.filter(cat2 => {
          return cat2.id == this.state.activeTagCat2.id;
        });
        if (tagCat2ItemList.length > 0) {
          tagItemList = tagCat2ItemList[0].items;
        }
      }
    }

    return (
      <React.Fragment>
        【大分類】
        {
          <For each="cat1" index="index" of={this.tagCat1List}>
            <Choose>
              <When condition={cat1._id == this.state.activeTagCat1._id}>
                <MDBBtn
                  key={index}
                  onClick={this.handleTagCat1(cat1)}
                  color="mdb-color"
                  size="sm"
                  style={{
                    border: "yellow",
                    borderStyle: "solid",
                    boxShadow:
                      "0 2px 5px 0 rgba(0, 0, 0, 0.32), 0 2px 10px 0 rgba(0, 0, 0, 0.24)"
                  }}
                >
                  {cat1.title}
                </MDBBtn>
              </When>
              <Otherwise>
                <MDBBtn
                  key={index}
                  onClick={this.handleTagCat1(cat1)}
                  color="mdb-color"
                  size="sm"
                >
                  {cat1.title}
                </MDBBtn>
              </Otherwise>
            </Choose>
          </For>
        }
        <hr
          style={{
            marginTop: "0.2rem",
            marginBottom: "0.2rem",
            borderTop: "1px solid rgba(0,0,0,.3)"
          }}
        />
        【中分類】
        {
          <For each="cat2" index="index" of={tagCat2List}>
            <Choose>
              <When condition={cat2.id == this.state.activeTagCat2.id}>
                <MDBBtn
                  key={index}
                  onClick={this.handleTagCat2(cat2)}
                  color="blue-grey"
                  size="sm"
                  style={{
                    border: "yellow",
                    borderStyle: "solid",
                    boxShadow:
                      "0 2px 5px 0 rgba(0, 0, 0, 0.32), 0 2px 10px 0 rgba(0, 0, 0, 0.24)"
                  }}
                >
                  {cat2.title}
                </MDBBtn>
              </When>
              <Otherwise>
                <MDBBtn
                  key={index}
                  onClick={this.handleTagCat2(cat2)}
                  color="blue-grey"
                  size="sm"
                >
                  {cat2.title}
                </MDBBtn>
              </Otherwise>
            </Choose>
          </For>
        }
        <hr
          style={{
            marginTop: "0.2rem",
            marginBottom: "0.2rem",
            borderTop: "1px solid rgba(0,0,0,.3)"
          }}
        />
        【小項目】
        {
          <For each="item" index="index" of={tagItemList}>
            <Choose>
              <When
                condition={
                  this.state.tagList.filter(_item => item.id == _item.id)
                    .length > 0
                }
              >
                <MDBBtn
                  key={index}
                  disabled={true}
                  rounded
                  color="mdb-color"
                  size="sm"
                >
                  {item.title}
                </MDBBtn>
              </When>
              <Otherwise>
                <MDBBtn
                  key={index}
                  onClick={this.handleTagItem(item)}
                  rounded
                  color="mdb-color"
                  size="sm"
                >
                  {item.title}
                </MDBBtn>
              </Otherwise>
            </Choose>
          </For>
        }
        <hr
          style={{
            marginTop: "0.2rem",
            marginBottom: "0.2rem",
            borderTop: "1px solid rgba(0,0,0,.3)"
          }}
        />
        {
          <For each="item" index="index" of={this.state.tagList}>
            <MDBChip
              key={index}
              waves
              close={!this.props.disabled}
              bgColor="indigo lighten-4"
              handleClose={this.handleTagClose(item)}
              style={{ marginBottom: 0 }}
            >
              {item.title}
            </MDBChip>
          </For>
        }
      </React.Fragment>
    );
  }
}

function divField(props) {
  return (
    <MapTag
      value={props.value}
      disabled={props.disabled}
      style={props.style}
      onChange={props.onChange}
    />
  );
}

const MapTagField_ = props => {
  const wrapProps = Object.assign({}, props);
  delete wrapProps["style"];
  return wrapField(props, divField(props));
};
export default connectField(MapTagField_);
