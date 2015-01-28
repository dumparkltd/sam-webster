define([
  'jquery','underscore','backbone',  
  'views/FramesView',
  'text!templates/prepNutritionFramesTemplate.html',
  'text!templates/prepNutritionFramesChartTemplate.html'
], function($, _, Backbone, FramesView, template, chartTemplate){

  var PrepNutritionFramesView = FramesView.extend({
    initialize : function(){
      this.render();
    },       
    events: function(){
       return _.extend({},FramesView.prototype.events,{
//           'click' : 'onclickChild'
       });
    },    
    render: function(){         
      this.$el.html(_.template(template)({}));   
      this.initCharts();      
      this.setupFrames();
      return this;      
    },
    initCharts: function(){
      var nutritionData = {
                          protein:[25,30,35],
                          carbs:  [45,55,40],
                          fat:    [30,15,25]
                          };

      
      for (i = 0; i < 3; i++) { 
        this.$('.frame'+i+' .nutrition-chart').html(_.template(chartTemplate)({protein : nutritionData.protein[i], 
                                                             carbs   : nutritionData.carbs[i] , 
                                                             fat     : nutritionData.fat[i] }));
      } 

    }
  });

  return PrepNutritionFramesView;
  
});