//import EventEmitter from 'events'
import EventEmitter from "event-emitter";
import localforage from "localforage";
import { Random } from "meteor/random";
import { Session } from "meteor/session";

import { extendPrototype as extendGetItems } from "localforage-getitems";
extendGetItems(localforage);

//persister object
const Persister = new EventEmitter();

//localforage method store
Persister._methodStore = localforage.createInstance({
  driver: [localforage.INDEXEDDB],
  name: "meteor-persister",
  storeName: "methods"
});

//wrap Meteor method functions
Persister.call = function(name) {
  const args = Array.prototype.slice.call(arguments, 1);

  let callback;
  if (args.length && typeof args[args.length - 1] === "function")
    callback = args.pop();

  return this.apply(name, args, callback);
};

Persister.apply = function(name, args, options, callback) {
  if (!callback && typeof options === "function") {
    callback = options;
    options = {};
  }

  options = options || {};

  //persist method call
  const key = options.id || Random.id();

  const poptions = Object.assign({}, options);
  delete poptions.onResultReceived; //we can't store functions in browser storage obviously
  delete poptions.id;

  const value = [name, args, poptions];

  if (typeof callback !== "function") callback = () => {};

  this._methodStore.setItem(key, value).catch(callback);

  //remove persisted method when run succesfully on the server
  const obsCallback = (err, res) => {
    const method = {
      name,
      args,
      options
    };

    Persister.emit("methodFinished", method, err, res);

    if (err) {
      /// Sys - ApplicationError - store
      const errorList = Session.get("method.call.error") || [];
      errorList.push({ method: method, error: err });
      Session.setPersistent("method.call.error", errorList);
      /// Sys - ApplicationError - store --

      setTimeout(() => {
        this._methodStore.removeItem(key);
      });

      return callback(err, res);
    }

    setTimeout(() => {
      this._methodStore
        .removeItem(key)
        .then(() => callback(err, res))
        .catch(callback);
    });
  };

  //run method
  Persister.emit("method", name, args, options);

  Meteor.apply(name, args, options, obsCallback);
};

//run persisted methods on startup
Meteor.startup(() => {
  Persister._methodStore
    .getItems()
    .then(methods => {
      for (var key in methods) {
        const mthd = methods[key];
        const name = mthd[0];
        const args = mthd[1];
        const options = mthd[2];

        Persister.emit("method", name, args, options);

        Meteor.apply(name, args, options, (err, res) => {
          const method = {
            name,
            args,
            options
          };

          Persister.emit("methodFinished", method, err, res);

          if (err) return false;

          setTimeout(() => {
            Persister._methodStore.removeItem(key);
          });
        });
      }
    })
    .catch(err => {
      throw new Error(err);
    });
});

export { Persister };
