'use strict';

/**
 * @ngdoc function
 * @name posterboyApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the posterboyApp
 */
angular.module('posterboyApp')
  .controller('AboutCtrl', function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });
