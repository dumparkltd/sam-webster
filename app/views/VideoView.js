define([
  'jquery','underscore','backbone'
], function($, _, Backbone){

  var VideoView = Backbone.View.extend({
    constructor : function(options){
      // extend options
      this.default_options = {
        play_tolerance : 400, // distance before auto playing video
        auto_play : false,
        player : {
          height: '100%',
          width: '100%'
        }
      };
      this.options = $.extend(true, this.default_options, options);     
      
      // player config array - to be populated in inheriting view
      this.players = [];
      
      this.playing = false;
      this.auto_played = false; // only allow autoplay once
                       
      $(window).scroll(_.debounce(_.bind(this.scrolled, this),100));  
      
      // Call the original constructor
      Backbone.View.apply(this, arguments);               
      
    },           
    initPlayers:function(){
      var that = this;            
      _.each(this.players, function(player){
                
        var player_options = $.extend(true, this.default_options, player);
        player.player = window['player'] = new YT.Player(player_options.player_el, {
          height: player_options.height,
          width: player_options.width,
          frameborder:0,
          videoId: player_options.player_id,
          events: {
            'onReady': _.bind(that.onPlayerReady,that),
            'onPlaybackQualityChange': _.bind(that.onPlayerPlaybackQualityChange,that),
            'onStateChange': _.bind(that.onPlayerStateChange,that),
            'onError': _.bind(that.onPlayerError,that)
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
      });
    },



    onPlayerReady: function(e) {},

    onPlayerPlaybackQualityChange: function(e) {},

    onPlayerStateChange: function(e) {
      if (e.data === YT.PlayerState.PLAYING){
        if (this.playing) {
          this.playing.player.pauseVideo();
        }
        this.playing = this.getPlayer(e.target.d.id);       
        
      } else if (e.data === YT.PlayerState.ENDED || e.data === YT.PlayerState.PAUSED) {
        if (this.getPlayer(e.target.d.id) === this.playing){
          this.playing = false;          
        };
      }
    },
    getPlayer : function(id){
      var player = false;
      _.each(this.players, function(p){        
        if (p.player_el === id) {
          player = p;
        }
      });
      return player;
    },
    onPlayerError: function(e) {},
    
    scrolled : function(){
      // scroll position relative to scroll
      var scrollTopRelative = $(document).scrollTop() - this.$el.offset().top;      

      // if above or below playtolerance
      if (scrollTopRelative < -1*this.options.play_tolerance 
        || scrollTopRelative > this.$el.outerHeight() - $(window).height()) 
      {
        if (this.playing) {
          this.playing.player.pauseVideo();          
          this.playing = '';
        }
      } else {
        if (this.options.auto_play && !this.auto_played && typeof this.players[0].player !== 'undefined'){
          this.auto_played = true;
          this.players[0].player.playVideo();          
        }            
      }
    }
  });

  return VideoView;
  
});
