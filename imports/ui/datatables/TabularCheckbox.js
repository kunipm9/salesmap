/// Sys - Tabular - checkbox
import { Session } from "meteor/session";
/// Sys - Tabular - checkbox --

/// Sys - Tabular - checkbox
/**
 *
 *
 * @param {*} tabularName
 * @param {*} e
 */
export const renderHeaderCheckbox = (tabularName, e) => {
  $(e.nTHead)
    .find("tr th:first")
    .css("width", "0");

  const checkAll = `
    <div class="checkbox checkbox-primary -checkbox-circle">
      <input type="checkbox" class="styled" style="pointer-events: all;" id="${tabularName}-checkAll" />
      <label style="margin: 0; padding: 0; width: 0;"></label>
    </div>`;

  if ($(e.nTHead).find("tr th:first input").length == 0) {
    $(e.nTHead)
      .find("tr th:first")
      .append(checkAll);
  }

  $(`#${tabularName}-checkAll`).click(function(e) {
    $(`.${tabularName}-checkbox`).prop("checked", e.target.checked);

    let ids = [];
    if (e.target.checked) {
      ids = TabularTables[tabularName].collection
        .find({}, { _id: 1 })
        .map(function(doc) {
          return doc._id;
        });
    }

    console.log("ids", ids);
    Session.setPersistent(tabularName + ".checked", ids);
  });
};

/**
 *
 *
 * @param {*} tabularName
 * @param {*} val
 * @param {*} type
 * @param {*} doc
 * @returns
 */
export const renderBodyCheckbox = (tabularName, val, type, doc) => {
  setTimeout(function() {
    $("#check_" + doc._id).click(function(e) {
      let ids = Session.get(tabularName + ".checked") || [];
      if (!e.target.checked) {
        $(`#${tabularName}-checkAll`).prop("checked", false);
        ids = ids.filter(id => id != doc._id);
      } else {
        ids = ids.filter(id => id != doc._id);
        ids.push(doc._id);
      }
      console.log("ids", ids);
      Session.setPersistent(tabularName + ".checked", ids);
    });
  }, 100);

  let checked = "";
  const ids = Session.get(tabularName + ".checked") || [];
  if (ids.includes(doc._id)) {
    checked = "checked";
  }

  return `
    <div class="checkbox checkbox-primary -checkbox-circle">
      <input type="checkbox" ${checked} class="styled ${tabularName}-checkbox" style="pointer-events: all;" id="check_${
    doc._id
  }" />
      <label style="margin: 0; padding: 0; width: 0;"></label>
    </div>`;
};

/// Sys - Tabular - checkbox --
