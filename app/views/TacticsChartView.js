define([
  'jquery','underscore','backbone',  
  'views/ChartView',
  'text!templates/tacticsTemplate.html'
], function($, _, Backbone, ChartView, template){

  var TacticsChartView = ChartView.extend({
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

  return TacticsChartView;
  
});