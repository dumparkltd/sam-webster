// Require.js allows us to configure shortcut alias
require.config({
  paths: {
    'jquery': 'libs/jquery',
    'underscore': 'libs/underscore',
    'backbone': 'libs/backbone',
    'skrollr': 'libs/skrollr.min',    
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
  analytics.track('UA-59355441-1');
  App.initialize();
});
