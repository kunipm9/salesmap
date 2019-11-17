import { Meteor } from 'meteor/meteor';

import '@imports/api/lib/Images_Collection';
import '@imports/api/lib/Excels_Collection';
import '@imports/api/Users/Groups_Collection';
import '@imports/api/Users/Users_Collection';
import '@imports/api/Books/Languages_Collection';
import '@imports/api/Books/Categorys_Collection';
import '@imports/api/Books/Books_Collection';
import '@imports/api/Maps/Consumers_Collection';
import '@imports/api/Maps/Pins_Collection';
import '@imports/api/Maps/PinCategorys_Collection';
import '@imports/api/Maps/Companys_Collection';
import '@imports/api/Maps/Associations_Collection';
import '@imports/api/Maps/Ranks_Collection';
import '@imports/api/Maps/Offices_Collection';
import '@imports/api/Maps/Bookmarks_Collection';
import '@imports/api/Maps/Tags_Collection';
import '@imports/api/Maps/ZnetLicences_Collection';

import '@imports/api/Users/Groups_Tabular';
import '@imports/api/Users/Admins_Tabular';
import '@imports/api/Users/Users_Tabular';

Meteor.startup(() => {
});
