define(["jquery","underscore","backbone","views/VideoView","views/TacticsFramesView","text!templates/tacticsTemplate.html"],function(t,e,i,s,a,r){var h=s.extend({initialize:function(t){this.options=t,this.skroll_data=[],this.players=[{player_id:"7xQhuKVOZiQ",player_el:"tactics-player-1",height:"720",width:"1280"}],this.hasFramesView=!0,this.render()},events:function(){return e.extend({},s.prototype.events,{})},render:function(){return this.$el.html(r),this.framesView=new a({el:this.$(".frames-view")}),this},goToFrame:function(t,e,i){this.framesView.goToFrame(t,e,i)},getHeight:function(){return this.$el.outerHeight()-this.framesView.$el.outerHeight()+this.framesView.getHeight()},offsetSkroll:function(t){this.framesView.setupFrames(t+this.$(".frames-above").outerHeight()),this.removeSkrollData();var e=this.getHeight();return this.$el.attr("data-0","top:"+t+"px"),this.skroll_data.push("data-0"),this.$el.attr("data-"+t,"top:0px;"),this.skroll_data.push("data-"+t),t+=e,this.$el.attr("data-"+t,"top:-"+e+"px"),this.skroll_data.push("data-"+t),this.$(".frames-below").css("top",this.framesView.getHeight()+"px"),t},removeSkrollData:function(){var t=this;e.each(this.skroll_data,function(e){t.$el.removeAttr(e),t.$el.removeData(e)}),this.skroll_data=[]}});return h});