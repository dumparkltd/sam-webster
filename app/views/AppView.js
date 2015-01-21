define([
  'jquery','underscore','backbone', // helper
  'collections/OceanCollection','collections/ExpeditionCollection','collections/StationCollection', //collections
  'views/NavView','views/ExpeditionsView','views/MapView','views/AboutView','views/IntroView', 
  'views/OceansView','views/ExpeditionSingleView',//subviews
  'text!templates/appTemplate.html'//templates
], function(
  $, _, Backbone,
  OceanCollection,ExpeditionCollection, StationCollection,
  NavView, ExpeditionsView, MapView,  AboutView, IntroView,
  OceansView,ExpeditionSingleView,
  template
){

  var AppView = Backbone.View.extend({
    el: $("#application"),
    initialize : function(options){
      this.options = options || {};
      this.url = '';
      this.subviews = {};
      this.intro = true;
      this.expeditionIntro = true;
      this.dataLoaded = false;
      this.render();   
    },
    events : {
      "updateRouteEvent" : "updateRoute",    
      "click .resetApp" : "resetApp",      
      "resetAppEvent" : "resetApp",
    },      
    render: function(){     
      $('body').addClass('loading-application');  
      
      this.$el.html(_.template(template)({url_enc : encodeURIComponent(this.url)})); 
      
      // init subviews
      //svg required
      if (Modernizr.svg) {
      }  
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
   
//    // ROUTE HANDLERS ///////////////////////////////                
    routeDefault : function(){
      window._gaq.push(['_trackEvent', 'default', 'default', 'default']);
      
      this.$el.attr('data-view','default');
      if (Modernizr.svg) {        
        this.waitForData(function(){
        });      
      }
    },      
    
            
    waitForData : function(callback){
      var that = this;
      if (this.dataLoaded){
         callback();
      } else {
        setTimeout(function(){
          that.waitForData(callback);
        },250);
      }                
    },
    
    // EVENT HANDLERS ////////////////////////////////////////////////////////////////

    updateRoute : function (event, args) {
//      console.log('updateRoute')
      // todo check for arguments
      var route = args.route;
      
      if (typeof args.id !== "undefined"){
        route += '/'+args.id;
      }
      
      this.options.router.navigate(route,{trigger:true});
    },    
    resetApp : function(){
      this.intro=true;
      this.$el.addClass('intro');
      this.subviews.mapView.fitOcean('ALL');
      $(this.el).trigger('updateRouteEvent',{route:''});
    },    
    
  });
  return AppView;
  
});
