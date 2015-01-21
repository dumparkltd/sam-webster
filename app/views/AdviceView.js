define([
  'jquery','underscore','backbone',  
  'text!templates/adviceTemplate.html'
], function($, _, Backbone, template){

  var AdviceView = Backbone.View.extend({
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

  return AdviceView;
  
});