define([
  'jquery','underscore','backbone',  
  'views/TacticsFramesView',//subviews
  'text!templates/tacticsTemplate.html'
], function($, _, Backbone, TacticsFramesView, template){

  var TacticsView = Backbone.View.extend({
    initialize : function(){
      this.player_config = {
          player_id:'GWCQFTgl5js',
          player_el:'tactics-player-1'
        };
      this.hasFramesView = true;
      this.playing = false;      
      this.render();
      
      $(window).scroll(_.debounce(_.bind(this.scrolled, this),100));  
      
    },       
    events: function(){       
    },    
    render: function(){         
      this.$el.html(_.template(template)({}));
            
      this.framesView = new TacticsFramesView({
        el:this.$('.frames-view'),
        enable_scrolling:true,
        scroll_distance:200
      });            
      
      return this;
    },
      
    initPlayers:function(){
      console.log('initPlayers tactics');
      this.player = new YT.Player(this.player_config.player_el, {
        height: '1280',
        width: '720',
        frameborder:0,
        videoId: this.player_config.player_id,
        events: {
          'onReady': _.bind(this.onPlayerReady,this),
          'onPlaybackQualityChange': _.bind(this.onPlayerPlaybackQualityChange,this),
          'onStateChange': _.bind(this.onPlayerStateChange,this),
          'onError': _.bind(this.onPlayerError,this)
        },
        playerVars: {
          controls: 1,
          modestbranding: 1,
          autohide: 1,
          enablejsapi: 1,
          showinfo: 0,
          rel: 0,
          autoplay: 0
        }
      });
    },

    onPlayerReady: function(e) {
      
    },
    onPlayerPlaybackQualityChange: function(e) {

    },
    onPlayerError: function(e) {

    },            
    onPlayerStateChange: function(e) {
      if (e.data === YT.PlayerState.PLAYING){
        this.playing = true;          
      } else if (e.data === YT.PlayerState.ENDED || e.data === YT.PlayerState.PAUSED) {
          this.playing = false;
      }    
    },
    
    scrolled : function(){
        
      // scroll position relative to scroll
      var scrollTopRelative = $(document).scrollTop() - this.$el.offset().top;
      var play_tolerance = 400;
      // if above or below
      if (scrollTopRelative < -play_tolerance || scrollTopRelative > this.$el.outerHeight()) {
        if (this.playing) {
          this.player.pauseVideo();          
        }
      } else {
        if ((!this.playing) && typeof this.player !== 'undefined' && typeof YT !== 'undefined') {
          //this.player.playVideo();          
        }
      }     
    },
    goToFrame : function(frameIndex, duration, callback){
      this.framesView.goToFrame(frameIndex, duration, callback);
    }

  });

  return TacticsView;
  
});