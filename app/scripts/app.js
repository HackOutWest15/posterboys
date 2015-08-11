'use strict';

/**
 * @ngdoc overview
 * @name posterboyApp
 * @description
 * # posterboyApp
 *
 * Main module of the application.
 */
angular
  .module('posterboyApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'spotify'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
