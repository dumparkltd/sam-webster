define([
  'jquery','underscore','backbone',  
  'views/AdviceNutritionFramesView',
  'text!templates/adviceTemplate.html'
], function($, _, Backbone, AdviceNutritionFramesView, template){

  var AdviceView = Backbone.View.extend({
    initialize : function(options){
      this.options = options;
      this.render();                  
      this.hasFramesView = true;
    },       
    events : function(){
    },    
    render: function(){         
      this.$el.html(_.template(template)({}));
      
      this.framesView = new AdviceNutritionFramesView({
        el:this.$('.frames-view'),
        scrolling:'skrollr',
        scroll_distance:200,
        offset_top: this.options.offset_top + this.$('.frames-view').position().top
      });  
            
      return this;
    },
    goToFrame : function(frameIndex, duration, callback){
      this.framesView.goToFrame(frameIndex, duration, callback);
    },
    getHeight : function(){
      return this.$el.outerHeight() - this.framesView.$el.outerHeight() + this.framesView.getHeight();
    }, 
  });

  return AdviceView;
  
});