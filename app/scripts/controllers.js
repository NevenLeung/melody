/**
 * Created by Administrator on 2017/8/15.
 */
'use strict';

angular.module('Melody')
    .controller('PlayerCtrl', ['$scope', 'angularPlayer', '$timeout', '$rootScope', 'songFactory', function ($scope, angularPlayer, $timeout, $rootScope, songFactory) {

        refreshPlaylist();

        $scope.baseUrl = 'http://localhost:3000/';

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
                // $scope.volume = value;
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
            angularPlayer.stop();
            angularPlayer.setCurrentTrack(null);

            angularPlayer.clearPlaylist(function () {
                // console.log('Playlist is clear.');
            });

            $timeout(refreshPlaylist, 200);
            $scope.spinner = true;
            $timeout(function () {
                $scope.spinner = false
            }, 1000);
        };

        $scope.isOpen = false;

        //console.log($scope.currentPlaying);
        $scope.changeSong = function () {
            $rootScope.$broadcast('songChange', $scope.currentPlaying);
        };

        $rootScope.$on('player:playlist', function (event, data) {
            if (data.length === 0) {
                $scope.displayInfo = false;
            }
        });

        function random(n) {
            return Math.floor(Math.random() * n);
        }

        function refreshPlaylist() {
            // songFactory.song.query(
            //     function (response) {
            //         // To generate 5 random songs from database
            //         var unique = {};
            //         for( var i = 0; Object.keys(unique).length < 34; i++) {
            //             // To make the song unique
            //             // unique[JSON.stringify(response[random(response.length)])] = i;
            //             unique[JSON.stringify(response.data[random(response.total)])] = i;
            //         }
            //         $scope.songs = Object.keys(unique).map(function (str) {
            //             return JSON.parse(str);
            //         });
            //         // To add the songs to playlist
            //         angular.forEach($scope.songs, function (value) {
            //             angularPlayer.addTrack(value);
            //         });
            //         angularPlayer.play();
            //         $rootScope.$broadcast('songChange');
            //
            //         // the current playing info display flag
            //         $scope.displayInfo = true;
            //     },
            //     function (err) {
            //         console.log(err);
            //     }
            // );
            songFactory.song.get({},
                function (response) {
                    // console.log('response:');
                    // console.log(response);

                    // To generate 5 random songs from database
                    var unique = {};
                    for( var i = 0; Object.keys(unique).length < 34; i++) {
                        // To make the song unique
                        // unique[JSON.stringify(response[random(response.length)])] = i;
                        unique[JSON.stringify(response.data[random(response.total)])] = i;
                    }
                    $scope.songs = Object.keys(unique).map(function (str) {
                        return JSON.parse(str);
                    });
                    // console.log('songs:');
                    // console.log($scope.songs);

                    // To add the songs to playlist
                    angular.forEach($scope.songs, function (value) {
                        value.id = value._id;
                        value.url = $scope.baseUrl + 'music/' + value.url;
                        angularPlayer.addTrack(value);
                    });
                    angularPlayer.play();
                    $rootScope.$broadcast('songChange');

                    // console.log('Current playing:');
                    // console.log(angularPlayer.currentTrackData());
                    // console.log(angularPlayer.currentPlaying);

                    // the current playing info display flag
                    $scope.displayInfo = true;
                },
                function (err) {
                    console.log(err);
                }
            );
        }
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

    .controller('HomeCtrl', ['$scope', 'angularPlayer', '$rootScope', '$timeout', function ($scope, angularPlayer, $rootScope, $timeout) {

        // $scope.baseUrl = 'http://localhost:3000/confusion-bootstrap/';
        $scope.baseUrl = 'http://localhost:3000/';


        // $scope.musicName = 'SHIROBAKO insert music';
        // $scope.albumName = 'Unknow';
        // $scope.albumPhoto = "images/album/shirobako.jpg";
        // $scope.singerName = 'Unknow';

        // console.log(angularPlayer.currentTrackData());

        // $timeout(updateHomeInfo, 200);
        updateHomeInfo();

        $rootScope.$on('songChange', function (event, data) {
            // console.log(data);
            updateHomeInfo();
        });

        $rootScope.$on('track:progress', function (event, data) {
            // console.log('here');
            // console.log(data);
            if (parseInt(data) === 100) {
                updateHomeInfo();
            }
        });

        function updateHomeInfo() {
            $timeout(function () {
                // console.log(angularPlayer.currentTrackData());
                $scope.songID = angularPlayer.currentTrackData()._id;
                // $scope.songID = angularPlayer.currentTrackData().id;
                $scope.musicName = angularPlayer.currentTrackData().title;
                $scope.albumName = angularPlayer.currentTrackData().albumName;
                $scope.albumCover = $scope.baseUrl + 'images/album/' + angularPlayer.currentTrackData().albumCover;
                $scope.singerName = angularPlayer.currentTrackData().artist;
                $scope.singerID = angularPlayer.currentTrackData().artistID;
            }, 100)
        }
    }])

    .controller('SongCtrl', ['$scope', '$stateParams', 'angularPlayer', '$timeout', 'commentFactory', function ($scope, $stateParams, angularPlayer, $timeout, commentFactory) {

        // $scope.musicName = 'SHIROBAKO insert music';
        // $scope.albumName = 'Unknow';
        // $scope.albumPhoto = "images/album/shirobako.jpg";
        // $scope.singerName = 'Unknow';

        // $scope.baseUrl = 'http://localhost:3000/confusion-bootstrap/';
        $scope.baseUrl = 'http://localhost:3000/';
        $scope.commentContent = 'click to comment!';
        // $timeout(updateSongInfo, 200);

        // Maybe use it to check is data is empty or the user has already commented
        $scope.checkComment = function (data) {
            console.log(data);
        };

        // save the comment to database and make the pager to page number of newest comment
        $scope.submitComment = function () {
            console.log('submit comment!');
            var lastPageNum = Math.ceil($scope.totalItems/$scope.itemsPerPage);
            $scope.currentPage = lastPageNum;
            $scope.pageChange();
        };

        updateSongInfo();

        function updateSongInfo() {
            // $scope.songID = angularPlayer.currentTrackData().id;
            $scope.songID = angularPlayer.currentTrackData()._id;

            $scope.musicName = angularPlayer.currentTrackData().title;
            $scope.albumName = angularPlayer.currentTrackData().albumName;
            $scope.albumCover = $scope.baseUrl + 'images/album/' + angularPlayer.currentTrackData().albumCover;
            $scope.singerName = angularPlayer.currentTrackData().artist;
            $scope.singerID = angularPlayer.currentTrackData().artistID;
        }



        // $scope.comments = [
        //     {
        //         username: 'Michael King',
        //         avatar: '019.jpg',
        //         comment: "It's great actually!",
        //         time: new Date()
        //     },
        //     {
        //         username: 'Tracy Howard',
        //         avatar: '005.jpg',
        //         comment: "It's great actually!",
        //         time: new Date()
        //     },
        //     {
        //         username: 'David Ford',
        //         avatar: '007.jpg',
        //         comment: "It's great actually!",
        //         time: new Date()
        //     },
        //     {
        //         username: 'Christina Jones',
        //         avatar: '010.jpg',
        //         comment: "It's great actually!",
        //         time: new Date()
        //     },
        //     {
        //         username: 'Taylor Elizabeth',
        //         avatar: '017.jpg',
        //         comment: "It's great actually!",
        //         time: new Date()
        //     }
        // ];

        commentFactory.total.query(
            function (response) {
                $scope.totalItems = response.length;
            },
            function (err) {
                console.log(err);
            }
        );

        $scope.currentPage = 1;
        $scope.itemsPerPage = 5;

        $scope.maxSize = 5;

        commentFactory.page.query({pageNum:$scope.currentPage})
            .$promise.then(
                function (response) {
                    $scope.comments = response;
                },
                function (err) {
                    console.log(err);
                }
        );

        $scope.pageChange = function () {
            commentFactory.page.query({pageNum:$scope.currentPage})
                .$promise.then(
                function (response) {
                    $scope.comments = response;
                },
                function (err) {
                    console.log(err);
                }
            );
        };
        $scope.list = commentFactory.total.query();
        // $scope.list = commentFactory.total.query({pageNum:$scope.currentPage});


        // console.log($stateParams);

        // $timeout(function () {
        //     console.log($scope.list);
        //     console.log($scope.totalItems);
        // }, 500);


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

    .controller('ArtistCtrl', ['$scope', 'artistFactory', '$stateParams', function ($scope, artistFactory, $stateParams) {

        // $scope.artistPhoto = "images/artist/simple-plan.jpg";
        // $scope.artistName = 'Simple plan';
        // $scope.introduction = 'Simple Plan is a Canadian rock band from Montreal, Quebec.Simple Plan \'s style of music has been described as pop punk, alternative rock, pop rock, punk rock, and power pop. Atlantic Records marketing material has described the band \'s style as having "classic punk energy and modern pop sonics". Simple Plan \'s music style has also been described as: "emo".';
        // $scope.recommended = 'Untitled, Take my hand.';

        // $scope.baseUrl = 'http://localhost:3000/confusion-bootstrap/';
        $scope.baseUrl = 'http://localhost:3000/';


        artistFactory.get({artistId: $stateParams.id}).$promise.then(
            function (response) {
                $scope.artistPhoto = $scope.baseUrl + 'images/artist/' + response.artistPhoto;
                $scope.artistName = response.artistName;
                $scope.introduction = response.introduction.replace(/\n/g, '\n\n');
                $scope.recommended = response.recommended;
            },
            function (err) {
                console.log(err);
            }
        )

    }]);


