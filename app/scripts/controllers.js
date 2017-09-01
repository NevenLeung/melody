/**
 * Created by Administrator on 2017/8/15.
 */
'use strict';

angular.module('Melody')
    .controller('PlayerCtrl', ['$scope', 'angularPlayer', '$timeout', function ($scope, angularPlayer, $timeout) {

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
        $scope.playIcon = '<span class="fa fa-2x fa-play player-icon"></span>';
        $scope.pauseIcon = '<span class="fa fa-2x fa-pause player-icon"></span>';

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

    .controller('HeaderCtrl', ['$scope', 'ngDialog', '$rootScope', function ($scope, ngDialog, $rootScope) {

        $scope.isLogin= false;

        $scope.avatar = 'images/avatar001.jpg';

        $scope.openRegisterModal = function () {
            ngDialog.open({
                template: 'views/register.html',
                scope: $scope,
                className: 'ngdialog-theme-default',
                controller:"RegisterCtrl"
            });
            // $scope.isLogin = true;
        };

        $scope.openLoginModal = function () {
            ngDialog.open({
                template: 'views/login.html',
                scope: $scope,
                className: 'ngdialog-theme-default',
                controller:"LoginCtrl"
            });
        };

        $scope.doLogout = function () {
            $scope.isLogin = false;
            // $scope.userName = '';
        };

        $rootScope.$on('login:Successful', function () {
            $scope.isLogin = true;
        });

        $rootScope.$on('registration:Successful', function () {
            $scope.isLogin = true;
        });

        $scope.stateIs = function(curstate) {
            return $state.is(curstate);
        };

        $scope.avatarList = ['005.jpg', '007.jpg', '010.jpg', '017.jpg', '019.jpg'];
    }])

    .controller('LoginCtrl', ['$scope', 'ngDialog', '$rootScope', function ($scope, ngDialog, $rootScope) {

        $scope.doLogin = function () {
            // $scope.isLogin = true;
            ngDialog.close();
            $rootScope.$broadcast('login:Successful');
        }

    }])

    .controller('RegisterCtrl', ['$scope', 'ngDialog', '$rootScope', function ($scope, ngDialog, $rootScope) {

        $scope.doRegistration = function () {
            // $scope.isLogin = true;
            ngDialog.close();
            $rootScope.$broadcast('registration:Successful');
        };

        // console.log( $scope.$parent);

    }])

    .controller('HomeCtrl', ['$scope', function ($scope) {

        $scope.albumPhoto = "images/album/shirobako.jpg";


    }])

    .controller('PersonalCtrl', ['$scope', '$timeout', function ($scope, $timeout) {

        $scope.userPhoto = 'images/avatar001.jpg';
        $scope.userName = 'Neven';
        $scope.introduction = 'An interesting guy';

        $scope.songs = [
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
            }
        ];

        $scope.removeOneFromFav = function (item) {
            $scope.songs.splice($scope.songs.indexOf(item), 1);
        };

        $scope.removeAllFromFav = function () {
            $scope.songs = [];
        };

        $scope.log = function () {
            console.log($scope.userName);
            console.log($scope.introduction);
        };

        $scope.saveUserInfo = function () {
            // make a put request to server to save information
            console.log('save');
        };
        
        $scope.checkIsEmpty =function (data) {
            console.log('here');
            if (data == '') return 'User name can not be empty!';
        };
        // $timeout(function () {
        //     var id = document.getElementById('fav');
        //     var log = id.style;
        //     console.log(log);
        // }, 0);


    }])

    .controller('UserCtrl', ['$scope', 'angularPlayer', function ($scope, angularPlayer) {

        $scope.userPhoto = 'images/avatar001.jpg';
        $scope.userName = 'Neven';
        $scope.introduction = 'An interesting guy';

        $scope.songs = [
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
            }
        ];

        $scope.playFavList = function () {
            angularPlayer.clearPlaylist(function () {
                console.log('Playlist is clear.')
            });
            // angularPlayer.addToPlaylist()
            // angularPlayer.play();
            // console.log(angularPlayer.getPlaylist());
            // angularPlayer.pause();
        };



    }])

    .controller('ArtistCtrl', ['$scope', function ($scope) {

        $scope.artistPhoto = "images/artist/simple-plan.jpg";
        $scope.artistName = 'Simple plan';
        $scope.introduction = 'Simple Plan is a Canadian rock band from Montreal, Quebec.Simple Plan \'s style of music has been described as pop punk, alternative rock, pop rock, punk rock, and power pop. Atlantic Records marketing material has described the band \'s style as having "classic punk energy and modern pop sonics". Simple Plan \'s music style has also been described as: "emo".';
        $scope.recommended = 'Untitled, Take my hand.';

    }])


