define([
  'jquery',
  'underscore',
  'backbone',
  'models/AppModel',
  'views/AppView'
], function($, _, Backbone, AppModel, AppView) {
  
  var app = {};
  
  var AppRouter = Backbone.Router.extend({
    routes: {      
      // Default
      "": "redirect",
      "*splat": "catchAll"
    }
  });
  
  
  var initialize = function(){
    app.Router = new AppRouter;
    
    // start app
    app.AppModel = app.AppModel || new AppModel({router:app.Router,route:''});
    app.AppView = app.AppView || new AppView({
      el: $("#application"),
      model:app.AppModel    
    });
    app.Router.on('route:redirect', function () {
      console.log('redirect');
      app.Router.navigate('start/',{trigger:true});
    });    
    app.Router.on('route:catchAll', function (route) {   
      console.log('catchAll');
      app.AppModel.set('route',route);      
    }); 

    Backbone.history.start();        
    
  };

  
  return { 
    initialize: initialize
  };
});
