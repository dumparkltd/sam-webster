define([
  'jquery','underscore','backbone',  
  'views/TimelineFramesView',//subviews
  'text!templates/timelineTemplate.html'
], function($, _, Backbone, TimelineFramesView, template){

  var TimelineView = Backbone.View.extend({
    initialize : function(options){
      this.options = options;
      this.render();
      this.skroll_data = [];      
      this.hasFramesView = true;      
    },           
    render: function(){         
      this.$el.html(template);
      this.framesView = new TimelineFramesView({el:this.$('.frames-view')});            
      return this;   
    },
    goToFrame : function(frameIndex, duration, callback){
      this.framesView.goToFrame(frameIndex, duration, callback);
    },
    getHeight : function(){
      return this.$el.outerHeight() 
              - this.framesView.$el.outerHeight() 
              + this.framesView.getHeight()
    },  
    offsetSkroll: function(offset_top){
      
      this.framesView.setupFrames(offset_top + this.$('.frames-above').outerHeight());;
      
      this.removeSkrollData();
      var offset = this.getHeight();      
      this.$el.attr('data-0','top:'+ offset_top +'px');
      this.skroll_data.push('data-0');
      this.$el.attr('data-'+offset_top,'top:0px;');
      this.skroll_data.push('data-'+offset_top);
      offset_top += offset;  
      this.$el.attr('data-'+offset_top,'top:-'+offset+'px');   
      this.skroll_data.push('data-'+offset_top);      
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

  return TimelineView;
  
});