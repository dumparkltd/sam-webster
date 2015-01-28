define([
  'jquery','underscore','backbone',  
  'views/FramesView',
  'text!templates/tacticsFramesTemplate.html',
  'text!templates/tacticsIndividualFrameTemplate.html'
], function($, _, Backbone, FramesView, template, frameTemplate){

  var TacticsFramesView = FramesView.extend({
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
      this.setupFrames();
      this.initTactics();
      return this;      
    },
    initTactics: function(){
    
      var speed=[0,15,16,20,26,33,51,60,68,71],
          power=[0,320,31,73,154,334,1195,1378,1876,1467,1221],
          title=["Race starts","Lap 1","Lap 1","Lap 1","Lap 2","Lap 2","Lap 2","Lap 3","Lap 3","Lap 3"],
          narrative=[ "Sam Webster and Jason Kenny on the starting line",
                      "not allow Jason to carry speed",
                      "go high to counter attack",
                      "move up and down the track to have hime follow",
                      "start to put some power down",
                      "go high to match Jason's track height",
                      "holding back just a little bit",
                      "the attack",
                      "driving for home",
                      "Sam wins gold"
                    ];
      
      for (i = 0; i < narrative.length; i++) { 
        this.$('.frame'+i).html(_.template(frameTemplate)({index : i,
                                                           title : title[i],
                                                           speed : speed[i], 
                                                           power : power[i] , 
                                                           narrative : narrative[i] }));
      } 
    }

  });

  return TacticsFramesView;
  
});