define([
  'jquery',
  'underscore',
  'backbone',
  'views/AppView'
], function($, _, Backbone, AppView) {
  
  var app = {};
  
  var AppRouter = Backbone.Router.extend({
    routes: {      
      // Default
      '' : 'default',             
      '/' : 'default',
    }
  });
  
  
  var initialize = function(){
    app.Router = new AppRouter;
    
    // start app
    app.AppView = app.AppView || new AppView({router:app.Router});
    
    app.Router.on('route:redirect', function () {
      app.Router.navigate('',{trigger:true, replace: true});
    });
    app.Router.on('route:default', function () {
      app.AppView.routeDefault();
    });   
            
    
    
    Backbone.history.start();        
    
  };

  
  return { 
    initialize: initialize
  };
});
