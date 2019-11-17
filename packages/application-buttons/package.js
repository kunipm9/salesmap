Package.describe({
  name: 'application-buttons',
  version: '0.0.1',
  // Brief, one-line summary of the package.
  summary: '',
  // URL to the Git repository containing the source code for this package.
  git: '',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('0.9.0');
  api.use('ecmascript@0.12.1');
  api.use(['underscore@1.0.10', 'templating@1.3.2', 'aldeed:template-extension@4.0.0'], 'client');
  api.addFiles([
    'templates.html',
  ], 'client');
});

