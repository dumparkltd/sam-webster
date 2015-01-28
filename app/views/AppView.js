define([
  'jquery','underscore','backbone', // helper
//  'collections/', //collections
  'views/IntroView','views/TacticsView','views/TimelineView','views/PrepView','views/AdviceView','views/WinView',//subviews
  'text!templates/appTemplate.html'//templates
], function(
  $, _, Backbone,
  IntroView, TacticsView, TimelineView, PrepView, AdviceView, WinView,
  template
){

  var AppView = Backbone.View.extend({    
    initialize : function(options){
      this.options = options || {};
      this.model.set('dataLoaded', false);
      this.render();
      this.listenTo(this.model, 'change:routeUpdated', this.routeUpdated);      
            
      // bind to window
      $(window).scroll(_.debounce(_.bind(this.scrolled, this),10));
      $(window).resize(_.debounce(_.bind(this.resized, this),10));
      
    },
    events : {
      "updateRouteEvent" : "updateRoute",    
      "scrollEvent" : "scrollEvent",    
      "click .resetApp" : "resetApp",      
      "click .next-chapter a" : "nextChapter",      
      "resetAppEvent" : "resetApp"
    },      
    render: function(){     
      
      this.$el.html(_.template(template)({})); 
      this.$('.fill-screen').each(function(){
        $(this).css('min-height',$(window).height());
      });      
      // init subviews
      this.model.addChapter(this.$('#intro-view').data('id'),new IntroView({
        el:this.$('#intro-view')
      }));
      this.model.addChapter(this.$('#timeline-view').data('id'),new TimelineView({
        el:this.$('#timeline-view')
      }));
      this.model.addChapter(this.$('#tactics-view').data('id'),new TacticsView({
        el:this.$('#tactics-view')
      }));
      this.model.addChapter(this.$('#prep-view').data('id'),new PrepView({
        el:this.$('#prep-view')
      }));
      this.model.addChapter(this.$('#advice-view').data('id'),new AdviceView({
        el:this.$('#advice-view')
      }));
      this.model.addChapter(this.$('#win-view').data('id'),new WinView({
        el:this.$('#win-view')
      }));
      
      //initPlayers: function() {
      if (typeof YT === 'undefined') {
        $('head').append('<script src="//www.youtube.com/iframe_api" type="text/javascript"></script>');    
      }
      
      var that = this;
      if (typeof YT !== 'undefined') {
          that.model.getChapterByID('prep').view.initPlayers();
          that.model.getChapterByID('tactics').view.initPlayers();  
      } else {      
        window.onYouTubeIframeAPIReady = function() {
          that.model.getChapterByID('prep').view.initPlayers();
          that.model.getChapterByID('tactics').view.initPlayers();          
        };
      }          
       
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
          
          if (typeof chapter.view.hasFramesView !== 'undefined' 
                && chapter.view.hasFramesView 
                && that.model.get('frame-id') !== '') {
              
              chapter.view.goToFrame(that.model.get('frame-id'),
              0,
              function(){            
                // then inside chapter scroll to frame             
                that.model.set('userScrolling', true);            
              });                      
          } else {
            $('html,body').animate({
              scrollTop: chapter.view.$el.offset().top
            }, 
            0, 
            function(){            
              // then inside chapter scroll to frame             
              that.model.set('userScrolling', true);            
            });
          }            
                          
        } else {
          this.resetApp();
        }           
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
           // remember current chapter    
           this.model.set('chapter-id',chapterID);
           this.model.get('router').navigate(chapterID,{trigger:false}); 
         }
      }
    },
    resized : function(){
      this.$('.fill-screen').each(function(){
        $(this).css('min-height',$(window).height());
      }); 
    },
  
    
    // EVENT HANDLERS ////////////////////////////////////////////////////////////////
    scrollEvent : function (event, args) {
      var default_options = {
        duration : 1000
      };
      var options = $.extend(true, default_options, args);       
      $('html,body').animate({
        scrollTop: options.offset
      }, 
      options.duration,
      options.callback
    );
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
