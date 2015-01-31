define([
  'jquery','underscore','backbone',  
  'views/PrepNutritionFramesView','views/PrepVideoView',//subviews
  'text!templates/prepTemplate.html'
], function($, _, Backbone, PrepNutritionFramesView, PrepVideoView, template){

  var PrepView = Backbone.View.extend({
    initialize : function(){
      this.render();                  
      this.hasFramesView = true;
    },       
    events : function(){
    },    
    render: function(){         
      this.$el.html(template);
      
      this.videoView = new PrepVideoView({
        el:this.$('.video-view')
      });  
      this.framesView = new PrepNutritionFramesView({
        el:this.$('.frames-view'),
        enable_scrolling:true,
        scroll_distance:300
      });  
            
      return this;
    },
    goToFrame : function(frameIndex, duration, callback){
      this.framesView.goToFrame(frameIndex, duration, callback);
    },
    initPlayers : function(){
      this.videoView.initPlayers();
    }
  });

  return PrepView;
  
});
