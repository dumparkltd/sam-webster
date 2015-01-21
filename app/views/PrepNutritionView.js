define([
  'jquery','underscore','backbone',  
  'text!templates/prepNutritionTemplate.html'
], function($, _, Backbone, template){

  var PrepNutritionView = Backbone.View.extend({
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

  return PrepNutritionView;
  
});