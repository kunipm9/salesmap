import { Maps_Tags_Collection } from "@imports/api/Maps/Tags_Collection";

export function getTagName(tmp, cat1Id, cat2Id, itemId) {
  const tagList = Maps_Tags_Collection.find({ _deleted: null }).map(c => c);

  let cat1Text = "";
  if (cat1Id) {
    if (!tagList.filter(c1 => c1._id == cat1Id).length) {
      return ["", ""];
    }
    cat1Text = tagList.filter(c1 => c1._id == cat1Id)[0].title;
  }

  let cat2Text = "";
  if (cat1Id) {
    if (!tagList.filter(c1 => c1._id == cat1Id).length) {
      return ["", ""];
    }
    if (!tagList.filter(c1 => c1._id == cat1Id)[0].cat2) {
      return ["", ""];
    }
    if (
      !tagList
        .filter(c1 => c1._id == cat1Id)[0]
        .cat2.filter(c2 => c2.id == cat2Id).length
    ) {
      return ["", ""];
    }
    cat2Text = tagList
      .filter(c1 => c1._id == cat1Id)[0]
      .cat2.filter(c2 => c2.id == cat2Id)[0].title;
  }

  let itemText = "";
  if (itemId) {
    if (!tagList.filter(c1 => c1._id == cat1Id).length) {
      return ["", ""];
    }
    if (!tagList.filter(c1 => c1._id == cat1Id)[0].cat2) {
      return ["", ""];
    }
    if (
      !tagList
        .filter(c1 => c1._id == cat1Id)[0]
        .cat2.filter(c2 => c2.id == cat2Id).length
    ) {
      return ["", ""];
    }
    if (
      !tagList
        .filter(c1 => c1._id == cat1Id)[0]
        .cat2.filter(c2 => c2.id == cat2Id)[0].items
    ) {
      return ["", ""];
    }
    if (
      !tagList
        .filter(c1 => c1._id == cat1Id)[0]
        .cat2.filter(c2 => c2.id == cat2Id)[0]
        .items.filter(c3 => c3.id == itemId).length
    ) {
      return ["", ""];
    }
    itemText = tagList
      .filter(c1 => c1._id == cat1Id)[0]
      .cat2.filter(c2 => c2.id == cat2Id)[0]
      .items.filter(c3 => c3.id == itemId)[0].title;
  }

  let ret1 = "";
  let ret2 = "";

  if (cat1Text) {
    ret1 = cat1Text + " > ";
    ret2 = "";
  }
  if (cat1Text && cat2Text) {
    ret1 = cat1Text + " > ";
    ret2 = cat2Text;
  }
  if (cat1Text && cat2Text && itemText) {
    ret1 = cat1Text + " > " + cat2Text + " > ";
    ret2 = itemText;
  }
  return [ret1, ret2];
}
