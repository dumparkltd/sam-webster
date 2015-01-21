define([
  'jquery','underscore','backbone',  
  'text!templates/prepPsycheTemplate.html'
], function($, _, Backbone, template){

  var PrepPsycheView = Backbone.View.extend({
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

  return PrepPsycheView;
  
});