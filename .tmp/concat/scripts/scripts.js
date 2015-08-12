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
  .config(["$routeProvider", "$locationProvider", function ($routeProvider, $locationProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });

    $locationProvider.html5Mode(true).hashPrefix('!');

  }]);

'use strict';

angular.module('posterboyApp').
  service('echonestApiService', ["$q", "$http", function ($q, $http) {
    var echonest = this;

    echonest.apiKey = 'FO7DBKI3Y5L8P4DGY';
    echonest.baseUrl = 'https://developer.echonest.com/api/v4/';

    echonest.getArtistImages = function(artistId) {
      return $http({
        method: 'GET',
        url: echonest.baseUrl + 'artist/images?api_key=' + echonest.apiKey + '&id=spotify:artist:' + artistId
      })
    };

    echonest._getRandomImage = function(imagesResponse) {
      var images = imagesResponse.data.response.images;
      var randomIndex = Math.floor(Math.random() * images.length);
      return images[randomIndex];
    }

    echonest.getRandomArtistImage = function(artistId) {
      var imageUrl = $q.defer();

      echonest.getArtistImages(artistId).then(function (imagesResponse) {
        if (imagesResponse.status == 200 && imagesResponse.data.response.images) {
          var image = echonest._getRandomImage(imagesResponse);
          imageUrl.resolve(image.url);
        }
      })

      return imageUrl.promise;
    }
  }]);

'use strict';

/**
 * @ngdoc function
 * @name posterboyApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the posterboyApp
 */
angular.module('posterboyApp')
  .controller('MainCtrl', ["$q", "MusixService", "Spotify", "echonestApiService", function ($q, MusixService, Spotify, echonestApiService) {
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

    ctrl.generateImg = function (format) {
      var poster = document.getElementById('poster');
      /// var originalWidth = poster.width;
      /// var originalHeight = poster.height;
      angular.element(poster).addClass('format-' + format);
      window.html2canvas(poster, {
        allowTaint: true,
        logging: true,
        proxy: 'https://immense-ridge-3213.herokuapp.com/proxy.php'
      }).then(function(canvas) {
        var posterWindow = window.open();
        posterWindow.document.write('<canvas id="poster" width="' + canvas.width + '" height="' + canvas.height + '"></canvas>');
        var newCanvas = posterWindow.document.getElementById('poster');
        var newCtx = newCanvas.getContext('2d');
        newCtx.drawImage(canvas, 0, 0);
        angular.element(poster).removeClass('format-' + format);
        // DO SOMETHING WITH CANVAS
        console.log(ctrl);
      }, function() {
        window.alert('An error occured!');
      });
    };

  }]);

'use strict';

angular.module('posterboyApp')
  .service('MusixService', ["$http", function ($http) {
    var musix = this;
    var echonestKey = 'VOEYVDVQ84HIHMU04';

    musix.getMusixId = function (spotifyId) {
      return $http.get('http://developer.echonest.com/api/v4/song/profile?api_key=' + echonestKey + '&format=json&track_id=spotify:track:' + spotifyId + '&bucket=id:musixmatch-WW');
    };

    musix.getLyrics = function (trackId) {
      var url = 'http://api.musixmatch.com/ws/1.1/track.lyrics.get?format=jsonp&callback=JSON_CALLBACK&apikey=6929f9543219d0a92f18a3a088f19000&track_id=';
      return $http.jsonp(url + trackId);
    };
  }]);
