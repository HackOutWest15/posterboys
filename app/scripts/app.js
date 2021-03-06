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
    'spotify',
    'colorpicker.module'
  ])
  .config(function ($routeProvider, $locationProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });

    $locationProvider.html5Mode(false).hashPrefix('!');

  });
