/**
 * Created by Administrator on 2017/8/15.
 */
'use strict';

angular.module('Melody')
    .factory('uploadFactory', ['$resource', function ($resource) {

        return $resource('https://sm.ms/api/upload', null);
    }])