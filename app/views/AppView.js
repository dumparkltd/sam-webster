define([
  'jquery','underscore','backbone', // helper
  'skrollr',
//  'collections/', //collections
  'views/IntroView','views/TacticsView','views/TimelineView',
  'views/PrepView','views/AdviceView','views/WinView',//subviews
  'text!templates/appTemplate.html'//templates
], function(
  $, _, Backbone,
  skrollr,
  IntroView, TacticsView, TimelineView, PrepView, AdviceView, WinView,
  template
){

  var AppView = Backbone.View.extend({    
    initialize : function(options){
      this.options = options || {};      
      
      this.scrollDuration = 200;
      this.img_loaded = false;
      this.totalImg = 0;
      this.skroll_data = [];
      this.render();  
          
      this.listenTo(this.model, 'change:routeUpdated', this.routeUpdated);         
      
      // bind to window
      $(window).scroll(_.debounce(_.bind(this.scrolled, this),10));
      $(window).resize(_.debounce(_.bind(this.resized, this),1000));
      
    },
    events : {
      "updateRouteEvent" : "updateRoute",    
      "scrollEvent" : "scrollEvent",    
      "click .resetApp" : "resetApp",      
      "click .toggle-share" : "toggleShare",      
      "click .next-chapter a" : "nextChapter",      
      "click .nav a" : "goToChapter",      
      "resetAppEvent" : "resetApp"
    },      
    render: function(){     
      
      this.$el.html(template);      
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
        el:this.$('#tactics-view'),
        auto_play:false
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
      
      this.initSkrollr();
      this.skrollr = skrollr.init({
        forceHeight : false
      }); 
      
      // re-run this once all images have been loaded
      var $img = this.$('img');      
      this.totalImg = $img.length;
      var that = this;
      $img.each(function() {
          $(this)
              .load(_.bind(that.waitImgDone,that))
              .error(_.bind(that.waitImgDone,that));
      });        
      
      this.activateChapter(this.getChapterByPosition());

      
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
    waitImgDone : function() {
        this.totalImg--;
        if ((this.totalImg===0) && (!this.img_loaded)) {

          this.img_loaded = true;
          this.initSkrollr(); 
          this.skrollr.refresh();           
        }
    },            
    initSkrollr: function(){     

      this.$('.fill-screen').each(function(){
        $(this).css('min-height',$(window).height());
      });        
      
      var offset_top = 0;
      _.each(this.model.getChapters(), function(chapter){
        offset_top = chapter.view.offsetSkroll(offset_top);
      });    

      // offset footer
      offset_top = this.offsetSkroll(this.$('footer'),this.$('footer').outerHeight(),offset_top);    
      
      $('body').css('height',offset_top);
 
    },
    offsetSkroll: function($item,offset,offset_top){
      this.removeSkrollData($item);
      $item.attr('data-0','top:'+ offset_top +'px');
      this.skroll_data.push('data-0');
      $item.attr('data-'+offset_top,'top:0px;');
      this.skroll_data.push('data-'+offset_top);
      offset_top += offset;  
      $item.attr('data-'+offset_top,'top:-'+offset+'px');   
      this.skroll_data.push('data-'+offset_top);      
      return offset_top;
    },     
    removeSkrollData : function($item){
      _.each(this.skroll_data,function(sd){
        $item.removeAttr(sd);
        $item.removeData(sd);
      });
      this.skroll_data = [];      
    },               
    // NAV HANDLERS ///////////////////////////////                
    routeUpdated : function(){
//      window._gaq.push(['_trackEvent', 'default', 'default', 'default']);
      var chapter = this.model.getChapter();
      console.log('routeUpdated '+chapter.id); 

      if (typeof chapter !== 'undefined') {
        // scroll to chapter
        var that = this;
        this.model.set('userScrolling', false);

        if (typeof chapter.view.hasFramesView !== 'undefined' 
              && chapter.view.hasFramesView 
              && that.model.get('frame-id') !== '') {

            chapter.view.goToFrame(that.model.get('frame-id'),
            that.scrollDuration, //duration
            function(){  
              // then inside chapter scroll to frame             
              setTimeout(function(){
                that.activateChapter(that.getChapterByPosition());
                that.model.set('userScrolling', true);                          
              },that.scrollDuration);            
            });                      
        } else {
          $('html,body').animate({
            scrollTop: chapter.view.$el.offset().top
          }, 
          that.scrollDuration, //duration
          function(){        
            // then inside chapter scroll to frame   
            that.activateChapter(that.getChapterByPosition());
            // as this callback seems to be fired early lets wait again and reset chapter
            setTimeout(function(){
              that.activateChapter(that.getChapterByPosition());
              that.model.set('userScrolling', true);                          
            },that.scrollDuration);            
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
      if (this.model.get('userScrolling')) {      
        this.activateChapter(this.getChapterByPosition());
      }
    },
    activateChapter:function(chapterID){
      this.$('.nav li').removeClass('active');
      this.$('.nav li#nav-'+chapterID).addClass('active');      
      if (this.model.get('userScrolling')) {        
        // remember current chapter    
        this.model.set('chapter-id',chapterID);
        this.model.get('router').navigate(chapterID,{trigger:false}); 
        this.$el.removeClass (function (index, css) {
          return (css.match (/(^|\s)chapter-\S+/g) || []).join(' ');
        });
        this.$el.addClass('chapter-'+chapterID);
      }
    },
    getChapterByPosition : function(){ 
      var chapterID = this.model.get('chapter-id');
      this.$('section.chapter').each(function(index){
        var scrollTolerance = $(window).height()/4;
        if ($(document).scrollTop() >= $(this).offset().top - scrollTolerance) {          
          // chapter is in view  
          chapterID = $(this).data('id');  
        }
      });      
      
      return chapterID;
    },
    
    resized : function(){
      this.$('.fill-screen').each(function(){
        $(this).css('min-height',$(window).height());
      });          
      this.initSkrollr();
      this.skrollr.refresh();      
      this.activateChapter(this.getChapterByPosition());           
    },
  
    
    // EVENT HANDLERS ////////////////////////////////////////////////////////////////
    goToChapter : function (e){
      if ($(e.originalEvent.target).attr('href').split('#')[1] === this.model.get('chapter-id')) {
        e.preventDefault();
        $(this.el).trigger('scrollEvent',{
          offset: this.model.getChapter().view.$el.offset().top,
          callback:_.bind(this.scrolled,this),
        });                
      }
    },
    scrollEvent : function (e, args) {
      var default_options = {
        duration : 0
      };
      var options = $.extend(true, default_options, args);       

      console.log('scrollEvent '+options.duration); 
      
      $('html,body').animate({
        scrollTop: options.offset
      }, 
      options.duration,
      options.callback
    );
    },    
    updateRoute : function (e, args) {
      this.model.get('router').navigate(args.route,{trigger:true});
    },    
    resetApp : function(){
      $(this.el).trigger('updateRouteEvent',{route:'start'});
    },    
    toggleShare : function(e){
      e.preventDefault();
      this.$('.share-buttons').toggleClass('active');
      this.$('.toggle-share').toggleClass('active');
    },    
    
  });
  return AppView;
  
});
