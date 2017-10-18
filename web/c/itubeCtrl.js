var page, limit;
page = getParameterByName("page");
limit = getParameterByName("limit");
// console.log(page+' | '+limit);
var MEMBER_API_URL = "https://youtube-api-challenger2.appspot.com/members";
var MEMBER_AUTH_URL = "https://youtube-api-challenger2.appspot.com/authentication";
var VIDEO_API_URL_VER1 = 'https://youtube-video-api-1608.appspot.com/youtube/api';
var VIDEO_API_URL = "https://youtube-api-challenger2.appspot.com/videos";
var API_KEY = 'AIzaSyARBKW7hWfmEYm7tswDHUsp68hUsfvgjbM';
var videoId = getParameterByName("v");
var ytId = getParameterByName("yt");
var VIDEO_INFO_API_URL = "https://youtube-api-challenger2.appspot.com/videos/";
var YT_CHECK_URL;
var PLAYLIST_API_URL = "https://youtube-api-challenger2.appspot.com/playlists";
app.controller('videosCtrl', function($scope, $http) {
    // $http.get(VIDEO_API_URL).then(function(response) {
    //     $scope.videos = response.data;
    // });
    $scope.enableFn = false;
    $scope.show = false;

    if (hasRole()) {
        $scope.show = true;
        $scope.videos;
        $scope.init = function() {

            $scope.video = {};
            $scope.getListVideoService();
            if (typeof(Storage) !== "undefined") {
                if (localStorage.getItem("enableFn") !== null) {
                    $scope.enableFn = localStorage.getItem("enableFn");
                    console.log("init storage: " + localStorage.getItem("enableFn"));
                    console.log("enableFn: " + $scope.enableFn);
                }
            } else {
                alert('Your browser is not support! Please upgare newest version.')
            }
        }

        $scope.switchFn = function() {
            localStorage.setItem("enableFn", $scope.enableFn);
            console.log("enable now: " + $scope.enableFn);
            console.log("storage: " + localStorage.getItem("enableFn"));
        }
        $scope.getListVideoService = function() {
            $http({
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": localStorage.getItem("tokenKey")
                },
                url: VIDEO_API_URL
            }).then(function successCallback(response) {
                $scope.videos = response.data.data;
                console.log($scope.videos)
            }, function errorCallback(response) {
                console.log(response);
                // alert(resp.errors[0].title + '! ' + resp.errors[0].detail);
            });
        }
        $scope.deleteVideo = function(videoid) {
            if (hasRole()) {
                $http({
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": localStorage.getItem("tokenKey")
                    },
                    url: VIDEO_API_URL + '/' + videoid,
                    method: 'DELETE'
                }).then(function successCallback(data) {
                    console.log(VIDEO_API_URL + '/' + videoid);
                    alert('success');
                    $scope.init()
                }, function errorCallback(response) {
                    var resp = response.data;
                    console.log(resp);
                    // alert(resp.errors[0].title + '! ' + resp.errors[0].detail);
                }, function errorCallback(response) {});
            } else {
                alert('Bạn cần đăng nhập để truy cập vào tính năng này!');
            }
        }
    } else {
        $scope.show = false;
    }
});
app.controller('registerCtrl', function($scope, $http, $window) {
    if (hasRole()) {
        $window.location.href = 'index.html';
    }
    $scope.init = function() {
        $scope.confirmPassword;
        $scope.attributes = {
            "username": "",
            "fullName": "",
            "email": "",
            "password": "",
            "birthDay": "",
            "gender": "",
            "avatar": "",
        }
        $scope.dataToSend = {
            "data": {
                "type": "Member",
                "attributes": attributes
            }
        }
    }
    $http({
        url: MEMBER_API_URL,
        method: 'POST',
        data: $scope.dataToSend
    }).then(function successCallback(response) {}, function errorCallback(response) {});
});
app.controller('videoInfoCtrl', function($scope, $http) {
    $http({
        headers: {
            "Content-Type": "application/json",
            "Authorization": localStorage.getItem("tokenKey")
        },
        url: VIDEO_INFO_API_URL + videoId
    }).then(function(response) {
        // alert('im in');
        // console.log(VIDEO_API_URL+videoId);
        $scope.videoInfo = response.data;
        ytId = $scope.videoInfo.data.attributes.youtubeId;
        // console.log(ytId);
        // console.log($scope.videoInfo)
        $scope.tags = $scope.videoInfo.data.attributes.keywords.split(",");
        $scope.$on('ngGetInforFinish', function(ngRepeatFinishedEvent) {
            var owl = $('.owl-stage');
            owl.owlCarousel({
                items: 4,
                loop: false,
                dots: false,
                nav: true,
                margin: 10,
                responsive: {
                    0: {
                        items: 1
                    },
                    768: {
                        items: 3
                    },
                    1024: {
                        items: 4
                    },
                    1600: {
                        items: 6
                    }
                }
            });
            // Go to the next item
            $('.owl-next').click(function() {
                owl.trigger('next.owl.carousel');
            })
            // Go to the previous item
            $('.owl-prev').click(function() {
                // With optional speed parameter
                // Parameters has to be in square bracket '[]'
                owl.trigger('prev.owl.carousel', [300]);
            })
            owl.on('mousewheel', '.owl-stage', function(e) {
                if (e.deltaY > 0) {
                    owl.trigger('next.owl');
                } else {
                    owl.trigger('prev.owl');
                }
                e.preventDefault();
            });
        });
        $scope.$on('ngRepeatFinish', function(ngRepeatFinishedEvent) {});
    });
});
// playlist controller
app.controller('playlistCtrl', function playlistCtrl($scope, $http, $window) {
    $scope.show = false;
    if (hasRole()) {
        $scope.show = true;
        $scope.tabName;
        $scope.playlists;
        $scope.videosByPlId;
        $scope.selectedPlaylist;
        $scope.meta;
        $scope.page;
        $scope.limit;
        $scope.tabName = 'playlist';
        $scope.init = function() {
            // console.log(localStorage.getItem("tokenKey"));
            $scope.currentPage = 1;
            $scope.limit = 6;
            $scope.getPlaylistService();
            $scope.totalPage;
            $scope.tabName = 'playlist';
            $scope.dataToSend = {
                "data": {
                    "type": "Playlist",
                    "attributes": {
                        "name": '',
                        "description": '',
                        "thumbnailUrl": '',
                    }
                }
            }
        }
        $scope.showPlDetail = function(playlistId){
            console.log(playlistId);
            $scope.getVideosByPlId(playlistId);
            $scope.showDetail = true;
           
        }
        $scope.setSelectedPl = function(playlist){
            $scope.selectedPlaylist = playlist;
        }
        $scope.getVideosByPlId = function(playlistId){
            
            $http({
                method: 'GET',
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": localStorage.getItem("tokenKey")
                },
                url: VIDEO_API_URL + '?playlist=' + playlistId
            }).then(function successCallback(response) {
                // console.log(VIDEO_API_URL + '?playlist=' + playlistId)
                // console.log(response)
                $scope.videosByPlId = response.data.data;
                console.log(response)
            }, function errorCallback(response) {});
           
        }
        $scope.pagination = function(comand) {
            if (comand === 'minus') {
                if ($scope.currentPage >= 3) {
                    $scope.currentPage = $scope.currentPage - 2;
                } else {
                    $scope.currentPage = $scope.currentPage - 1;
                }
            } else if (comand === 'plus') {
                $scope.currentPage = $scope.currentPage + 2;
            } else if (comand === 'c') {
                $scope.currentPage = $scope.currentPage + 1;
            }
            $scope.getPlaylistService($scope, $http);
        }
        $scope.prev = function() {
            $scope.currentPage--;
            $scope.pagination();
        }
        $scope.next = function() {
            $scope.currentPage++;
            $scope.pagination();
        }
        $scope.switchTab = function(tabName) {
            this.tabName = tabName;
        }
        $scope.getPlaylistService = function() {
            // console.log("Tokenkey: "+localStorage.getItem("tokenKey"));
            $http({
                method: 'GET',
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": localStorage.getItem("tokenKey")
                },
                url: PLAYLIST_API_URL + '?page=' + $scope.currentPage + '&limit=' + $scope.limit,
            }).then(function successCallback(response) {
                if (response === '{}') {
                    alert('Chưa có playlist!');
                } else {
                    $scope.playlists = response.data.data;
                    $scope.meta = response.data.meta;
                    // console.log(response.data);
                    $scope.totalPage = $scope.meta.totalPage;
                    // console.log(response.data);
                    //$scope.meta.totalPage;
                    // console.log($scope.currentPage);
                }
            }, function errorCallback(response) {});
        }
        $scope.doSubmit = function() {
            $http({
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": localStorage.getItem("tokenKey")
                },
                url: PLAYLIST_API_URL,
                data: $scope.dataToSend
            }).then(function successCallback(response) {
                $('#alert-success').text('Success, playlist is created');
                $('#alert-success').show();
                $('#alert-error').hide();
                console.log(response);
            }, function errorCallback(response) {
                var resp = response.data;
                $('#alert-error').text(resp.errors[0].title + '! ' + resp.errors[0].detail);
                $('#alert-error').show();
                $('#alert-success').hide();
            }, function errorCallback(response) {});
        }
    } else {
        // alert('Bạn cần đăng nhập để truy cập vào tính năng này!');
        $scope.show = false;
        // $window.location.href = 'index.html';
    }
});
app.controller('uploadVideoCtrl', function($scope, $http) {
    $scope.show = false;
    if (hasRole()) {
        $scope.show = true;
        $scope.ytURL;
        $scope.playlistsModel = {};
        $scope.playlist;
        $scope.ytId;
        $scope.nullPl = {
            type: "playlist",
            id: "0",
            "attributes": {
                "name": "Chung"
            }
        };
        $scope.init = function() {
            $scope.ytURL = "";
            $scope.attributes = {
                "youtubeId": $scope.ytId,
                "name": "",
                "description": "",
                "keywords": "",
                "playlistId": "",
                "thumbnail": ""
            }
            $scope.videoToUpload = {
                "data": {
                    "type": "video",
                    "attributes": $scope.attributes
                }
            };
            $scope.getPlaylistModel();
            $scope.playlist = $scope.nullPl;
            $scope.attributes.playlistId = $scope.playlist.id;
            // console.log($scope.attributes.playlistId);
        }
        $scope.setPlId = function() {
            $scope.attributes.playlistId = $scope.playlist.id;
        }
        $scope.getPlaylistModel = function() {
            $http({
                method: 'GET',
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": localStorage.getItem("tokenKey")
                },
                url: PLAYLIST_API_URL + '?page=1&limit=100'
            }).then(function successCallback(response) {
                if (response === '{}') {
                    // alert('Chưa có playlist!');
                    template: "chua co pll"
                }
                else {
                    $scope.playlistsModel = response.data.data
                    $scope.playlistsModel.unshift($scope.nullPl)
                    // console.log($scope.playlistsModel)
                }
            }, function errorCallback(response) {});
        }
        $scope.doSubmit = function() {
            console.log($scope.videoToUpload);
            console.log(VIDEO_API_URL)
            $http({
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": localStorage.getItem("tokenKey")
                },
                url: VIDEO_API_URL,
                data: $scope.videoToUpload
            }).then(function successCallback(response) {
                $scope.init();
                $('#alert-success').html('Tải lên thành công! Nhấn vào <a href="#!home">đây</a> để duyệt.');
                $('#alert-success').show();
                $('#alert-error').hide();
            }, function errorCallback(response) {
                var resp = response.data;
                console.log(resp)
                $('#alert-error').text(resp.errors[0].title + '! ' + resp.errors[0].detail);
                $('#alert-error').show();
                $('#alert-success').hide();
            }, function errorCallback(response) {});
        }
        //reset form
        //get data from youtube data api
        $scope.getYTData = function() {
            if (isValidURL($scope.ytURL)) {
                // console.log('valid url')
                var url = new URL($scope.ytURL);
                $scope.attributes.youtubeId = getParameterByName("v", url);
                $scope.isExitsURL = 'https://www.googleapis.com/youtube/v3/videos?part=id&id=' + $scope.attributes.youtubeId + '&key=' + API_KEY;
                $http({
                    url: $scope.isExitsURL,
                    type: 'GET'
                }).then(function successCallback(response) {
                    // console.log(response.data.pageInfo.totalResults)
                    if (response.data.pageInfo.totalResults === 1) {
                        $scope.ytApiGetVideo();
                    } else {
                        $scope.attributes.name = "";
                        $scope.attributes.description = "";
                        $scope.attributes.keywords = "";
                        $('#alert-error').text('Video không tồn tại!');
                        $('#alert-error').show();
                        $('#alert-success').hide();
                    }
                }, function errorCallback(response) {
                    console.log('nhay vao error');
                });
            }
        }
        //call youtube data api
        $scope.ytApiGetVideo = function() {
            var alertWarning = $('#alert-warning');
            var alertError = $('#alert-error');
            var alertSuccess = $('#alert-success');
            YT_API_URL = 'https://www.googleapis.com/youtube/v3/videos?id=' + $scope.attributes.youtubeId + '&key=' + API_KEY + '&fields=items&part=snippet,statistics';
            console.log(YT_API_URL);
            video = null;
            $http({
                url: YT_API_URL,
                type: 'GET'
            }).then(function successCallback(response) {
                $('#alert-success').text('Tải dữ liệu thành công!');
                $('#alert-success').show();
                $('#alert-error').hide();
                //console.log(response.data)
                var video = response.data.items[0].snippet;
                console.log(video)
                $scope.attributes.name = video.title;
                $scope.attributes.description = video.description;
                $scope.attributes.keywords = video.tags.toString();
            }, function errorCallback(response) {
                $('#alert-error').text('Video không tồn tại!');
                $('#alert-error').show();
                $('#alert-success').hide();
            }, function errorCallback(response) {});
        }

        function addVideo() {
            var alertWarning = $('#alert-warning');
            var alertError = $('#alert-error');
            var alertSuccess = $('#alert-success');
            var d = new Date();
            var videoBOD = formatDate(d);
            var lstCategory = "";
            for (var i = 0, len = category.length; i < len; i++) {
                if (category[i].checked) {
                    lstCategory += category[i].value + ',';
                }
            }
            lstCategory = lstCategory.substring(0, lstCategory.length - 1);
            // console.log(lstCategory);
            // console.log(video);
            // console.log(apiUrl);
            var videoUpload = {
                videoId: videoId,
                name: name,
                description: description,
                keywords: tags,
                category: lstCategory,
                genre: genre,
                authorName: "lamtv",
                authorEmail: "lamtvd00516@fpt.edu.vn",
                birthday: videoBOD
            };
            //console.log(video);
            $.ajax({
                url: UPLOAD_VIDEO_URL,
                // contentType: 'application/json; charset=UTF-8',
                data: JSON.stringify(videoUpload),
                type: 'POST',
                success: function(status, xhr) {
                    alertError.hide();
                    alertWarning.hide();
                    alertSuccess.html('<strong>Thành công!</strong> Tải lên thành công video.')
                    alertSuccess.show();
                },
                error: function(status, xhr) {
                    alertError.html('<strong>Lỗi!</strong> lỗi bất thường xảy ra, thử lại. code: ' + xhr.status);
                    alertError.show();
                    alertWarning.hide();
                    alertSuccess.hide();
                }
            })
        }
    } else {
        $scope.show = false;
    }
});

function hasRole() {
    if (typeof(Storage) !== "undefined") {
        if (localStorage.getItem("tokenKey") !== null) {
            return true;
        } else {
            return false;
        }
    } else {
        alert("Sorry, your browser does not support Web Storage...");
        return false;
    }
}

function getLink($scope) {
    alert(videoToUpload.videoId)
}

function submitForm($scope) {}

function getVideoInfo($scope, $http) {
    $http.get(VIDEO_INFO_API_URL).then(function(response) {
        $scope.videoInfo = response.data;
        $scope.tags = $scope.videoInfo.keywords.split(",");
        $scope.$on('ngGetInforFinish', function(ngRepeatFinishedEvent) {
            // console.log($scope.tags);
        });
        $scope.$on('ngRepeatFinish', function(ngRepeatFinishedEvent) {
            var owl = $('.owl-stage');
            owl.owlCarousel({
                items: 4,
                loop: false,
                dots: false,
                nav: true,
                margin: 10,
                responsive: {
                    0: {
                        items: 1
                    },
                    768: {
                        items: 3
                    },
                    1024: {
                        items: 4
                    },
                    1600: {
                        items: 6
                    }
                }
            });
            // Go to the next item
            $('.owl-next').click(function() {
                owl.trigger('next.owl.carousel');
            })
            // Go to the previous item
            $('.owl-prev').click(function() {
                // With optional speed parameter
                // Parameters has to be in square bracket '[]'
                owl.trigger('prev.owl.carousel', [300]);
            })
            owl.on('mousewheel', '.owl-stage', function(e) {
                if (e.deltaY > 0) {
                    owl.trigger('next.owl');
                } else {
                    owl.trigger('prev.owl');
                }
                e.preventDefault();
            });
            // alert('ok')
        });
    });
}