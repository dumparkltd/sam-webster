define([
  'jquery',  'underscore',  'backbone'
], function($,_, Backbone) {
  
  var AppModel = Backbone.Model.extend({
    initialize : function(){
      this.chapters = {};      
      this.chapterCounter = 0;
      this.set('userScrolling',true);
    },
    addChapter : function(id,view){
      this.chapters[id] = {view:view,index:this.chapterCounter,id:id};
      this.chapterCounter++;      
    },
    getChapter : function() {      
      return this.getChapterByID(this.get('chapter-id'));
    },
    getChapterByID : function(id) {      
      return (id in this.chapters) ? this.chapters[id] : undefined;                  
    },    
    getNextChapterID : function() {         
      var next = _.findWhere(this.chapters, {index:this.getChapter().index+1});
      return (typeof next !== 'undefined') ? next.id : '';      
    }
  });
  
  return AppModel;

});
