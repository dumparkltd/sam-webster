define([
  'jquery','underscore','backbone',  
  'views/VideoView',//
  'views/TacticsFramesView',//subviews
  'text!templates/tacticsTemplate.html'
], function($, _, Backbone, VideoView, TacticsFramesView, template){

  var TacticsView = VideoView.extend({
    initialize : function(options){
      this.options = options;

      this.players = [
        {
          player_id:'GWCQFTgl5js',
          player_el:'tactics-player-1',
          height: '720',
          width: '1280'          
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

  return TacticsView;
  
});