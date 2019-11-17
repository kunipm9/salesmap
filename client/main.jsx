
// eslint-disable-next-line no-undef
if (process.env.NODE_ENV !== "development") {
//  console.log = () => {};
}


import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';
import { render } from 'react-dom';
import Router from './components/Router'
import { DataKeeper } from './components/DataKeeper'


require('@imports/ui/lang/simple-schema');


import '@fortawesome/fontawesome-free/css/all.min.css';
import 'bootstrap-css-only/css/bootstrap.min.css';
require('jquery-ui-sortable-npm');

import "mdbreact/dist/css/mdb.css";
import "awesome-bootstrap-checkbox/awesome-bootstrap-checkbox.css";

import "./css/mdb-datatable.css";
import "./css/mdb-datatable-custom.css";
import "./css/mdb-custom.css";
import 'react-tabulator/lib/styles.css';
import '@imports/ui/tabular/tabulator.css';
import "./css/uniforms-custom.css";
import "./css/navbar.css";
import "./css/sidebar.css";
import "./css/popover.css";
import "./css/main.css";
import 'react-image-lightbox/style.css';

import 'semantic-ui-css/semantic.min.css';

import "./css/mui-custom.css";

import 'leaflet/dist/leaflet.css';

import "./css/smsk-front/misc.css";
import "./css/smsk-front/index.css";
import "./css/smsk-front/index_upd_c.css";

import "./css/collapseible.css";

import '@imports/api/lib/Images_Collection';
import '@imports/api/lib/Excels_Collection';

import { Persister } from '@imports/api/lib/persist-method';
import { localCollection_StartUp } from '@imports/api/lib/localCollection';

import { Maps_ConsumersSum_Collection } from "@imports/api/Maps/ConsumersSum_Collection";
import { Maps_PinsSum_Collection } from "@imports/api/Maps/PinsSum_Collection";

import __SVG__ from "@imports/ui/utils/svgListWeb";


if (!window.$GLOBAL$) {
  window.$GLOBAL$ = {};
}
window.$GLOBAL$.fields = {};
window.$GLOBAL$.formRef = {};
window.$GLOBAL$.changingFormName = null;
window.$GLOBAL$.changingFormMode = 'update';
window.$GLOBAL$.transitionDuration = 150;
window.$GLOBAL$.submitForm = false;
window.$GLOBAL$.Collection = {};
window.$GLOBAL$.LocalStorage = {};
window.$GLOBAL$.Modals = {};


Meteor.startup(() => {
  TAPi18n.setLanguage('ja');

  localCollection_StartUp("Maps_Consumers", Maps_ConsumersSum_Collection);
  localCollection_StartUp("Maps_Pins", Maps_PinsSum_Collection);

  render(<Router />, document.getElementById('react-target'));
  render(<DataKeeper />, document.getElementById('react-datakeeper'));
console.log("screen.width", screen.width);
console.log("document.documentElement.clientWidth", document.documentElement.clientWidth);
console.log("window.innerWidth", window.innerWidth);

  document.body.addEventListener("touchmove", (evt) => {
    evt.preventDefault();
  }, true);
});

Accounts.onLogin(() => {
  Session.setPersistent('loggedIn', true)
});

Accounts.onLogout(() => {
  Session.setPersistent('loggedIn', false)
});

Persister.on('method', (name, args, options) => {
  console.log("method", name, args, options);
})

Persister.on('methodFinished', (method, err, res) => {
  console.log("methodFinished", method, err, res);
})

