/**
 * Created by Administrator on 2017/8/15.
 */
'use strict';

angular.module('Melody', ['ui.router', 'ngResource', 'ngDialog', 'angularSoundManager', 'ngAnimate', 'ngSanitize', 'ui.bootstrap', 'angularAwesomeSlider'])
    .config(function ($stateProvider, $urlRouterProvider, $uibTooltipProvider) {
        $stateProvider

        // route for the index.html
            .state('app', {
                url: '/',
                views: {
                    'header': {
                        templateUrl: '',
                        // controller: ''
                    },
                    // 'content': {
                    //     templateUrl: '',
                    //     // controller: ''
                    // },
                    // 'playlist': {
                    //     templateUrl: '',
                    //     // controller: ''
                    // },
                    'player': {
                        templateUrl: 'views/player.html',
                        controller: 'playerCtrl'
                    }
                }
            });

        $urlRouterProvider.otherwise('/');

        // $uibTooltipProvider.options({placement: "bottom-right"});
        $uibTooltipProvider.setTriggers({'mouseenter': 'outsideClick'});
    });
