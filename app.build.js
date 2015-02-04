({
    appDir: "./",
    baseUrl: "app",
    dir: "../sam-webster-dep/deploy",
    paths: {
    'jquery': 'libs/jquery',
    'underscore': 'libs/underscore',
    'backbone': 'libs/backbone',
    'skrollr': 'libs/skrollr.min',     
    'templates': 'templates'
    },  
    modules: [
      {
          name: "main"
      }
    ],
    optimize: "uglify2", 
    uglify2: {        
      mangle: true
    },    
    optimizeCss: "standard",
    inlineText: true
 
})