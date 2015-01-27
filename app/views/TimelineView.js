define([
  'jquery','underscore','backbone',  
  'views/TimelineFramesView',//subviews
  'text!templates/timelineTemplate.html'
], function($, _, Backbone, TimelineFramesView, template){

  var TimelineView = Backbone.View.extend({
    initialize : function(){
      this.render();
      this.hasFramesView = true;      
    },       
    events : {
    },    
    render: function(){         
      this.$el.html(_.template(template)({}));
      this.framesView = new TimelineFramesView({
        el:this.$('.frames-view'),
        enable_scrolling:true,
        scroll_distance:300
      });            
      return this;   
    },
    goToFrame : function(frameIndex, duration, callback){
      this.framesView.goToFrame(frameIndex, duration, callback);
    }           
  });

  return TimelineView;
  
});