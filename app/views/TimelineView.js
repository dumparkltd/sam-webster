define([
  'jquery','underscore','backbone',  
  'views/ScrollView',  
  'text!templates/introTemplate.html'
], function($, _, Backbone, ScrollView, template){

  var IntroView = ScrollView.extend({
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

  return IntroView;
  
});