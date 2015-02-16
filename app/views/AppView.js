define(["jquery","underscore","backbone","skrollr","views/IntroView","views/TacticsView","views/TimelineView","views/PrepView","views/AdviceView","text!templates/appTemplate.html"],function(t,e,i,s,a,r,o,h,l,n){var d=i.View.extend({initialize:function(i){this.options=i||{},this.img_loaded=!1,this.totalImg=0,this.skroll_data=[],this.render(),t(window).scroll(e.debounce(e.bind(this.scrolled,this),10)),t(window).resize(e.debounce(e.bind(this.resized,this),1e3)),Modernizr.touch&&t(window).on("touchstart touchmove touchend",e.debounce(e.bind(this.scrolled,this),10))},events:{updateRouteEvent:"updateRoute",scrollEvent:"scrollEvent","click .resetApp":"resetApp","click .toggle-share":"toggleShare","click .nav a":"goToChapter","click .navbar-toggle":"navbarToggle",resetAppEvent:"resetApp"},render:function(){this.$el.html(n),this.$(".fill-screen").each(function(){t(this).css("min-height",t(window).height())}),t(window).height()<800?this.$el.addClass("low-screen"):this.$el.removeClass("low-screen"),this.model.addChapter(this.$("#intro-view").data("id"),new a({el:this.$("#intro-view")})),this.model.addChapter(this.$("#timeline-view").data("id"),new o({el:this.$("#timeline-view")})),this.model.addChapter(this.$("#tactics-view").data("id"),new r({el:this.$("#tactics-view"),auto_play:Modernizr.touch?!1:!0,play_tolerance:t(window).height()/4})),this.model.addChapter(this.$("#prep-view").data("id"),new h({el:this.$("#prep-view")})),this.model.addChapter(this.$("#advice-view").data("id"),new l({el:this.$("#advice-view")})),this.initSkrollr(),this.skrollr=s.init({forceHeight:!1});var i=this.$("img");this.totalImg=i.length;var d=this;i.each(function(){t(this).load(e.bind(d.waitImgDone,d)).error(e.bind(d.waitImgDone,d))}),this.activateChapter(this.getChapterByPosition()),t("head").append('<script type="text/javascript" src="//s7.addthis.com/js/300/addthis_widget.js#pubid=ra-54d1b9271ac1634b" async="async"></script>'),"undefined"==typeof YT&&t("head").append('<script src="//www.youtube.com/iframe_api" type="text/javascript"></script>');var d=this;"undefined"!=typeof YT?(d.model.getChapterByID("prep").view.initPlayers(),d.model.getChapterByID("tactics").view.initPlayers()):window.onYouTubeIframeAPIReady=function(){d.model.getChapterByID("prep").view.initPlayers(),d.model.getChapterByID("tactics").view.initPlayers()}},waitImgDone:function(){this.totalImg--,0!==this.totalImg||this.img_loaded||(this.img_loaded=!0,this.initSkrollr(),this.skrollr.refresh())},initSkrollr:function(){this.$(".fill-screen").each(function(){t(this).css("min-height",t(window).height())});var i=0;e.each(this.model.getChapters(),function(t){i=t.view.offsetSkroll(i)}),i=this.offsetSkroll(this.$("footer"),this.$("footer").outerHeight(),i),t("body").css("height",i)},offsetSkroll:function(t,e,i){return this.removeSkrollData(t),t.attr("data-0","top:"+i+"px"),this.skroll_data.push("data-0"),t.attr("data-"+i,"top:0px;"),this.skroll_data.push("data-"+i),i+=e,t.attr("data-"+i,"top:-"+e+"px"),this.skroll_data.push("data-"+i),i},removeSkrollData:function(t){e.each(this.skroll_data,function(e){t.removeAttr(e),t.removeData(e)}),this.skroll_data=[]},scrolled:function(){this.activateChapter(this.getChapterByPosition())},activateChapter:function(t){this.$(".nav li").removeClass("active"),this.$(".nav li#nav-"+t).addClass("active"),this.$el.removeClass(function(t,e){return(e.match(/(^|\s)chapter-\S+/g)||[]).join(" ")}),this.$el.addClass("chapter-"+t),window._gaq.push(["_trackEvent","chapter","chapter-"+t,""])},getChapterByPosition:function(){var e=this.model.get("chapter-id"),i=this;return this.$("section.chapter").each(function(){var s=t(window).height()/4;i.skrollr.getScrollTop()>=t(this).attr("data-0").split("top:")[1].split("px")[0]-s&&(e=t(this).data("id"))}),e},resized:function(){this.$(".fill-screen").each(function(){t(this).css("min-height",t(window).height())}),t(window).height()<800?this.$el.addClass("low-screen"):this.$el.removeClass("low-screen"),this.initSkrollr(),this.skrollr.refresh(),this.activateChapter(this.getChapterByPosition())},goToChapter:function(e){if(e.preventDefault(),this.model.set("userScrolling",!1),this.$("aside").removeClass("open"),this.$(".share-buttons").removeClass("active"),"undefined"!=typeof t(e.originalEvent.target).attr("href"))var i=t(e.originalEvent.target).attr("href").split("#")[1];else var i=t(e.originalEvent.target).parent().attr("href").split("#")[1];var s=this.model.getChapterByID(i);this.skrollr.setScrollTop(s.view.$el.attr("data-0").split("top:")[1].split("px")[0]),this.activateChapter(i),this.model.set("userScrolling",!0)},scrollEvent:function(e,i){var s={duration:0,callback:function(){}},a=t.extend(!0,s,i);this.skrollr.setScrollTop(a.offset),a.callback},updateRoute:function(t,e){this.model.get("router").navigate(e.route,{trigger:!0})},toggleShare:function(t){t.preventDefault(),this.$(".share-buttons").toggleClass("active"),this.$(".toggle-share").toggleClass("active")},navbarToggle:function(t){t.preventDefault(),this.$("aside").toggleClass("open"),this.$(".share-buttons").toggleClass("active")}});return d});