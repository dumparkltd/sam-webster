define([
  'jquery','underscore','backbone',  
  'views/PrepNutritionFramesView',//subviews
  'text!templates/prepTemplate.html'
], function($, _, Backbone, PrepNutritionFramesView, template){

  var PrepView = Backbone.View.extend({
    initialize : function(){
      this.render();
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

      this.hasFramesView = true;

    },       
    events : function(){
    },    
    render: function(){         
      this.$el.html(_.template(template)({}));
      
      this.framesView = new PrepNutritionFramesView({
        el:this.$('.frames-view'),
        enable_scrolling:true,
        scroll_distance:300
      });  
      
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
      console.log('onPlayerReady');
    },

    onPlayerPlaybackQualityChange: function(e) {

    },

    onPlayerStateChange: function(e) {
        console.log('onPlayerStateChange');
        if (e.data === YT.PlayerState.PLAYING){
          _.each(this.players, function(player){
            if(e.target.d.id !== player.player_el) {
              player.player.stopVideo()
            }
          });
        }

    },

    onPlayerError: function(e) {

    },
    
    stopVideo: function() {
    
    }
    

    
  });

  return PrepView;
  
});
