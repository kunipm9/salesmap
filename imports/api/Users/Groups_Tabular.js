console.log("Users_Groups_Tabular");

/// Sys - Tabular
import "@imports/api/lib/Tabular";
import Tabular from "meteor/aldeed:tabular";
import { Template } from "meteor/templating";
/// Sys - Tabular --

/// Custom - Tabular - collection
import { Users_Groups_Collection } from "@imports/api/Users/Groups_Collection";
/// Custom - Tabular - collection --

/// Custom - Tabular - display format
TabularTables.Users_Groups_Tabular = new Tabular.Table({
  name: "Users_Groups",
  collection: Users_Groups_Collection,
  stateSave: true,
  dom: "Bfrtip",
  //  dom: 'C<"clear">lRfrtip',
  //  dom: "<\"datatable-header\"Rfl><\"datatable-scroll\"rt><\"datatable-footer\"ip>",
  buttons: ["csv", "colvis"],
  colReorder: true,
  language: {
    url: "//cdn.datatables.net/plug-ins/3cfcc339e89/i18n/Japanese.json"
  },
  columnDefs: [{ visible: false, targets: 0 }],
  columns: [
    { data: "_deleted", title: "" },
    {
      data: "title",
      title: "Title",
      render: function(val, type, doc) {
        return doc.disp_title();
      }
    },
    {
      // see packages/application-buttons/templates.html
      tmpl: Meteor.isClient && Template.Users_Groups_List_Buttons,
      className: "paddingZero"
    }
  ]
});
/// Custom - Tabular - display format --
