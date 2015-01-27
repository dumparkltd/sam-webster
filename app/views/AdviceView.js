define([
  'jquery','underscore','backbone',  
  'views/AdviceNutritionFramesView',
  'text!templates/adviceTemplate.html'
], function($, _, Backbone, AdviceNutritionFramesView, template){

  var AdviceView = Backbone.View.extend({
    initialize : function(){
      this.render();                  
      this.hasFramesView = true;
    },       
    events : function(){
    },    
    render: function(){         
      this.$el.html(_.template(template)({}));
      
      this.framesView = new AdviceNutritionFramesView({
        el:this.$('.frames-view'),
        enable_scrolling:true,
        scroll_distance:300
      });  
            
      return this;
    },
    goToFrame : function(frameIndex, duration, callback){
      this.framesView.goToFrame(frameIndex, duration, callback);
    },

  });

  return AdviceView;
  
});