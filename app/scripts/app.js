/**
 * Created by Administrator on 2017/8/15.
 */
'use strict';

angular.module('Melody', ['ui.router', 'ngResource', 'ngDialog', 'angularSoundManager', 'ngAnimate', 'ngSanitize', 'ui.bootstrap', 'angularAwesomeSlider', 'angular-sortable-view'])
    .config(function ($stateProvider, $urlRouterProvider, $uibTooltipProvider) {
        $stateProvider

        // route for the index.html
            .state('app', {
                url: '/',
                views: {
                    'player': {
                        templateUrl: 'views/player.html',
                        controller: 'playerCtrl'
                    },
                    'header': {
                        templateUrl: 'views/header.html',
                        // controller: ''
                    },
                    'content': {
                        templateUrl: 'views/home.html',
                        controller: 'homeCtrl'
                    }
                }
            });

        $urlRouterProvider.otherwise('/');

        // $uibTooltipProvider.options({placement: "bottom-right"});
        $uibTooltipProvider.setTriggers({'mouseenter': 'outsideClick'});
    });
