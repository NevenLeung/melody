/**
 * Created by Administrator on 2017/8/15.
 */
'use strict';

angular.module('Melody', ['ui.router', 'ngResource', 'ngDialog', 'angularSoundManager', 'ngAnimate', 'ngSanitize', 'ui.bootstrap', 'angularAwesomeSlider', 'angular-sortable-view', 'xeditable'])
    .config(function ($stateProvider, $urlRouterProvider, $uibTooltipProvider) {

        // $uibTooltipProvider.options({placement: "bottom-right"});
        $uibTooltipProvider.setTriggers({'mouseenter': 'outsideClick'});

        $stateProvider

        // route for the index.html
            .state('app', {
                url: '/',
                views: {
                    'player': {
                        templateUrl: 'views/player.html',
                        controller: 'PlayerCtrl'
                    },
                    'header': {
                        templateUrl: 'views/header.html',
                        controller: 'HeaderCtrl'
                    },
                    'content': {
                        templateUrl: 'views/home.html',
                        controller: 'HomeCtrl'
                    }
                }
            })

            .state('app.song', {
                url: 'song/:id',
                views: {
                    'content@': {
                        templateUrl: 'views/song-info.html',
                        controller: 'SongCtrl'
                    }
                }
            })

            .state('app.personal', {
                url: 'personal',
                views: {
                    'content@': {
                        templateUrl: 'views/personal-center.html',
                        controller: 'PersonalCtrl'
                    }
                }
            })

            .state('app.user', {
                url: 'user/:id',
                views: {
                    'content@': {
                        templateUrl: 'views/user-info.html',
                        controller: 'UserCtrl'
                    }
                }
            })

            .state('app.artist', {
                url: 'artist/:id',
                views: {
                    'content@': {
                        templateUrl: 'views/artist.html',
                        controller: 'ArtistCtrl'
                    }
                }
            })

            .state('app.about', {
                url: 'about',
                views: {
                    'content@': {
                        templateUrl:'views/about.html'
                    }
                }
            });

        $urlRouterProvider.otherwise('/');


    });
