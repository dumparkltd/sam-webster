define([
  'jquery','underscore','backbone',  
  'views/ScrollView',
  'text!templates/tacticsTemplate.html'
], function($, _, Backbone, ScrollView, template){

  var TacticsView = ScrollView.extend({
    initialize : function(){
      this.render();
    },       
    events : {
    },    
    render: function(){         
      this.$el.html(_.template(template)({}));
      this.initScroll();
      return this;      
    },

  });

  return TacticsView;
  
});