define([
  'jquery','underscore','backbone',  
  'views/TimelineFramesView',//subviews
  'text!templates/timelineTemplate.html'
], function($, _, Backbone, TimelineFramesView, template){

  var TimelineView = Backbone.View.extend({
    initialize : function(options){
      this.options = options;
      this.render();
      this.hasFramesView = true;      
    },       
    events : {
    },    
    render: function(){         
      this.$el.html(template);
      this.framesView = new TimelineFramesView({
        el:this.$('.frames-view'),
        scrolling:'skrollr',
        scroll_distance:200,
        offset_top: this.options.offset_top
      });            
      return this;   
    },
    goToFrame : function(frameIndex, duration, callback){
      this.framesView.goToFrame(frameIndex, duration, callback);
    },
    getHeight : function(){
      return this.framesView.getHeight();
    },            
  });

  return TimelineView;
  
});