/**
 * Created by Administrator on 2017/8/15.
 */
'use strict';

angular.module('Melody')
    // here use json-server serve a json file for testing
    .constant('baseUrl', 'http://localhost:3000/')
    .factory('uploadFactory', ['$resource', function ($resource) {

        return $resource('https://sm.ms/api/upload', null);
    }])

    .factory('songFactory', ['$resource', 'baseUrl', function ($resource, baseUrl) {

        return {
            random: $resource(baseUrl + 'playlist'),
            // song: $resource(baseUrl + 'song/:songId', null, null)
            song: $resource(baseUrl + 'songs/:songId', null, null)

        };

    }])

    .factory('artistFactory', ['$resource', 'baseUrl', function ($resource, baseUrl) {

        // return $resource(baseUrl + 'artist/:artistId', null, null);
        return $resource(baseUrl + 'artists/:artistId', null, null);

    }])

    .factory('commentFactory', ['$resource', 'baseUrl', function ($resource, baseUrl) {

        return {
            total: $resource(baseUrl + 'comments'),
            page: $resource(baseUrl + 'comments?_page=:pageNum', {
                pageNum: '@pageNum',
                _limit: 5
            })
        }


    }])