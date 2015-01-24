define([
  'jquery','underscore','backbone', // helper
//  'collections/', //collections
  'views/IntroView','views/TacticsView','views/TimelineView',//subviews
  'text!templates/appTemplate.html'//templates
], function(
  $, _, Backbone,
  IntroView, TacticsView, TimelineView,
  template
){

  var AppView = Backbone.View.extend({    
    initialize : function(options){
      this.options = options || {};
      this.model.set('dataLoaded', false);
      this.render();
      this.listenTo(this.model, 'change:routeUpdated', this.routeUpdated);      
      //this.listenTo(this.model, 'change:slide', this.viewUpdated);      
            
      // bind to window
      $(window).scroll(_.debounce(_.bind(this.scrolled, this),10));
    
    },
    events : {
      "updateRouteEvent" : "updateRoute",    
      "scrollEvent" : "scrollEvent",    
      "click .resetApp" : "resetApp",      
      "click .next-chapter a" : "nextChapter",      
      "resetAppEvent" : "resetApp",
    },      
    render: function(){     
      
      this.$el.html(_.template(template)({})); 
      
      // init subviews
      this.model.addChapter(this.$('#intro-view').data('id'),new IntroView({el:this.$('#intro-view')}));
      this.model.addChapter(this.$('#timeline-view').data('id'),new TimelineView({el:this.$('#timeline-view')}));
      this.model.addChapter(this.$('#tactics-view').data('id'),new TacticsView({el:this.$('#tactics-view')}));
      
      //svg required
      
      
      if (Modernizr.svg) {}  
      
      this.$('.fill-screen').each(function(){
        $(this).css('min-height',$(window).height());
      });

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
   
    // NAV HANDLERS ///////////////////////////////                
    routeUpdated : function(){
//      window._gaq.push(['_trackEvent', 'default', 'default', 'default']);
      console.log('routeUpdated');      
      
      console.log(this.model.get('chapter-id'));
        var chapter = this.model.getChapter();

        if (typeof chapter !== 'undefined') {
          // scroll to chapter
          var that = this;
          this.model.set('userScrolling', false);
          $('html,body').animate({
            scrollTop: chapter.view.$el.offset().top
          }, 
          1000, 
          function(){            
            // then inside chapter scroll to slide
            if (typeof chapter.view.isScrollView !== 'undefined' 
                && chapter.view.isScrollView 
                && that.model.get('slide-id') !== '') {
          
              chapter.view.scroll(this.model.get('slide-id'), function(){
                // callback
                that.model.set('userScrolling', true);
              });
            } else {
              that.model.set('userScrolling', true);
            }
          });
                          
        } else {
          this.resetApp();
        }      
      
//      if (Modernizr.svg) {        
//        // make sure data is loaded
//        this.waitForData(function(){
//        });      
//      }
    },      
    nextChapter : function(e){
      e.preventDefault();
      $(this.el).trigger('updateRouteEvent',{route:this.model.getNextChapterID()});     
    },   
    scrolled : function(){
      // only when the user is scrolling, not when animated by app          
      if (this.model.get('userScrolling')) {
        var chapterID = this.model.get('chapter-id');
        this.$('section.chapter').each(function(index){
          if ($('html').scrollTop() >= $(this).offset().top) {
            // chapter is in view  
            chapterID = $(this).data('id');
          }
        });
        if (chapterID !== this.model.get('chapter-id')){
           console.log('scrolled: ' + chapterID);

           // remember current chapter    
           this.model.set('chapter-id',chapterID);
           this.model.get('router').navigate(chapterID,{trigger:false}); 
         }
      }
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
    chapterEvent : function (event, args){
      console.log('chapterEvent'); 
     
    },
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
