define([
  'jquery','underscore','backbone',  
  'text!templates/winTemplate.html'
], function($, _, Backbone, template){

  var IntroView = Backbone.View.extend({
    initialize : function(){
      this.skroll_data = [];
      this.render();
    },       
    events : {
    },    
    render: function(){         
      this.$el.html(template);
      return this;
   },
    getHeight : function(){
      return this.$el.outerHeight();
    },  
    offsetSkroll: function(offset_top){
      this.removeSkrollData();
      var offset = this.getHeight();      
      this.$el.attr('data-0','top:'+ offset_top +'px');
      this.skroll_data.push('data-0');
      this.$el.attr('data-'+offset_top,'top:0px;');
      this.skroll_data.push('data-'+offset_top);
      offset_top += offset;  
      this.$el.attr('data-'+offset_top,'top:-'+offset+'px');   
      this.skroll_data.push('data-'+offset_top);      
      return offset_top;
    },     
    removeSkrollData : function(){
      var that = this;
      _.each(this.skroll_data,function(sd){
        that.$el.removeAttr(sd);
        that.$el.removeData(sd);
      });
      this.skroll_data = [];
      
    }               
  });

  return IntroView;
  
});