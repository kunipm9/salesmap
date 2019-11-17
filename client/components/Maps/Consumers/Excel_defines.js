export const fieldDefList = [
  {
    fieldName: "d",
    title: "削除",
    required: true,
    fsel: {
      postcard: true
    },
    validator: (fieldDef, lineNo, val, errorList) => {
      if (!val || val === "削除") {
        return false;
      } else {
        errorList.push({
          lineNo: lineNo,
          column: fieldDef.title,
          errorCode: 2001,
          errorStr: "値が不正"
        });
        return true;
      }
    }
  },
  {
    fieldName: "u",
    title: "変更",
    required: true,
    fsel: {
      postcard: true
    },
    validator: (fieldDef, lineNo, val, errorList) => {
      if (!val || val === "変更") {
        return false;
      } else {
        errorList.push({
          lineNo: lineNo,
          column: fieldDef.title,
          errorCode: 2001,
          errorStr: "値が不正"
        });
        return true;
      }
    }
  },
  {
    fieldName: "identity.name",
    title: "氏名",
    required: true,
    fsel: {
      postcard: true
    },
    validator: (fieldDef, lineNo, val, errorList) => {
      if (val) {
        return false;
      } else {
        errorList.push({
          lineNo: lineNo,
          column: fieldDef.title,
          errorCode: 2002,
          errorStr: "必須項目"
        });
        return true;
      }
    }
  },
  {
    fieldName: "residenceAddress.addressUnrefined.postalCode",
    title: "郵便番号",
    required: true,
    fsel: {
      postcard: true
    },
    validator: (fieldDef, lineNo, val, errorList) => {
      if (!val) {
        errorList.push({
          lineNo: lineNo,
          column: fieldDef.title,
          errorCode: 2002,
          errorStr: "必須項目"
        });
        return true;
      }
      return false;
    }
  },
  {
    fieldName: "residenceAddress.addressUnrefined.address1",
    title: "住所1",
    required: true,
    fsel: {
      postcard: true
    },
    validator: (fieldDef, lineNo, val, errorList) => {
      if (!val) {
        errorList.push({
          lineNo: lineNo,
          column: fieldDef.title,
          errorCode: 2002,
          errorStr: "必須項目"
        });
        return true;
      }
      return false;
    }
  },
  {
    fieldName: "residenceAddress.addressUnrefined.address2",
    title: "住所2",
    required: true,
    fsel: {
      postcard: true
    },
    validator: () => {
      return true;
    }
  },
  {
    fieldName: "tags",
    title: "タグ",
    required: false,
    fsel: {
      postcard: true
    },
    validator: () => {
      return true;
    }
  }
];

export const excelTitleList = {
  postcard: "PostCard"
};
