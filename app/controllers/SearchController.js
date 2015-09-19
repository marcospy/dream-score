/**
 * Search Controller
 * @namespace Controllers
 */
(function(){

'use strict';

angular
  .module('App')
  .controller('SearchController', SearchController)

  SearchController.$inject = ['$scope', '$http', '$routeParams', 'uiGmapGoogleMapApi'];

  /**
   * @namespace SearchController
   * @desc Controller for the chapter route
   * @memberOf Controllers
   */
  function SearchController($scope, $http, $routeParams, uiGmapGoogleMapApi) {
    $scope.loc = $routeParams.location;

    var initialCenter = {
      latitude: -23.5534084,
      longitude: -46.6577078
    };

    $http.get('http://houserank.felipevr.com/geocode?name=' + $scope.loc).then(
      function(response) {
        var lat = response.data.lat;
        var lng = response.data.lng;
        var initialCenter = {
          latitude: lat,
          longitude: lng
        };
        $scope.map = { center: initialCenter, zoom: 13 };
        $scope.c =
          {
            id: 0,
            center: { latitude: lat,
          longitude: lng},
            radius: 2500,
            stroke: {
                color: '#08B21F',
                weight: 2,
                opacity: 1
            },
            fill: {
                color: '#08B21F',
                opacity: 0.1
            },
            geodesic: true,
            draggable: true,
            clickable: true,
            editable: true,
            visible: true,
            control: {}
          };

      }
    );

    $scope.hoverIn = function(id) {
      var el = $scope.markers[id];
      $scope.map = { center: {latitude: el.coords.latitude, longitude: el.coords.longitude }, zoom: 13 };
      el.options.animation = '1';
    }

    $scope.hoverOut = function(id) {
      var el = $scope.markers[id];
      el.options.animation = '0';
    }

    $scope.applyFilters= function() {
      var dict = {
        grocery_or_supermarket: $scope.grocery_or_supermarket,
        hospital: $scope.hospital,
        bar: $scope.bar,
        gym: $scope.gym,
        school: $scope.school
      };
      $http.get('http://177.8.106.72/HouseRank/public/search?x=' + $scope.c.center.latitude + '&y=' + $scope.c.center.longitude + '&r=' + $scope.c.radius + '&types=grocery_or_supermarket,hospital,bar,gym,school&weights=' + $scope.grocery_or_supermarket + ',' + $scope.hospital + ',' + $scope.bar + ',' + $scope.gym + ',' + $scope.school).then(
        function(response) {
          var markers = [];
          response.data.forEach(function(element, index){
            var marker = {};
            marker.id = index;
            marker.title = element.title;
            marker.siteUrl = element.siteUrl;
            marker.thumbnail = element.thumbnails[0];
            marker.salePrice = element.salePrice;
            marker.legend = element.legend;
            marker.coords = { latitude: element.latitude, longitude: element.longitude };
            marker.options = {
              draggable: false,
              labelContent: "R$"+element.salePrice,
              labelAnchor: "20 70",
              labelClass: "marker-labels"
            };
            markers.push(marker);
            $scope.markers = markers;
          });
        }
      );
    };

  }

})();
