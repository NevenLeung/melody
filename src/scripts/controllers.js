'use strict';

angular.module('Melody')
    .controller('PlayerCtrl', ['$scope', 'angularPlayer', '$timeout', '$rootScope', 'songFactory', 'favFactory', 'AuthFactory', 'ngDialog', 'baseUrl', function ($scope, angularPlayer, $timeout, $rootScope, songFactory, favFactory, AuthFactory, ngDialog, baseUrl) {

        refreshPlaylist();

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

        $scope.toggleFavorite = function (item) {
            if (AuthFactory.isAuthenticated()) {
                // only user who logged in can execute this operation
                favFactory.updateFavoriteList(item);
                item.favorite = favFactory.isInFavList(item);
            } else {
                ngDialog.open({
                    template: 'views/loginReminder.html',
                    className: 'ngdialog-theme-default'
                });
            }
        };

        $rootScope.$on('favoriteList: Update', function (event,data) {
            if (data.operation == 'removeAll') {
                angular.forEach($scope.playlist, function (item) {
                    item.favorite = false;
                })
            }
        });

        // $scope.displayCurrentPlaying = function () {
        //     console.log($scope.currentPlaying);
        //     console.log(favFactory.isInFavList($scope.currentPlaying));
        // };
        
        $scope.spinIcon = function () {
            angularPlayer.stop();
            angularPlayer.setCurrentTrack(null);
            // clearPlaylist method needs a callback
            angularPlayer.clearPlaylist(function () {
                // console.log('Playlist is clear.');
            });

            $timeout(refreshPlaylist, 200);
            $scope.spinner = true;
            $timeout(function () {
                $scope.spinner = false
            }, 1000);
        };

        // use the angular sound manager built-in event, which means clear playlist action has been executed
        // change the current playing info display flag
        // if none of song is in playlist, do not display the song info above the progress bar
        $rootScope.$on('player:playlist', function (event, data) {
            $scope.displayInfo = data.length !== 0;
        });

        $rootScope.$on('login: Successful', setFavorite);

        $rootScope.$on('logout: Successful', resetFavorite);

        function random(n) {
            return Math.floor(Math.random() * n);
        }

        function refreshPlaylist() {
            songFactory.song.get({},
                function (response) {
                    // To generate 5 random songs from database
                    var unique = {};
                    for(var i = 0; Object.keys(unique).length < 5; i++) {
                        // To make the song unique
                        unique[JSON.stringify(response.data[random(response.total)])] = i;
                    }
                    $scope.songs = Object.keys(unique).map(function (str) {
                        return JSON.parse(str);
                    });

                    // To add the songs to playlist
                    angular.forEach($scope.songs, function (item) {
                        item.id = item._id;
                        item.url = baseUrl + 'music/' + item.url;
                        // if user is logged in, set his/her favorite to song info object
                        item.favorite = favFactory.isInFavList(item);
                        angularPlayer.addTrack(item);
                    });
                    angularPlayer.play();
                    // use the angular sound manager built-in event, which means a new song begin to play
                    $rootScope.$broadcast('track:id');

                    // the current playing info display flag
                    $scope.displayInfo = true;
                },
                function (err) {
                    console.log(err);
                }
            );
        }
        
        function setFavorite() {
            angular.forEach($scope.playlist, function (item) {
                item.favorite = favFactory.isInFavList(item);
            });
        }

        function resetFavorite() {
            angular.forEach($scope.playlist, function (item) {
                item.favorite = false;
            });
        }
    }])

    .controller('HeaderCtrl', ['$scope', '$state', 'ngDialog', '$rootScope', 'baseUrl', 'localStorage', 'AuthFactory', function ($scope, $state, ngDialog, $rootScope, baseUrl, localStorage, AuthFactory) {

        $scope.baseUrl = baseUrl;

        $scope.isLoggedIn= AuthFactory.isAuthenticated();

        loadUserInfo();

        $scope.openRegisterModal = function () {
            ngDialog.open({
                template: 'views/register.html',
                scope: $scope,
                className: 'ngdialog-theme-default',
                controller:"RegisterCtrl"
            });
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
            $scope.isLoggedIn = false;
            AuthFactory.logout();
            // $scope.userName = '';
        };

        $rootScope.$on('login: Successful', function () {
            loadUserInfo();
            $scope.isLoggedIn = true;
        });

        $rootScope.$on('logout: Successful', function () {
            $state.go('app');
        });

        $scope.stateIs = function(currentState) {
            return $state.is(currentState);
        };

        $scope.avatarList = ['001.jpg', '002.jpg', '003.jpg', '004.jpg', '005.jpg'];

        function loadUserInfo() {
            $scope.username = localStorage.getObject('Token', '{}').username;
            $scope.avatar = baseUrl + 'images/avatar/' + localStorage.getObject('Token', '{}').avatar;
            $scope.userID = localStorage.getObject('Token', '{}').userID;
        }
    }])

    .controller('LoginCtrl', ['$scope', 'ngDialog', '$rootScope', 'AuthFactory', 'localStorage', function ($scope, ngDialog, $rootScope, AuthFactory, localStorage) {

        $scope.loginData = localStorage.getObject('userinfo', '{}');

        $scope.doLogin = function () {
            if ($scope.rememberMe) {
                localStorage.storeObject('userinfo', $scope.loginData);
            }

            AuthFactory.login($scope.loginData);

            ngDialog.close();
        }

    }])

    .controller('RegisterCtrl', ['$scope', 'ngDialog', '$rootScope', 'AuthFactory', function ($scope, ngDialog, $rootScope, AuthFactory) {

        $scope.registration = {};
        $scope.loginData = {};

        $scope.doRegistration = function () {
            // console.log($scope.registration);
            AuthFactory.register($scope.registration);
            ngDialog.close();
        };

    }])

    .controller('HomeCtrl', ['$scope', 'angularPlayer', '$rootScope', '$timeout', 'baseUrl', function ($scope, angularPlayer, $rootScope, $timeout, baseUrl) {

        $scope.baseUrl = baseUrl;


        // $scope.musicName = 'SHIROBAKO insert music';
        // $scope.albumName = 'Unknow';
        // $scope.albumPhoto = "images/album/shirobako.jpg";
        // $scope.singerName = 'Unknow';

        updateHomeInfo();

        // listen the song change, including prev and next button
        $rootScope.$on('track:id', function (event, data) {
            // console.log(data);
            updateHomeInfo();
        });

        $rootScope.$on('track:progress', function (event, data) {
            // console.log(data);
            if (parseInt(data) === 100) {
                updateHomeInfo();
            }
        });

        function updateHomeInfo() {
            // use $timeout to obtain the data from angularPlayer.currentTrackData() a little later
            $timeout(function () {
                $scope.songID = angularPlayer.currentTrackData()._id;
                $scope.musicName = angularPlayer.currentTrackData().title;
                $scope.albumName = angularPlayer.currentTrackData().albumName;
                $scope.albumCover = $scope.baseUrl + 'images/album/' + angularPlayer.currentTrackData().albumCover;
                $scope.singerName = angularPlayer.currentTrackData().artist;
                $scope.singerID = angularPlayer.currentTrackData().artistID;
            }, 100)
        }
    }])

    .controller('SongCtrl', ['$scope', '$stateParams', 'angularPlayer', '$timeout', 'songFactory', 'AuthFactory', 'ngDialog', 'baseUrl', function ($scope, $stateParams, angularPlayer, $timeout, songFactory, AuthFactory, ngDialog, baseUrl) {

        $scope.commentContent = 'click to comment!';

        $scope.currentPage = 1;
        $scope.itemsPerPage = 5;

        $scope.maxSize = 5;

        $scope.checkComment = function () {
            if (!AuthFactory.isAuthenticated()) {
                ngDialog.open({
                    template: 'views/loginReminder.html',
                    className: 'ngdialog-theme-default'
                });
                return '';
            }
        };

        // save the comment to database and set the pager to page number of newest comment
        $scope.submitComment = function () {
            console.log('submit comment!');
            $scope.currentPage = Math.ceil($scope.totalItems/$scope.itemsPerPage);
            $scope.pageChange();
            songFactory.comment.save(
                    {
                        songId: $stateParams.id
                    },
                    {
                        comment: $scope.commentContent
                    },
                    function (response) {
                        console.log(response);
                    },
                    function (err) {
                        console.log(err);
                    }
                );
        };

        // use mongoose-paginate to implement the pagination
        $scope.pageChange = function () {
            songFactory.comment.get(
                {
                    songId: $stateParams.id,
                    page:$scope.currentPage
                })
                .$promise.then(
                function (response) {
                    angular.forEach(response.docs, function (item) {
                        item.postedBy.avatar = baseUrl + 'images/avatar/' + item.postedBy.avatar;
                    });
                    $scope.comments = response.docs;
                    $scope.totalItems = response.total
                },
                function (err) {
                    console.log(err);
                }
            );
        };

        function updateSongInfo() {
            $scope.songID = angularPlayer.currentTrackData()._id;

            $scope.musicName = angularPlayer.currentTrackData().title;
            $scope.albumName = angularPlayer.currentTrackData().albumName;
            $scope.albumCover = baseUrl + 'images/album/' + angularPlayer.currentTrackData().albumCover;
            $scope.singerName = angularPlayer.currentTrackData().artist;
            $scope.singerID = angularPlayer.currentTrackData().artistID;
        }

        updateSongInfo();
        $scope.pageChange();


    }])

    .controller('PersonalCtrl', ['$scope', '$state', '$timeout', '$rootScope', 'baseUrl', 'localStorage', 'userFactory', 'favFactory', '$q', '$http', 'AuthFactory', 'ngDialog', function ($scope, $state, $timeout, $rootScope, baseUrl, localStorage, userFactory, favFactory, $q, $http, AuthFactory, ngDialog) {

        // $scope.userPhoto = baseUrl + 'images/avatar001.jpg';
        // $scope.userName = 'Neven';
        // $scope.introduction = 'An interesting guy';

        $scope.favList = [];
        $scope.userInfo = {};

        var userID = localStorage.getObject('Token', '{}').userID;
        var favListOrder = localStorage.getObject(userID, '[]');

        checkLoginStatus();
        loadFavlist();

        function checkLoginStatus() {
            if (!AuthFactory.isAuthenticated()) {
                ngDialog.open({
                    template: 'views/loginReminder.html',
                    className: 'ngdialog-theme-default'
                });
                $state.go('app');
            }
        }

        function loadFavlist() {
            if (userID) {
                userFactory.favorite.get({
                    id: userID
                }).$promise.then(function (response) {
                    $scope.userInfo.username = response.username;
                    $scope.userPhoto = baseUrl + 'images/avatar/' + response.avatar;
                    $scope.userInfo.introduction = response.introduction;

                    // save favList order after drag & drop in a callback!! Not save to server,
                    // only save in localStorage, and sync the order after get the response from server.
                    angular.forEach(favListOrder, function (songID) {
                            angular.forEach(response.favorites, function (item) {
                                if (songID == item.songInfo._id) {
                                    item.songInfo.id = item.songInfo._id;
                                    item.songInfo.url = baseUrl + 'music/' + item.songInfo.url;
                                    $scope.favList.push(item.songInfo);
                                }
                            });
                        }
                    );
                }, function (err) {
                    console.log(err);
                });
            }
        }
        
        $scope.changeFavListOrder = function () {
            favListOrder = [];
            angular.forEach($scope.favList, function (item) {
                favListOrder.push(item._id);
            });
            localStorage.storeObject(userID, favListOrder);
        };

        $scope.removeOneFromFav = function (item) {
            favFactory.updateFavoriteList(item);
        };

        $scope.removeAllFromFav = function () {
            favFactory.removeAll();
        };
        
        $scope.checkUsername = function (data) {
            if (data == '') {
                return 'Username can not be empty!';
            }
            else {
                // check if the username has been used by others.
                var d = $q.defer();
                $http.put(baseUrl+'users/' + userID , {username: data})
                    .then(function(res) {
                        res = res || {};
                        if(res.status == '200') {
                            d.resolve()
                        }
                    }, function(err){
                        if (err.status == 500) {
                            d.reject('Username ' + data + ' has been already used!');
                    }});
                return d.promise;
            }
        };

        $scope.saveUserInfo = function () {
            // make a put request to server to save information
            console.log('save');
            userFactory.user.update({id: userID}, $scope.userInfo)
                .$promise.then(function (response) {
                console.log(response);
            }, function (err) {
                console.log(err);
            });
        };

        $rootScope.$on('favoriteList: Update', function (event,data) {
            if (data.operation == 'add') {
                $scope.favList.push(data.song);
            } else {
                $scope.favList.splice($scope.favList.indexOf(data.song), 1);
            }
        });

    }])

    .controller('UserCtrl', ['$scope', 'angularPlayer', '$stateParams','userFactory', 'baseUrl', function ($scope, angularPlayer, $stateParams, userFactory, baseUrl) {

        $scope.favList = [];

        userFactory.favorite.get({
            id: $stateParams.id
        }).$promise.then(function (response) {
            $scope.userName = response.username;
            $scope.userPhoto = baseUrl + 'images/avatar/' + response.avatar;
            $scope.introduction = response.introduction;

            angular.forEach(response.favorites, function (item) {
                item.songInfo.id = item.songInfo._id;
                item.songInfo.url = baseUrl + 'music/' + item.songInfo.url;
                $scope.favList.push(item.songInfo);
            })
        }, function (err) {
            console.log(err);
        });

        // $scope.userPhoto = 'images/avatar001.jpg';
        // $scope.userName = 'Neven';
        // $scope.introduction = 'An interesting guy';

        // $scope.favList = [
        //     {
        //         id: 1,
        //         title: 'SHIROBAKO',
        //         artist: 'Unknown',
        //         url: 'http://localhost:3000/music/SHIROBAKO.mp3',
        //         time: '3:08',
        //         favorite: true
        //     }
        //     {
        //         id: 2,
        //         title: 'Coming Home',
        //         artist: 'Diddy & Skylar Grey',
        //         url: 'http://localhost:3000/music/Diddy、Skylar Grey - Coming Home.mp3',
        //         time: '3:59',
        //         favorite: false
        //     }
        // ];



    }])

    .controller('ArtistCtrl', ['$scope', 'artistFactory', '$stateParams', 'baseUrl', function ($scope, artistFactory, $stateParams, baseUrl) {
        $scope.baseUrl = baseUrl;

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

    }])
    
    .controller('AboutCtrl', ['baseUrl', '$scope', function (baseUrl, $scope) {
        $scope.baseUrl = baseUrl;
    }]);




