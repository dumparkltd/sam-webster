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
      this.$el.html(template);   
      this.initTactics();
      this.setupFrames();      
      return this;      
    },
    initTactics: function(){
    
      var args={ 
        speed : [0, 15, 16, 20,  26,  33,   51,   60,   68,   71],
        power : [0, 15, 30, 76, 217, 282, 1394, 1889, 1798, 1467],
        lap   : ["Start","Lap 1","Lap 1","Lap 1","Lap 2","Lap 2","Lap 2","Lap 3","Lap 3","Lap 3"],
        title : [ 
    "Lining up",
    "Starting slow",
    "Going high",
    "Having Jason follow",
    "Increasing the pace",
    "Matching Jason's track height",
    "Holding back a little",
    "Executing the attack",
    "Driving for home",
    "Winning Gold"
        ],
        narrative : [     
    "Sam and Jason line up for the third and last race of the final, knowing that it would require the right tactic to win",
    "Sam's game plan was to not allow Jason to carry to much speed at the start and to be vigilant to avoid being attacked from behind",
    "Sam would go high on the straights, thus gaining potential energy to counter any potential attack, ",
    "Sam continues to dictate the race by moving up and down the track, making sure Jason follows him closely",
    "While keeping the speed low at the start of lap 2, Sam starts to 'put some power down' coming out of the first turn",
    "When Jason climbs the track, Sam makes sure to match his opponent's track height while continuing to look back frequently",
    "Getting out of his seat in turn 2, Sam goes close to his limit, and only holds back just a little bit when entering the final lap",
    "With little over 200m to go, Sam takes one last look around and executes the attack by dropping down into the back straight",
    "Sam puts his head down and drives for home, knowing that his opponent behind will use the slip stream to overtake him on the final meters",
    "With less than a bike's length ahead of his opponent Sam crosses the finish line and win's his first Commonwealth individual gold"
        ]
      };
      
      for (i = 0; i < args.lap.length; i++) { 
        this.$('.frame'+i).html(_.template(frameTemplate)({index:i, data:args}));
      } 
    }

  });

  return TacticsFramesView;
  
});