define([
  'jquery','underscore','backbone',  
  'text!templates/prepTemplate.html'
], function($, _, Backbone, template){

  var PrepView = Backbone.View.extend({
    initialize : function(){
      this.render();
    },       
    events : {
    },    
    render: function(){         
      this.$el.html(_.template(template)({}));
      
      this.initPlayers();

      return this;
    },
    
    initPlayers: function(){
    
      this.player1 = new YT.Player('prep-player-1', {
          height: '315',
          width: '560',
          frameborder: '0',
          videoId: 'GWCQFTgl5js',
          events: {
            'onReady': this.onPlayerReady,
            'onStateChange': _.bind(this.onPlayerStateChange, this)
          }});
          
      this.player2 = new YT.Player('prep-player-2', {
          height: '315',
          width: '560',
          frameborder: '0',
          videoId: 'GWCQFTgl5js',
          events: {
            'onReady': this.onPlayerReady,
            'onStateChange': _.bind(this.onPlayerStateChange, this)
          }});
          
      this.player3 = new YT.Player('prep-player-3', {
          height: '315',
          width: '560',
          frameborder: '0',
          videoId: 'GWCQFTgl5js',
          events: {
            'onReady': this.onPlayerReady,
            'onStateChange': _.bind(this.onPlayerStateChange, this)
          }});
          
      this.player4 = new YT.Player('prep-player-4', {
          height: '315',
          width: '560',
          frameborder: '0',
          videoId: 'GWCQFTgl5js',
          events: {
            'onReady': this.onPlayerReady,
            'onStateChange': _.bind(this.onPlayerStateChange, this)
          }});
    },
    
    onPlayerReady: function(event){
    },
    
    onPlayerStateChange: function(event){
      if (event.data == YT.PlayerState.PLAYING){
        if(event.target.d.id == "prep-player-1") this.player2.stopVideo(),this.player3.stopVideo(),this.player4.stopVideo();
        if(event.target.d.id == "prep-player-2") this.player1.stopVideo(),this.player3.stopVideo(),this.player4.stopVideo();
        if(event.target.d.id == "prep-player-3") this.player1.stopVideo(),this.player2.stopVideo(),this.player3.stopVideo();
        if(event.target.d.id == "prep-player-4") this.player1.stopVideo(),this.player2.stopVideo(),this.player3.stopVideo();
      }     
    },
    
    stopVideo: function() {
    
    }
    

    
  });

  return PrepView;
  
});