'use strict';

angular.module('posterboyApp')
  .service('MusixService', function ($http) {
    var musix = this;
    var echonestKey = 'VOEYVDVQ84HIHMU04';

    musix.getMusixId = function (spotifyId) {
      return $http.get('http://developer.echonest.com/api/v4/song/profile?api_key=' + echonestKey + '&format=json&track_id=spotify:track:' + spotifyId + '&bucket=id:musixmatch-WW');
    };

    musix.getLyrics = function (trackId) {
      var url = 'http://api.musixmatch.com/ws/1.1/track.lyrics.get?format=jsonp&callback=JSON_CALLBACK&apikey=6929f9543219d0a92f18a3a088f19000&track_id=';
      return $http.jsonp(url + trackId);
    };
  });
