'use strict';

/**
 * @ngdoc function
 * @name posterboyApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the posterboyApp
 */
angular.module('posterboyApp')
  .controller('MainCtrl', function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });
