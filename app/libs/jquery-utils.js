define(["jquery"], 
function ($) {
  /*
    * .addClassSVG(className)
    * Adds the specified class(es) to each of the set of matched SVG elements.
    */
   $.fn.addClassSVG = function(className){
      $(this).attr('class', function(index, existingClassNames) {
          return existingClassNames + ' ' + className;
      });
      return this;
   };

   /*
    * .removeClassSVG(className)
    * Removes the specified class to each of the set of matched SVG elements.
    */
   $.fn.removeClassSVG = function(className){
      $(this).attr('class', function(index, existingClassNames) {
          var re = new RegExp(className, 'g');
          return existingClassNames.replace(re, '');
      });
      return this;
   };
  
    return true;
    

});