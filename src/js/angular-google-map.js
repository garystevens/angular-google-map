(function() {
	'use strict';

	angular
		.module('angular-google-map', [])
        .service('loadGoogleMapAPI', loadGoogleMapAPI)
		.directive('googleMap', googleMap);

    /** @ngInject */
    function loadGoogleMapAPI($window, $rootScope, $document){
        var Service = {};
        Service.ready = false;
        var script = $document[0].createElement('script');
        script.type = 'text/javascript';
        script.async = true;
        script.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyB_LF646F92I172yLqMe-lMXdhbcCx6umk&callback=mapready';
        $document[0].getElementsByTagName('head')[0].appendChild(script);

        $window.mapready = function(){
            $rootScope.$apply(function () {
                Service.ready = true;
            });
        };

        return Service;
    }

	/** @ngInject */
	function googleMap(loadGoogleMapAPI) {

        return {
            restrict: 'E',
            scope: {
                lat: '=',
                long: '=',
                zoom: '=',
                mapType: '=',
                disableDoubleClickZoom: '=',
                disableDefaultUi: '=',
                fullscreenControl: '=',
                clickableIcons: '=',
                draggable: '=',
                mapTypeControl: '=',
                streetViewControl: '=',
                scrollwheel: '=',
                zoomControl: '=',
                customMapName: '=',
                mapTypeControlOptionsStyle: '=',
                mapTypeControlOptionsPosition: '=',
                zoomControlOptions: '=',
                streetViewControlOptions: '=',
                fullscreenControlOptions: '=',
                customCss: '@'
            },
            template: '<div id="{{ templateId }}" class="{{ customCss }}" style="{{ height }}"></div>',
            link: function($scope, element, attributes){

                var lat = parseFloat($scope.lat) || 0;
                var long = parseFloat($scope.long) || 0;
                var zoom = parseInt($scope.zoom) || 8;
                var mapType = ($scope.mapType !== undefined ? ($scope.mapType).toUpperCase() : "ROADMAP");
                var customMapName = ($scope.customMapName === undefined ? "Custom Map" : $scope.customMapName);
                var mapTypeControlOptionsStyle = ($scope.mapTypeControlOptionsStyle !== undefined ? ($scope.mapTypeControlOptionsStyle).toUpperCase() : "DEFAULT");
                var mapTypeControlOptionsPosition = ($scope.mapTypeControlOptionsPosition !== undefined ? ($scope.mapTypeControlOptionsPosition).toUpperCase() : "TOP_LEFT");
                var zoomControlOptions = ($scope.zoomControlOptions !== undefined ? ($scope.mapTypeControlOptionsStyle).toUpperCase() : "BOTTOM_RIGHT");
                var streetViewControlOptions = ($scope.streetViewControlOptions !== undefined ? ($scope.streetViewControlOptions).toUpperCase() : "RIGHT_BOTTOM");
                var fullscreenControlOptions = ($scope.fullscreenControlOptions !== undefined ? ($scope.fullscreenControlOptions).toUpperCase() : "TOP_RIGHT");

                var disableDoubleClickZoom = Boolean($scope.disableDoubleClickZoom);
                var disableDefaultUI = Boolean($scope.disableDefaultUi);
                var fullscreenControl = Boolean($scope.fullscreenControl);

                var clickableIcons = ($scope.clickableIcons !== undefined ? $scope.clickableIcons: true);

                var draggable = ($scope.draggable === false  ? false: true);
                var mapTypeControl = ($scope.mapTypeControl === false ? false: true);
                var streetViewControl = ($scope.streetViewControl === false ? false: true);
                var scrollwheel = ($scope.scrollwheel === false ? false: true);
                var zoomControl = (attributes.zoomControl === false ? false: true);

                var mapArrays = ['roadmap', 'satellite', 'hybrid', 'terrain', 'styled_map'];

                var map;

                var generateMapID = function () {
                    return 'map_' + ($scope.$id*Math.random()).toString(36).substr(2, 9);
                };

                $scope.googlemap = loadGoogleMapAPI;
                $scope.templateId = generateMapID();

                if($scope.customCss === undefined){
                    $scope.height = "height: 400px;";
                }

                $scope.$watch(
                    function() {
                        return $scope.googlemap.ready;
                    },
                    function(newValue, oldValue) {
                        if ( newValue !== oldValue ) {
                            createMap();
                        }
                    }
                );

                function createMap(){
                    map = new google.maps.Map(document.getElementById($scope.templateId), {
                        center: {
                            lat: lat,
                            lng: long
                        },
                        clickableIcons: clickableIcons,
                        disableDoubleClickZoom: disableDoubleClickZoom,
                        disableDefaultUI: disableDefaultUI,
                        draggable: draggable,
                        fullscreenControl: fullscreenControl,
                        mapTypeControl: mapTypeControl,
                        scrollwheel: scrollwheel,
                        streetViewControl: streetViewControl,
                        zoom: zoom,
                        zoomControl: zoomControl,
                        mapTypeId: google.maps.MapTypeId[mapType],
                        zoomControlOptions: {
                            position: google.maps.ControlPosition[zoomControlOptions]
                        },
                        mapTypeControlOptions: {
                            style: google.maps.MapTypeControlStyle[mapTypeControlOptionsStyle],
                            position: google.maps.ControlPosition[mapTypeControlOptionsPosition],
                            mapTypeIds: mapArrays
                        },
                        streetViewControlOptions: {
                            position: google.maps.ControlPosition[streetViewControlOptions]
                        },
                        fullscreenControlOptions: {
                            position: google.maps.ControlPosition[fullscreenControlOptions]
                        }
                    });

                    if($scope.customMapStyles && Array.isArray($scope.customMapStyles)){
                        var styledMapType = new google.maps.StyledMapType($scope.customMapStyles, {name: customMapName});
                        map.mapTypes.set('styled_map', styledMapType);
                        map.setMapTypeId('styled_map');
                    }
                }
            }
        };
	}



})();
