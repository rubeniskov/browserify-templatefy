angular
  .module('module', [])
  .run(['$stateProvider', function($stateProvider){
      //$stateProvider.state();
      require('./template.b.html');
  }])
  .name
