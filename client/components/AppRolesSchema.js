import { SimpleSchema } from "meteor/aldeed:simple-schema";
import NestField from "@imports/ui/uniforms/NestField";

const ProgramRolesSchema = new SimpleSchema({
  crud: {
    type: [String],
    uniforms: {
      /// Custom - AutoForm - select style
      checkboxes: true,
      /// Custom - AutoForm - select style --

      /// Custom - AutoForm - inline grid
      inline: true,
      wrapClassName: "col-12",
      /// Custom - AutoForm - inline grid --

      label: "",
      options: [
        { label: "All", value: "all", type: "all", color: "checkbox-primary" },
        { label: "Create", value: "create", color: "checkbox-success" },
        { label: "Read", value: "read", color: "checkbox-success" },
        { label: "Update", value: "update", color: "checkbox-success" },
        { label: "Delete", value: "delete", color: "checkbox-success" }
      ]
    }
  }
});

export const AppRolesSchema = new SimpleSchema({
  Books: {
    optional: true,
    type: Object,
    label: "(Books アプリケーション)",
    uniforms: {
      className: "col col-12",
      component: NestField,
      frameset: "card",
      collapsable: true
    }
  },
  "Books.Books": {
    optional: true,
    type: ProgramRolesSchema,
    label: "Books Func"
  },
  "Books.Categorys": {
    optional: true,
    type: ProgramRolesSchema,
    label: "Categorys Func"
  },
  "Books.Languages": {
    optional: true,
    type: ProgramRolesSchema,
    label: "Languages Func"
  },

  Maps: {
    optional: true,
    type: Object,
    label: "(Maps アプリケーション)",
    uniforms: {
      className: "col col-12",
      component: NestField,
      frameset: "card",
      collapsable: true
    }
  },
  "Maps.Consumers": {
    optional: true,
    type: ProgramRolesSchema,
    label: "Consumers Func"
  },
  "Maps.Maps": {
    optional: true,
    type: ProgramRolesSchema,
    label: "Maps Func"
  },
  "Maps.Pins": {
    optional: true,
    type: ProgramRolesSchema,
    label: "Pins Func"
  },
  "Maps.Companys": {
    optional: true,
    type: ProgramRolesSchema,
    label: "Companys Func"
  },
  "Maps.Associations": {
    optional: true,
    type: ProgramRolesSchema,
    label: "Associations Func"
  },
  "Maps.Ranks": {
    optional: true,
    type: ProgramRolesSchema,
    label: "Ranks Func"
  },
  "Maps.Tags": {
    optional: true,
    type: ProgramRolesSchema,
    label: "Tags Func"
  },
  "Maps.ZnetLicences": {
    optional: true,
    type: ProgramRolesSchema,
    label: "ZnetLicences Func"
  },
  MapsSP: {
    optional: true,
    type: Object,
    label: "(Maps SPアプリケーション)",
    uniforms: {
      className: "col col-12",
      component: NestField,
      frameset: "card",
      collapsable: true
    }
  },
  "MapsSP.List": {
    optional: true,
    type: ProgramRolesSchema,
    label: "List Func"
  },
  "MapsSP.Consumers": {
    optional: true,
    type: ProgramRolesSchema,
    label: "Consumers Func"
  },
  "MapsSP.Companys": {
    optional: true,
    type: ProgramRolesSchema,
    label: "Companys Func"
  },
  "MapsSP.Associations": {
    optional: true,
    type: ProgramRolesSchema,
    label: "Associations Func"
  },
  "MapsSP.Maps": {
    optional: true,
    type: ProgramRolesSchema,
    label: "Maps Func"
  },
  "MapsSP.Pins": {
    optional: true,
    type: ProgramRolesSchema,
    label: "Pins Func"
  }
});
