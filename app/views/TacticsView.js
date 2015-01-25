define([
  'jquery','underscore','backbone',  
  'views/TacticsFramesView',//subviews
  'text!templates/tacticsTemplate.html'
], function($, _, Backbone, TacticsFramesView, template){

  var TacticsView = Backbone.View.extend({
    initialize : function(){
      this.render();
      this.hasFramesView = true;
    },       
    events: function(){       
    },    
    render: function(){         
      this.$el.html(_.template(template)({}));
      this.framesView = new TacticsFramesView({
        el:this.$('.frames-view'),
        frame_offset:300,
        offset:this.$('.frames-view').offset().top - this.$el.offset().top
      });            
      return this;      
    },
    goToFrame : function(frameIndex, duration, callback){
      this.framesView.goToFrame(frameIndex, duration, callback);
    }

  });

  return TacticsView;
  
});