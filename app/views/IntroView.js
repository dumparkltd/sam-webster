define([
  'jquery','underscore','backbone',  
  'text!templates/introTemplate.html'
], function($, _, Backbone, template){

  var IntroView = Backbone.View.extend({
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