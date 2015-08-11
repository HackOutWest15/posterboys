'use strict';

/**
 * @ngdoc function
 * @name posterboyApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the posterboyApp
 */
angular.module('posterboyApp')
  .controller('MainCtrl', function () {

    var ctrl = this;

    ctrl.things = ['lol', 'boll', 'hej'];

    ctrl.generatePoster = function () {
      // DO LOGIC HERE
      console.log('lol!');
    };

  });
