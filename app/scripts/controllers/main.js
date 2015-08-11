'use strict';

/**
 * @ngdoc function
 * @name posterboyApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the posterboyApp
 */
angular.module('posterboyApp')
  .controller('MainCtrl', function (MusixService, Spotify) {

    var ctrl = this;

    ctrl.things = ['lol', 'boll', 'hej'];

    // Default poster vars
    ctrl.poster = {
      lyrics: ['I’m living the future so the present is my past'], // i'm thinking an array of lyrics lines?
      quoteIndex: 0, // index of array to pick quote line
      artist: 'Kanye West',
      track: 'Monster',
      artistImageUrl: 'http://uptownmagazine.com/files/2015/01/People-Kanye_West.jpg'
    };

    // Quotes poster controls
    ctrl.quoteNext = function () {
      if((ctrl.poster.quoteIndex + 1) < ctrl.poster.lyrics.length) {
        ctrl.poster.quoteIndex = ctrl.poster.quoteIndex + 1;
        console.log(ctrl.poster.quoteIndex);
      }
    };

    ctrl.quotePrev = function () {
      if((ctrl.poster.quoteIndex - 1) >= 0) {
        ctrl.poster.quoteIndex = ctrl.poster.quoteIndex - 1;
      }
    };

    ctrl.getInfo = function (trackId) {

      /* Get track ID from URI or link (or none) */
      trackId = trackId.split(':').slice(-1)[0].split('/').slice(-1)[0];
      console.log(trackId);

      /* Get track artist and name */
      Spotify.getTrack(trackId).then(function(response) {
        console.log(response);
        ctrl.poster.track = response.name;
        ctrl.poster.artist = response.artists[0].name;
        ctrl.poster.artistImageUrl = response.album.images[0].url;
      });

      /* Get lyrics */
      MusixService.getMusixId(trackId).then(function(response) {
        if(response && response.data && response.data.response && response.data.response.songs) {
          var musixId = response.data.response.songs[0].foreign_ids[0].foreign_id.split(':').slice(-1)[0];
          MusixService.getLyrics(musixId).then(function(response) {
            if(response && response.data && response.data.message && response.data.message.body
              && response.data.message.body.lyrics) {
                ctrl.poster.lyrics = response.data.message.body.lyrics.lyrics_body.match(/[^\r\n]+/g);
                console.log(ctrl.poster.lyrics);
              } else {
                console.log('error'); // TODO: BETTER ERROR HANDLING
              }
          });
        }
      });


    };

  });
