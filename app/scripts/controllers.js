/**
 * Created by Administrator on 2017/8/15.
 */
'use strict';

angular.module('Melody')
    .controller('playerCtrl', ['$scope' ,function ($scope) {
        $scope.songs = [
            // {
            //     id: 1,
            //     title: 'Take My Hand',
            //     artist: 'Simple Plan',
            //     url: 'http://ws.stream.qqmusic.qq.com/425607.m4a'
            // },
            // {
            //     id: 2,
            //     title: 'Saturday',
            //     artist: 'Simple Plan',
            //     url: 'http://ws.stream.qqmusic.qq.com/102695318.m4a'
            // },
            // {
            //     id: 3,
            //     title: 'Jet Lag',
            //     artist: 'Simple Plan',
            //     url: 'http://ws.stream.qqmusic.qq.com/104796357.m4a'
            // }

            // The links above in qqmusic are unable, so I use json-server to serve local music file to test.

            {
                id: 1,
                title: 'SHIROBAKO',
                artist: 'Unknown',
                url: 'http://localhost:3000/confusion-bootstrap/music/SHIROBAKO.mp3'
            },
            {
                id: 2,
                title: 'TREASURE BOX',
                artist: '奥井雅美',
                url: 'http://localhost:3000/confusion-bootstrap/music/奥井雅美 - 宝箱-TREASURE BOX- (TVアニメ『SHIROBAKO』OPテーマ).mp3'
            },
            {
                id: 3,
                title: 'COLORFUL BOX',
                artist: '石田燿子',
                url: 'http://localhost:3000/confusion-bootstrap/music/石田燿子 - COLORFUL BOX.mp3'
            }
        ];

        $scope.isOpen = false;
    }])