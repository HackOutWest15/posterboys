'use strict';

/**
 * @ngdoc function
 * @name posterboyApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the posterboyApp
 */
angular.module('posterboyApp')
  .controller('MainCtrl', function ($q, MusixService, Spotify, echonestApiService) {
    var ctrl = this;

    ctrl.STEP_CREATE = 0;
    ctrl.STEP_CUSTOMIZE = 1;
    ctrl.STEP_SAVE = 2;

    ctrl.step = 0;
    ctrl.isLoading = false;

    // Default poster vars
    ctrl.poster = {
      lyrics: ['I’m living the future so the present is my past'], // i'm thinking an array of lyrics lines?
      quoteIndex: 0, // index of array to pick quote line
      artist: 'Kanye West',
      track: 'Monster',
      artistImageUrl: 'http://uptownmagazine.com/files/2015/01/People-Kanye_West.jpg',
      showArtist: true,
      showTitle: true,
      showBorder: true,
      fontSize: 4,
      quoteFontFamily: 'Oswald',
      artistTitleFontFamily: 'Oswald',
      bgTint: 'rgba(0, 0, 0, 0.65)'
    };

    // Quotes poster controls
    ctrl.quoteNext = function () {
      if((ctrl.poster.quoteIndex + 1) < ctrl.poster.lyrics.length) {
        ctrl.poster.quoteIndex = ctrl.poster.quoteIndex + 1;
      }
    };

    ctrl.quotePrev = function () {
      if((ctrl.poster.quoteIndex - 1) >= 0) {
        ctrl.poster.quoteIndex = ctrl.poster.quoteIndex - 1;
      }
    };

    ctrl.changeImage = function() {
      ctrl.isLoading = true;
      echonestApiService.getRandomArtistImage(ctrl.poster.artistId).then(function(imageUrl) {
        ctrl.poster.artistImageUrl = imageUrl;
      });
      ctrl.isLoading = false;
    };

    ctrl.loadingPoster = {};

    ctrl.getInfo = function (trackId, preset) {

      ctrl.isLoading = true;

      /* Get track ID from URI or link (or none) */
      trackId = trackId.split(':').slice(-1)[0].split('/').slice(-1)[0];

      /* Create track artist, name and musixId promises */
      var trackInfoPromise = Spotify.getTrack(trackId);
      var musixIdPromise = MusixService.getMusixId(trackId);

      /* Run promises and wait for all */
      $q.all([trackInfoPromise, musixIdPromise]).then(function(response) {
        ctrl.loadingPoster.track = response[0].name;
        ctrl.loadingPoster.artist = response[0].artists[0].name;
        ctrl.loadingPoster.artistId = response[0].artists[0].id;

        /* Create Echonest image promise */
        var echoImgPromise = echonestApiService.getRandomArtistImage(ctrl.loadingPoster.artistId);
        var lyricsPromise;

        if(response[1] && response[1].data && response[1].data.response && response[1].data.response.songs) {
          var musixId = response[1].data.response.songs[0].foreign_ids[0].foreign_id.split(':').slice(-1)[0];

          /* Create lyrics promise */
          lyricsPromise = MusixService.getLyrics(musixId);
        }

        $q.all([echoImgPromise, lyricsPromise]).then(function(response) {
          ctrl.loadingPoster.artistImageUrl = response[0];

          if(response[1] && response[1].data && response[1].data.message && response[1].data.message.body
            && response[1].data.message.body.lyrics) {
              ctrl.loadingPoster.lyrics = response[1].data.message.body.lyrics.lyrics_body.match(/[^\r\n]+/g);
            } else {
              console.log('error parsing lyric response: ' + response[1]); // TODO: BETTER ERROR HANDLING
            }

          ctrl.poster.track = ctrl.loadingPoster.track;
          ctrl.poster.artist = ctrl.loadingPoster.artist;
          ctrl.poster.artistId = ctrl.loadingPoster.artistId;
          ctrl.poster.artistImageUrl = ctrl.loadingPoster.artistImageUrl;
          ctrl.poster.lyrics = ctrl.loadingPoster.lyrics;

          if(preset) {
            ctrl.poster.quoteIndex = preset;
          } else {
            ctrl.poster.quoteIndex = 0;
          }

          ctrl.isLoading = false;
        });
      });
    };

  });
