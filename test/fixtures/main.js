angular
  .module('main', [
    require('test-templates'),
    require('module.a')
  ])
  .run(function(){
      require('./template.a.html')
  })
  .name;
