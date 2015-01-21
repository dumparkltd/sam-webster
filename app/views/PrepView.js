define([
  'jquery','underscore','backbone',  
  'text!templates/prepTemplate.html'
], function($, _, Backbone, template){

  var PrepView = Backbone.View.extend({
    initialize : function(){
      this.render();
    },       
    events : {
    },    
    render: function(){         
      this.$el.html(_.template(template)({}));
      return this;
    },

  });

  return PrepView;
  
});