define([
  'jquery','underscore','backbone',  
  'views/ScrollView',  
  'text!templates/timelineTemplate.html'
], function($, _, Backbone, ScrollView, template){

  var TimelineView = Backbone.View.extend({
    initialize : function(){
      this.render();
    },       
    events : {
    },    
    render: function(){         
      this.$el.html(_.template(template)({}));
      return this;
   },
  });

  return TimelineView;
  
});