// Require.js allows us to configure shortcut alias
require.config({
  paths: {
    'jquery': 'libs/jquery',
    'jquery.utils': 'libs/jquery-utils',
    'underscore': 'libs/underscore',
    'backbone': 'libs/backbone',
    'd3': 'libs/d3.min',
    'templates': 'templates'
  },
  shim: {  
    'backbone': {deps: ['underscore']}
  },
  urlArgs: "bust=" + (new Date()).getTime()
  
});
require([
  // Load our app module and pass it to our definition function
  'app',
  'analytics',
  'utils'
], function(App,analytics,utils){
  //analytics.track('');
  // The "app" dependency is passed in as "App"
  // Again, the other dependencies passed in are not "AMD" therefore don't pass a parameter to this function
  if (!$('html').hasClass('oldie')) {
    App.initialize();
  }
});
