define([
  'jquery','underscore','backbone',    
  'text!templates/prepVideoTemplate.html'
], function($, _, Backbone, template){

  var PrepVideoView = Backbone.View.extend({
    initialize : function(){
      this.players = [
        {
          player_id:'GWCQFTgl5js',
          player_el:'prep-player-1'
        },       
        {
          player_id:'GWCQFTgl5js',
          player_el:'prep-player-2'
        },       
        {
          player_id:'GWCQFTgl5js',
          player_el:'prep-player-3'
        },       
        {
          player_id:'GWCQFTgl5js',
          player_el:'prep-player-4'
        },       
      ];
      this.render();
      
      this.playing = false;
      
      $(window).scroll(_.debounce(_.bind(this.scrolled, this),100));  
      
    },       
    events : function(){
    },    
    render: function(){         
      this.$el.html(_.template(template)({}));      
      
      this.setupPlayers();
      
      return this;
    },
    setupPlayers: function() {      
      var that = this;
      if (typeof YT !== 'undefined') {
        this.initPlayers();
      } else {
        window.onYouTubeIframeAPIReady = function() {
          that.initPlayers();
        };
      }        
    },
    initPlayers:function(){
      
      var that = this;      
      _.each(this.players, function(player){
        player.player = new YT.Player(player.player_el, {
          height: '100%',
          width: '100%',
          frameborder:0,
          videoId: player.player_id,
          events: {
            'onReady': that.onPlayerReady,
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



    onPlayerReady: function(e) {
    },

    onPlayerPlaybackQualityChange: function(e) {

    },

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
    onPlayerError: function(e) {

    },
    
    stopVideo: function() {
    
    },
    scrolled : function(){
        
      // scroll position relative to scroll
      var scrollTopRelative = $(document).scrollTop() - this.$el.offset().top;

      // if above or below
      if (scrollTopRelative < 0 || scrollTopRelative > this.$el.outerHeight()) {
        if (this.playing) {
          this.playing.player.pauseVideo();          
          this.playing = '';
        }
      }      
    }        

  });

  return PrepVideoView;
  
});
