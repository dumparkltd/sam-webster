define([
  'jquery','underscore','backbone',  
  'text!templates/introTemplate.html'
], function($, _, Backbone, template){

  var IntroView = Backbone.View.extend({
    initialize : function(){
      this.render();
    }, 
    render: function(){         
      this.$el.html(template);
      return this;
   },
  });

  return IntroView;
  
});