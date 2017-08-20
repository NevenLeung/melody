/**
 * Created by Administrator on 2017/8/15.
 */
'use strict';

angular.module('Melody')
    .controller('playerCtrl', ['$scope', 'angularPlayer', '$timeout', function ($scope, angularPlayer, $timeout) {
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
                url: 'http://localhost:3000/confusion-bootstrap/music/SHIROBAKO.mp3',
                time: '3:08',
                favorite: true
            },
            {
                id: 2,
                title: 'TREASURE BOX',
                artist: '奥井雅美',
                url: 'http://localhost:3000/confusion-bootstrap/music/奥井雅美 - 宝箱-TREASURE BOX- (TVアニメ『SHIROBAKO』OPテーマ).mp3',
                time: '3:50',
                favorite: false
            },
            {
                id: 3,
                title: 'COLORFUL BOX',
                artist: '石田燿子',
                url: 'http://localhost:3000/confusion-bootstrap/music/石田燿子 - COLORFUL BOX.mp3',
                time: '3:59',
                favorite: false
            },
            {
                id: 4,
                title: 'Coming Home',
                artist: 'Diddy & Skylar Grey',
                url: 'http://localhost:3000/confusion-bootstrap/music/Diddy、Skylar Grey - Coming Home.mp3',
                time: '3:59',
                favorite: false
            },
            {
                id: 5,
                title: '新世界',
                artist: 'SiS乐印姊妹',
                url: 'http://localhost:3000/confusion-bootstrap/music/SiS乐印姊妹 - 新世界.mp3',
                time: '4:03',
                favorite: false
            },
            {
                id: 6,
                title: 'きみのこえ',
                artist: '川嶋あい',
                url: 'http://localhost:3000/confusion-bootstrap/music/川嶋あい - きみのこえ.mp3',
                time: '5:39',
                favorite: false
            },
            {
                id: 7,
                title: '新世界',
                artist: 'SiS乐印姊妹',
                url: 'http://localhost:3000/confusion-bootstrap/music/SiS乐印姊妹 - 新世界.mp3',
                time: '4:03',
                favorite: false
            },
            {
                id: 8,
                title: '新世界',
                artist: 'SiS乐印姊妹',
                url: 'http://localhost:3000/confusion-bootstrap/music/SiS乐印姊妹 - 新世界.mp3',
                time: '4:03',
                favorite: false
            },
            {
                id: 9,
                title: '新世界',
                artist: 'SiS乐印姊妹',
                url: 'http://localhost:3000/confusion-bootstrap/music/SiS乐印姊妹 - 新世界.mp3',
                time: '4:03',
                favorite: false
            },
            {
                id: 10,
                title: '新世界',
                artist: 'SiS乐印姊妹',
                url: 'http://localhost:3000/confusion-bootstrap/music/SiS乐印姊妹 - 新世界.mp3',
                time: '4:03',
                favorite: false
            }
        ];

        // For the play pause toggle button
        $scope.playIcon = '<span class="fa fa-2x fa-play salmon"></span>';
        $scope.pauseIcon = '<span class="fa fa-2x fa-pause salmon"></span>';

        // the volume slider control

        $scope.sliderOptions = {
            from: 100,
            to: 0,
            step: 10,
            vertical: true,
            callback: function (value) {
                // To adjust the volume
                angularPlayer.adjustVolumeSlider(value);
            }
        };

        $scope.toggleFavorite = function () {
            return $scope.currentPlaying.favorite = !$scope.currentPlaying.favorite;
        };

        // $scope.clickIndex = function (song) {
        //     console.log($scope.playlist);
        //     console.log(angularPlayer.getIndexByValue($scope.playlist, song));
        // };
        
        $scope.spinIcon = function () {
            $scope.spinner = true;
            $timeout(function () {
                $scope.spinner = false
            }, 1000);
        };

        $scope.isOpen = false;
    }])