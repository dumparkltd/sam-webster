define([
  'jquery','underscore','backbone', 
  'views/VideoView',  
  'text!templates/prepVideoTemplate.html'
], function($, _, Backbone, VideoView, template){

  var PrepVideoView = VideoView.extend({
    initialize : function(){
      this.players = [
        {
          player_id:'zmsq8YVr0hI',
          player_el:'prep-player-1'
        },       
        {
          player_id:'yobJ6-hecCk',
          player_el:'prep-player-2'
        },       
        {
          player_id:'f9sKY_rwHFI',
          player_el:'prep-player-3'
        },       
        {
          player_id:'wShIQOMSzcM',
          player_el:'prep-player-4'
        },       
      ];
      this.render();
      
    },       
    events : function(){
       return _.extend({},VideoView.prototype.events,{
//           'click' : 'onclickChild'
       });      
    },    
    render: function(){         
      this.$el.html(template);            
      return this;
    },

    scrolled : function(){
        
      // scroll position relative to scroll
      var scrollTopRelative = $(document).scrollTop() - this.$el.offset().top;
      var play_tolerance = 400;

      // if above or below
      if (scrollTopRelative < 0 -play_tolerance || scrollTopRelative > this.$el.outerHeight() + play_tolerance) {
        if (this.playing) {
          this.playing.player.pauseVideo();          
          this.playing = '';
        }
      }      
    }        

  });

  return PrepVideoView;
  
});
