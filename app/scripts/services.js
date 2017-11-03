'use strict';

angular.module('Melody')
    .constant('baseUrl', 'http://localhost:3000/')

    .factory('songFactory', ['$resource', 'baseUrl', function ($resource, baseUrl) {

        return {
            song: $resource(baseUrl + 'songs/:songId', null, null),
            comment: $resource(baseUrl + 'songs/:songId/comments', null, null)

        };

    }])

    .factory('artistFactory', ['$resource', 'baseUrl', function ($resource, baseUrl) {

        return $resource(baseUrl + 'artists/:artistId', null, null);

    }])

    .factory('userFactory', ['$resource', 'baseUrl', function ($resource, baseUrl) {

        return {
            user: $resource(baseUrl + "users/:id", null, {
                'update': {
                    method: 'PUT'
                }
            }),
            favorite: $resource(
                baseUrl + "users/:id/favorites/:songID",
                {
                    id: '@id',
                    songID: '@songID'
                },
                {
                'update': {
                    method: 'PUT'
                }
            }),
            register: $resource(baseUrl + 'users/register'),
            login: $resource(baseUrl + 'users/login'),
            logout: $resource(baseUrl + 'users/logout')
        };
    }])

    .factory('localStorage', ['$window', function ($window) {
        return {
            store: function (key, value) {
                $window.localStorage[key] = value;
            },
            get: function (key, defaultValue) {
                return $window.localStorage[key] || defaultValue;
            },
            remove: function (key) {
                $window.localStorage.removeItem(key);
            },
            storeObject: function (key, value) {
                $window.localStorage[key] = JSON.stringify(value);
            },
            getObject: function (key, defaultValue) {
                return JSON.parse($window.localStorage[key] || defaultValue);
            }
        }
    }])

    .factory('favFactory', ['$rootScope', 'localStorage', 'userFactory', function ($rootScope, localStorage, userFactory) {

        var favFactory = {};
        var favList = [];

        // item is songInfo object
        favFactory.updateFavoriteList = function (item) {
            console.log(item.id);
            var userID = localStorage.getObject('Token', '{}').userID;
            favList = localStorage.getObject(userID, '[]');

            if (favList.indexOf(item.id) === -1) {
                // if item is not in favList, add it
                favList.push(item.id);
                localStorage.storeObject(userID, favList);
                userFactory.favorite.update(
                    {
                        id: userID,
                        songID: item.id
                    },
                    {})
                    .$promise.then(function (response) {
                    console.log('Add to favList');
                    console.log(response);
                }, function (err) {
                    console.log(err);
                });
                $rootScope.$broadcast('favoriteList: Update', {operation: 'add', song: item});
            } else {
                // remove item from favList
                favList.splice(favList.indexOf(item.id), 1);
                localStorage.storeObject(userID, favList);
                userFactory.favorite.remove(
                    {
                        id: userID,
                        songID: item.id
                    })
                    .$promise.then(function (response) {
                    console.log('Remove from favList');
                    console.log(response);
                }, function (err) {
                    console.log(err);
                });
                $rootScope.$broadcast('favoriteList: Update', {operation: 'remove', song: item});
            }

        };

        favFactory.removeAll = function () {

            var userID = localStorage.getObject('Token', '{}').userID;

            // clear all item in favList
            localStorage.storeObject(userID, '[]');
            userFactory.favorite.remove({id: userID})
                .$promise.then(function (response) {
                console.log('Remove all from favList');
                console.log(response);
            }, function (err) {
                console.log(err);
            });
            $rootScope.$broadcast('favoriteList: Update', {operation: 'removeAll'});
        };

        favFactory.isInFavList =function (item) {
            var userID = localStorage.getObject('Token', '{}').userID;
            favList = localStorage.getObject(userID, '[]');

            // console.log(favList.indexOf(item.id) !== -1);
            return favList.indexOf(item.id) !== -1;
        };

        return favFactory;
    }])

    .factory('AuthFactory', ['$resource', '$http', 'localStorage', '$rootScope', '$window', 'ngDialog', 'userFactory', function ($resource, $http, localStorage, $rootScope, $window, ngDialog, userFactory) {
        var authFac = {};
        var TOKEN_KEY ='Token';
        var isAuthenticated = false;
        var username = '';
        var authToken = undefined;

        loadUserCredentials();

        function useCredentials(credentials) {
            isAuthenticated = true;
            username = credentials.username;
            authToken = credentials.Token;
            // Set the token as header for your requests!
            $http.defaults.headers.common['x-access-token'] = authToken;
            storeFavlistToLocal();
        }

        function loadUserCredentials() {
            var credentials = localStorage.getObject(TOKEN_KEY, '{}');
            if (credentials.username != undefined) {
                useCredentials(credentials);
            }
        }

        function storeUserCredentials(credentials) {
            localStorage.storeObject(TOKEN_KEY, credentials);
            useCredentials(credentials);
        }
        
        function destroyUserCredentials() {
            authToken = undefined;
            username = '';
            isAuthenticated = false;
            $http.defaults.headers.common['x-access-token'] = authToken;
            localStorage.remove(TOKEN_KEY);
        }

        function storeFavlistToLocal() {

            var userID = localStorage.getObject('Token').userID;
            var favListOrder = localStorage.getObject(userID, '[]');

            userFactory.favorite.get({
                id: userID
            }).$promise.then(function (response) {
                // save favList order after drag & drop in a callback!! Not save to server,
                // only save in localStorage, and sync the order after get the response from server.
                if (favListOrder.length < response.favorites.length) {
                    favListOrder = [];
                    angular.forEach(response.favorites, function (item) {
                        favListOrder.push(item.songInfo._id);
                    });
                    localStorage.storeObject(userID, favListOrder);
                }
            });
        }
        
        authFac.login = function (loginData) {

            userFactory.login
                .save(loginData, function (response) {
                    storeUserCredentials({
                        username: loginData.username,
                        Token: response.token,
                        userID: response.id,
                        avatar: response.avatar
                    });
                    $rootScope.$broadcast('login: Successful');
                },
                function (response) {
                    isAuthenticated = false;

                    var message = '\
                        <div class="ngdialog-message">\
                            <div><h4>Login Unsuccessful</h4></div>' +
                            '<div><p>' + response.data.err.name + '</p></div>' +
                            '<div class="ngdialog-buttons">\
                                <button type="button" class="ngdialog-button ngdialog-button-primary" ng-click=confirm("OK")>OK</button>\
                            </div>\
                        </div>';

                    ngDialog.openConfirm({ template: message, plain: 'true'});
                });
        };
        
        authFac.logout = function () {
            userFactory.logout.get(function (response) {});
            destroyUserCredentials();
            $rootScope.$broadcast('logout: Successful');
        };
        
        authFac.register = function (registerData) {

            userFactory.register
                .save(registerData, function (response) {
                    authFac.login({username: registerData.username, password: registerData.password});
                    if (registerData.rememberMe) {
                        localStorage.storeObject('userinfo', {username: registerData.username, password: registerData.password});
                    }
                    $rootScope.$broadcast('registration: Successful');
                },
                function (response) {
                    var message = '\
                        <div class="ngdialog-message">\
                            <div><h4>Registration Unsuccessful</h4></div>' +
                            '<div><p>' + response.data.err.name + '</p></div></div>';

                    ngDialog.openConfirm({ template: message, plain: 'true'});
                });
        };

        authFac.isAuthenticated = function () {
            return isAuthenticated;
        };

        authFac.getUsername = function () {
            return username;
        };

        return authFac;
    }])

;
