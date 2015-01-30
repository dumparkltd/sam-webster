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
      "": "start",
      "*splat": "catchAll"
    }
  });
  
  
  var initialize = function(){
    app.Router = new AppRouter;
    
    // start app
    app.AppModel = app.AppModel || new AppModel({router:app.Router,chapter:''});
    app.AppView = app.AppView || new AppView({
      el: $("#application"),
      model:app.AppModel    
    });
    app.Router.on('route:start', function () {
      console.log('redirect');
      app.AppModel.set('chapter-id','start');       
      app.AppModel.set('routeUpdated',new Date().getTime());      
    });    
    app.Router.on('route:catchAll', function (route) {   
      console.log('catchAll');
      var route = route.split('/')
      app.AppModel.set('chapter-id',route[0]);  
      if (route.length>1){
        app.AppModel.set('frame-id',route[1]);
      } else {
        app.AppModel.set('frame-id','');
      }
      app.AppModel.set('routeUpdated',new Date().getTime());
    }); 

    Backbone.history.start();        
    
  };

  
  return { 
    initialize: initialize
  };
});
