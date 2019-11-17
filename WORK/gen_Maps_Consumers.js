var docs = require("./data_consumers");

var fs = require("fs");
var moji = require("./moji");

function appendFile(path, data) {
  fs.appendFile(path, data, function (err) {
    if (err) {
        throw err;
    }
  });
}

var proj4 = require("./proj4");
proj4.defs([
      ["EPSG:4301", //東京測地系/日本測地系 SRID=4301
        "+proj=longlat +ellps=bessel +towgs84=-146.414,507.337,680.507,0,0,0,0 +no_defs"
      ]
]);

function tokyo2world(posTokyo) {
  var ret = proj4("EPSG:4301", "EPSG:4326", [posTokyo[0] / 3600000, posTokyo[1] / 3600000]);
  return ret;
}

try {
  fs.unlinkSync('mongo_consumers.sql');
} catch(err) {
}
for(var i=0; i<docs.length; i++) {
    var doc = docs[i];

    if (! doc.identity) {
      doc.identity.name = doc._id;
    }

    doc.residenceAddress.address.prefecture = cvPrefecture(doc.residenceAddress.address.prefecture);

    doc.residenceAddress.location.pos.coordinates = tokyo2world(doc.residenceAddress.location.posTokyo.coordinates);

    delete doc.residenceAddress.location.posTokyo;

    doc._modifiedAt = 1550000000000 + i * 60 * 1000;

    setKeyword(doc);

    fs.appendFileSync('mongo_consumers.sql', "db.Maps_Consumers.insert(\n");
    fs.appendFileSync('mongo_consumers.sql', JSON.stringify(doc));
    fs.appendFileSync('mongo_consumers.sql', ");\n");
}

function setKeyword(doc) {
  let keyword = "";

  if (doc.identity) {
    keyword += doc.identity.name;
    keyword += ",";
    keyword += doc.identity.kana;
    keyword += ",";
  }

  if (doc.residenceAddress && doc.residenceAddress.addressUnrefined) {
    keyword +=
      (doc.residenceAddress.addressUnrefined.address1 || "") +
      (doc.residenceAddress.addressUnrefined.address2 || "") +
      (doc.residenceAddress.addressUnrefined.shopName || "")
    keyword += ",";
  }

  if (doc.residenceAddress && doc.residenceAddress.address) {
    keyword +=
      (doc.residenceAddress.address.prefecture || "") +
      (doc.residenceAddress.address.addressTown || "") +
      (doc.residenceAddress.address.addressNumber || "") +
      (doc.residenceAddress.address.addressBuilding || "") +
      (doc.residenceAddress.address.addressRoomNo || "") +
      (doc.residenceAddress.address.shopName || "")
    keyword += ",";
  }

  if (doc.memo) {
    keyword += doc.memo;
  }

  keyword = moji(keyword).convert("HG", "KK").convert("HK", "ZK").convert("ZE", "HE").toString();

  doc.keyword = keyword;
}

function cvPrefecture(pref) {
      prefecture_list = {
        "北海道":"hokkaido",
        "青森県":"aomori",
        "岩手県":"iwate",
        "宮城県":"miyagi",
        "秋田県":"akita",
        "山形県":"yamagata",
        "福島県":"fukushima",
        "茨城県":"ibaraki",
        "栃木県":"tochigi",
        "群馬県":"gunma",
        "埼玉県":"saitama",
        "千葉県":"chiba",
        "東京都":"tokyo",
        "神奈川県":"kanagawa",
        "新潟県":"niigata",
        "富山県":"toyama",
        "石川県":"ishikawa",
        "福井県":"fukui",
        "山梨県":"yamanashi",
        "長野県":"nagano",
        "岐阜県":"gifu",
        "静岡県":"shizuoka",
        "愛知県":"aichi",
        "三重県":"mie",
        "滋賀県":"shiga",
        "京都府":"kyoto",
        "大阪府":"osaka",
        "兵庫県":"hyogo",
        "奈良県":"nara",
        "和歌山県":"wakayama",
        "鳥取県":"tottori",
        "島根県":"shimane",
        "岡山県":"okayama",
        "広島県":"hiroshima",
        "山口県":"yamaguchi",
        "徳島県":"tokushima",
        "香川県":"kagawa",
        "愛媛県":"ehime",
        "高知県":"kochi",
        "福岡県":"fukuoka",
        "佐賀県":"saga",
        "長崎県":"nagasaki",
        "熊本県":"kumamoto",
        "大分県":"oita",
        "宮崎県":"miyazaki",
        "鹿児島県":"kagoshima",
        "沖縄県":"okinawa"
      }
  var result = Object.keys(prefecture_list).filter( (key) => { 
    return prefecture_list[key] === pref
  });
  if (result.length) {
    return result[0];
  } else {
    return pref;
  }
}
