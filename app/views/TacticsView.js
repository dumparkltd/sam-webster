define([
  'jquery','underscore','backbone',  
  'views/VideoView',//
  'views/TacticsFramesView',//subviews
  'text!templates/tacticsTemplate.html'
], function($, _, Backbone, VideoView, TacticsFramesView, template){

  var TacticsView = VideoView.extend({
    initialize : function(options){
      this.options = options;
      this.skroll_data = [];      
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
        scroll_distance:200,
      });        
      
      return this;
    },                  
    goToFrame : function(frameIndex, duration, callback){
      this.framesView.goToFrame(frameIndex, duration, callback);
    },
    getHeight : function(){
      return this.$el.outerHeight() 
              - this.framesView.$el.outerHeight() 
              + this.framesView.getHeight();
    },              
    offsetSkroll: function(offset_top){
      console.log('tactics offsetSkroll ' + offset_top);
      this.framesView.setupFrames(offset_top + this.$('.frames-above').outerHeight());
            
      this.removeSkrollData();
      var offset = this.getHeight();      
      this.$el.attr('data-0','top:'+ offset_top +'px');
      this.skroll_data.push('data-0');
      this.$el.attr('data-'+offset_top,'top:0px;');
      this.skroll_data.push('data-'+offset_top);
      offset_top += offset;  
      this.$el.attr('data-'+offset_top,'top:-'+offset+'px');   
      this.skroll_data.push('data-'+offset_top);      
      
      
      this.$('.frames-below').css('top',this.framesView.getHeight() + 'px') ;      
      
      
      return offset_top;
    },     
    removeSkrollData : function(){
      var that = this;
      _.each(this.skroll_data,function(sd){
        that.$el.removeAttr(sd);
        that.$el.removeData(sd);
      });
      this.skroll_data = [];     
      
    }             

  });

  return TacticsView;
  
});