'use strict';

angular.module('posterboyApp').
  service('flickrApiService', function ($q, $http) {
    var flickr = this;

    flickr.apiKey = '3da5fccf998aac87d6e78697d84d98ec';
    flickr.baseUrl = 'https://api.flickr.com/services/rest/?format=json&nojsoncallback=1&api_key=' + flickr.apiKey;

    /**
     * @param text
     * @returns {*}
     */
    flickr.searchPhotos = function(text) {
      return $http({
        method: 'GET',
        url: flickr.baseUrl + '&method=flickr.photos.search&content_type=1&text=' + text
      })
    }

    /**
     * @param photoId
     * @returns {*}
     */
    flickr.getSizes = function(photoId) {
      return $http({
        method: 'GET',
        url: flickr.baseUrl + '&method=flickr.photos.getSizes&photo_id=' + photoId
      })
    }

    /**
     * Get random image from API search results
     *
     * @param searchResponse
     * @returns array
     * @private
     */
    flickr._getRandomImage = function(searchResponse) {
      var photos = searchResponse.data.photos.photo;
      if (photos.length > 0) {
        var randomIndex = Math.floor(Math.random() * photos.length);
        return photos[randomIndex];
      }
    }

    /**
     * Get URL of the "large" version of an image from results of API call getSizes
     *
     * @param sizesResponse
     * @returns string Image url
     * @private
     */
    flickr._getSizeLargeUrl = function(sizesResponse) {
      var sizes = sizesResponse.data.sizes.size;

      if (sizes.length > 0) {
        for (var i = 0; i < sizes.length; i++) {
          if (sizes[i].label == 'Large') {
            return sizes[i].source;
          }
        }
      }
    }

    /**
     * Get URL of a random large photo matching text
     *
     * @param text
     * @returns string Image url
     */
    flickr.getRandomLargePhoto = function(text) {
      var imageUrl = $q.defer();

      flickr.searchPhotos(text)
        .then(function(searchResponse) {
          var image = flickr._getRandomImage(searchResponse);

          if (image) {
            flickr.getSizes(image.id)
              .then(function(sizesResponse) {
                var url = flickr._getSizeLargeUrl(sizesResponse);

                if (url) {
                  imageUrl.resolve(url);
                } else {
                  imageUrl.reject();
                }
              });
          }
      });

      return imageUrl.promise;
    }
  });
