define([
  'jquery','underscore','backbone',  
  'views/VideoView',//
  'views/TacticsFramesView',//subviews
  'text!templates/tacticsTemplate.html'
], function($, _, Backbone, VideoView, TacticsFramesView, template){

  var TacticsView = VideoView.extend({
    initialize : function(){

      this.players = [
        {
          player_id:'GWCQFTgl5js',
          player_el:'tactics-player-1',
          height: '1280',
          width: '720',          
        }
      ];
      this.hasFramesView = true;
      this.render();
            
    },       
    events: function(){       
       return _.extend({},VideoView.prototype.events,{});       
    },    
    render: function(){         
      this.$el.html(template);
            
      this.framesView = new TacticsFramesView({
        el:this.$('.frames-view'),
        enable_scrolling:true,
        scroll_distance:200
      });            
      
      return this;
    },                  
    goToFrame : function(frameIndex, duration, callback){
      this.framesView.goToFrame(frameIndex, duration, callback);
    }

  });

  return TacticsView;
  
});