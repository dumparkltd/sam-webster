define([
  'jquery','underscore','backbone', // helper
//  'collections/', //collections
  'views/IntroView','views/TacticsView',//subviews
  'text!templates/appTemplate.html'//templates
], function(
  $, _, Backbone,
  IntroView, TacticsView,
  template
){

  var AppView = Backbone.View.extend({    
    initialize : function(options){
      this.options = options || {};
      this.model.set('dataLoaded', false);
      this.render();
      this.listenTo(this.model, 'change:route', this.routeUpdated);   
            
      // bind to window
      $(window).scroll(_.debounce(_.bind(this.scrolled, this),10));
    
    },
    events : {
      "updateRouteEvent" : "updateRoute",    
      "scrollEvent" : "scrollEvent",    
      "click .resetApp" : "resetApp",      
      "resetAppEvent" : "resetApp",
    },      
    render: function(){     
      
      this.$el.html(_.template(template)({})); 
      
      // init subviews
      this.model.addSubview('start',new IntroView({el:this.$('#intro-view')}));
      this.model.addSubview('tactics',new TacticsView({el:this.$('#tactics-view')}));
      
      //svg required
      
      
      if (Modernizr.svg) {}  
    },
    
    loadData : function(callback) {
      var that = this;
      $.when(
//        $.getJSON('app/data/Oceans.geojson'), 
        
      ).done(function (data) {
        that.data = {
          data:data
        };
        callback();
      });
    },            
   
    // ROUTE HANDLERS ///////////////////////////////                
    routeUpdated : function(){
//      window._gaq.push(['_trackEvent', 'default', 'default', 'default']);
      console.log('routeUpdated');      
      
      console.log(this.model.get('route'));
      var route = this.model.get('route').split('/');
      
      // scroll to corresponding view section
      var subview = this.model.subviews[route[0]];
      
      if (typeof subview !== 'undefined') {
        if (typeof subview.isScrollView !== 'undefined' && subview.isScrollView) {
            subview.scroll(route[1]);
        } else {
          $('html,body').animate({
            scrollTop: subview.$el.offset().top
          }, 1000);
        }
        
        
      } else {
        this.resetApp();
      }
      
      // pass view the subview parameter
      
      
      if (Modernizr.svg) {        
        // make sure data is loaded
        this.waitForData(function(){
        });      
      }
    },      
       
    scrolled : function(){
     // console.log('scrolled');
    },            
    waitForData : function(callback){
      var that = this;
      if (this.model.get('dataLoaded')){
         callback();
      } else {
        setTimeout(function(){
          that.waitForData(callback);
        },250);
      }                
    },
    
    // EVENT HANDLERS ////////////////////////////////////////////////////////////////

    scrollEvent : function (event, args) {
      console.log('scrollEvent');      
      $('html,body').animate({
        scrollTop: args.offset
      }, 1000);
    },    

    updateRoute : function (event, args) {
      console.log('updateRoute');      
      this.model.get('router').navigate(args.route,{trigger:true});
    },    
    resetApp : function(){
      console.log('resetApp');
      $(this.el).trigger('updateRouteEvent',{route:'start/'});
    },    
    
  });
  return AppView;
  
});
