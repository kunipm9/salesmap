import { Meteor } from "meteor/meteor";
import { Session } from "meteor/session";
import { Tracker } from "meteor/tracker";
import localforage from "localforage";

/**
 *
 *
 * @class seedy
 */
class seedy {
  constructor(seed) {
    this.se = seed;
    this.ot = 128;
    this.pt = 63369;
    this.gt = 53687;
    this.ot = this.ot * 13000 + 525;
    this.pt = this.pt * 16000 + 223;
    this.gt = this.gt * 40000 + 3647;
  }
  /**
   *
   *
   * @returns
   * @memberof seedy
   */
  next() {
    this.se = (this.se * this.ot + this.pt) & this.gt;
    return this.se;
  }
}

/**
 *
 *
 * @param {*} buf
 * @returns
 */
function ab2str(buf) {
  const bufView = new Uint16Array(buf);
  const strLen = bufView.length;
  const iseedy = new seedy(strLen + 321);
  for (let i = 0; i < strLen; i++) {
    bufView[i] = bufView[i] ^ (iseedy.next() & 65535);
  }
  return String.fromCharCode.apply(null, bufView);
}

/**
 *
 *
 * @param {*} str
 * @returns
 */
function str2ab(str) {
  const buf = new ArrayBuffer(str.length * 2);
  const bufView = new Uint16Array(buf);
  const strLen = bufView.length;
  const iseedy = new seedy(strLen + 321);
  for (let i = 0; i < strLen; i++) {
    bufView[i] = str.charCodeAt(i) ^ (iseedy.next() & 65535);
  }
  return buf;
}

/**
 *
 *
 */
function localCollection_Worker() {
  let localStorage_db = null;
  let fOnUpgradeNeeded = false;
  /**
   *
   *
   * @param {*} collectionName
   */
  const localStorage_init = function(collectionName) {
    const req = indexedDB.open(collectionName);
    // eslint-disable-next-line no-unused-vars
    req.onupgradeneeded = function(ev) {
      // upgrade時はlocalStorageのreadを行わない
      fOnUpgradeNeeded = true;
      self.postMessage([]);
    };
    req.onsuccess = function(ev) {
      if (fOnUpgradeNeeded) {
        return;
      }
      localStorage_db = ev.target ? ev.target.result : ev.result;
      localStorage_getAll();
    };
    // eslint-disable-next-line no-unused-vars
    req.onerror = function(error) {
      console.log("xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx", error);
    };
  };

  /**
   *
   *
   */
  const localStorage_getAll = function() {
    const db = localStorage_db;
    const tx = db.transaction(["keyvaluepairs"], "readwrite");
    const store = tx.objectStore("keyvaluepairs");
    const range = IDBKeyRange.lowerBound(0);
    const cursorRequest = store.openCursor(range);
    let dataList = [];

    cursorRequest.onsuccess = function(e) {
      const result = e.target.result;

      if (!!result == false) {
        self.postMessage(dataList);
        dataList = [];
        setTimeout(function() {
          // [] はデータ取得の終了をあらわす
          self.postMessage([]);
        }, 100);
        return;
      }

      dataList.push(result.value);
      // 10000件単位でmain threadへデータを送信
      if (dataList.length >= 10000) {
        self.postMessage(dataList);
        dataList = [];
      }

      result.continue();
    };
    cursorRequest.onerror = function(err) {
      console.log("XXX3 -----------------------------", err);
    };
  };

  self.addEventListener("message", function(e) {
    localStorage_init(e.data);
  });
}

/**
 *
 *
 * @export
 * @param {*} collectionName
 * @returns
 */
export function localCollection_StartUp(collectionName, sumCollection) {
  console.log(new Date().getTime(), "localCollection_StartUp");

  const self = {};
  window.$GLOBAL$.LocalStorage[collectionName] = self;

  if (!window.$GLOBAL$.Collection[collectionName]) {
    window.$GLOBAL$.Collection[collectionName] = {};
  }

  self.localCollection_tracker1 = null;
  self.localCollection_tracker2 = null;
  self.localCollection_tracker3 = null;
  self.localCollection_tracker5 = null;
  self.localCollection_tracker6 = null;
  self.localCollection_busy = false;
  self.localCollection_MeteorStatus = null;
  self.localCollection_redrawProc = null;
  self.localCollection_collectionName = collectionName;

  self.localCollection__lastModifiedAt =
    Session.get(
      self.localCollection_collectionName + "_Collection__lastModifiedAt"
    ) || -1;

  let localStorage_db = null;

  const req = indexedDB.open(collectionName);

  // eslint-disable-next-line no-unused-vars
  req.onupgradeneeded = function(ev) {
    // upgrade時はlocalStorageのreadを行わない
    self.localCollection__lastModifiedAt = -1;
    localCollection_StartUpNext(self, collectionName, sumCollection);
  };

  req.onsuccess = function(ev) {
    localStorage_db = ev.target ? ev.target.result : ev.result;
    try {
      localStorage_db.transaction(["keyvaluepairs"], "readwrite");
      localCollection_StartUpNext(self, collectionName, sumCollection);
    } catch (err) {
      console.log("xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx", err.message);
      self.localCollection__lastModifiedAt = -1;
      localCollection_StartUpNext(self, collectionName, sumCollection);
    }
  };

  // eslint-disable-next-line no-unused-vars
  req.onerror = function(error) {
    console.log("xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx", error);
    self.localCollection__lastModifiedAt = -1;
    localCollection_StartUpNext(self, collectionName, sumCollection);
  };
}

/**
 *
 *
 * @export
 * @param {*} collectionName
 * @returns
 */
function localCollection_StartUpNext(self, collectionName, sumCollection) {
  console.log(new Date().getTime(), "localCollection_StartUp");

  if (self.localCollection__lastModifiedAt == -1) {
    console.log(
      "IndexedDB DROP -------------------------",
      self.localCollection_collectionName
    );

    localforage
      .dropInstance({
        name: self.localCollection_collectionName
      })
      .then(() => {
        console.log(
          "IndexedDB CREATE -------------------------",
          self.localCollection_collectionName
        );

        self.localCollection_storage = localforage.createInstance({
          name: self.localCollection_collectionName
        });
      })
      .catch(error => {
        console.log(
          "IndexedDB DROP catch --------------------------------",
          error
        );
      });
  } else {
    self.localCollection_storage = localforage.createInstance({
      name: self.localCollection_collectionName
    });
  }

  self.localCollection_sumCollection = sumCollection;

  self.lastRedrawProc = 0;

  //  // localStorageにデータが存在するか
  //  if (!(Session.get(collectionName + "_Collection__lastModifiedAt") || null)) {
  //    console.log(new Date().getTime(), "localCollection_StartUp return !!!");
  //
  //    return;
  //  }

  // localCollection_ => XX Component trigger reset
  Session.set(collectionName + "_read", 0);
  Session.set(collectionName + "_readCompleted", 0);
  Session.set(collectionName + "_redrawProcPartOf", 0);
  Session.set(collectionName + "_redrawProc", 0);

  // web worker 起動
  const tos = Function.prototype.toString;
  let script = tos.call(localCollection_Worker);
  const scriptHeaderP = script.indexOf(")");
  script = script.substring(scriptHeaderP + 1);
  const blob = new Blob([script]);
  const url = URL.createObjectURL(blob);

  // web worker 側処理起動
  const myWorker = new Worker(url);
  myWorker.postMessage(collectionName);

  // web worker からの message受信
  myWorker.addEventListener("message", e => {
    console.log(
      new Date().getTime(),
      "localCollection_StartUp message receive =======================",
      e.data.length
    );

    if (!e.data.length) {
      // localStorage read終了
      Session.set(collectionName + "_readCompleted", new Date().getTime());

      console.log(
        new Date().getTime(),
        "localCollection_StartUp message " +
          collectionName +
          "_readCompleted set",
        new Date().getTime()
      );

      myWorker.terminate();
    } else {
      // memory データ更新
      for (let i in e.data) {
        let doc = JSON.parse(ab2str(e.data[i]));

        if (!(doc._id in window.$GLOBAL$.Collection[collectionName])) {
          window.$GLOBAL$.Collection[collectionName][doc._id] = doc;
        }
      }

      // localStorage read通知
      Session.set(
        collectionName + "_read =====================",
        new Date().getTime()
      );

      console.log(
        new Date().getTime(),
        "localCollection_StartUp message " + collectionName + "_read set",
        new Date().getTime()
      );
    }
  });

  setTimeout(function() {
    self.localCollection_tracker1 = Tracker.autorun(() => {
      if (
        Meteor.status().status == "connected" &&
        self.localCollection_MeteorStatus != "connected"
      ) {
        // network回復
        console.log("localCollection_ComponentDidMount getDeltaFromServer");

        getDeltaFromServer(self);
      }
      self.localCollection_MeteorStatus = Meteor.status().status;
    });

    self.localCollection_tracker3 = Tracker.autorun(() => {
      console.log(
        "Session.get(" +
          self.localCollection_collectionName +
          "_readCompleted)",
        Session.get(self.localCollection_collectionName + "_readCompleted")
      );

      if (
        Session.get(self.localCollection_collectionName + "_readCompleted") > 0
      ) {
        console.log(
          new Date().getTime(),
          self.localCollection_collectionName +
            "_readCompleted get _redrawProc ====================="
        );

        // localStorage read終了
        Session.set(collectionName + "_redrawProc", new Date().getTime());

        if (self.localCollection_tracker2) {
          console.log(
            new Date().getTime(),
            "self.localCollection_tracker2.stop"
          );

          self.localCollection_tracker2.stop();
        }
        if (self.localCollection_tracker3) {
          console.log(
            new Date().getTime(),
            "self.localCollection_tracker3.stop"
          );

          self.localCollection_tracker3.stop();
        }

        // 前のgetDeltaFromServer処理中に新たな差分が生じていないかチェック
        getDeltaFromServer(self);
      }
    });

    // 対象CollctionのSummaryCollectionでCollectionの変化をチェック
    self.localCollection_sumCollection.find().observe({
      // eslint-disable-next-line no-unused-vars
      add(doc) {
        console.log("localCollection_sumCollection add ----------------------");
        getDeltaFromServer(self);
      },
      // eslint-disable-next-line no-unused-vars
      changed(doc) {
        console.log(
          "localCollection_sumCollection changed ----------------------"
        );
        getDeltaFromServer(self);
      },
      // eslint-disable-next-line no-unused-vars
      removed(doc) {
        console.log(
          "localCollection_sumCollection removed ----------------------"
        );
        getDeltaFromServer(self);
      }
    });
  }, 0);
}

/**
 *
 *
 * @param {*} self
 * @returns
 */
function getDeltaFromServer(self) {
  console.log(new Date().getTime(), "getDeltaFromServer");

  // network チェック
  if (Meteor.status().status !== "connected") {
    console.log(new Date().getTime(), "getDeltaFromServer net connected");

    return;
  }

  // 2重起動防止
  if (self.localCollection_busy) {
    console.log(new Date().getTime(), "getDeltaFromServer busy");

    setTimeout(() => {
      self.localCollection_busy = false;
    }, 30000);

    return;
  }
  self.localCollection_busy = true;
  console.log("TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT");

  //  const timeGoback = 5 * 60 * 1000; // 5分前の分から再取得
  const timeGoback = 0;
  const Users_Groups_id = Session.get("Users_Groups_id");
  let _schemaVersion =
    Session.get(
      self.localCollection_collectionName + "_Collection__schemaVersion"
    ) || "";

  // サーバーから変更差分レコード件数を取得
  Meteor.call(
    self.localCollection_collectionName + ".read_all_count",
    Users_Groups_id,
    _schemaVersion,
    self.localCollection__lastModifiedAt - timeGoback,
    (error, serverRet) => {
      console.log(
        new Date().getTime(),
        self.localCollection_collectionName + ".read_all_count",
        Users_Groups_id,
        _schemaVersion,
        self.localCollection__lastModifiedAt - timeGoback
      );

      console.log(
        new Date().getTime(),
        self.localCollection_collectionName + ".read_all_count" + " serverRet",
        serverRet
      );

      const totalCount = serverRet.collectionCount;
      Session.set(
        self.localCollection_collectionName + "_Collection__totalCount",
        totalCount
      );
      Session.set(
        self.localCollection_collectionName + "_Collection__unsavedCount",
        totalCount
      );

      if (!totalCount) {
        console.log(
          "!!! totalCount ------------------------------------------------"
        );

        self.localCollection_busy = false;

        Session.setPersistent(
          self.localCollection_collectionName + "_Collection__lastModifiedAt",
          serverRet._modifiedAt
        );
        self.localCollection__lastModifiedAt = serverRet._modifiedAt;

        return;
      }

      if (_schemaVersion != serverRet._schemaVersion) {
        self.localCollection__lastModifiedAt = serverRet._modifiedAt;

        localforage
          .dropInstance({
            name: self.localCollection_collectionName
          })
          .then(() => {
            console.log(
              "IndexedDB CREATE -------------------------",
              self.localCollection_collectionName
            );

            self.localCollection_storage = localforage.createInstance({
              name: self.localCollection_collectionName
            });

            Session.setPersistent(
              self.localCollection_collectionName +
                "_Collection__schemaVersion",
              serverRet._schemaVersion
            );
            _schemaVersion = serverRet._schemaVersion;

            getDataFromServer(self);
          })
          .catch(error => {
            console.log(
              "IndexedDB DROP catch --------------------------------",
              error
            );
          });
      } else {
        getDataFromServer(self);
      }
    }
  );
}

function getDataFromServer(self) {
  // bugfix
  //      Session.setPersistent(
  //        self.localCollection_collectionName + "_Collection__lastModifiedAt",
  //        serverRet._modifiedAt
  //      );
  //      self.localCollection__lastModifiedAt = serverRet._modifiedAt;

  const timeGoback = 0;
  const Users_Groups_id = Session.get("Users_Groups_id");
  let _schemaVersion =
    Session.get(
      self.localCollection_collectionName + "_Collection__schemaVersion"
    ) || "";

  // サーバーから変更差分レコードを取得
  Meteor.call(
    self.localCollection_collectionName + ".read_all",
    Users_Groups_id,
    _schemaVersion,
    self.localCollection__lastModifiedAt - timeGoback,
    (error, serverRet) => {
      console.log(
        new Date().getTime(),
        self.localCollection_collectionName + ".read_all",
        Users_Groups_id,
        _schemaVersion,
        self.localCollection__lastModifiedAt - timeGoback
      );

      console.log(
        new Date().getTime(),
        self.localCollection_collectionName + ".read_all" + " serverRet",
        serverRet.collection.length
      );

      const totalCount = serverRet.collection.length;
      let unsavedCount = serverRet.collection.length;

      Session.set(
        self.localCollection_collectionName + "_Collection__totalCount",
        totalCount
      );

      let redrawCount = 0;
      for (let key in serverRet.collection) {
        const doc = serverRet.collection[key];

        if (doc._modifiedAt > self.localCollection__lastModifiedAt) {
          redrawCount++;
        }

        // memory データ更新
        window.$GLOBAL$.Collection[self.localCollection_collectionName][
          doc._id
        ] = doc;

        // localStorage更新
        saveStorage(self, totalCount, unsavedCount, doc, doc._modifiedAt);
        unsavedCount--;
      }

      //          // Component上の redraw callbackを呼び出し
      //          if (redrawCount && self.localCollection_redrawProc) {
      //            self.localCollection_redrawProc();
      //          }

      if (redrawCount) {
        Session.set(
          self.localCollection_collectionName + "_redrawProc",
          new Date().getTime()
        );
      }

      // アクセス頻度を下げる
      setTimeout(() => {
        self.localCollection_busy = false;
        console.log(
          "F 2 FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF"
        );
      }, 10000);
    }
  );
}

/**
 *
 *
 * @param {*} self
 * @param {*} totalCount
 * @param {*} unsavedCount
 * @param {*} doc
 * @param {*} _modifiedAt
 */
function saveStorage(self, totalCount, unsavedCount, doc, _modifiedAt) {
  const _doc = str2ab(JSON.stringify(doc));

  self.localCollection_storage
    .setItem(doc._id, _doc)
    .then(() => {
      if (unsavedCount % 300 == 0 || unsavedCount < 2) {
        if (_modifiedAt > self.localCollection__lastModifiedAt) {
          // サーバー差分取得用最終取得時刻を保存
          Session.setPersistent(
            self.localCollection_collectionName + "_Collection__lastModifiedAt",
            _modifiedAt
          );
          self.localCollection__lastModifiedAt = _modifiedAt;
        }

        // 残り処理件数
        Session.set(
          self.localCollection_collectionName + "_Collection__unsavedCount",
          unsavedCount - 1
        );
      }
    })
    .catch(error => {
      console.log(
        "IndexedDB SETITEM catch --------------------------------",
        error
      );

      Session.setPersistent(
        self.localCollection_collectionName + "_Collection__lastModifiedAt",
        -1
      );
      self.localCollection__lastModifiedAt = -1;
    });
}

/**
 *
 *
 * @export
 * @param {*} self
 */
export function localCollection_ComponentDidMount(self) {
  console.log(new Date().getTime(), "localCollection_ComponentDidMount");

  setTimeout(function() {
    self.localCollection_tracker5 = Tracker.autorun(() => {
      console.log(
        "Session.get(" + self.Collection._name + "_read)",
        Session.get(self.Collection._name + "_read")
      );

      if (Session.get(self.Collection._name + "_read") > 0) {
        console.log(
          new Date().getTime(),
          self.Collection._name + "_read get =====================",
          Session.get(self.Collection._name + "_read")
        );

        if (self.localCollection_redrawProcPartOf) {
          console.log(
            new Date().getTime(),
            "self.localCollection_redrawProcPartOf"
          );

          self.localCollection_redrawProcPartOf();
        }
      }
    });

    self.localCollection_tracker6 = Tracker.autorun(() => {
      console.log(
        "Session.get(" + self.Collection._name + "_redrawProc)",
        Session.get(self.Collection._name + "_redrawProc")
      );
      console.log("self.lastRedrawProc", self.lastRedrawProc);

      if (
        Session.get(self.Collection._name + "_redrawProc") >
        (self.lastRedrawProc || 0)
      ) {
        console.log(
          new Date().getTime(),
          self.Collection._name + "_redrawProc get =====================",
          Session.get(self.Collection._name + "_redrawProc")
        );

        if (self.localCollection_redrawProc) {
          console.log(new Date().getTime(), "self.localCollection_redrawProc");

          self.localCollection_redrawProc();
        }

        self.lastRedrawProc = Session.get(
          self.Collection._name + "_redrawProc"
        );
      }
    });
  }, 0);
}

/**
 *
 *
 * @export
 * @param {*} self
 */
export function localCollection_ComponentWillUnmount(self) {
  console.log(new Date().getTime(), "localCollection_ComponentWillUnmount");

  if (self.localCollection_tracker5) {
    self.localCollection_tracker5.stop();
  }
  if (self.localCollection_tracker6) {
    self.localCollection_tracker6.stop();
  }
}
