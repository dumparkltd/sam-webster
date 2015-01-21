define([
  'jquery','underscore','backbone',  
  'text!templates/prepTrainingTemplate.html'
], function($, _, Backbone, template){

  var PrepTrainingView = Backbone.View.extend({
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

  return PrepTrainingView;
  
});