define(["jquery","underscore","backbone","views/ChartView","text!templates/tacticsTemplate.html"],function(e,t,n,i,r){var a=i.extend({initialize:function(){this.render()},events:{},render:function(){return this.$el.html(t.template(r)({})),this}});return a});