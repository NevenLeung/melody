"use strict";angular.module("Melody",["ui.router","ngResource","ngDialog","angularSoundManager","ngAnimate","ngSanitize","ui.bootstrap","angularAwesomeSlider","angular-sortable-view","xeditable"]).config(["$stateProvider","$urlRouterProvider","$uibTooltipProvider",function(t,e,o){o.setTriggers({mouseenter:"outsideClick"}),t.state("app",{url:"/",views:{player:{templateUrl:"views/player.html",controller:"PlayerCtrl"},header:{templateUrl:"views/header.html",controller:"HeaderCtrl"},content:{templateUrl:"views/home.html",controller:"HomeCtrl"}}}).state("app.song",{url:"song/:id",views:{"content@":{templateUrl:"views/song-info.html",controller:"SongCtrl"}}}).state("app.personal",{url:"personal",views:{"content@":{templateUrl:"views/personal-center.html",controller:"PersonalCtrl"}}}).state("app.user",{url:"user/:id",views:{"content@":{templateUrl:"views/user-info.html",controller:"UserCtrl"}}}).state("app.artist",{url:"artist/:id",views:{"content@":{templateUrl:"views/artist.html",controller:"ArtistCtrl"}}}).state("app.about",{url:"about",views:{"content@":{templateUrl:"views/about.html",controller:"AboutCtrl"}}}),e.otherwise("/")}]).run(["editableOptions",function(t){t.theme="bs3"}]),angular.module("Melody").constant("baseUrl","https://neven.cc:3443/").factory("songFactory",["$resource","baseUrl",function(t,e){return{song:t(e+"songs/:songId",null,null),comment:t(e+"songs/:songId/comments",null,null)}}]).factory("artistFactory",["$resource","baseUrl",function(t,e){return t(e+"artists/:artistId",null,null)}]).factory("userFactory",["$resource","baseUrl",function(t,e){return{user:t(e+"users/:id",null,{update:{method:"PUT"}}),favorite:t(e+"users/:id/favorites/:songID",{id:"@id",songID:"@songID"},{update:{method:"PUT"}}),register:t(e+"users/register"),login:t(e+"users/login"),logout:t(e+"users/logout")}}]).factory("localStorage",["$window",function(t){return{store:function(e,o){t.localStorage[e]=o},get:function(e,o){return t.localStorage[e]||o},remove:function(e){t.localStorage.removeItem(e)},storeObject:function(e,o){t.localStorage[e]=JSON.stringify(o)},getObject:function(e,o){return JSON.parse(t.localStorage[e]||o)}}}]).factory("favFactory",["$rootScope","localStorage","userFactory",function(t,e,o){var n={},a=[];return n.updateFavoriteList=function(n){var r=e.getObject("Token","{}").userID;-1===(a=e.getObject(r,"[]")).indexOf(n.id)?(a.push(n.id),e.storeObject(r,a),o.favorite.update({id:r,songID:n.id},{}).$promise.then(function(t){},function(t){console.log(t)}),t.$broadcast("favoriteList: Update",{operation:"add",song:n})):(a.splice(a.indexOf(n.id),1),e.storeObject(r,a),o.favorite.remove({id:r,songID:n.id}).$promise.then(function(t){},function(t){console.log(t)}),t.$broadcast("favoriteList: Update",{operation:"remove",song:n}))},n.removeAll=function(){var n=e.getObject("Token","{}").userID;e.storeObject(n,"[]"),o.favorite.remove({id:n}).$promise.then(function(t){},function(t){console.log(t)}),t.$broadcast("favoriteList: Update",{operation:"removeAll"})},n.isInFavList=function(t){var o=e.getObject("Token","{}").userID;return-1!==(a=e.getObject(o,"[]")).indexOf(t.id)},n}]).factory("AuthFactory",["$resource","$http","localStorage","$rootScope","$window","ngDialog","userFactory",function(t,e,o,n,a,r,i){function s(t){u=!0,g=t.username,f=t.Token,e.defaults.headers.common["x-access-token"]=f,function(){var t=o.getObject("Token").userID,e=o.getObject(t,"[]");i.favorite.get({id:t}).$promise.then(function(n){e.length<n.favorites.length&&(e=[],angular.forEach(n.favorites,function(t){e.push(t.songInfo._id)}),o.storeObject(t,e))})}()}var c={},l="Token",u=!1,g="",f=void 0,m=o.getObject("userinfo","{}");return function(){var t=o.getObject(l,"{}");void 0!=t.username&&s(t)}(),c.login=function(t){i.login.save(t,function(e){!function(t){o.storeObject(l,t),s(t)}({username:t.username,Token:e.token,userID:e.id,avatar:e.avatar}),n.$broadcast("login: Successful")},function(t){u=!1;var e='                        <div class="ngdialog-message">                            <div><h4>Login Unsuccessful</h4></div><div><p>'+t.data.err.name+'</p></div><div class="ngdialog-buttons">                                <button type="button" class="ngdialog-button ngdialog-button-primary" ng-click=confirm("OK")>OK</button>                            </div>                        </div>';r.openConfirm({template:e,plain:"true"})})},c.logout=function(){i.logout.get(function(t){}),f=void 0,g="",u=!1,e.defaults.headers.common["x-access-token"]=f,o.remove(l),n.$broadcast("logout: Successful")},c.register=function(t){i.register.save(t,function(e){c.login({username:t.username,password:t.password}),t.rememberMe&&o.storeObject("userinfo",{username:t.username,password:t.password}),n.$broadcast("registration: Successful")},function(t){var e='                        <div class="ngdialog-message">                            <div><h4>Registration Unsuccessful</h4></div><div><p>'+t.data.err.name+"</p></div></div>";r.openConfirm({template:e,plain:"true"})})},c.isAuthenticated=function(){return u},c.getUsername=function(){return g},0!==Object.keys(m).length&&c.login(m),c}]),angular.module("Melody").controller("PlayerCtrl",["$scope","angularPlayer","$timeout","$rootScope","songFactory","favFactory","AuthFactory","ngDialog","baseUrl",function(t,e,o,n,a,r,i,s,c){function l(){a.song.get({},function(o){for(var a={},i=0;Object.keys(a).length<5;i++)a[JSON.stringify(o.data[function(t){return Math.floor(Math.random()*t)}(o.total)])]=i;t.songs=Object.keys(a).map(function(t){return JSON.parse(t)}),angular.forEach(t.songs,function(t){t.id=t._id,t.url=c+"music/"+t.url,t.favorite=r.isInFavList(t),e.addTrack(t)}),e.play(),n.$broadcast("track:id"),t.displayInfo=!0},function(t){console.log(t)})}l(),t.playIcon='<span class="fa fa-2x fa-play player-icon"></span>',t.pauseIcon='<span class="fa fa-2x fa-pause player-icon"></span>',t.sliderOptions={from:100,to:0,step:10,vertical:!0,callback:function(t){e.adjustVolumeSlider(t)}},t.toggleFavorite=function(t){i.isAuthenticated()?(r.updateFavoriteList(t),t.favorite=r.isInFavList(t)):s.open({template:"views/loginReminder.html",className:"ngdialog-theme-default"})},n.$on("favoriteList: Update",function(e,o){"removeAll"==o.operation&&angular.forEach(t.playlist,function(t){t.favorite=!1})}),t.spinIcon=function(){e.stop(),e.setCurrentTrack(null),e.clearPlaylist(function(){}),o(l,200),t.spinner=!0,o(function(){t.spinner=!1},1e3)},n.$on("player:playlist",function(e,o){t.displayInfo=0!==o.length}),n.$on("login: Successful",function(){angular.forEach(e.getPlaylist(),function(t){t.favorite=r.isInFavList(t)})}),n.$on("logout: Successful",function(){angular.forEach(e.getPlaylist(),function(t){t.favorite=!1})})}]).controller("HeaderCtrl",["$scope","$state","ngDialog","$rootScope","baseUrl","localStorage","AuthFactory",function(t,e,o,n,a,r,i){function s(){t.username=r.getObject("Token","{}").username,t.avatar=a+"images/avatar/"+r.getObject("Token","{}").avatar,t.userID=r.getObject("Token","{}").userID}t.baseUrl=a,t.isLoggedIn=i.isAuthenticated(),s(),t.openRegisterModal=function(){o.open({template:"views/register.html",scope:t,className:"ngdialog-theme-default",controller:"RegisterCtrl"})},t.openLoginModal=function(){o.open({template:"views/login.html",scope:t,className:"ngdialog-theme-default",controller:"LoginCtrl"})},t.doLogout=function(){t.isLoggedIn=!1,i.logout()},n.$on("login: Successful",function(){s(),t.isLoggedIn=!0}),n.$on("logout: Successful",function(){e.go("app")}),t.stateIs=function(t){return e.is(t)},t.avatarList=["001.jpg","002.jpg","003.jpg","004.jpg","005.jpg"]}]).controller("LoginCtrl",["$scope","ngDialog","$rootScope","AuthFactory","localStorage",function(t,e,o,n,a){t.loginData=a.getObject("userinfo","{}"),t.doLogin=function(){t.rememberMe&&a.storeObject("userinfo",t.loginData),n.login(t.loginData),e.close()}}]).controller("RegisterCtrl",["$scope","ngDialog","$rootScope","AuthFactory",function(t,e,o,n){t.registration={},t.loginData={},t.doRegistration=function(){n.register(t.registration),e.close()}}]).controller("HomeCtrl",["$scope","angularPlayer","$rootScope","$timeout","baseUrl",function(t,e,o,n,a){function r(){n(function(){t.songID=e.currentTrackData()._id,t.musicName=e.currentTrackData().title,t.albumName=e.currentTrackData().albumName,t.albumCover=t.baseUrl+"images/album/"+e.currentTrackData().albumCover,t.singerName=e.currentTrackData().artist,t.singerID=e.currentTrackData().artistID},100)}t.baseUrl=a,r(),o.$on("track:id",function(t,e){r()}),o.$on("track:progress",function(t,e){100===parseInt(e)&&r()})}]).controller("SongCtrl",["$scope","$stateParams","angularPlayer","songFactory","AuthFactory","ngDialog","baseUrl","$http","$q",function(t,e,o,n,a,r,i,s,c){t.commentContent="click to comment!",t.currentPage=1,t.itemsPerPage=5,t.maxSize=5,t.checkComment=function(){if(!a.isAuthenticated())return r.open({template:"views/loginReminder.html",className:"ngdialog-theme-default"}),""},t.submitComment=function(){t.currentPage=Math.ceil(t.totalItems/t.itemsPerPage),t.pageChange(),n.comment.save({songId:e.id},{comment:t.commentContent},function(t){},function(t){console.log(t)})},t.pageChange=function(){n.comment.get({songId:e.id,page:t.currentPage}).$promise.then(function(e){angular.forEach(e.docs,function(t){t.postedBy.avatar=i+"images/avatar/"+t.postedBy.avatar}),t.comments=e.docs,t.totalItems=e.total},function(t){console.log(t)})},t.songID=o.currentTrackData()._id,t.musicName=o.currentTrackData().title,t.albumName=o.currentTrackData().albumName,t.albumCover=i+"images/album/"+o.currentTrackData().albumCover,t.singerName=o.currentTrackData().artist,t.singerID=o.currentTrackData().artistID;var l=c.defer();s.get(i+"songs/"+e.id+"/comments",{page:t.currentPage}).then(function(e){t.totalItems=e.data.total,t.currentPage=Math.ceil(t.totalItems/t.itemsPerPage),t.pageChange(),l.resolve()},function(t){l.reject("error")})}]).controller("PersonalCtrl",["$scope","$state","$timeout","$rootScope","baseUrl","localStorage","userFactory","favFactory","$q","$http","AuthFactory","ngDialog","angularPlayer",function(t,e,o,n,a,r,i,s,c,l,u,g,f){t.favList=[],t.userInfo={};var m=r.getObject("Token","{}").userID,d=r.getObject(m,"[]");u.isAuthenticated()||(g.open({template:"views/loginReminder.html",className:"ngdialog-theme-default"}),e.go("app")),m&&i.favorite.get({id:m}).$promise.then(function(e){t.userInfo.username=e.username,t.userPhoto=a+"images/avatar/"+e.avatar,t.userInfo.introduction=e.introduction,angular.forEach(d,function(o){angular.forEach(e.favorites,function(e){o==e.songInfo._id&&(e.songInfo.id=e.songInfo._id,e.songInfo.url=a+"music/"+e.songInfo.url,t.favList.push(e.songInfo))})})},function(t){console.log(t)}),t.playAll=function(){f.stop(),f.setCurrentTrack(null),f.clearPlaylist(function(){}),o(function(){angular.forEach(t.favList,function(t){f.addTrack(t)}),f.play()},100)},t.changeFavListOrder=function(){d=[],angular.forEach(t.favList,function(t){d.push(t._id)}),r.storeObject(m,d)},t.removeOneFromFav=function(t){s.updateFavoriteList(t)},t.removeAllFromFav=function(){s.removeAll()},t.checkUsername=function(t){if(""==t)return"Username can not be empty!";var e=c.defer();return l.put(a+"users/"+m,{username:t}).then(function(t){"200"==(t=t||{}).status&&e.resolve()},function(o){500==o.status&&e.reject("Username "+t+" has been already used!")}),e.promise},t.saveUserInfo=function(){i.user.update({id:m},t.userInfo).$promise.then(function(t){},function(t){console.log(t)})},n.$on("favoriteList: Update",function(e,o){"add"==o.operation?t.favList.push(o.song):t.favList.splice(t.favList.indexOf(o.song),1)})}]).controller("UserCtrl",["$scope","angularPlayer","$stateParams","userFactory","baseUrl","$timeout",function(t,e,o,n,a,r){t.favList=[],n.favorite.get({id:o.id}).$promise.then(function(e){t.userName=e.username,t.userPhoto=a+"images/avatar/"+e.avatar,t.introduction=e.introduction,angular.forEach(e.favorites,function(e){e.songInfo.id=e.songInfo._id,e.songInfo.url=a+"music/"+e.songInfo.url,t.favList.push(e.songInfo)})},function(t){console.log(t)}),t.playAll=function(){e.stop(),e.setCurrentTrack(null),e.clearPlaylist(function(){}),r(function(){angular.forEach(t.favList,function(t){e.addTrack(t)}),e.play()},100)}}]).controller("ArtistCtrl",["$scope","artistFactory","$stateParams","baseUrl",function(t,e,o,n){t.baseUrl=n,e.get({artistId:o.id}).$promise.then(function(e){t.artistPhoto=t.baseUrl+"images/artist/"+e.artistPhoto,t.artistName=e.artistName,t.introduction=e.introduction.replace(/\n/g,"\n\n"),t.recommended=e.recommended},function(t){console.log(t)})}]).controller("AboutCtrl",["baseUrl","$scope",function(t,e){e.baseUrl=t}]);