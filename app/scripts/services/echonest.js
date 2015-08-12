'use strict';

angular.module('posterboyApp').
  service('echonestApiService', function ($q, $http) {
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
  });
