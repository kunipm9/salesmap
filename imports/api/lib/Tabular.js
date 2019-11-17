/// Sys - Tabular
import { Template } from "meteor/templating";
import { Meteor } from "meteor/meteor";
/// Sys - Tabular --

/// Sys - Tabular
if (!Meteor.setTabularTables) {
  TabularTables = {};
  Meteor.isClient &&
    Template.registerHelper("TabularTables", global.TabularTables);
  Meteor.setTabularTables = true;
}
/// Sys - Tabular --
