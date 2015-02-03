define([
  'jquery','underscore','backbone',  
  'views/FramesView',
  'text!templates/timelineFramesTemplate.html'
], function($, _, Backbone, FramesView, template){

  var TimelineFramesView = FramesView.extend({
    initialize : function(){
      this.render();
    },       
    events: function(){
       return _.extend({},FramesView.prototype.events,{
//           'click' : 'onclickChild'
       });
    },    
    render: function(){         
      this.$el.html(template);   
      return this;      
    },

  });

  return TimelineFramesView;
  
});