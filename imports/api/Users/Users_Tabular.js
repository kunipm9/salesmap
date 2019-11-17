console.log("Users_Users_Tabular");

/// Sys - Tabular
import "@imports/api/lib/Tabular";
import Tabular from "meteor/aldeed:tabular";
import { Template } from "meteor/templating";
/// Sys - Tabular --

/// Custom - Tabular - display format
TabularTables.Users_Users_Tabular = new Tabular.Table({
  name: "Users_Users",
  collection: Meteor.users,
  stateSave: true,
  dom: "Bfrtip",
  //  dom: 'C<"clear">lRfrtip',
  //  dom: "<\"datatable-header\"Rfl><\"datatable-scroll\"rt><\"datatable-footer\"ip>",
  buttons: ["csv", "colvis"],
  colReorder: true,
  language: {
    url: "//cdn.datatables.net/plug-ins/3cfcc339e89/i18n/Japanese.json"
  },
  columns: [
    { data: "profile.username", title: "Username" },
    { data: "emails[0].address", title: "Emails" },
    {
      // see packages/application-buttons/templates.html
      tmpl: Meteor.isClient && Template.Users_Users_List_Buttons,
      className: "paddingZero"
    }
  ]
});
/// Custom - Tabular - display format --
