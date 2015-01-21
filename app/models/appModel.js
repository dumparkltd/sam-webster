define([
  'jquery',  'underscore',  'backbone'
], function($,_, Backbone) {
  
  var appModel = Backbone.Model.extend({
    initialize : function(){
      this.subviews = {};
    },
    addSubview : function(id,view){
      this.subviews[id] = view;
    },
  });
  
  return appModel;

});
