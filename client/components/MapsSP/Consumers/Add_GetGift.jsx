/// Sys - AutoForm
import React from "react";
import AutoFields from "@imports/ui/uniforms-material/AutoFields";
import ErrorsField from "uniforms-bootstrap4/ErrorsField";
import { Add_Base } from "../lib/Add_Base";
/// Sys - AutoForm --

/// Custom - AutoForm - collection
import { Maps_Consumers_Collection } from "@imports/api/Maps/Consumers_Collection";
console.assert(
  Maps_Consumers_Collection,
  "Maps_Consumers_Collection is undefined."
);
/// Custom - AutoForm - collection --

import { MapsSP_Consumers_Detail_ComponentInfo } from "./Detail";

/**
 *
 *
 * @export
 * @class Add_GetGift
 * @extends {Update}
 */
export class Add_GetGift extends Add_Base {
  "use strict";

  /**
   *Creates an instance of Add_GetGift.
   * @param {*} props
   * @memberof Add_GetGift
   */
  constructor(props) {
    super(props);

    if (!props) {
      return;
    }

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
    this.Form_name = this.Collection._name + "_getGift";
    /// Custom - AutoForm - rebuild field --
    /// Custom - LocalStorage --

    /// Sys - AutoForm - rebuild field !!!!!!!!!!
    this.postConstructor();
    /// Sys - AutoForm - rebuild field !!!!!!!!!! --

    this.submit = this.submit.bind(this);
    this.securityCheck = this.securityCheck.bind(this);

    /// Sys - AutoForm - rebuild field
    this.postConstructor();
    /// Sys - AutoForm - rebuild field --

    this.state.doc = Object.assign({}, this.props.doc);
    if (!this.state.doc.getGifts) {
      this.state.doc.getGifts = [];
    }
    this.state.index = this.state.doc.getGifts.length;
  }

  /// Application - Save
  /**
   *
   *
   * @param {*} doc
   * @memberof Add_GetGift
   */
  submit(doc) {
    this.props.updateDoc(doc, [
      "getGifts",
      `getGifts.${doc.getGifts.length - 1}.gift`
    ]);
    this.props.close();
  }
  /// Application - Save --

  /**
   *
   *
   * @returns
   * @memberof Add_GetGift
   */
  render() {
    let simpleSchema;
    if (typeof this.Collection.simpleSchema == "function") {
      simpleSchema = this.Collection.simpleSchema();
    } else {
      simpleSchema = this.Collection.simpleSchema;
    }

    return super.render(
      simpleSchema,
      <React.Fragment>
        <AutoFields
          fields={simpleSchema._schemaKeys
            .filter(f => f.startsWith("getGifts.$.gift."))
            .map(f => {
              if (f.startsWith("getGifts.$.gift.")) {
                return f.replace("$", String(this.state.index));
              }
            })}
        />
        <ErrorsField />
      </React.Fragment>
    );
    /// Sys - AutoForm - layout --
  }
}
